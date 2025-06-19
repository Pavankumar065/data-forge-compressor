
import { useState } from 'react';
import { Info } from 'lucide-react';

interface AlgorithmSelectProps {
  selectedAlgorithm: string;
  selectedMode: 'compress' | 'decompress';
  onAlgorithmChange: (algorithm: string) => void;
  onModeChange: (mode: 'compress' | 'decompress') => void;
}

const AlgorithmSelect = ({
  selectedAlgorithm,
  selectedMode,
  onAlgorithmChange,
  onModeChange
}: AlgorithmSelectProps) => {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const algorithms = [
    {
      id: 'huffman',
      name: 'Huffman Coding',
      description: 'Variable-length encoding based on character frequency. Best for text files.',
      efficiency: 'High for text'
    },
    {
      id: 'rle',
      name: 'Run-Length Encoding',
      description: 'Compresses consecutive identical characters. Ideal for images with large solid areas.',
      efficiency: 'High for repetitive data'
    }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Mode Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Operation Mode
        </h3>
        <div className="flex space-x-4">
          {['compress', 'decompress'].map((mode) => (
            <label
              key={mode}
              className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedMode === mode
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
              }`}
            >
              <input
                type="radio"
                name="mode"
                value={mode}
                checked={selectedMode === mode}
                onChange={(e) => onModeChange(e.target.value as 'compress' | 'decompress')}
                className="sr-only"
              />
              <div className="text-center">
                <div className={`text-lg font-medium ${
                  selectedMode === mode
                    ? 'text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {mode === 'compress' ? '📦 Compress' : '📂 Decompress'}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {mode === 'compress' ? 'Reduce file size' : 'Restore original file'}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Algorithm Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Compression Algorithm
        </h3>
        <div className="space-y-4">
          {algorithms.map((algorithm) => (
            <div
              key={algorithm.id}
              className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedAlgorithm === algorithm.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
              }`}
              onClick={() => onAlgorithmChange(algorithm.id)}
            >
              <div className="flex items-start justify-between">
                <label className="flex items-start space-x-3 cursor-pointer flex-1">
                  <input
                    type="radio"
                    name="algorithm"
                    value={algorithm.id}
                    checked={selectedAlgorithm === algorithm.id}
                    onChange={() => onAlgorithmChange(algorithm.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        {algorithm.name}
                      </h4>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowTooltip(showTooltip === algorithm.id ? null : algorithm.id);
                        }}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        <Info className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {algorithm.description}
                    </p>
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        {algorithm.efficiency}
                      </span>
                    </div>
                  </div>
                </label>
              </div>

              {showTooltip === algorithm.id && (
                <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-10">
                  <div className="font-medium mb-1">{algorithm.name} Details:</div>
                  <div>{algorithm.description}</div>
                  <div className="mt-2 text-xs text-gray-300">
                    Best efficiency: {algorithm.efficiency}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlgorithmSelect;
