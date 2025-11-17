import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, RotateCcw, SkipBack, SkipForward } from 'lucide-react';

interface ControlPanelProps {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number;
  arraySize: number;
  onPlayPause: () => void;
  onReset: () => void;
  onStepBack: () => void;
  onStepForward: () => void;
  onSpeedChange: (value: number[]) => void;
  onArraySizeChange: (value: number[]) => void;
  onGenerateNew: () => void;
  comparisons: number;
  swaps: number;
}

export const ControlPanel = ({
  isPlaying,
  currentStep,
  totalSteps,
  speed,
  arraySize,
  onPlayPause,
  onReset,
  onStepBack,
  onStepForward,
  onSpeedChange,
  onArraySizeChange,
  onGenerateNew,
  comparisons,
  swaps,
}: ControlPanelProps) => {
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
