#!/bin/bash
# 전시용 크롬 창만 종료합니다 (평소 쓰는 크롬은 그대로 둡니다).
pkill -f "when-love-responds-chrome" && echo "전시 화면을 종료했습니다." || echo "실행 중인 전시 화면이 없습니다."
sleep 1
