
import { useState, useRef } from 'react';
import { Upload, File, X, Check } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

const SUPPORTED_TYPES = [
  '.txt', '.jpg', '.jpeg', '.png', '.bmp', '.webp', '.gif', '.bin', '.json'
];

const FileUpload = ({ onFileSelect, selectedFile }: FileUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValidFileType = (file: File) => {
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    return SUPPORTED_TYPES.includes(extension);
  };

  const handleFileSelect = (file: File) => {
    if (isValidFileType(file)) {
      onFileSelect(file);
      
      // Generate preview for text and image files
      if (file.type.startsWith('text/') || file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        
        if (file.type.startsWith('text/')) {
          reader.readAsText(file);
        } else {
          reader.readAsDataURL(file);
        }
      } else {
        setPreview(null);
      }
    } else {
      alert('Unsupported file type. Please upload: ' + SUPPORTED_TYPES.join(', '));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const removeFile = () => {
    onFileSelect(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!selectedFile ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer ${
            isDragOver
              ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Drop your file here, or click to browse
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Supports: {SUPPORTED_TYPES.join(', ')}
          </p>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileInputChange}
            accept={SUPPORTED_TYPES.join(',')}
          />
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  {selectedFile.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedFile.type || 'Unknown type'} • {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          {preview && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preview:
              </h4>
              {selectedFile.type.startsWith('image/') ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="max-w-full h-48 object-contain rounded-lg border border-gray-200 dark:border-gray-600"
                />
              ) : (
                <pre className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg text-sm max-h-32 overflow-auto border border-gray-200 dark:border-gray-600">
                  {preview.substring(0, 500)}
                  {preview.length > 500 && '...'}
                </pre>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
