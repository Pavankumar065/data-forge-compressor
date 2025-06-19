
import { useState, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FileUpload from '@/components/FileUpload';
import AlgorithmSelect from '@/components/AlgorithmSelect';
import CompressionStats from '@/components/CompressionStats';
import DownloadButton from '@/components/DownloadButton';

const Index = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('huffman');
  const [selectedMode, setSelectedMode] = useState<'compress' | 'decompress'>('compress');
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressionStats, setCompressionStats] = useState<any>(null);
  const [processComplete, setProcessComplete] = useState(false);

  // Dark mode toggle
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Mock compression/decompression function
  const handleProcess = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please upload a file before processing.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProcessComplete(false);
    setCompressionStats(null);

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

    // Mock compression statistics
    const originalSize = selectedFile.size;
    const mockCompressionRatio = selectedAlgorithm === 'huffman' 
      ? 60 + Math.random() * 30  // 60-90% for Huffman
      : 30 + Math.random() * 40; // 30-70% for RLE
    
    const compressedSize = selectedMode === 'compress' 
      ? Math.floor(originalSize * (1 - mockCompressionRatio / 100))
      : Math.floor(originalSize * (1 + Math.random() * 0.5)); // Slightly larger for decompress

    const mockStats = {
      originalSize,
      compressedSize,
      compressionRatio: mockCompressionRatio,
      timeTaken: 1500 + Math.random() * 2000,
      algorithm: selectedAlgorithm,
      mode: selectedMode
    };

    setCompressionStats(mockStats);
    setIsProcessing(false);
    setProcessComplete(true);

    toast({
      title: `${selectedMode === 'compress' ? 'Compression' : 'Decompression'} Complete!`,
      description: `File processed successfully using ${selectedAlgorithm === 'huffman' ? 'Huffman Coding' : 'Run-Length Encoding'}.`,
    });
  };

  const handleDownload = () => {
    // Mock download functionality
    const blob = new Blob(['Mock compressed/decompressed data'], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile ? 
      (selectedMode === 'compress' ? selectedFile.name + '.compressed' : selectedFile.name.replace('.compressed', '')) :
      'processed_file';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Started",
      description: "Your file download has begun.",
    });
  };

  const canProcess = selectedFile && selectedAlgorithm && !isProcessing;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Data Compression Portal
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Compress and decompress your files using advanced algorithms like Huffman Coding and Run-Length Encoding. 
            Perfect for learning compression techniques and optimizing file storage.
          </p>
        </div>

        {/* Main Process Flow */}
        <div className="space-y-8">
          {/* Step 1: File Upload */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-semibold">
                1
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Upload Your File
              </h2>
            </div>
            <FileUpload onFileSelect={setSelectedFile} selectedFile={selectedFile} />
          </div>

          {/* Step 2: Algorithm Selection */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                selectedFile 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
              }`}>
                2
              </div>
              <h2 className={`text-2xl font-semibold ${
                selectedFile 
                  ? 'text-gray-900 dark:text-white' 
                  : 'text-gray-400 dark:text-gray-500'
              }`}>
                Choose Algorithm & Mode
              </h2>
            </div>
            <AlgorithmSelect 
              selectedAlgorithm={selectedAlgorithm}
              selectedMode={selectedMode}
              onAlgorithmChange={setSelectedAlgorithm}
              onModeChange={setSelectedMode}
            />
          </div>

          {/* Step 3: Process Button */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                canProcess 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
              }`}>
                3
              </div>
              <h2 className={`text-2xl font-semibold ${
                canProcess 
                  ? 'text-gray-900 dark:text-white' 
                  : 'text-gray-400 dark:text-gray-500'
              }`}>
                Start Processing
              </h2>
            </div>
            
            <div className="w-full max-w-2xl mx-auto">
              <button
                onClick={handleProcess}
                disabled={!canProcess}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center space-x-3 ${
                  canProcess
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-6 w-6" />
                    <span>
                      Start {selectedMode === 'compress' ? 'Compression' : 'Decompression'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Step 4: Results */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                compressionStats || isProcessing
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
              }`}>
                4
              </div>
              <h2 className={`text-2xl font-semibold ${
                compressionStats || isProcessing
                  ? 'text-gray-900 dark:text-white' 
                  : 'text-gray-400 dark:text-gray-500'
              }`}>
                View Results
              </h2>
            </div>
            <CompressionStats stats={compressionStats} isLoading={isProcessing} />
          </div>

          {/* Step 5: Download */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                processComplete
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
              }`}>
                5
              </div>
              <h2 className={`text-2xl font-semibold ${
                processComplete
                  ? 'text-gray-900 dark:text-white' 
                  : 'text-gray-400 dark:text-gray-500'
              }`}>
                Download Result
              </h2>
            </div>
            <DownloadButton 
              isEnabled={processComplete}
              fileName={selectedFile?.name || ''}
              mode={selectedMode}
              onDownload={handleDownload}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
