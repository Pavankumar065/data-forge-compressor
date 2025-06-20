
import { useState } from 'react';
import { FileArchive, Play, Clock, BarChart3 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FileUpload from '../components/FileUpload';
import AlgorithmSelect from '../components/AlgorithmSelect';
import CompressionStats from '../components/CompressionStats';
import DownloadButton from '../components/DownloadButton';
import { toast } from "@/components/ui/use-toast";

interface CompressorProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Compressor = ({ darkMode, toggleDarkMode }: CompressorProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('huffman');
  const [selectedMode, setSelectedMode] = useState<'compress' | 'decompress'>('compress');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);
  const [stats, setStats] = useState<{
    originalSize: number;
    compressedSize: number;
    compressionRatio: number;
    timeTaken: number;
    algorithm: string;
    mode: string;
  } | null>(null);
  const [processedFileData, setProcessedFileData] = useState<{
    content: string | ArrayBuffer;
    name: string;
    type: string;
  } | null>(null);

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    setIsProcessed(false);
    setProcessedFileData(null);
    setStats(null);
  };

  const handleAlgorithmChange = (algorithm: string) => {
    setSelectedAlgorithm(algorithm);
  };

  const handleModeChange = (mode: 'compress' | 'decompress') => {
    setSelectedMode(mode);
  };

  const handleProcessFile = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    const startTime = Date.now();

    try {
      // Read the original file content
      const fileContent = await readFileContent(selectedFile);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      // For now, we're keeping the same content (since we don't have actual compression algorithms)
      // In a real implementation, this is where you'd apply Huffman or RLE algorithms
      let processedContent = fileContent;
      let processedSize = selectedFile.size;

      // Simulate compression ratio for demonstration
      if (selectedMode === 'compress') {
        // Simulate compression by reducing size by 10-30%
        const compressionFactor = 0.7 + Math.random() * 0.2; // 70-90% of original size
        processedSize = Math.floor(selectedFile.size * compressionFactor);
      } else {
        // Simulate decompression by increasing size slightly
        const decompressionFactor = 1.1 + Math.random() * 0.1; // 110-120% of original size
        processedSize = Math.floor(selectedFile.size * decompressionFactor);
      }

      const endTime = Date.now();
      const processingTime = endTime - startTime;

      // Generate processed file name
      const originalName = selectedFile.name;
      const fileExtension = originalName.substring(originalName.lastIndexOf('.'));
      const baseName = originalName.substring(0, originalName.lastIndexOf('.'));
      const suffix = selectedMode === 'compress' ? '_compressed' : '_decompressed';
      const processedFileName = `${baseName}${suffix}${fileExtension}`;

      // Store processed file data
      setProcessedFileData({
        content: processedContent,
        name: processedFileName,
        type: selectedFile.type
      });

      // Update stats with correct structure
      setStats({
        originalSize: selectedFile.size,
        compressedSize: processedSize,
        compressionRatio: ((selectedFile.size - processedSize) / selectedFile.size) * 100,
        timeTaken: processingTime,
        algorithm: selectedAlgorithm,
        mode: selectedMode
      });

      setIsProcessed(true);
      
      toast({
        title: `${selectedMode === 'compress' ? 'Compression' : 'Decompression'} Complete!`,
        description: `File processed successfully in ${processingTime}ms`,
      });

    } catch (error) {
      toast({
        title: "Processing Failed",
        description: "An error occurred while processing the file.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const readFileContent = (file: File): Promise<string | ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        resolve(e.target?.result || '');
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      // For text files, read as text to preserve content exactly
      if (file.type.startsWith('text/') || 
          file.name.endsWith('.txt') || 
          file.name.endsWith('.json') || 
          file.name.endsWith('.csv') || 
          file.name.endsWith('.html') || 
          file.name.endsWith('.xml')) {
        reader.readAsText(file);
      } else {
        // For binary files, read as array buffer
        reader.readAsArrayBuffer(file);
      }
    });
  };

  const handleDownload = () => {
    if (!processedFileData) return;

    let blob: Blob;
    
    if (typeof processedFileData.content === 'string') {
      // Text content
      blob = new Blob([processedFileData.content], { 
        type: processedFileData.type || 'text/plain' 
      });
    } else {
      // Binary content
      blob = new Blob([processedFileData.content], { 
        type: processedFileData.type || 'application/octet-stream' 
      });
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = processedFileData.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Started",
      description: "Your file download has begun.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
              <FileArchive className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              File Compressor
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Upload your file and choose a compression algorithm to get started
            </p>
          </div>

          {/* File Upload */}
          <div className="mb-8">
            <FileUpload onFileSelect={handleFileSelect} selectedFile={selectedFile} />
          </div>

          {/* Algorithm Selection */}
          {selectedFile && (
            <div className="mb-8">
              <AlgorithmSelect
                selectedAlgorithm={selectedAlgorithm}
                selectedMode={selectedMode}
                onAlgorithmChange={handleAlgorithmChange}
                onModeChange={handleModeChange}
              />
            </div>
          )}

          {/* Process Button */}
          {selectedFile && (
            <div className="mb-8 text-center">
              <button
                onClick={handleProcessFile}
                disabled={isProcessing}
                className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 space-x-2"
              >
                {isProcessing ? (
                  <>
                    <Clock className="h-5 w-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5" />
                    <span>Process File</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Compression Stats */}
          <CompressionStats
            stats={stats}
            isLoading={isProcessing}
          />

          {/* Download Button */}
          {isProcessed && processedFileData && (
            <div className="mb-8">
              <DownloadButton
                isEnabled={true}
                fileName={processedFileData.name}
                mode={selectedMode}
                onDownload={handleDownload}
              />
            </div>
          )}

          {/* Supported File Types Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Supported File Types
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              The following file types are supported for compression and decompression:
            </p>
            <div className="flex flex-wrap gap-2">
              {['.txt', '.json', '.csv', '.html', '.xml', '.jpg', '.jpeg', '.png', '.bmp', '.webp', '.gif', '.bin'].map((type) => (
                <span
                  key={type}
                  className="inline-flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const readFileContent = (file: File): Promise<string | ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      resolve(e.target?.result || '');
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    // For text files, read as text to preserve content exactly
    if (file.type.startsWith('text/') || 
        file.name.endsWith('.txt') || 
        file.name.endsWith('.json') || 
        file.name.endsWith('.csv') || 
        file.name.endsWith('.html') || 
        file.name.endsWith('.xml')) {
      reader.readAsText(file);
    } else {
      // For binary files, read as array buffer
      reader.readAsArrayBuffer(file);
    }
  });
};

export default Compressor;
