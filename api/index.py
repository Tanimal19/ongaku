from flask import Flask, request, jsonify
from lyric.provider.youtube import YoutubeAPI, YoutubeVideo
from lyric.type import Song, YoutubeVideo
from lyric.lyricAPI import get_lyric, generate_roma_lyrics

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


@app.route("/api/get-lyrics", methods=["POST"])
def get_lyrics():
    data = request.get_json()
    track: str = data.get("track")
    artist: str = data.get("artist")
    video: YoutubeVideo = YoutubeVideo.from_dict(data.get("video"))

    song: Song = get_lyric(track, artist, video)
    song = generate_roma_lyrics(song)

    if song is None:
        return jsonify({"error": "An error occurred during the request"}), 500

    song_dict = song.to_dict()

    return jsonify(song_dict)
