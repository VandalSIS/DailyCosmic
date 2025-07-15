import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, FileText, RefreshCw } from 'lucide-react';
import { getAllZodiacPdfs, getPdfByZodiacSign } from '@/lib/zodiacPdfMapping';

interface PdfStatus {
  sign: string;
  fileName: string;
  displayName: string;
  exists: boolean;
  loading: boolean;
}

export const PdfManager = () => {
  const [pdfStatuses, setPdfStatuses] = useState<PdfStatus[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  const checkPdfExists = async (fileName: string): Promise<boolean> => {
    try {
      const response = await fetch(`/pdfs/${fileName}`, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  };

  const checkAllPdfs = async () => {
    setIsChecking(true);
    const allPdfs = getAllZodiacPdfs();
    
    const initialStatuses = allPdfs.map(pdf => ({
      sign: pdf.sign,
      fileName: pdf.fileName,
      displayName: pdf.displayName,
      exists: false,
      loading: true
    }));
    
    setPdfStatuses(initialStatuses);

    const updatedStatuses = await Promise.all(
      allPdfs.map(async (pdf) => {
        const exists = await checkPdfExists(pdf.fileName);
        return {
          sign: pdf.sign,
          fileName: pdf.fileName,
          displayName: pdf.displayName,
          exists,
          loading: false
        };
      })
    );

    setPdfStatuses(updatedStatuses);
    setIsChecking(false);
  };

  useEffect(() => {
    checkAllPdfs();
  }, []);

  const availableCount = pdfStatuses.filter(pdf => pdf.exists).length;
  const totalCount = pdfStatuses.length;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              PDF File Manager
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Check which zodiac PDF files are available
            </p>
          </div>
          <Button
            onClick={checkAllPdfs}
            disabled={isChecking}
            variant="outline"
            size="sm"
          >
            {isChecking ? (
              <RefreshCw className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary */}
        <div className="mb-6 p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">
                PDF Files Status: {availableCount}/{totalCount}
              </p>
              <p className="text-xs text-muted-foreground">
                {availableCount === totalCount 
                  ? "✅ All PDF files are ready!" 
                  : `⚠️ ${totalCount - availableCount} PDF files missing`
                }
              </p>
            </div>
            <Badge variant={availableCount === totalCount ? "default" : "secondary"}>
              {Math.round((availableCount / totalCount) * 100)}% Complete
            </Badge>
          </div>
        </div>

        {/* PDF List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pdfStatuses.map((pdf) => (
            <div
              key={pdf.sign}
              className={`p-4 border rounded-lg ${
                pdf.exists 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-red-200 bg-red-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-sm">{pdf.sign}</h3>
                {pdf.loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-gray-400" />
                ) : pdf.exists ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600" />
                )}
              </div>
              <p className="text-xs text-gray-600 mb-2">{pdf.displayName}</p>
              <p className="text-xs font-mono text-gray-500">{pdf.fileName}</p>
              <Badge 
                variant={pdf.exists ? "default" : "destructive"}
                className="mt-2 text-xs"
              >
                {pdf.exists ? "Available" : "Missing"}
              </Badge>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-sm mb-2">📁 How to Add Missing PDFs:</h3>
          <ol className="text-xs text-gray-600 space-y-1">
            <li>1. Place your PDF files in the <code>public/pdfs/</code> folder</li>
            <li>2. Use the exact filenames shown above</li>
            <li>3. Click "Refresh" to check again</li>
            <li>4. All files should show as "Available" before going live</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}; 