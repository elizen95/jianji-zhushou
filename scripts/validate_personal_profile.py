#!/usr/bin/env python3
"""Check the current personal production contract. This does not inspect pixels, PDFs or Word."""
from pathlib import Path
import argparse,json

def validate(board,stage='plan'):
    errors=[];warnings=[];p=board.get('production_policy',{});strict=p.get('profile_id')=='personal-youtube-r7'
    overrides=p.get('overrides',{})
    def check(path,condition,message):
        if not condition and not (isinstance(overrides,dict) and isinstance(overrides.get(path),str) and overrides[path].strip()):errors.append(message)
    presenter=p.get('presenter',{});video=p.get('ai_video',{});images=p.get('images',p.get('historical_images',{}));sub=p.get('subtitles',{});text=p.get('text',{})
    if not strict:warnings.append('No personal profile_id: checking declared controls only; existing project decisions are not rewritten.')
    faceless = p.get('motion', {}).get('faceless_narrative_coverage') is True or presenter.get('mode') == 'avatar_overlay'
    if faceless:
        check('presenter.mode',presenter.get('mode')=='avatar_overlay','Use the Q avatar overlay for this faceless profile.')
        check('presenter.opening',presenter.get('opening_fullscreen_seconds')==0,'The faceless profile has no fullscreen presenter opening.')
        check('presenter.later_mode',presenter.get('later_mode')=='bottom_right_overlay' and presenter.get('shape')=='keyed_silhouette','Use the bottom-right keyed silhouette.')
        box=presenter.get('pip_pixels',{})
        current_avatar = p.get('version') in {'1.0', '4.5', '4.6', '4.7'}
        expected_box = (
            {'x':1300,'y':530,'width':640,'height':360} if current_avatar
            else {'x':1530,'y':710,'width':320,'height':180}
        )
        check('presenter.scale',presenter.get('reference_canvas')==[1920,1080] and box==expected_box,
              'Use the reference avatar box for the declared profile version.')
        if current_avatar:
            check('presenter.generation',presenter.get('generation_owner')=='user' and presenter.get('minimum_new_segment_seconds')==10,
                  'New avatar speech is generated separately by the user and scheduled for at least ten seconds.')
    elif strict or presenter:
        check('presenter.opening' ,presenter.get('opening_fullscreen_seconds')==15,'Presenter opening must retain the first 15 seconds.')
        check('presenter.later_mode',presenter.get('later_mode') in ['bottom_right_pip','scheduled_bottom_right_pip'],'Later presenter must stay in the bottom-right rounded rectangle.')
        check('presenter.position',presenter.get('allow_reposition',False) is False and presenter.get('allow_later_fullscreen',False) is False,'Do not move or re-expand the later presenter.')
    if strict or video:
        check('video.frame',video.get('fit','contain')=='contain' and video.get('crop',False) is False and video.get('zoom',False) is False,'Video must preserve the whole original frame, without crop or zoom.')
        check('video.playback',video.get('playback_rate',1)==1 and video.get('loop',False) is False and video.get('freeze_fill',False) is False,'Do not retime, loop or freeze footage to fill time.')
        check('video.cleanup',video.get('source_edge_cleanup',False) is False,'Source edge lettering and flags belong to the user; do not clean them automatically.')
    if strict or images:
        check('images.frame',images.get('frame_enabled',images.get('new_image_frame',False)) is False,'Historical pictures must not gain a frame.')
        check('images.detail',images.get('detail_inset',False) is False and images.get('local_magnifier',False) is False,'Same-source magnifier/detail insets are disabled.')
    if strict or sub:
        check('subtitles.mode',sub.get('mode','external')!='burned' and sub.get('burn_in',False) is False,'The master must not burn narration subtitles.')
        check('subtitles.safe_area',sub.get('reserve_space') is True,'Reserve a real subtitle-safe band.')
    if strict:
        check('text.bilingual',text.get('bilingual') is True,'Generated on-screen text must be bilingual.')
        check('review.documents',p.get('review_documents',{}).get('full_film_pdf') is True and p.get('review_documents',{}).get('per_page_editable_word') is True,'The execution package needs a full-film PDF and a matching editable Word.')
        review = p.get('review_documents', {})
        check('review.visual',review.get('visual_reinspection') is False,'Avoid repeated PDF/Word screenshot checks.')
        if p.get('version') in {'1.0', '4.5', '4.6', '4.7'}:
            check('review.cadence',review.get('cadence')=='single_batch' and review.get('routine_effect_image_checks') is False,
                  'Group the visual review into one batch.')
            check('output.master',p.get('output')=={'width':2560,'height':1440,'fps':60} and board.get('fps')==60,
                  'Use a 2560×1440 60fps master unless this project records an explicit override.')
    forbidden=['AI历史重建','AI historical reconstruction','AI重建','AI reconstruction','出版物示意图']
    for scene in board.get('scenes',[]):
        sid=scene.get('id','scene')
        for t in scene.get('texts',[]):
            if t.get('role') in ['制作占位','production_placeholder','review_metadata','source_metadata','ledger']:continue
            zh=t.get('zh',t.get('text',''));en=t.get('en','')
            if strict or text.get('bilingual',False):check('text.bilingual',bool(str(zh).strip()) and bool(str(en).strip()),sid+': missing Chinese or English screen text.')
            if any(q.casefold() in (str(zh)+' '+str(en)).casefold() for q in forbidden):check('text.provenance',False,sid+': remove the screen provenance prefix; keep source facts in the ledger.')
        if scene.get('render_kind')=='video' and scene.get('video_roi') not in [None,{'x':0,'y':0,'w':1,'h':1}]:check('video.frame',False,sid+': video_roi crops the original source.')
        for layer in scene.get('media_layers',[]):
            if layer.get('kind') in ['video','ai_video']:
                if layer.get('crop') is True or layer.get('fit')=='cover':check('video.frame',False,sid+': a media layer crops the source frame.')
                if layer.get('loop') is True or layer.get('playback_rate',1)!=1:check('video.playback',False,sid+': a media layer loops or retimes footage.')
        for box in scene.get('image_boxes',[]):
            if box.get('border') is True or box.get('detail') is True:check('images.detail',False,sid+': an image box enables a frame/detail inset.')
        if stage!='plan' and scene.get('render_kind') in ['diagram','mechanism']:
            plan=scene.get('r7_motion_plan',scene.get('motion_plan',{}));beats=plan.get('beats',scene.get('motion_beats',[]))
            if not beats and not plan.get('continuous_motion'):warnings.append(sid+': no recorded semantic motion; check for a PPT-like hold before rendering.')
    if p.get('version') in {'1.0', '4.6', '4.7'}:
        motion = p.get('motion', {})
        check('motion.repeat', all(motion.get(key) == 300 for key in
              ('animation_repeat_window_seconds', 'composition_repeat_window_seconds')),
              'The default animation and composition reuse window is 300 seconds.')
        signature_id = None
        if p.get('version') in {'1.0', '4.7'}:
            signature_id = p.get('chapter_card', {}).get('signature_motion_id')
        issues = validate_motion_occurrences(
            board, motion.get('animation_repeat_window_seconds', 300),
            require_records=stage != 'plan', signature_id=signature_id)
        errors.extend(issues)
    for window in presenter.get('schedule',[]):
        start=window.get('start_frame',window.get('startFrame',0));mode=window.get('mode')
        if faceless:
            check('presenter.position',mode in ('overlay','hidden'),'The faceless profile permits only keyed overlay or hidden windows.')
        elif start>=15*board.get('fps',60) and mode=='fullscreen':
            check('presenter.position',False,'A later schedule window returns the presenter to fullscreen.')
    return {'ok':not errors,'errors':errors,'warnings':warnings,'profile_id':p.get('profile_id'),'stage':stage,'scope':'Declared data only. No PDF/Word screenshots, pixel comparison, listening or aesthetic claim.'}

