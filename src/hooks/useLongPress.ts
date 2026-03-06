import { useRef, useState, useCallback, useEffect } from 'react';

/**
 * Detects a long-press hold on touch devices.
 *
 * @param duration        - How long (ms) the user must hold before `isPressed` becomes true. Default: 300ms.
 * @param autoDismissDelay - If provided, `isPressed` automatically resets to false after this many ms.
 *                          Useful for revealing hidden buttons that auto-hide if the user doesn't tap them.
 *
 * Usage:
 *   const { handlers, isPressed } = useLongPress(300, 3000);
 *   <div {...handlers} className={isPressed ? 'is-long-pressed' : ''}>
 *
 * - handlers.onContextMenu calls e.preventDefault() to block the browser's
 *   "Save Image" / "Copy Link" popup that appears during long-touch on images.
 * - Both timers are cleaned up automatically on unmount.
 */

type LongPressHandlers = {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchEnd: () => void;
    onTouchCancel: () => void;
    onContextMenu: (e: React.MouseEvent) => void;
};

export type UseLongPressResult = {
    handlers: LongPressHandlers;
    isPressed: boolean;
};

export function useLongPress(duration = 300, autoDismissDelay?: number): UseLongPressResult {
    const [isPressed, setIsPressed] = useState(false);
    const timerRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
    const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const start = useCallback(() => {
        timerRef.current = setTimeout(() => {
            setIsPressed(true);

            // Optionally auto-dismiss after a delay so the revealed UI
            // doesn't stay visible indefinitely if the user doesn't tap it.
            if (autoDismissDelay) {
                resetTimerRef.current = setTimeout(() => setIsPressed(false), autoDismissDelay);
            }
        }, duration);
    }, [duration, autoDismissDelay]);

    const cancel = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        // Also cancel the auto-dismiss so it doesn't fire after a short tap
        if (resetTimerRef.current) {
            clearTimeout(resetTimerRef.current);
            resetTimerRef.current = null;
        }
        setIsPressed(false);
    }, []);

    // Clear both timers when the component unmounts to prevent memory leaks
    // and state updates on an unmounted component.
    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
        };
    }, []);

    const handlers: LongPressHandlers = {
        onTouchStart: (e: React.TouchEvent) => {
            e.stopPropagation();
            start();
        },
        onTouchEnd:   cancel,
        onTouchCancel: cancel,
        // Prevent the browser's "Save Image" / "Copy" context menu on long-press
        onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
    };

    return { handlers, isPressed };
}
