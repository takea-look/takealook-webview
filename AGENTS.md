# PROJECT KNOWLEDGE BASE

**Generated:** 2026-02-26
**Commit:** (auto-generated)
**Branch:** main

## OVERVIEW
Hybrid Flutter + Vite/React WebView app for TakeALook Korean platform. Flutter is the official main runtime; src/ is legacy React maintenance-only.

## STRUCTURE
```
takealook-webview/
├── flutter/           # Main runtime (PRIMARY) - Dart code
├── src/              # Legacy React (maintenance-only)
│   ├── api/          # API clients (auth, chat, user, storage)
│   ├── components/    # React components (chat, icons, Layout)
│   ├── features/      # Feature modules (story-editor)
│   ├── hooks/         # React hooks (useAuth, useWebSocket)
│   ├── screens/       # Page components (ChatRoom, Login, etc.)
│   ├── types/         # TypeScript types
│   └── utils/         # Utilities (authDebug, image)
├── docs/             # Documentation
└── dist/             # Build output (generated)
```

## WHERE TO LOOK

| Task | Location | Notes |
|-------|-----------|--------|
| Main app logic | flutter/lib/ | Primary runtime - work here |
| React pages | src/screens/ | Legacy - only bugfixes |
| API clients | src/api/ | client.ts has base API config |
| Auth flow | src/hooks/useAuth.ts | Auth hook + deep link handling |
| Story editor | src/features/story-editor/ | React + core logic |
| Routing | src/App.tsx | Protected routes + deep links |
| CI/CD | .github/workflows/ | ait-deploy.yml is non-standard |

## CONVENTIONS

**Environment Variables:**
- All Vite env vars must have `VITE_` prefix
- Required: `VITE_API_BASE_URL`, `VITE_ENABLE_NICKNAME_UPDATE`, `VITE_REGACY_LOGIN`
- Default API: `https://s1.takealook.my` (use `http://localhost:8080` for local)

**Framework:**
- Build: `granite dev` / `granite build` (not standard Vite)
- Granite 404 workaround: `npx vite --host 0.0.0.0 --port 5173`

**TypeScript:**
- Strict mode enabled
- Project references: tsconfig.json → tsconfig.app.json + tsconfig.node.json

**Auth:**
- Toss login by default (toss:// scheme)
- ID/PW login via `VITE_REGACY_LOGIN=true`
- Deep link handling: window.postMessage + event listeners

## ANTI-PATTERNS (THIS PROJECT)

- **NEVER** add new features to `src/` - use `flutter/` instead
- **NEVER** modify Flutter code when working on React bugfixes
- **DO NOT** run `npm run dev` if granite returns 404 on root - use `npx vite --host` instead

## UNIQUE STYLES

**Toss Integration:**
- `@toss/tds-mobile` and `@toss/tds-mobile-ait` for UI
- `@apps-in-toss/web-framework` for WebView framework
- Korean-language logs and error messages

**Deployment:**
- AIT deploy via `.github/workflows/ait-deploy.yml`
- Generates QR code via quickchart.io API
- Discord webhook notifications (Korean)

**Artifacts:**
- `artifacts/` contains test results (283 items, 32MB) - unusual for webview

## COMMANDS

```bash
# Development (React legacy)
npm install              # Install dependencies
cp .env.example .env    # Setup env
npm run dev              # Granite dev server (or: npx vite --host 0.0.0.0 --port 5173)
npm run lint            # ESLint check
npm run build            # Granite build
npm run preview         # Preview build

# Development (Flutter - PRIMARY)
cd flutter
flutter pub get
flutter analyze
flutter test
flutter build apk --debug

# Deployment
npm run deploy            # AIT deploy
```

## NOTES

- **CRITICAL:** `src/` is legacy maintenance-only. All new work goes in `flutter/`
- Granite framework sometimes has 404 on `/` - workaround exists in README
- `takealook.ait` is 2.2MB archive (AI training data?)
- Flutter entry: `flutter/lib/main.dart`
- React entry: `src/main.tsx` → `src/App.tsx`
- Auth debug: `src/utils/authDebug.ts` logs to console when `VITE_DEBUG_AUTH_FLOW=true`
