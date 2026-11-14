import copy,json,sys,unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2];sys.path.insert(0,str(ROOT/'scripts'))
from validate_personal_profile import validate

class PersonalProfile(unittest.TestCase):
    def setUp(self):
        self.board={'fps':60,'production_policy':json.loads((ROOT/'assets/templates/personal-production-policy.json').read_text(encoding='utf8')),'scenes':[]}
    def test_default_passes(self):self.assertTrue(validate(self.board)['ok'])
    def test_crop_and_cover_are_rejected(self):
        self.board['production_policy']['ai_video']['crop']=True;self.assertFalse(validate(self.board)['ok'])
    def test_later_fullscreen_is_rejected(self):
        self.board['production_policy']['presenter']['schedule']=[{'start_frame':1800,'mode':'fullscreen'}];self.assertFalse(validate(self.board)['ok'])
    def test_source_ledger_is_not_screen_text(self):
        self.board['scenes']=[{'id':'S1','texts':[{'role':'source_metadata','zh':'AI历史重建','en':''}]}];self.assertTrue(validate(self.board)['ok'])
    def test_generated_prefix_and_empty_translation_fail(self):
        self.board['scenes']=[{'id':'S1','texts':[{'role':'title','zh':'AI历史重建','en':''}]}];self.assertFalse(validate(self.board)['ok'])
    def test_detail_inset_and_document_reinspection_fail(self):
        self.board['production_policy']['images']['detail_inset']=True;self.board['production_policy']['review_documents']['visual_reinspection']=True;self.assertFalse(validate(self.board)['ok'])
    def test_new_explicit_user_override_is_respected(self):
        self.board['production_policy']['presenter']['opening_fullscreen_seconds']=15;self.assertFalse(validate(self.board)['ok'])
        self.board['production_policy']['overrides']['presenter.opening']='测试明确覆盖';self.assertTrue(validate(self.board)['ok'])
if __name__=='__main__':unittest.main()
