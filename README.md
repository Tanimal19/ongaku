<div align="center">
  <img src="https://github.com/Tanimal19/ongaku/blob/beb67a44cf3fd3a5a9da8c501f359b7231136440/public/logo-full.svg" width="500" height="100">
</div>
<br>
<br>

# Ongaku v0.1
**Ongaku** 是一個簡單的音樂播放工具，可以播放 youtube 上的任何影片。  
同時 Ongaku 會自動在網路上搜尋相關歌詞以及翻譯，讓你在享受音樂的同時查看歌詞。  
demo site: https://ongaku-delta.vercel.app  
demo video: https://youtu.be/W3OSHAKRem8  

※目前還在開發中，網站主要提供 DEMO、試玩的用途  
※在 production 環境中有一些功能會受到限制，有興趣的人歡迎 clone 到本地使用

## Project Structure
```
.
├── api/
│   ├── index.py
│   └── requirements.txt
├── app/
├── component/
│   ├── player/
│   │   └── custom components
│   ├── ui/
│   │   └── shadcn components
│   └── icon.tsx
├── lib/
│   └── utils for frontend
├── modules/
│   └── python modules for backend
└── public/
    └── svgs
```

## After you clone
### install packages & modules
```
npm install
pip -r requirements.txt
```

### set youtube api key
create a `credentials.py` and modify this content:
```py
YOUTUBE_API_KEY = "YOUR-YOUTUBE-API-KEY"
```

### to run dev server
```
npm run dev
```

