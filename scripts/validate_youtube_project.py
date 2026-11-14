#!/usr/bin/env python3
"""Validate project links, locked style and recorded delivery evidence, not truth/aesthetics."""
import argparse,json
from pathlib import Path
from lock_style import check as check_style
from validate_storyboard import validate as validate_board
from validate_personal_profile import validate as validate_personal

def validate(root,stage='plan'):
    errors=[];warnings=[]
    def load(name):
        try:return json.loads((root/name).read_text(encoding='utf-8-sig'))
        except (OSError,ValueError) as e:errors.append(f'{name}: {e}');return {}
    project=load('project.json');board=load('storyboard.json');style=load('style-lock.json')
    ledger=load('claims.json');assets=load('assets.json')
    result=validate_board(board,root if stage!='plan' else None)
    errors.extend(result['errors']);warnings.extend(result['warnings'])
    if board.get('production_policy',{}).get('profile_id')=='personal-youtube-r7':
        personal=validate_personal(board,'plan' if stage=='plan' else 'execution');errors.extend(personal['errors']);warnings.extend(personal['warnings'])
    if project.get('fps')!=board.get('fps'):errors.append('Project and storyboard fps differ.')
    if stage!='plan':errors.extend(check_style(style))
    elif style.get('status')!='locked':warnings.append('Style is still a candidate; lock before production render.')
    if board.get('style_system',{}).get('id')!=style.get('style_id'):errors.append('Storyboard style id differs from style-lock.')
    def index(items,label):
        if not isinstance(items,list):errors.append(label+' must be a list');return {}
        out={}
        for item in items:
            if not isinstance(item,dict) or not item.get('id'):errors.append(label+' item needs id');continue
            if item['id'] in out:errors.append(label+' duplicate id: '+item['id'])
            out[item['id']]=item
        return out
    claims=index(ledger.get('claims',[]),'claims');asset_index=index(assets.get('assets',[]),'assets')
    for scene in board.get('scenes',[]):
        if not isinstance(scene,dict):continue
        if stage!='plan' and scene.get('content_status')=='demonstration':errors.append(scene['id']+': demonstration scene has not been replaced.')
        ids=scene.get('claim_ids',[])
        if scene.get('factual') and not ids:errors.append(scene['id']+': factual scene needs claim_ids.')
        for cid in ids:
            if cid not in claims:errors.append(scene['id']+': unknown claim '+str(cid));continue
            c=claims[cid]
            if c.get('kind')!='illustration' and not c.get('sources'):errors.append(cid+': evidence source missing.')
            if stage!='plan' and c.get('status')!='verified' and c.get('kind')=='fact':errors.append(cid+': fact remains unverified.')
        for layer in scene.get('media_layers',[]):
            aid=layer.get('asset_id')
            if aid not in asset_index:errors.append(scene['id']+': unknown asset '+str(aid))
    for aid,asset in asset_index.items():
        if asset.get('status')=='ready':
            path=asset.get('path')
            if not path or not (root/path).is_file():errors.append(aid+': ready asset file missing.')
    presenter=board.get('production_policy',{}).get('presenter',{})
    if stage!='plan' and presenter.get('required') and not presenter.get('user_override'):
        layers=[layer for scene in board.get('scenes',[]) for layer in scene.get('media_layers',[]) if layer.get('kind')=='presenter']
        if not layers:errors.append('Required presenter footage has not been placed on the timeline.')
        if board.get('scope','full_film')=='full_film':
            opening_frames=min(board.get('duration_frames',0),round(presenter.get('opening_fullscreen_seconds',15)*board.get('fps',30)))
            windows=sorted((x.get('visible_start_frame',0),x.get('visible_end_frame_exclusive',0)) for x in layers)
            cursor=0
            for start,end in windows:
                if start>cursor:break
                cursor=max(cursor,end)
            if cursor<opening_frames:errors.append('Presenter opening has uncovered frames.')
            if board.get('duration_frames',0)>opening_frames and not any(end>opening_frames for start,end in windows):errors.append('Later presenter PiP footage is missing.')
    if stage=='delivery':
        if project.get('stage') not in ('rendered','reviewed','delivery','complete'):
            errors.append('Project remains a draft; record actual production state before delivery.')
        for scene in board.get('scenes',[]):
            if scene.get('verification') not in ('rendered','reviewed'):
                errors.append(scene.get('id','scene')+': scene has not been rendered.')
        qa=load('qa.json');checks=qa.get('checks',{})
        required=['content','style','visual','motion','media']
        if project.get('audio_policy','required')=='required':required.append('audio')
        for name in required:
            c=checks.get(name,{})
            if c.get('status')!='passed' or not c.get('evidence'):errors.append(name+': actual review evidence required.')
            for file in c.get('evidence',[]):
                if not (root/file).is_file():errors.append(name+': evidence file missing: '+file)
        video=project.get('final_video')
        if not video or not (root/video).is_file():errors.append('Final video file missing.')
    return {'ok':not errors,'stage':stage,'errors':errors,'warnings':warnings,'scope':'Checks structure, links and recorded evidence. Does not verify historical truth, pixels or listening by itself.'}

def main():
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('project',type=Path);p.add_argument('--stage',choices=['plan','render','delivery'],default='plan');a=p.parse_args()
    try:result=validate(a.project,a.stage)
    except (ValueError,TypeError,KeyError,AttributeError) as e:result={'ok':False,'errors':['Malformed project: '+str(e)]}
    print(json.dumps(result,ensure_ascii=False,indent=2));raise SystemExit(0 if result['ok'] else 1)
if __name__=='__main__':main()
