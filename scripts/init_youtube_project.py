#!/usr/bin/env python3
"""Create an editable production scaffold, not a finished film or fabricated research."""
import argparse, json, shutil
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def write(path,data):
    path.parent.mkdir(parents=True,exist_ok=True)
    path.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
def create(destination,topic,presenter='avatar_overlay'):
    if destination.exists():raise ValueError('Destination exists; refusing to overwrite a project.')
    destination.mkdir(parents=True)
    for d in ('research','media','previews','delivery'): (destination/d).mkdir()
    shutil.copy2(ROOT/'assets/style-presets/editorial-collage.json',destination/'style-lock.json')
    board=json.loads((ROOT/'assets/templates/storyboard-youtube-v8.json').read_text(encoding='utf-8'))
    board['scope']='full_film'
    if presenter != 'avatar_overlay':
        policy=board['production_policy']
        policy['motion'].pop('faceless_narrative_coverage')
        legacy=policy['presenter']
        legacy.pop('source_type')
        legacy.pop('background')
        legacy['pip_pixels']={'x':1530,'y':710,'width':320,'height':180,'radius':22}
        legacy.update(mode=presenter,required=True,opening_fullscreen_seconds=15,
                      shrink_seconds=0.75,later_mode='bottom_right_pip',shape='rounded_rectangle')
    arrangement = (
        '全片不露脸，以旁白、证据与持续叙事动效推进；Q版绿幕角色抠像后按640×360参考容纳区透明叠加，按内容出场。'
        if presenter=='avatar_overlay' else
        '按本项目明确选择的旧出镜模式编排开场与小窗。'
    )
    write(destination/'storyboard.json',board)
    write(destination/'project.json',{'schema_version':1,'title':topic,'stage':'draft','engine':'remotion',**board['production_policy']['output'],'audio_policy':'required','commercial_use':False,'storyboard':'storyboard.json','style':'style-lock.json','claims':'claims.json','assets':'assets.json','note':'Scaffold only. Replace demonstration scenes with researched content and real timing.'})
    write(destination/'claims.json',{'claims':[]})
    write(destination/'assets.json',{'assets':[]})
    write(destination/'qa.json',{'checks':{},'notes':['No production render or review has been performed.']})
    (destination/'brief.md').write_text('# '+topic+'\n\n当前为制作草稿。填写目标观众、核心问题、内容承诺、已有素材与本次交付范围。\n\n按文案从参考库选动作，形成统一主题，并登记 300 秒动效去重。'+arrangement+'原视频整幅全屏不裁切；史料大图无白黑框，图片名称中英大字，不做局部放大副窗。主题统一而布局与动效丰富，尽量用足相关视频。字体优先苹方、备选Noto Sans SC；画面双语、字幕留白且不烧录。执行包默认一次性交全片构图PDF及对页校对Word。Three.js／Blender按镜头需要编写可运行源工程。\n',encoding='utf-8')
    return destination
def main():
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('destination',type=Path);p.add_argument('--topic',required=True);p.add_argument('--presenter',choices=['avatar_overlay','mixed','legacy_15s_pip'],default='avatar_overlay')
    a=p.parse_args()
    try:create(a.destination,a.topic,a.presenter)
    except ValueError as e:raise SystemExit(str(e))
    print(json.dumps({'created':str(a.destination.resolve()),'state':'draft','rendered':False},ensure_ascii=False))
if __name__=='__main__':main()
