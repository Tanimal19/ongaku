<div align="center">
  <img src="https://github.com/Tanimal19/ongaku/blob/beb67a44cf3fd3a5a9da8c501f359b7231136440/public/logo-full.svg" width="500" height="100">
</div>
<br>
<br>

# Ongaku v0.1
**Ongaku** 是一個簡單的音樂播放工具，可以播放 youtube 上的任何影片，並且會自動在網路上搜尋相關歌詞以及翻譯。  
demo video: https://youtu.be/W3OSHAKRem8  

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
cd api/
pip install -r requirements.txt
```

### set youtube api key
inside `modules/` directory, create a `credentials.py` with this content:
```py
YOUTUBE_API_KEY = "YOUR-YOUTUBE-API-KEY"
```

### to run dev server
```
npm run dev
```



