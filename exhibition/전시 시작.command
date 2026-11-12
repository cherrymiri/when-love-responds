#!/bin/bash
# 〈When Love Responds〉 전시 시작 — 더블클릭하면 크롬 키오스크(주소창·탭 없는 전체화면)로 갤러리가 열립니다.
# 배포 주소가 바뀌면 아래 한 줄만 고치세요.
GALLERY_URL="https://갤러리-배포-주소.vercel.app/?kiosk"   # ← Vercel 배포 후 실제 주소로 교체

PROFILE="$HOME/.when-love-responds-chrome"   # 전시 전용 크롬 프로필 (평소 쓰는 크롬과 분리)

open -na "Google Chrome" --args \
  --user-data-dir="$PROFILE" \
  --kiosk \
  --no-first-run \
  --no-default-browser-check \
  --use-fake-ui-for-media-stream \
  --autoplay-policy=no-user-gesture-required \
  --disable-features=Translate \
  --disable-session-crashed-bubble \
  --noerrdialogs \
  --overscroll-history-navigation=0 \
  --disable-pinch \
  "$GALLERY_URL"
