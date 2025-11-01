import { useState, useEffect, useRef } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryDropdownProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  variant?: 'default' | 'light'; // light = white text for dark backgrounds
}

export const CategoryDropdown = ({ categories, selectedCategory, onCategoryChange, variant = 'default' }: CategoryDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleSelect = (category: string) => {
    onCategoryChange(category);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative inline-block">
      {/* Trigger Button - TikTok Style */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1.5 px-2 py-2 font-semibold text-base transition-opacity hover:opacity-80",
          variant === 'light' ? "text-white" : "text-foreground"
        )}
      >
        <span>{selectedCategory}</span>
        <ChevronDown 
          className={cn(
            "w-3 h-3 transition-transform duration-200",
            isOpen && "rotate-180"
          )} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div 
            className="fixed inset-0 z-30 md:hidden"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-background border border-border rounded-xl shadow-xl min-w-[200px] max-w-[280px] z-40 overflow-hidden">
            <div className="max-h-[400px] overflow-y-auto">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleSelect(category)}
                  className={cn(
                    "w-full px-4 py-3 text-right transition-colors flex items-center justify-between",
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  <span>{category}</span>
                  {selectedCategory === category && (
                    <Check className="w-4 h-4" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
