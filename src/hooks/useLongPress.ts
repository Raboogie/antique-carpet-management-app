import { useRef, useState, useCallback } from 'react';

/**
 * Detects a long-press (~500ms hold) on touch devices.
 *
 * Usage:
 *   const { handlers, isPressed } = useLongPress();
 *   <div {...handlers} className={isPressed ? 'is-long-pressed' : ''}>
 *
 * handlers.onContextMenu calls e.preventDefault() to block the browser's
 * "Save Image" / "Copy Link" popup that fires during a long touch on images.
 */

type LongPressHandlers = {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchEnd: () => void;
    onTouchCancel: () => void;
    onContextMenu: (e: React.MouseEvent) => void;
};

type UseLongPressResult = {
    handlers: LongPressHandlers;
    isPressed: boolean;
};

export function useLongPress(
    onLongPress?: () => void,
    onRelease?: () => void,
    duration = 500,
): UseLongPressResult {
    const [isPressed, setIsPressed] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const start = useCallback(() => {
        timerRef.current = setTimeout(() => {
            setIsPressed(true);
            onLongPress?.();
        }, duration);
    }, [onLongPress, duration]);

    const cancel = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        setIsPressed(false);
        onRelease?.();
    }, [onRelease]);

    const handlers: LongPressHandlers = {
        onTouchStart: (e: React.TouchEvent) => {
            e.stopPropagation();
            start();
        },
        onTouchEnd: cancel,
        onTouchCancel: cancel,
        // Prevent the browser's "Save Image" / "Copy" context menu on long-press
        onContextMenu: (e: React.MouseEvent) => {
            e.preventDefault();
        },
    };

    return { handlers, isPressed };
}
