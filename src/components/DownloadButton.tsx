
import { Download, FileDown } from 'lucide-react';

interface DownloadButtonProps {
  isEnabled: boolean;
  fileName: string;
  mode: 'compress' | 'decompress';
  onDownload: () => void;
}

const DownloadButton = ({ isEnabled, fileName, mode, onDownload }: DownloadButtonProps) => {
  const getButtonText = () => {
    if (mode === 'compress') {
      return 'Download Compressed File';
    }
    return 'Download Decompressed File';
  };

  const getFileName = () => {
    if (mode === 'compress') {
      return fileName + '.compressed';
    }
    return fileName.replace('.compressed', '') || fileName;
  };

  if (!isEnabled) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
          <FileDown className="h-8 w-8 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">
            Complete the {mode}ion process to download your file
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center space-y-4">
          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full w-fit mx-auto">
            <Download className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {mode === 'compress' ? 'Compression Complete!' : 'Decompression Complete!'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Your file is ready for download
            </p>
          </div>

          <button
            onClick={onDownload}
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 space-x-2"
          >
            <Download className="h-5 w-5" />
            <span>{getButtonText()}</span>
          </button>

          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            File name: {getFileName()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadButton;
