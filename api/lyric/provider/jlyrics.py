import requests
from bs4 import BeautifulSoup
from lyric.type import Song


class JLyricsAPI:
    def get_plain_lyric(song: Song):
        print("Fetching from j-lyric...")

        track = song.track.replace(" ", "+")
        artist = song.artist.replace(" ", "+")

        url = f"http://search3.j-lyric.net/index.php?kt={track}&ct=2&ka={artist}&ca=2&cl=2"
        response = requests.get(url)
        soup = BeautifulSoup(response.text, "html.parser")

        # get link from html
        result_bdy = soup.select("#mnb")[0].find_all(
            "div", class_="bdy", recursive=False
        )

        if len(result_bdy) == 0:
            return None

        result = list(map(lambda x: x.find("p", class_="mid"), result_bdy))

        selection = 0
        # if len(result) > 1:
        #     print("Multiple results found. Please select one:")
        #     for i, entry in enumerate(result):
        #         a_element = entry.find("a")
        #         print("[{}] {:<40} {}".format(i, a_element["href"], a_element.text))

        #     selection = int(input("Enter the number of the song you want: "))

        # fetch and parse lyric
        lyric_url = result[selection].find("a")["href"]
        response = requests.get(lyric_url)
        soup = BeautifulSoup(response.text, "html.parser")
        lyric = soup.select("#Lyric")[0].get_text(separator="\n")

        return lyric
