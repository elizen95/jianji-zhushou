"""Meaningful boundary regressions for full-film scope and malformed presenter data."""
import json
import sys
import tempfile
import unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from init_youtube_project import create
from validate_storyboard import validate

class YouTubeBoundaryTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory()
        self.project=create(Path(self.tmp.name)/'film','测试')
        self.board=json.loads((self.project/'storyboard.json').read_text(encoding='utf-8'))
    def tearDown(self):
        self.tmp.cleanup()
    def test_new_film_defaults_to_faceless_avatar(self):
        self.assertEqual(self.board['scope'],'full_film')
        presenter=self.board['production_policy']['presenter']
        self.assertEqual(presenter['mode'],'avatar_overlay')
        self.assertEqual(presenter['opening_fullscreen_seconds'],0)
        self.assertFalse(presenter['required'])
        self.assertTrue(validate(self.board)['ok'])
    def test_invalid_later_mode_returns_diagnostic(self):
        self.board['production_policy']['presenter']['later_mode']=None
        result=validate(self.board)
        self.assertFalse(result['ok'])
        self.assertTrue(any('later_mode' in e for e in result['errors']))
    def test_invalid_schedule_returns_diagnostic(self):
        self.board['production_policy']['presenter'].update(schedule=None,later_mode='fullscreen')
        result=validate(self.board)
        self.assertFalse(result['ok'])
        self.assertTrue(any('schedule' in e for e in result['errors']))

if __name__=='__main__':unittest.main()
