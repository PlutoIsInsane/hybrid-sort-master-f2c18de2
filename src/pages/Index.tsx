import { useState, useEffect, useCallback } from 'react';
import { SortVisualizer } from '@/components/SortVisualizer';
import { ControlPanel } from '@/components/ControlPanel';
import { HybridSortVisualizer, generateRandomArray, SortStep } from '@/utils/hybridSort';
import { Card } from '@/components/ui/card';

const Index = () => {
  const [arraySize, setArraySize] = useState(20);
  const [speed, setSpeed] = useState(500);
  const [algorithm, setAlgorithm] = useState<'hybrid' | 'quicksort' | 'insertion'>('hybrid');
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [maxValue, setMaxValue] = useState(100);

  const generateNewArray = useCallback(() => {
    const newArray = generateRandomArray(arraySize);
    const sorter = new HybridSortVisualizer();
    const sortSteps = sorter.sort(newArray, algorithm);
    setSteps(sortSteps);
    setCurrentStep(0);
    setIsPlaying(false);
    setMaxValue(Math.max(...newArray));
  }, [arraySize, algorithm]);

  const handleCustomArray = useCallback((customArray: number[]) => {
    const sorter = new HybridSortVisualizer();
    const sortSteps = sorter.sort(customArray, algorithm);
    setSteps(sortSteps);
    setCurrentStep(0);
    setIsPlaying(false);
    setMaxValue(Math.max(...customArray));
  }, [algorithm]);

  useEffect(() => {
    generateNewArray();
  }, [generateNewArray]);

  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else if (currentStep === steps.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, steps.length, speed]);

  const handlePlayPause = () => {
    if (currentStep === steps.length - 1) {
      setCurrentStep(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleStepBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setIsPlaying(false);
    }
  };

  const handleStepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setIsPlaying(false);
    }
  };

  const handleSpeedChange = (value: number[]) => {
    setSpeed(value[0]);
  };

  const handleArraySizeChange = (value: number[]) => {
    setArraySize(value[0]);
  };

  const handleAlgorithmChange = (value: 'hybrid' | 'quicksort' | 'insertion') => {
    setAlgorithm(value);
  };

  if (steps.length === 0) return null;

  return (
    <div className="min-h-screen bg-gradient-bg p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Hybrid Sort Visualizer
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Watch how QuickSort combines with Insertion Sort for optimal performance. 
            QuickSort handles large subarrays while Insertion Sort efficiently sorts small ones.
          </p>
        </div>

        {/* Algorithm Info */}
        <Card className="p-6 bg-card/80 backdrop-blur-sm border-border">
          <h2 className="text-xl font-semibold mb-3 text-foreground">How It Works</h2>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <span className="font-semibold text-quicksort">QuickSort Phase:</span> Efficiently partitions large arrays using a divide-and-conquer approach with O(n log n) average complexity.
            </p>
            <p>
              <span className="font-semibold text-insertion">Insertion Sort Phase:</span> When a subarray size ≤ 10 elements, switches to Insertion Sort which has lower overhead and is faster for small datasets.
            </p>
            <p className="pt-2 border-t border-border">
              <strong>Why Hybrid?</strong> This combination leverages QuickSort's efficiency on large data while avoiding its overhead on small subarrays, resulting in 10-20% performance improvement in practice.
            </p>
          </div>
        </Card>

        {/* Main Content */}
        <div className="grid lg:grid-cols-[1fr_380px] gap-6">
          <Card className="p-6 bg-card/80 backdrop-blur-sm border-border">
            <SortVisualizer
              step={steps[currentStep]}
              maxValue={maxValue}
            />
          </Card>

          <ControlPanel
            isPlaying={isPlaying}
            currentStep={currentStep}
            totalSteps={steps.length}
            speed={speed}
            arraySize={arraySize}
            algorithm={algorithm}
            onPlayPause={handlePlayPause}
            onReset={handleReset}
            onStepBack={handleStepBack}
            onStepForward={handleStepForward}
            onSpeedChange={handleSpeedChange}
            onArraySizeChange={handleArraySizeChange}
            onAlgorithmChange={handleAlgorithmChange}
            onGenerateNew={generateNewArray}
            onCustomArray={handleCustomArray}
            comparisons={steps[currentStep].stats.comparisons}
            swaps={steps[currentStep].stats.swaps}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
