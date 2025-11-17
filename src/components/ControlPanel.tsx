import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Play, Pause, RotateCcw, SkipBack, SkipForward } from 'lucide-react';
import { useState } from 'react';

interface ControlPanelProps {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number;
  arraySize: number;
  algorithm: 'hybrid' | 'quicksort' | 'insertion';
  onPlayPause: () => void;
  onReset: () => void;
  onStepBack: () => void;
  onStepForward: () => void;
  onSpeedChange: (value: number[]) => void;
  onArraySizeChange: (value: number[]) => void;
  onAlgorithmChange: (value: 'hybrid' | 'quicksort' | 'insertion') => void;
  onGenerateNew: () => void;
  onCustomArray: (array: number[]) => void;
  comparisons: number;
  swaps: number;
}

export const ControlPanel = ({
  isPlaying,
  currentStep,
  totalSteps,
  speed,
  arraySize,
  algorithm,
  onPlayPause,
  onReset,
  onStepBack,
  onStepForward,
  onSpeedChange,
  onArraySizeChange,
  onAlgorithmChange,
  onGenerateNew,
  onCustomArray,
  comparisons,
  swaps,
}: ControlPanelProps) => {
  const [customInput, setCustomInput] = useState('');
  return (
    <Card className="p-6 space-y-6 bg-card/80 backdrop-blur-sm border-border">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">Playback Controls</h3>
          <span className="text-sm text-muted-foreground">
            Step {currentStep + 1} / {totalSteps}
          </span>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="icon"
            onClick={onStepBack}
            disabled={currentStep === 0}
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button
            variant="default"
            className="flex-1"
            onClick={onPlayPause}
            disabled={currentStep === totalSteps - 1 && !isPlaying}
          >
            {isPlaying ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Play
              </>
            )}
          </Button>
          
          <Button
            variant="secondary"
            size="icon"
            onClick={onStepForward}
            disabled={currentStep === totalSteps - 1}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
          
          <Button
            variant="secondary"
            size="icon"
            onClick={onReset}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Algorithm
          </label>
          <RadioGroup value={algorithm} onValueChange={onAlgorithmChange}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="hybrid" id="hybrid" />
              <Label htmlFor="hybrid" className="cursor-pointer">Hybrid (QuickSort + Insertion)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="quicksort" id="quicksort" />
              <Label htmlFor="quicksort" className="cursor-pointer">QuickSort Only</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="insertion" id="insertion" />
              <Label htmlFor="insertion" className="cursor-pointer">Insertion Sort Only</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Animation Speed: {speed}ms
          </label>
          <Slider
            value={[speed]}
            onValueChange={onSpeedChange}
            min={100}
            max={2000}
            step={100}
            className="w-full"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Array Size: {arraySize}
          </label>
          <Slider
            value={[arraySize]}
            onValueChange={onArraySizeChange}
            min={10}
            max={50}
            step={5}
            className="w-full"
          />
        </div>

        <Button
          variant="secondary"
          className="w-full"
          onClick={onGenerateNew}
        >
          Generate New Array
        </Button>

        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Custom Numbers (comma-separated)
          </label>
          <Textarea
            placeholder="e.g., 45, 23, 78, 12, 56"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            className="min-h-[60px]"
          />
          <Button
            variant="secondary"
            className="w-full mt-2"
            onClick={() => {
              const numbers = customInput
                .split(',')
                .map(n => parseInt(n.trim()))
                .filter(n => !isNaN(n));
              if (numbers.length > 0) {
                onCustomArray(numbers);
                setCustomInput('');
              }
            }}
          >
            Use Custom Array
          </Button>
        </div>
      </div>

      <div className="pt-4 border-t border-border space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Comparisons:</span>
          <span className="font-mono font-semibold text-foreground">{comparisons}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Swaps:</span>
          <span className="font-mono font-semibold text-foreground">{swaps}</span>
        </div>
      </div>
    </Card>
  );
};
