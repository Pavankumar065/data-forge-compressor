
import { BarChart3, Clock, FileText, Zap } from 'lucide-react';

interface CompressionStatsProps {
  stats: {
    originalSize: number;
    compressedSize: number;
    compressionRatio: number;
    timeTaken: number;
    algorithm: string;
    mode: string;
  } | null;
  isLoading: boolean;
}

const CompressionStats = ({ stats, isLoading }: CompressionStatsProps) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCompressionColor = (ratio: number) => {
    if (ratio >= 70) return 'text-green-600 dark:text-green-400';
    if (ratio >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Processing...
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            Upload a file and start compression to see statistics
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          {stats.mode === 'compress' ? 'Compression' : 'Decompression'} Results
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* File Size Stats */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-gray-700 dark:text-gray-300">Original Size</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {formatFileSize(stats.originalSize)}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-green-600" />
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {stats.mode === 'compress' ? 'Compressed Size' : 'Decompressed Size'}
                </span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {formatFileSize(stats.compressedSize)}
              </span>
            </div>
          </div>

          {/* Performance Stats */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Zap className="h-5 w-5 text-yellow-600" />
                <span className="font-medium text-gray-700 dark:text-gray-300">Compression Ratio</span>
              </div>
              <span className={`font-semibold ${getCompressionColor(stats.compressionRatio)}`}>
                {stats.compressionRatio.toFixed(1)}%
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-purple-600" />
                <span className="font-medium text-gray-700 dark:text-gray-300">Time Taken</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {stats.timeTaken.toFixed(2)}ms
              </span>
            </div>
          </div>
        </div>

        {/* Compression Ratio Visualization */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Space Saved
            </span>
            <span className={`text-sm font-semibold ${getCompressionColor(stats.compressionRatio)}`}>
              {formatFileSize(stats.originalSize - stats.compressedSize)}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                stats.compressionRatio >= 70
                  ? 'bg-green-500'
                  : stats.compressionRatio >= 50
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(stats.compressionRatio, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Algorithm Info */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-sm">
            <span className="font-medium text-blue-900 dark:text-blue-300">Algorithm Used: </span>
            <span className="text-blue-700 dark:text-blue-400">
              {stats.algorithm === 'huffman' ? 'Huffman Coding' : 'Run-Length Encoding'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompressionStats;
