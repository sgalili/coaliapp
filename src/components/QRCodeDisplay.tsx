import { useEffect, useRef } from "react";

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  className?: string;
}

export const QRCodeDisplay = ({ value, size = 200, className }: QRCodeDisplayProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Simple QR code pattern generator (mock implementation)
    // In a real app, you would use a QR code library like 'qrcode'
    const generateQRPattern = () => {
      const moduleSize = size / 25;
      const modules = 25;

      // Clear canvas
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);

      // Generate a simple pattern based on the value
      ctx.fillStyle = '#000000';
      const hash = hashCode(value);
      
      for (let i = 0; i < modules; i++) {
        for (let j = 0; j < modules; j++) {
          // Create a deterministic pattern based on hash and position
          const shouldFill = ((hash + i * 31 + j * 17) % 7) < 3;
          
          if (shouldFill) {
            ctx.fillRect(i * moduleSize, j * moduleSize, moduleSize, moduleSize);
          }
        }
      }

      // Add corner squares (finder patterns)
      addFinderPattern(ctx, 0, 0, moduleSize);
      addFinderPattern(ctx, (modules - 7) * moduleSize, 0, moduleSize);
      addFinderPattern(ctx, 0, (modules - 7) * moduleSize, moduleSize);
    };

    generateQRPattern();
  }, [value, size]);

  const hashCode = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  };

  const addFinderPattern = (ctx: CanvasRenderingContext2D, x: number, y: number, moduleSize: number) => {
    // Outer square
    ctx.fillRect(x, y, 7 * moduleSize, 7 * moduleSize);
    
    // Inner white square
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + moduleSize, y + moduleSize, 5 * moduleSize, 5 * moduleSize);
    
    // Inner black square
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + 2 * moduleSize, y + 2 * moduleSize, 3 * moduleSize, 3 * moduleSize);
  };

  return (
    <div className={`inline-block p-4 bg-white rounded-lg shadow-sm ${className}`}>
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="border border-border rounded"
      />
      <div className="text-xs text-center mt-2 text-muted-foreground max-w-[200px] break-all">
        {value.length > 30 ? `${value.substring(0, 30)}...` : value}
      </div>
    </div>
  );
};