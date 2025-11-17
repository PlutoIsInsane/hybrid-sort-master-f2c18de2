import { useEffect, useRef } from 'react';
import { SortStep } from '@/utils/hybridSort';

interface SortVisualizerProps {
  step: SortStep;
  maxValue: number;
}

export const SortVisualizer = ({ step, maxValue }: SortVisualizerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [step]);

  const getBarColor = (index: number) => {
    if (step.sorted.includes(index)) return 'bg-sorted';
    if (step.comparing.includes(index)) return 'bg-comparing';
    if (step.activeAlgorithm === 'quicksort') return 'bg-quicksort';
    if (step.activeAlgorithm === 'insertion') return 'bg-insertion';
    return 'bg-primary';
  };

  return (
    <div ref={containerRef} className="w-full space-y-4">
      <div className="flex items-end justify-center gap-1 h-64 px-4">
        {step.array.map((value, index) => {
          const heightPercent = (value / maxValue) * 100;
          return (
            <div
              key={index}
              className={`flex-1 max-w-16 ${getBarColor(index)} transition-all duration-300 rounded-t-sm relative group`}
              style={{ height: `${heightPercent}%` }}
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity bg-card px-2 py-1 rounded whitespace-nowrap">
                {value}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-4">
        <p className="text-sm font-mono text-foreground">{step.message}</p>
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-quicksort rounded"></div>
          <span className="text-muted-foreground">QuickSort</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-insertion rounded"></div>
          <span className="text-muted-foreground">Insertion Sort</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-comparing rounded"></div>
          <span className="text-muted-foreground">Comparing</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-sorted rounded"></div>
          <span className="text-muted-foreground">Sorted</span>
        </div>
      </div>
    </div>
  );
};
