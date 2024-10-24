from flask import Flask, request, jsonify
from lyric.provider.youtube import YoutubeAPI, YoutubeVideo
from lyric.type import Song, YoutubeVideo
from lyric.lyricAPI import get_lyric, lyric_process

app = Flask(__name__)


@app.route("/api/search-youtube", methods=["POST"])
def search_youtube():
    data = request.get_json()
    query = data.get("query")
    max_results = data.get("max_results")
    videos: list[YoutubeVideo] = YoutubeAPI.search_video(query, max_results)

    if videos is None:
        return jsonify({"error": "An error occurred during the request"}), 500

    videos_dict = [video.to_dict() for video in videos]

    return jsonify(videos_dict)


@app.route("/api/get-youtube-video", methods=["POST"])
def get_youtube_video():
    data = request.get_json()
    video_id = data.get("video_id")
    videos: list[YoutubeVideo] = YoutubeAPI.search_video(video_id, 1)
    video = videos[0]

    if video is None:
        return jsonify({"error": "An error occurred during the request"}), 500

    video_dict = video.to_dict()

    return jsonify(video_dict)


@app.route("/api/get-lyrics", methods=["POST"])
def get_lyrics():
    data = request.get_json()
    track: str = data.get("track")
    artist: str = data.get("artist")
    video: YoutubeVideo = YoutubeVideo.from_dict(data.get("video"))

    song: Song = get_lyric(track, artist, video)
    song = lyric_process(song)
    print(song)

    if song is None:
        return jsonify({"error": "An error occurred during the request"}), 500

    song_dict = song.to_dict()

    return jsonify(song_dict)
