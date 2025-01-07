import re
import json


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


def match_lyric_and_translation(lyric: str, translation: str) -> str:
    lyric_lines = json.loads(lyric)
    translation_lines = json.loads(translation)
    error = 0.3

    if len(lyric_lines) == len(translation_lines):
        return lyric, translation

    base_is_lyric = len(lyric_lines) < len(translation_lines)

    if base_is_lyric:
        base = lyric_lines
        match = translation_lines
    else:
        base = translation_lines
        match = lyric_lines
    new = []

    try:
        j = 0

        # find the first line matching the start time
        while float(match[j]["start"]) < float(base[0]["start"]) - error:
            j += 1

        for i in range(0, len(base)):
            text = match[j]["text"]
            j += 1

            if i + 1 < len(base):
                while float(match[j]["start"]) < float(base[i + 1]["start"]) - error:
                    text += "\u3000" + match[j]["text"]
                    j += 1

            new.append({"start": base[i]["start"], "text": text})

        if base_is_lyric:
            return lyric, json.dumps(new, ensure_ascii=False)
        else:
            return json.dumps(new, ensure_ascii=False), translation

    except Exception as e:
        print(e)
        return lyric, translation
