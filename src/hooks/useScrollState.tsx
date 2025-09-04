import { useState, useEffect, createContext, useContext, ReactNode } from "react";

interface ScrollState {
  scrollY: number;
  isHeaderVisible: boolean;
  isFilterVisible: boolean;
}

interface ScrollStateContextType extends ScrollState {
  setHeaderVisible: (visible: boolean) => void;
  setFilterVisible: (visible: boolean) => void;
}

const ScrollStateContext = createContext<ScrollStateContextType | undefined>(undefined);

export const ScrollStateProvider = ({ children }: { children: ReactNode }) => {
  const [scrollY, setScrollY] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isFilterVisible, setIsFilterVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = document.querySelector('.h-screen.overflow-y-scroll');
      if (!scrollContainer) return;
      
      setScrollY(scrollContainer.scrollTop);
    };

    const scrollContainer = document.querySelector('.h-screen.overflow-y-scroll');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const setHeaderVisible = (visible: boolean) => setIsHeaderVisible(visible);
  const setFilterVisible = (visible: boolean) => setIsFilterVisible(visible);

  return (
    <ScrollStateContext.Provider value={{
      scrollY,
      isHeaderVisible,
      isFilterVisible,
      setHeaderVisible,
      setFilterVisible
    }}>
      {children}
    </ScrollStateContext.Provider>
  );
};

export const useScrollState = () => {
  const context = useContext(ScrollStateContext);
  if (context === undefined) {
    throw new Error('useScrollState must be used within a ScrollStateProvider');
  }
  return context;
};