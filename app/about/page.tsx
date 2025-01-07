"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import Link from "next/link";

export default function About() {
  return (
    <div>
      <div className="bg-zinc-50 w-full h-12 py-2 px-6 flex flex-row justify-between items-center border-b">
        <Link href="/">
          <Image src="/logo-full.svg" width={120} height={40} alt="logo" />
        </Link>
      </div>
      <Content />
    </div>
  );
}

function Content() {
  return (
    <div className="max-w-lg px-4 pt-4 mx-auto">
      <div className="flex flex-col items-center gap-8 my-10">
        <Image src="/logo-full.svg" width={240} height={80} alt="logo" />
        <p>
          Ongaku 是一個簡單的音樂播放網站，可以播放 youtube 上的任何影片。同時
          Ongaku
          會自動在網路上搜尋相關歌詞以及翻譯，讓你在享受音樂的同時查看歌詞。
          <br />
          <span className="text-red-600">
            目前網站還在開發中，有著諸多限制(見下方 4.)，主要提供
            DEMO、試玩的用途
          </span>
        </p>
      </div>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>1. 為什麼要做這個網站？</AccordionTrigger>
          <AccordionContent className="text-gray-700 flex flex-col gap-2">
            <p>
              當初因為 MARUMARU
              突然關站，讓我非常傷心，所以就想說要做一個類似的網站出來，並且在日文歌曲之上擴大到整個
              youtube
              上的音樂，才有了這個專案。順便也是練習一下自己前端開發的技術，不然我真的好爛
              :(
            </p>
            <p>
              <strong>2024/12 更新：</strong>
              <a
                className="text-cyan-600 hover:opacity-70"
                href="https://www.marumaru-x.com/"
                target="_blank"
              >
                MARUMARU{" "}
              </a>
              復活而且功能也變多了！再次跪下感謝站長，不過我應該會繼續這個專案，至少也要做出一個
              MVP
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>
            2. 歌詞從哪裡來？有哪些種類的歌詞？
          </AccordionTrigger>
          <AccordionContent className="text-gray-700 flex flex-col gap-2">
            <p>目前支援的功能有顯示一般歌詞、同步歌詞、翻譯歌詞。</p>
            <p>
              同步和翻譯歌詞會優先從 youtube
              影片本身的字幕抓取，如果沒有找到則會從
              <a
                className="text-cyan-600 hover:opacity-70"
                href="https://lrclib.net/"
                target="_blank"
              >
                {" "}
                Lrclib{" "}
              </a>
              和
              <a
                className="text-cyan-600 hover:opacity-70"
                href="https://www.musixmatch.com/"
                target="_blank"
              >
                {" "}
                Musixmatch{" "}
              </a>
              抓取。如果都找不到，則會從
              <a
                className="text-cyan-600 hover:opacity-70"
                href="https://genius.com/"
                target="_blank"
              >
                {" "}
                Genius{" "}
              </a>
              或是
              <a
                className="text-cyan-600 hover:opacity-70"
                href="https://j-lyric.net/"
                target="_blank"
              >
                {" "}
                J-Lyrics{" "}
              </a>
              (針對日文歌曲) 抓取一般歌詞。網站會盡可能的找到最適合的歌詞。
            </p>
            <p>
              歌詞資源皆來自網路，本網站不擁有任何歌詞資源，也不對歌詞內容負責。
            </p>
            <p className="text-red-500">
              很遺憾，目前從 youtube 影片抓取歌詞的功能並不能在 production
              環境上運行，因為 youtube 不知為何會阻擋來自 Vercel IP 的請求 (
              <a
                className="text-cyan-600 hover:opacity-70"
                href="https://github.com/jdepoix/youtube-transcript-api/issues/303"
                target="_blank"
              >
                github issue
              </a>
              )，所以如果你想要使用這個功能，可以 clone 這個專案到本地運行。
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>3. 網站使用了那些技術？</AccordionTrigger>
          <AccordionContent className="text-gray-700 flex flex-col gap-2">
            <p>
              本網站使用了 Next.js 作為前端框架、flask
              作為後端處理歌詞抓取，並部署在 Vercel 上。
            </p>
            <p>
              前端的 UI 主要使用 shadcn ui
              元件庫；而後端用來抓取歌詞的套件包括但不限於{" "}
              <a
                className="text-cyan-600 hover:opacity-70"
                href="https://pypi.org/project/youtube-transcript-api/"
                target="_blank"
              >
                youtube-transcript-api
              </a>
              、
              <a
                className="text-cyan-600 hover:opacity-70"
                href="https://pypi.org/project/syncedlyrics/"
                target="_blank"
              >
                syncedlyrics
              </a>{" "}
              等。
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>4. 網站目前的限制</AccordionTrigger>
          <AccordionContent className="text-gray-700 flex flex-col gap-2">
            <p>
              由於這只是一個基於興趣的專案，因此目前是部署在 Vercel
              的免費方案上，流量等等會有一定限制。
            </p>
            <p>
              另外，youtube 上的歌曲搜尋是使用 youtube 提供的 API (用我個人的
              GCP 帳號)，因此有使用上的限制，目前網站每天只能搜尋影片 10000 次。
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger>
            5. 未來可能會加入什麼功能？會怎麼發展？
          </AccordionTrigger>
          <AccordionContent className="text-gray-700 flex flex-col gap-2">
            <p>
              雖然是一個業餘專案，但是我還是會盡量維護，嘗試做一些新功能像自動轉換羅馬歌詞之類的，我是沒有打算把它變成一個大雜燴，功能越少越簡單越好。
            </p>
            <p>
              目前的歌詞來源還不是很多，而這樣從網路上抓取歌詞的方式還是有許多問題，經常會有找不到歌詞的情況，尤其同步歌詞還有
              match
              的問題。我個人是希望未來會走向開放歌詞庫的形式，讓每個人都能貢獻、上傳歌詞，而不是都從網路上抓取。
            </p>
            <p>
              如果你有興趣一起開發這個專案，或是有任何問題、建議，都歡迎透過
              poyuncheng.bob@gmail.com 聯絡我。
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