def validate_motion_occurrences(board, minimum_seconds, *, require_records=False, signature_id=None):
    fps = board.get('fps')
    if type(fps) is not int or fps <= 0:
        return ['Motion checking requires a positive integer fps.']
    if type(minimum_seconds) is not int or minimum_seconds <= 0:
        return ['Motion repeat window must be a positive integer.']
    if signature_id is not None and (not isinstance(signature_id, str) or not signature_id.strip()):
        return ['The chapter signature must be a single nonempty motion ID or null.']
    signature_id = signature_id.strip().casefold() if signature_id is not None else None
    issues = []
    occurrences = []
    chapter_seconds = board.get('production_policy', {}).get('chapter_card', {}).get('duration_seconds', 3)
    for scene in board.get('scenes', []):
        scene_id = scene.get('id', 'scene')
        if require_records and 'motion_occurrences' not in scene:
            issues.append(f'{scene_id}: declare motion_occurrences, using [] when there is no motion.')
        records = scene.get('motion_occurrences', [])
        if not isinstance(records, list):
            issues.append(f'{scene_id}: motion_occurrences must be a list.')
            continue
        for entry in records:
            if not isinstance(entry, dict):
                issues.append(f'{scene_id}: invalid motion occurrence.')
                continue
            name = entry.get('motion_id')
            start = entry.get('start_frame')
            end = entry.get('end_frame_exclusive')
            if not (isinstance(name, str) and name.strip() and type(start) is int
                    and type(end) is int and 0 <= start < end <= board.get('duration_frames', end)):
                issues.append(f'{scene_id}: motion occurrence needs an ID and valid master frames.')
                continue
            name = name.strip().casefold()
            exempt = (name == signature_id and scene.get('chapter_card') is True
                      and scene.get('start_frame', -1) <= start < end <= scene.get('end_frame_exclusive', -1)
                      and scene.get('end_frame_exclusive', -1) - scene.get('start_frame', -1) == chapter_seconds * fps)
            occurrences.append((start, end, name, scene_id, exempt))
    latest = {}
    latest_regular = {}
    for start, end, name, scene_id, exempt in sorted(occurrences):
        previous = (latest_regular if exempt else latest).get(name)
        if previous is not None:
            previous_end, previous_scene = previous
            gap = start - previous_end
            if gap < fps * minimum_seconds:
                issues.append(f'{scene_id}: {name} repeats {gap / fps:g}s after {previous_scene}; '
                              f'required interval is {minimum_seconds}s.')
        if name not in latest or end > latest[name][0]:
            latest[name] = (end, scene_id)
        if not exempt and (name not in latest_regular or end > latest_regular[name][0]):
            latest_regular[name] = (end, scene_id)
    return issues


def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('storyboard',type=Path);parser.add_argument('--stage',choices=['plan','execution','delivery'],default='plan');args=parser.parse_args()
    try:result=validate(json.loads(args.storyboard.read_text(encoding='utf-8-sig')),args.stage)
    except (OSError,ValueError,TypeError,AttributeError) as e:result={'ok':False,'errors':['Malformed production data: '+str(e)]}
    print(json.dumps(result,ensure_ascii=False,indent=2));raise SystemExit(0 if result['ok'] else 1)
if __name__=='__main__':main()
