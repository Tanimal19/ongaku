from lyric.type import Song, YoutubeVideo
from lyric.provider.youtube import YoutubeAPI, YoutubeVideo
from lyric.provider.slyrics import SyncLyricsAPI
from lyric.provider.jlyrics import JLyricsAPI
from lyric.utils import detect_language, romanize_ja_lyric, romanize_ko_lyric


def get_lyric(track: str, artist: str, video: YoutubeVideo) -> Song | None:
    song = Song(track, artist, video.video_id)

    # try to get synced lyric from syncedlyric
    lrc_lyric = SyncLyricsAPI.get_sync_lyric(song)

    # detect language from video title, description, channel description, and synced lyric (if have)
    context = video.title + video.description

    channel_description = YoutubeAPI.get_channel_description(video.channel_id)
    if channel_description is not None:
        context += channel_description

    if lrc_lyric is not None:
        context += lrc_lyric
    song.lang = detect_language(context)

    if lrc_lyric is not None:
        song.add_lyric(song.lang, lrc_lyric, True)

    # try to get synced lyric from youtube
    lyric_list = YoutubeAPI.get_sync_lyrics(song)
    if lyric_list is not None:
        for lyric in lyric_list:
            song.add_lyric(lyric[0], lyric[1], True)

    if len(song.synced_lyrics.values()) >= 1:
        return song

    # if there's no synced lyric, try to get unsynced lyric
    # for japanese songs, use j-lyric first
    if song.lang == "ja":
        plain_lyric = JLyricsAPI.get_plain_lyric(song)
        if plain_lyric is not None:
            song.add_lyric(song.lang, plain_lyric, False)
            return song

    plain_lyric = SyncLyricsAPI.get_plain_lyric(song)
    if plain_lyric is not None:
        song.add_lyric(song.lang, plain_lyric, False)
        return song

    return song


def generate_roma_lyrics(song: Song) -> Song:
    if song.lang != "zh" and (
        "zh" in song.synced_lyrics.keys() or "zh" in song.plain_lyrics.keys()
    ):
        song.support_translate = True

    if "ja" in song.synced_lyrics.keys():
        song.add_lyric("roma", romanize_ja_lyric(song.synced_lyrics["ja"], True), True)
    elif "ja" in song.plain_lyrics.keys():
        song.add_lyric("roma", romanize_ja_lyric(song.plain_lyrics["ja"], False), False)

    if "ko" in song.synced_lyrics.keys():
        song.add_lyric("roma", romanize_ko_lyric(song.synced_lyrics["ko"], True), True)
    elif "ko" in song.plain_lyrics.keys():
        song.add_lyric("roma", romanize_ko_lyric(song.plain_lyrics["ko"], False), False)

    if "roma" in song.synced_lyrics.keys() or "roma" in song.plain_lyrics.keys():
        song.support_romaji = True

    return song
