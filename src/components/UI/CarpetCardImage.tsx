import { useState, useRef, useCallback } from 'react';
import '../../Css/UI/ImageGrid.css';
import { useNavigate, useLocation } from 'react-router';

type CarpetCardImageProps = {
    imageUrl: string;
    carpetNum: string;
    altText?: string;
}

export const CarpetCardImage = ({ imageUrl, carpetNum, altText }: CarpetCardImageProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isPressed, setIsPressed] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleClick = () => {
        navigate(`/carpet/${carpetNum}`, {
            state: { from: location.pathname + location.search }
        });
    };

    const startLongPress = useCallback(() => {
        timerRef.current = setTimeout(() => {
            setIsPressed(true);
            // Auto-dismiss the overlay after 3s so it doesn't stay stuck
            resetTimerRef.current = setTimeout(() => setIsPressed(false), 4000);
        }, 300);
    }, []);

    const cancelLongPress = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    return (
        <div className="carpet-card-image-container">
            <div
                className={`carpet-card-image-item${isPressed ? ' is-long-pressed' : ''}`}
                onClick={handleClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleClick();
                    }
                }}
                onTouchStart={(e) => { e.stopPropagation(); startLongPress(); }}
                onTouchEnd={cancelLongPress}
                onTouchCancel={cancelLongPress}
                // Prevent "Save Image" / "Copy" OS popup during long-press on mobile
                onContextMenu={(e) => e.preventDefault()}
            >
                <img
                    src={imageUrl}
                    alt={altText || `Carpet ${carpetNum}`}
                    loading="lazy"
                />
                <div className="carpet-card-overlay">
                    <span>Click to view details</span>
                </div>
            </div>
        </div>
    );
};
