# Story Editor (WebView) — 이미지 편집(스토리형) 구현/반영 계획

- Issue: #57
- Goal: 스토리형 이미지 편집(텍스트/스티커 레이어, 제스처 변형, 레이어 순서, 캡처/익스포트) 기능을 Takealook FE(WebView)에 도입하기 위한 **기술 선택 + 아키텍처 + 단계별 마일스톤**을 정리한다.

## Summary
Memento(KMP)의 핵심 컨셉은:
1) **UI-agnostic controller(core)** 가 레이어 상태를 소유하고
2) **UI(renderer)** 가 제스처를 통해 레이어를 변형/포커싱하며
3) controller의 **requestCapture / requestExport** 같은 플래그(또는 deferred promise)를 UI가 관찰해서 실제 캡처/크롭/익스포트를 수행하는 구조입니다.

Takealook FE(WebView)에서도 동일하게 `core/ui split`을 두고, UI 렌더러는 **Konva 기반**으로 구성하는 것을 추천합니다.

## Options Comparison (Reuse vs Build)

| Option | License | Rough footprint / complexity | Story-editor fit | Pros | Cons |
|---|---|---:|---|---|---|
| **Konva.js + react-konva** | MIT | Konva unpacked ~1.41MB | **High** | 레이어/히트테스트/익스포트 적합 | 멀티터치 핀치/로테이트는 커스텀 필요 |
| Fabric.js | MIT | unpacked ~25MB(v6.x) | High | 기능 풍부 | React 연동이 대체로 imperative + 번들 크기 큼 |
| Pixi.js | MIT | Large | Medium | 렌더링 성능 | 선택/핸들/텍스트편집/export 파이프라인 직접 구현 부담 |
| TUI Image Editor | MIT | Medium-high | Low-medium | 완성된 photo editor | Story UX와 안맞고 UI opinionated |
| Pintura | Commercial | Medium | Medium | 완성도/지원 | 유료 + story 레이어형은 커스텀 필요 |
| tldraw | Source-available (상용 라이선스 필요) | High | Low | 퀄리티 높음 | 라이선스/UX 미스매치 |

**MVP 추천: Konva.js + react-konva 재사용**

## Recommended Architecture (Memento-like core/ui split)

권장 모듈 구조:

- `src/features/story-editor/core/`  (state/actions/undo/export contract)
- `src/features/story-editor/react/` (Konva Stage/Transformer/gestures/export 구현)
- `src/features/story-editor/tds/`   (Top/Bottom chrome, picker, input 등 TDS UI)
- `src/screens/StoryEditorScreen.tsx`

### Core 모델 / Controller 아이디어

- `EditorState`
  - baseImage
  - ordered layers(z-order)
  - selectedId
  - mode(예: `editingText`)
- `EditorController`
  - addText / addSticker
  - bringToFront
  - setTransform
  - undo / redo
  - requestExport(): `Promise<Blob>`

`requestExport()`는 core에서 deferred promise를 만들고, UI renderer가 `stage.toCanvas()/toBlob()`로 fulfill하는 방식으로 (Memento의 `requestCapture` 패턴) 미러링합니다.

## Milestones + Acceptance Criteria

0) Foundations (1-2d)
- core state/actions/history (undo/redo)

1) Canvas MVP (3-5d)
- base + text + sticker 렌더
- drag
- selection + transformer

2) Gestures + Text Editing (3-6d)
- 2-finger pinch/rotate
- TDS input overlay

3) Export (2-4d)
- PNG/JPEG
- pixelRatio 조절
- JPEG background fill

4) Productization (2-5d)
- sticker picker
- safe-area 대응
- e2e

## Risks / Gotchas
- Canvas tainting(CORS)로 export 실패 가능
  - 이미지 도메인 CORS 헤더 필요
  - `crossOrigin` 설정 필요
- WebView 멀티터치 디바이스 편차
- 텍스트 렌더링/폰트 일관성
- undo/redo 히스토리 크기 제한 필요

## Next TODO
- [ ] FE에서 스토리 편집 기능 스펙(MVP 범위) 확정
- [ ] Konva/react-konva 기반 PoC (제스처 + export까지 최소)
- [ ] 이미지 소스(CDN/R2 등) CORS 정책 점검
- [ ] 최종적으로 core/ui/tds 모듈 구조로 정리
