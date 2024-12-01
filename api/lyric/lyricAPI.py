from lyric.type import Song, YoutubeVideo
from lyric.provider.youtube import YoutubeAPI, YoutubeVideo
from lyric.provider.slyrics import SyncLyricsAPI
from lyric.provider.jlyrics import JLyricsAPI
from lyric.utils import (
    detect_language,
    romanize_ja_lyric,
    romanize_ko_lyric,
    match_lyric_and_translation,
)


def get_lyric(
    track: str, artist: str, video: YoutubeVideo, api_key: str
) -> Song | None:
    song = Song(track, artist, video.video_id)

    # detect language from video title, description, channel description, and synced lyric (if have)
    context = video.title + video.description

    channel_description = YoutubeAPI.get_channel_description(api_key, video.channel_id)
    if channel_description is not None:
        context += channel_description

    lrc_lyric = SyncLyricsAPI.get_sync_lyric(song)
    if lrc_lyric is not None:
        context += lrc_lyric

    song.lang = detect_language(context)

    # try to get synced lyric from slyrics
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


def lyric_process(song: Song) -> Song:
    # add romanized lyric
    if "ja" in song.synced_lyrics.keys():
        song.add_lyric("roma", romanize_ja_lyric(song.synced_lyrics["ja"], True), True)
    elif "ja" in song.plain_lyrics.keys():
        song.add_lyric("roma", romanize_ja_lyric(song.plain_lyrics["ja"], False), False)

    if "ko" in song.synced_lyrics.keys():
        song.add_lyric("roma", romanize_ko_lyric(song.synced_lyrics["ko"], True), True)
    elif "ko" in song.plain_lyrics.keys():
        song.add_lyric("roma", romanize_ko_lyric(song.plain_lyrics["ko"], False), False)

    # check if song support sync, translate, and romaji
    if len(song.synced_lyrics.values()) >= 1:
        song.support_sync = True

    if song.lang != "zh" and (
        "zh" in song.synced_lyrics.keys() or "zh" in song.plain_lyrics.keys()
    ):
        song.support_translate = True

    if "roma" in song.synced_lyrics.keys() or "roma" in song.plain_lyrics.keys():
        song.support_romaji = True

    # match lyric and translation
    if song.support_sync and song.support_translate:
        song.synced_lyrics["zh"] = match_lyric_and_translation(
            song.synced_lyrics[song.lang], song.synced_lyrics["zh"]
        )

    return song
