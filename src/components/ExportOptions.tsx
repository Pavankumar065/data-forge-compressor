
import { Download, FileImage, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface ExportOptionsProps {
  onExport: (format: 'png' | 'jpg' | 'pdf') => void;
}

const ExportOptions = ({ onExport }: ExportOptionsProps) => {
  return (
    <Card className="m-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Download className="w-4 h-4" />
          Export Canvas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onExport('png')}
          className="w-full justify-start"
        >
          <FileImage className="w-4 h-4 mr-2" />
          Export as PNG
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onExport('jpg')}
          className="w-full justify-start"
        >
          <FileImage className="w-4 h-4 mr-2" />
          Export as JPG
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onExport('pdf')}
          className="w-full justify-start"
        >
          <FileText className="w-4 h-4 mr-2" />
          Export as PDF
        </Button>
      </CardContent>
    </Card>
  );
};

export default ExportOptions;
