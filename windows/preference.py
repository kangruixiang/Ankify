import os
from pathlib import Path

mac_ANKI_PATH = os.path.join(Path.home(), 'Library', 'Application Support', 'Anki2', 'User 1', 'collection.media')
win_ANKI_PATH = os.path.join(Path.home(), 'AppData', 'Roaming', 'Anki2', 'User 1', 'collection.media')

card_left = '{{'
card_right = '}}'
delimiter = '~'