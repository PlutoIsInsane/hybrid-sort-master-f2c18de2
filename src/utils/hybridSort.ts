export interface SortStep {
  array: number[];
  comparing: number[];
  sorted: number[];
  activeAlgorithm: 'quicksort' | 'insertion' | 'complete';
  message: string;
  stats: {
    comparisons: number;
    swaps: number;
  };
}

const INSERTION_THRESHOLD = 10;

export class HybridSortVisualizer {
  private steps: SortStep[] = [];
  private comparisons = 0;
  private swaps = 0;

  private addStep(
    array: number[],
    comparing: number[] = [],
    sorted: number[] = [],
    activeAlgorithm: 'quicksort' | 'insertion' | 'complete',
    message: string
  ) {
    this.steps.push({
      array: [...array],
      comparing: [...comparing],
      sorted: [...sorted],
      activeAlgorithm,
      message,
      stats: {
        comparisons: this.comparisons,
        swaps: this.swaps,
      },
    });
  }

  private insertionSort(arr: number[], low: number, high: number, sortedIndices: Set<number>) {
    for (let i = low + 1; i <= high; i++) {
      const key = arr[i];
      let j = i - 1;
      
      this.addStep(arr, [i, j], Array.from(sortedIndices), 'insertion', 
        `Insertion Sort: Inserting element ${key} into sorted position`);
      
      while (j >= low && arr[j] > key) {
        this.comparisons++;
        this.swaps++;
        arr[j + 1] = arr[j];
        j--;
        
        this.addStep(arr, [j + 1, j >= low ? j : j + 1], Array.from(sortedIndices), 'insertion',
          `Insertion Sort: Shifting element ${arr[j + 1]} right`);
      }
      
      if (j >= low) this.comparisons++;
      arr[j + 1] = key;
      sortedIndices.add(i);
      
      this.addStep(arr, [j + 1], Array.from(sortedIndices), 'insertion',
        `Insertion Sort: Placed ${key} at position ${j + 1}`);
    }
  }

  private partition(arr: number[], low: number, high: number, sortedIndices: Set<number>): number {
    const pivot = arr[high];
    let i = low - 1;

    this.addStep(arr, [high], Array.from(sortedIndices), 'quicksort',
      `QuickSort: Selected pivot ${pivot} at position ${high}`);

    for (let j = low; j < high; j++) {
      this.comparisons++;
      this.addStep(arr, [j, high], Array.from(sortedIndices), 'quicksort',
        `QuickSort: Comparing ${arr[j]} with pivot ${pivot}`);

      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        this.swaps++;
        
        this.addStep(arr, [i, j], Array.from(sortedIndices), 'quicksort',
          `QuickSort: Swapped ${arr[i]} and ${arr[j]}`);
      }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    this.swaps++;
    sortedIndices.add(i + 1);
    
    this.addStep(arr, [i + 1, high], Array.from(sortedIndices), 'quicksort',
      `QuickSort: Placed pivot ${pivot} at final position ${i + 1}`);

    return i + 1;
  }

  private hybridQuickSort(arr: number[], low: number, high: number, sortedIndices: Set<number>) {
    if (low < high) {
      const size = high - low + 1;
      
      if (size <= INSERTION_THRESHOLD) {
        this.addStep(arr, [], Array.from(sortedIndices), 'insertion',
          `Switching to Insertion Sort (size ${size} ≤ ${INSERTION_THRESHOLD})`);
        this.insertionSort(arr, low, high, sortedIndices);
        for (let i = low; i <= high; i++) {
          sortedIndices.add(i);
        }
      } else {
        const pi = this.partition(arr, low, high, sortedIndices);
        this.hybridQuickSort(arr, low, pi - 1, sortedIndices);
        this.hybridQuickSort(arr, pi + 1, high, sortedIndices);
      }
    } else if (low === high) {
      sortedIndices.add(low);
    }
  }

  private pureQuickSort(arr: number[], low: number, high: number, sortedIndices: Set<number>) {
    if (low < high) {
      const pi = this.partition(arr, low, high, sortedIndices);
      this.pureQuickSort(arr, low, pi - 1, sortedIndices);
      this.pureQuickSort(arr, pi + 1, high, sortedIndices);
    } else if (low === high) {
      sortedIndices.add(low);
    }
  }

  private pureInsertionSort(arr: number[], sortedIndices: Set<number>) {
    for (let i = 1; i < arr.length; i++) {
      const key = arr[i];
      let j = i - 1;
      
      this.addStep(arr, [i, j], Array.from(sortedIndices), 'insertion', 
        `Insertion Sort: Inserting element ${key} into sorted position`);
      
      while (j >= 0 && arr[j] > key) {
        this.comparisons++;
        this.swaps++;
        arr[j + 1] = arr[j];
        j--;
        
        this.addStep(arr, [j + 1, j >= 0 ? j : j + 1], Array.from(sortedIndices), 'insertion',
          `Insertion Sort: Shifting element ${arr[j + 1]} right`);
      }
      
      if (j >= 0) this.comparisons++;
      arr[j + 1] = key;
      sortedIndices.add(i);
      
      this.addStep(arr, [j + 1], Array.from(sortedIndices), 'insertion',
        `Insertion Sort: Placed ${key} at position ${j + 1}`);
    }
  }

  sort(array: number[], algorithm: 'hybrid' | 'quicksort' | 'insertion' = 'hybrid'): SortStep[] {
    this.steps = [];
    this.comparisons = 0;
    this.swaps = 0;

    const arr = [...array];
    const sortedIndices = new Set<number>();

    if (algorithm === 'quicksort') {
      this.addStep(arr, [], [], 'quicksort', `Starting QuickSort`);
      this.pureQuickSort(arr, 0, arr.length - 1, sortedIndices);
    } else if (algorithm === 'insertion') {
      this.addStep(arr, [], [], 'insertion', `Starting Insertion Sort`);
      sortedIndices.add(0);
      this.pureInsertionSort(arr, sortedIndices);
    } else {
      this.addStep(arr, [], [], 'quicksort', `Starting Hybrid Sort (QuickSort + Insertion Sort)`);
      this.hybridQuickSort(arr, 0, arr.length - 1, sortedIndices);
    }

    this.addStep(arr, [], Array.from({ length: arr.length }, (_, i) => i), 'complete',
      `Sorting complete! Comparisons: ${this.comparisons}, Swaps: ${this.swaps}`);

    return this.steps;
  }
}

export function generateRandomArray(size: number, min = 10, max = 100): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * (max - min + 1)) + min);
}
