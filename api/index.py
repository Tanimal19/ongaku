from flask import Flask, request, jsonify
import os
import sys

app = Flask(__name__)

if os.environ.get("FLASK_DEBUG") == "1":
    print("development")
    sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
    from modules.credentials import YOUTUBE_API_KEY
else:
    print("production")
    YOUTUBE_API_KEY = os.environ.get("YOUTUBE_API_KEY")

from modules.provider.youtube import YoutubeAPI, YoutubeVideo
from modules.type import Song, YoutubeVideo
from modules.lyricAPI import get_lyric, lyric_process


@app.route("/api/search-youtube", methods=["POST"])
def search_youtube():
    data = request.get_json()
    api_key = YOUTUBE_API_KEY
    query = data.get("query")
    max_results = data.get("max_results")

    videos: list[YoutubeVideo] = YoutubeAPI.search_video(api_key, query, max_results)

    if videos is None:
        return jsonify({"error": "An error occurred during the request"}), 500

    videos_dict = [video.to_dict() for video in videos]

    return jsonify(videos_dict)


@app.route("/api/get-youtube-video", methods=["POST"])
def get_youtube_video():
    data = request.get_json()
    api_key = YOUTUBE_API_KEY
    video_id = data.get("video_id")
    videos: list[YoutubeVideo] = YoutubeAPI.search_video(api_key, video_id, 1)
    video = videos[0]

    if video is None:
        return jsonify({"error": "An error occurred during the request"}), 500

    video_dict = video.to_dict()

    return jsonify(video_dict)


@app.route("/api/get-lyrics", methods=["POST"])
def get_lyrics():
    data = request.get_json()
    api_key = YOUTUBE_API_KEY
    track: str = data.get("track")
    artist: str = data.get("artist")
    video: YoutubeVideo = YoutubeVideo.from_dict(data.get("video"))

    song: Song = get_lyric(track, artist, video, api_key)
    song = lyric_process(song)

    if song is None:
        return jsonify({"error": "An error occurred during the request"}), 500

    song_dict = song.to_dict()

    return jsonify(song_dict)
