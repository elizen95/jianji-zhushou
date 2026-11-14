#!/usr/bin/env python3
"""Fingerprint the selected style; never claims pixel or aesthetic verification."""
import argparse, hashlib, json
from pathlib import Path

def digest(data):
    content = {k:v for k,v in data.items() if k not in ('status','lock_sha256','golden_sample','decision_basis')}
    return hashlib.sha256(json.dumps(content,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode('utf-8')).hexdigest()

def check(data):
    problems=[]
    if data.get('status')!='locked': problems.append('Style is not locked.')
    if data.get('lock_sha256')!=digest(data): problems.append('Style configuration has changed since locking.')
    refs=data.get('reference_styles',[])
    if not isinstance(refs,list) or not refs or any(not isinstance(ref,dict) or not ref.get('source_id') for ref in refs):
        problems.append('Record the actual theme references; multiple references are allowed.')
    return problems

def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('action',choices=['lock','check']);p.add_argument('project',type=Path)
    a=p.parse_args();path=a.project/'style-lock.json'
    data=json.loads(path.read_text(encoding='utf-8-sig'))
    if a.action=='lock':
        if not data.get('reference_styles') or not data.get('tokens'): raise SystemExit('Missing theme references/tokens.')
        data['lock_sha256']=digest(data);data['status']='locked'
        path.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    issues=check(data)
    print(json.dumps({'ok':not issues,'errors':issues,'sha256':data.get('lock_sha256'),'scope':'Configuration identity only.'},ensure_ascii=False))
    raise SystemExit(1 if issues else 0)

if __name__=='__main__':main()
