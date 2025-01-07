import json


class Song:
    track: str = None
    artist: str = None
    lang: str = None
    video_id: str = None
    support_sync: bool = False
    support_translate: bool = False
    support_romaji: bool = False
    plain_lyrics: dict = {}
    synced_lyrics: dict = {}

    def __init__(self, track: str, artist: str, video_id: str):
        self.track = track
        self.artist = artist
        self.lang = None
        self.video_id = video_id
        self.support_sync = False
        self.support_translate = False
        self.support_romaji = False
        self.plain_lyrics = {}
        self.synced_lyrics = {}

    def __str__(self):
        s = f"track: {self.track}\n"
        s += f"artist: {self.artist}\n"
        s += f"lang: {self.lang}\n"
        s += f"video_id: {self.video_id}\n"
        s += "plain_lyrics:\n"
        for lang, lyric in self.plain_lyrics.items():
            s += f"{lang}: {lyric}\n"
        s += "synced_lyrics:\n"
        for lang, lyric in self.synced_lyrics.items():
            s += f"{lang}: {json.loads(lyric)}\n"

        return s

    def add_lyric(self, lang: str, lyric: str, synced: bool):
        if synced:
            self.synced_lyrics.update({lang: lyric})
        else:
            self.plain_lyrics.update({lang: lyric})

    def to_dict(self):
        return {
            "track": self.track,
            "artist": self.artist,
            "lang": self.lang,
            "videoId": self.video_id,
            "supportSync": self.support_sync,
            "supportTranslate": self.support_translate,
            "supportRomaji": self.support_romaji,
            "plainLyrics": self.plain_lyrics,
            "syncedLyrics": self.synced_lyrics,
        }


class YoutubeVideo:
    video_id: str = None
    title: str = None
    description: str = None
    channel_name: str = None
    channel_id: str = None

    def __init__(
        self,
        video_id: str,
        title: str,
        description: str,
        channel_name: str,
        channel_id: str,
    ):
        self.video_id = video_id
        self.title = title
        self.description = description
        self.channel_name = channel_name
        self.channel_id = channel_id

    def from_dict(dict: dict):
        return YoutubeVideo(
            dict.get("videoId"),
            dict.get("title"),
            dict.get("description"),
            dict.get("channelName"),
            dict.get("channelId"),
        )

    def to_dict(self):
        return {
            "videoId": self.video_id,
            "title": self.title,
            "description": self.description,
            "channelName": self.channel_name,
            "channelId": self.channel_id,
        }
