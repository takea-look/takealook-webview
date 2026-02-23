# Flutter CI / AIT Deploy Pipeline

## Standard chain (required)

1. `flutter pub get`
2. `flutter analyze`
3. `flutter test`
4. `flutter build web --release`

## AIT artifact standard

- `takealook.ait`
- `flutter/build/web`
- deploy QR PNG (when deploy runs)

## Secrets policy (graceful fail/skip)

- `TOSS_KEY` 누락 시: AIT **deploy 단계는 skip**, CI + artifact upload는 계속 수행
- `DISCORD_WEBHOOK_URL` 누락 시: Discord 알림 단계 skip

## Manual run (`workflow_dispatch`)

- `deploy=true` (default): secret 존재 시 배포 진행
- `deploy=false`: 배포 생략, CI + artifact only

## Failure visibility

- 실패/성공 시 Discord에 run URL 포함
- 원인 확인은 GitHub Actions failed step 로그 기준
