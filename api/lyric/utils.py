import re
import json
import cutlet
from korean_romanizer.romanizer import Romanizer


def detect_language(text: str):
    chinese_pattern = re.compile(r"[\u4E00-\u9FFF]")
    japanese_pattern = re.compile(r"[\u3040-\u30FF]")
    korean_pattern = re.compile(r"[\uAC00-\uD7AF]")

    counts = {
        "zh": len(chinese_pattern.findall(text)),
        "ja": len(japanese_pattern.findall(text)),
        "ko": len(korean_pattern.findall(text)),
    }

    dominant_lang = max(counts, key=counts.get)

    if counts[dominant_lang] <= 1:
        dominant_lang = "en"

    return dominant_lang


def lrc_to_json(lrc_lyric: str) -> str:
    lyric_lines = lrc_lyric.split("\n")

    lyric = []
    for line in lyric_lines:
        match = re.match(r"(\[\d{2}:\d{2}\.\d{2}\])\s(.+)", line)
        if not match:
            continue
        timestamp, lyric_text = match.groups()

        minutes, seconds, milliseconds = map(
            int, re.match(r"\[(\d{2}):(\d{2})\.(\d{2})\]", timestamp).groups()
        )
        start_time = minutes * 60 + seconds + milliseconds / 100

        lyric.append({"start": start_time, "text": lyric_text})

    return json.dumps(lyric, ensure_ascii=False)


def romanize_ja_lyric(lyric: str, isJson: bool = False) -> str:
    katsu = cutlet.Cutlet()

    if not isJson:
        lyric_lines = lyric.split("\n")

        for i, line in enumerate(lyric_lines):
            lyric_lines[i] = katsu.romaji(line)

        return "\n".join(lyric_lines)
    else:
        lyric_json = json.loads(lyric)

        katsu = cutlet.Cutlet()
        for entry in lyric_json:
            text = entry["text"]
            entry["text"] = katsu.romaji(text)

        return json.dumps(lyric_json, ensure_ascii=False)


def romanize_ko_lyric(lyric: str, isJson: bool = False) -> str:
    if not isJson:
        lyric_lines = lyric.split("\n")

        for i, line in enumerate(lyric_lines):
            r = Romanizer(line)
            lyric_lines[i] = r.romanize()

        return "\n".join(lyric_lines)
    else:
        lyric_json = json.loads(lyric)

        katsu = cutlet.Cutlet()
        for entry in lyric_json:
            text = entry["text"]
            r = Romanizer(text)
            entry["text"] = r.romanize()

        return json.dumps(lyric_json, ensure_ascii=False)
