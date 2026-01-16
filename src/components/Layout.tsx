import { CSSProperties, ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
    style?: CSSProperties;
    contentStyle?: CSSProperties;
    fullBleed?: boolean;
}

export function Layout({ children, style, contentStyle, fullBleed = false }: LayoutProps) {
    return (
        <div style={{
            backgroundColor: '#fff',
            minHeight: '100vh',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            ...style
        }}>
            <main style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                padding: fullBleed ? '0' : '0 24px',
                maxWidth: '480px',
                width: '100%',
                boxSizing: 'border-box',
                position: 'relative',
                ...contentStyle
            }}>
                {children}
            </main>
        </div>
    );
}
