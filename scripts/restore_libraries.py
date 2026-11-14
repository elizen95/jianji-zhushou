"""Restore the reference libraries shipped separately from the lightweight skill."""
from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path, PurePosixPath
from zipfile import ZipFile

from prompt_motion_index import cache_index, valid_index
from startup import ROOT, STATE, archive_root, package, read, source_folder, write

INDEX = ROOT / "modules/upstream/prompt-motion-charts"
DECISION = STATE / "reference-restoration.json"


def disk_path(path):
    if os.name == "nt":
        return Path("\\\\?\\" + str(path.absolute()))
    return path


def registry():
    return read(ROOT / "references/motion-sources.json")["sources"]


def status(sources):
    missing = []
    for source in sources:
        folder = source_folder(source)
        state = read(folder / "source.json", {})
        if not state.get("package_complete") or not all(disk_path(folder / f).is_file() for f in state.get("files", {})):
            missing.append(source["id"])
    if not valid_index(INDEX):
        missing.append("prompt-motion-charts")
    if not missing:
        return {"status": "ready", "missing": []}
    decision = read(DECISION, {}).get("decision")
    return {"status": "ask" if decision is None else decision, "missing": missing}


def restore_zip(filename, sources):
    targets = {}
    for source in sources:
        identifier = source["id"]
        prefix = ("skills/jianji-zhushou/modules/upstream" if source["active"]
                  else "skill-reference-archive/jianji-zhushou")
        targets[f"{prefix}/{identifier}/"] = source_folder(source)
    targets["skills/jianji-zhushou/modules/upstream/prompt-motion-charts/"] = INDEX
    targets["skills/jianji-zhushou/assets/avatar-reference/"] = ROOT / "assets/avatar-reference"
    with ZipFile(filename) as archive:
        info = json.loads(archive.read("skills/jianji-zhushou/distribution.json"))
        if info["version"] != "1.0" or info["lightweight"]:
            raise ValueError("Use the matching jianji-zhushou 1.0 full ZIP.")
        names = set(archive.namelist())
        for prefix in targets:
            marker = ("web-source.json" if prefix.endswith("prompt-motion-charts/") else "source.json")
            if prefix.endswith("avatar-reference/"):
                continue
            if prefix + marker not in names:
                raise ValueError(f"Full ZIP is missing {prefix + marker}")
        for member in archive.infolist():
            for prefix, directory in targets.items():
                if not member.filename.startswith(prefix) or member.is_dir():
                    continue
                relative = PurePosixPath(member.filename[len(prefix):])
                if relative.is_absolute() or ".." in relative.parts or any(":" in p or "\\" in p for p in relative.parts):
                    raise ValueError(f"Invalid archive member: {member.filename}")
                destination = directory.joinpath(*relative.parts)
                if not destination.resolve().is_relative_to(directory.resolve()):
                    raise ValueError(f"Archive member escapes destination: {member.filename}")
                destination = disk_path(destination)
                if not destination.exists():
                    destination.parent.mkdir(parents=True, exist_ok=True)
                    temporary = destination.with_name(destination.name + ".restoring")
                    with archive.open(member) as incoming, temporary.open("wb") as output:
                        shutil.copyfileobj(incoming, output)
                    temporary.replace(destination)
                break


def restore_online(sources):
    if not shutil.which("git"):
        raise RuntimeError("Install Git or use the full ZIP.")
    for source in sources:
        folder = source_folder(source)
        try:
            result, _ = package(source["id"], source["url"], folder, folder / "source.json",
                                revision=source["audited_commit"])
            print(json.dumps(result, ensure_ascii=False), flush=True)
        except (OSError, ValueError, RuntimeError, subprocess.SubprocessError) as error:
            print(json.dumps({"id": source["id"], "error": str(error)}, ensure_ascii=False), flush=True)
    if not valid_index(INDEX):
        print(json.dumps(cache_index(INDEX), ensure_ascii=False))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument("--status", action="store_true")
    mode.add_argument("--later", action="store_true")
    mode.add_argument("--online", action="store_true")
    mode.add_argument("--from-zip", type=Path)
    args = parser.parse_args()
    sources = registry()
    current = status(sources)
    if args.status or (current["status"] == "ready" and not args.from_zip):
        print(json.dumps(current, ensure_ascii=False))
        return 0
    if not (args.online or args.from_zip or args.later):
        if not sys.stdin.isatty():
            print(json.dumps(current, ensure_ascii=False))
            return 0
        print("参考库尚未完整。是否恢复全部参考库？")
        choice = input("[1] 从完整版 ZIP 恢复  [2] 联网恢复  [Enter] 稍后：").strip()
        if choice == "1":
            args.from_zip = Path(input("完整版 ZIP 路径：").strip().strip('"'))
        elif choice == "2":
            args.online = True
        else:
            args.later = True
    if args.later:
        write(DECISION, {"decision": "deferred"})
        return 0
    if args.from_zip:
        restore_zip(args.from_zip, sources)
    else:
        restore_online(sources)
    current = status(sources)
    write(DECISION, {"decision": "ready" if not current["missing"] else "incomplete"})
    print(json.dumps(status(sources), ensure_ascii=False))
    return int(bool(current["missing"]))


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (OSError, ValueError, RuntimeError, KeyError) as error:
        print(str(error), file=sys.stderr)
        raise SystemExit(1)
