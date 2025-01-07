import syncedlyrics
from modules.type import Song
from modules.utils import lrc_to_json


class SyncLyricsAPI:
    def get_sync_lyric(song: Song):
        print("Fetching sync lyrics from syncedlyrics...")

        # try lrclib first
        lrc_lyric = syncedlyrics.search(
            f"{song.track} {song.artist}",
            synced_only=True,
            providers=["Lrclib"],
        )
        if lrc_lyric is None:
            lrc_lyric = syncedlyrics.search(
                f"{song.track} {song.artist}",
                synced_only=True,
                providers=["Musixmatch"],
            )
            if lrc_lyric is None:
                return None

        json_lyric = lrc_to_json(lrc_lyric)
        return json_lyric

    def get_plain_lyric(song: Song):
        print("Fetching plain lyrics from syncedlyrics...")

        plain_lyric = syncedlyrics.search(
            f"{song.track} {song.artist}",
            plain_only=True,
            providers=["Musixmatch", "Genius", "Lrclib", "NetEase"],
        )

        if plain_lyric is None:
            return None
        if "[" or "]" in plain_lyric:
            return None

        json_lyric = lrc_to_json(plain_lyric)
        return json_lyric
