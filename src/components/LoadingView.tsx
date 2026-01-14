import { Loader } from '@toss/tds-mobile';
import type { CSSProperties } from 'react';

interface LoadingViewProps {
    className?: string;
    style?: CSSProperties;
    size?: 'small' | 'medium' | 'large';
}

export function LoadingView({ className, style, size = 'medium' }: LoadingViewProps) {
    return (
        <div 
            className={className}
            style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                width: '100%',
                minHeight: '100vh',
                backgroundColor: '#FFFFFF',
                ...style 
            }}
        >
            <Loader size={size} type="primary" />
        </div>
    );
}
