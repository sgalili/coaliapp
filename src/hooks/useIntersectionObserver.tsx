import { useEffect, useRef, useState } from "react";

export interface IntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
}

export const useIntersectionObserver = (options: IntersectionObserverOptions = {}) => {
  const [entries, setEntries] = useState<IntersectionObserverEntry[]>([]);
  const observer = useRef<IntersectionObserver | null>(null);
  const elementsRef = useRef<Element[]>([]);

  const { threshold = 0.6, rootMargin = "0px" } = options;

  useEffect(() => {
    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(
      (observedEntries) => {
        setEntries(observedEntries);
      },
      {
        threshold,
        rootMargin,
      }
    );

    elementsRef.current.forEach((element) => {
      if (element && observer.current) {
        observer.current.observe(element);
      }
    });

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [threshold, rootMargin]);

  const observe = (element: Element | null) => {
    if (!element) return;
    
    if (!elementsRef.current.includes(element)) {
      elementsRef.current.push(element);
      if (observer.current) {
        observer.current.observe(element);
      }
    }
  };

  const unobserve = (element: Element | null) => {
    if (!element) return;
    
    elementsRef.current = elementsRef.current.filter((el) => el !== element);
    if (observer.current) {
      observer.current.unobserve(element);
    }
  };

  return { entries, observe, unobserve };
};