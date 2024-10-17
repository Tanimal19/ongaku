from lyric.provider.slyrics import SyncLyricsAPI
from lyric.type import Song

song = Song("one thing", "one direction", "no")

print(SyncLyricsAPI.get_sync_lyric(song))
