import React from 'react';
import { Button, Text } from '@toss/tds-mobile';

type ReportConfirmDialogProps = {
    open: boolean;
    isReporting: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

export function ReportConfirmDialog({
    open,
    isReporting,
    onClose,
    onConfirm,
}: ReportConfirmDialogProps) {
    if (!open) return null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.55)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
                zIndex: 250,
            }}
            onClick={() => !isReporting && onClose()}
        >
            <div
                style={{
                    width: 'min(420px, 100%)',
                    background: '#fff',
                    borderRadius: '16px',
                    padding: '18px 16px 16px 16px',
                    boxShadow: '0 24px 80px rgba(0,0,0,0.35)',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <Text display="block" color="grey900" typography="st13" fontWeight="bold">
                    이 메시지를 신고할까요?
                </Text>
                <Text
                    display="block"
                    color="grey600"
                    typography="st13"
                    style={{ marginTop: '8px' } as React.CSSProperties}
                >
                    신고가 접수되면 운영팀에서 검토합니다.
                </Text>

                <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                    <Button
                        display="full"
                        color="light"
                        variant="weak"
                        size="large"
                        disabled={isReporting}
                        onClick={onClose}
                    >
                        취소
                    </Button>
                    <Button
                        display="full"
                        color="danger"
                        variant="fill"
                        size="large"
                        loading={isReporting}
                        onClick={onConfirm}
                    >
                        신고
                    </Button>
                </div>
            </div>
        </div>
    );
}
