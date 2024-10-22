import requests
import html
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.formatters import JSONFormatter
from lyric.type import Song, YoutubeVideo
from credentials import YOUTUBE_API_KEY


class YoutubeAPI:
    def get_channel_description(channel_id: str) -> str | None:
        url = "https://www.googleapis.com/youtube/v3/channels"
        params = {
            "part": "snippet",
            "id": channel_id,
            "key": YOUTUBE_API_KEY,
        }

        try:
            response = requests.get(url, params=params)
            response.raise_for_status()

            data = response.json()
            description = html.unescape(data["items"][0]["snippet"]["description"])
            return description

        except Exception as e:
            print(e)
            return None

    def search_video(query: str, max_results: int = 1) -> list[YoutubeVideo] | None:
        url = "https://www.googleapis.com/youtube/v3/search"
        params = {
            "part": "snippet",
            "order": "relevance",
            "q": query,
            "regionCode": "US",
            "safeSearch": "strict",
            "type": "video",
            "maxResults": max_results,
            "key": YOUTUBE_API_KEY,
        }

        try:
            response = requests.get(url, params=params)
            response.raise_for_status()

            data = response.json()
            ret = list()

            for item in data["items"]:
                video_id = item["id"]["videoId"]
                title = html.unescape(item["snippet"]["title"])
                description = html.unescape(item["snippet"]["description"])
                channel_name = item["snippet"]["channelTitle"]
                channel_id = item["snippet"]["channelId"]

                ret.append(
                    YoutubeVideo(video_id, title, description, channel_name, channel_id)
                )

            return ret

        except Exception as e:
            print(e)
            return None

    def get_sync_lyrics(song: Song) -> list | None:
        print("Fetching from Youtube...")

        try:
            youtube_lyric_list = YouTubeTranscriptApi.list_transcripts(song.video_id)

            # filter lyric by language
            youtube_lyrics = dict()
            for lyric in list(
                youtube_lyric_list._manually_created_transcripts.values()
            ):
                youtube_lyrics[lyric.language_code] = lyric

            filtered_lyric_list = list()

            # check if there's a lyric in the same language as the song
            if song.lang in youtube_lyrics.keys():
                filtered_lyric_list.append(youtube_lyrics[song.lang])
            elif song.synced_lyrics.get(song.lang) is None:
                return None

            # check if there's a traditional chinese lyric
            if song.lang != "zh":
                if "zh-Hant" in youtube_lyrics.keys():
                    youtube_lyrics["zh-Hant"].language_code = "zh"
                    filtered_lyric_list.append(youtube_lyrics["zh-Hant"])
                else:
                    if "zh-TW" in youtube_lyrics.keys():
                        youtube_lyrics["zh-TW"].language_code = "zh"
                        filtered_lyric_list.append(youtube_lyrics["zh-TW"])
                    else:
                        if "zh" in youtube_lyrics.keys():
                            filtered_lyric_list.append(youtube_lyrics["zh"])
                        else:
                            if "zh-Hans" in youtube_lyrics.keys():
                                youtube_lyrics["zh-Hans"].language_code = "zh"
                                filtered_lyric_list.append(youtube_lyrics["zh-Hans"])

            # format lyric to json, add to return list
            lyric_list = list()
            formatter = JSONFormatter()
            for lyric in filtered_lyric_list:
                lyric_text = lyric.fetch()
                json_lyric = formatter.format_transcript(lyric_text)
                lyric_list.append([lyric.language_code, json_lyric])

            return lyric_list

        except Exception as e:
            print(e)
            return None
