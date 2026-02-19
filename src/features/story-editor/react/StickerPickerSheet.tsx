import type { CSSProperties } from 'react';
import { Button, Loader, Text } from '@toss/tds-mobile';
import type { StickerCategory } from '../../../api/stickerCategories';
import type { Sticker } from '../../../api/stickers';

type Props = {
  open: boolean;
  categories: StickerCategory[];
  stickers: Sticker[];
  selectedCategoryId: number | null;
  loadingCategories: boolean;
  loadingStickers: boolean;
  errorMessage: string;
  onClose: () => void;
  onRetry: () => void;
  onSelectCategory: (categoryId: number) => void;
  onPickSticker: (sticker: Sticker) => void;
};

export function StickerPickerSheet({
  open,
  categories,
  stickers,
  selectedCategoryId,
  loadingCategories,
  loadingStickers,
  errorMessage,
  onClose,
  onRetry,
  onSelectCategory,
  onPickSticker,
}: Props) {
  if (!open) return null;

  return (
    <div style={overlayStyle} onClick={onClose} role="presentation">
      <div style={sheetStyle} onClick={e => e.stopPropagation()} role="dialog" aria-label="스티커 선택">
        <div style={handleStyle} />
        <div style={tabsRowStyle}>
          {loadingCategories ? (
            <div style={loadingWrapStyle}><Loader /></div>
          ) : categories.length === 0 ? (
            <Text typography="st13" color="grey500">카테고리가 없습니다.</Text>
          ) : (
            categories.map(category => {
              const active = category.id === selectedCategoryId;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => onSelectCategory(category.id)}
                  style={{ ...tabButtonStyle, ...(active ? activeTabStyle : null) }}
                  aria-label={category.name}
                >
                  {category.thumbnailUrl ? (
                    <img src={category.thumbnailUrl} alt="" style={tabImageStyle} />
                  ) : (
                    <span style={tabFallbackStyle}>🙂</span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {errorMessage ? (
          <div style={statusStyle}>
            <Text typography="st13" color="red600">{errorMessage}</Text>
            <Button size="small" variant="weak" color="dark" onClick={onRetry}>다시 시도</Button>
          </div>
        ) : loadingStickers ? (
          <div style={statusStyle}><Loader /></div>
        ) : (
          <div style={gridStyle}>
            {stickers.map(sticker => (
              <button key={sticker.id} type="button" style={gridItemStyle} onClick={() => onPickSticker(sticker)}>
                <img src={sticker.thumbnailUrl ?? sticker.imageUrl} alt={sticker.name ?? ''} style={gridImageStyle} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const overlayStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.55)',
  zIndex: 20,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-end',
};

const sheetStyle: CSSProperties = {
  width: 'min(720px, 100%)',
  maxHeight: '58vh',
  background: '#141414',
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  border: '1px solid rgba(255,255,255,0.12)',
  borderBottom: 'none',
  padding: '10px 12px max(12px, env(safe-area-inset-bottom))',
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
};

const handleStyle: CSSProperties = {
  width: 44,
  height: 4,
  borderRadius: 999,
  background: 'rgba(255,255,255,0.35)',
  alignSelf: 'center',
};

const tabsRowStyle: CSSProperties = {
  display: 'flex',
  gap: 8,
  overflowX: 'auto',
  paddingBottom: 4,
};

const tabButtonStyle: CSSProperties = {
  width: 48,
  height: 48,
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.14)',
  background: 'rgba(255,255,255,0.08)',
  padding: 0,
  flex: '0 0 auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const activeTabStyle: CSSProperties = {
  border: '1px solid rgba(99, 102, 241, 0.9)',
  background: 'rgba(99, 102, 241, 0.18)',
};

const tabImageStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: 12,
};

const tabFallbackStyle: CSSProperties = {
  fontSize: 22,
};

const gridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
  gap: 8,
  overflowY: 'auto',
  paddingBottom: 4,
};

const gridItemStyle: CSSProperties = {
  width: '100%',
  aspectRatio: '1 / 1',
  borderRadius: 10,
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(255,255,255,0.06)',
  padding: 4,
};

const gridImageStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'contain',
};

const statusStyle: CSSProperties = {
  minHeight: 160,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  gap: 12,
};

const loadingWrapStyle: CSSProperties = {
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
};
