// Custom hook for adding and removing event listeners

'use client';

import { useEffect, useRef } from 'react';

type EventMap = WindowEventMap &
  DocumentEventMap &
  HTMLElementEventMap &
  MediaQueryListEventMap;

type EventName<K extends string> = K extends keyof EventMap
  ? EventMap[K]
  : Event;

export function useEventListener<
  K extends string,
  T extends EventTarget = Window
>(
  eventName: K,
  handler: (event: EventName<K>) => void,
  target?: T,
  options?: AddEventListenerOptions
) {
  // Create a ref to store the handler
  const savedHandler = useRef(handler);

  // Update the ref when handler changes
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    // Validate that we have a target
    const targetElement = target ?? (typeof window !== 'undefined' ? window : null);
    if (!targetElement) return;

    // Create event listener
    const listener = (event: Event) => {
      savedHandler.current(event as EventName<K>);
    };

    targetElement.addEventListener(eventName as any, listener, options);

    // Cleanup
    return () => {
      targetElement.removeEventListener(eventName as any, listener, options);
    };
  }, [eventName, target, options]);
}

/**
 * Hook for listening to window events
 */
export function useWindowEventListener<K extends string>(
  eventName: K,
  handler: (event: EventName<K>) => void,
  options?: AddEventListenerOptions
) {
  return useEventListener(eventName, handler, window, options);
}

/**
 * Hook for listening to document events
 */
export function useDocumentEventListener<K extends string>(
  eventName: K,
  handler: (event: EventName<K>) => void,
  options?: AddEventListenerOptions
) {
  return useEventListener(eventName, handler, document, options);
}

/**
 * Hook for listening to custom events
 */
export function useCustomEventListener<T = any>(
  eventName: string,
  handler: (event: CustomEvent<T>) => void,
  target?: EventTarget
) {
  return useEventListener(eventName, handler as (event: Event) => void, target);
}
