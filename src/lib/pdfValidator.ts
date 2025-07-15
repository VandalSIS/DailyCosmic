import { getPdfByZodiacSign } from './zodiacPdfMapping';

export interface PdfValidationResult {
  exists: boolean;
  filePath: string;
  message: string;
}

// Check if a PDF file exists for a zodiac sign
export const validateZodiacPdf = async (zodiacSign: string): Promise<PdfValidationResult> => {
  const pdfInfo = getPdfByZodiacSign(zodiacSign);
  
  if (!pdfInfo) {
    return {
      exists: false,
      filePath: '',
      message: `No PDF mapping found for zodiac sign: ${zodiacSign}`
    };
  }

  try {
    // In a real application, you would check if the file exists on the server
    // For now, we'll simulate this check
    const response = await fetch(pdfInfo.filePath, { method: 'HEAD' });
    
    if (response.ok) {
      return {
        exists: true,
        filePath: pdfInfo.filePath,
        message: `${pdfInfo.displayName} is ready for delivery`
      };
    } else {
      return {
        exists: false,
        filePath: pdfInfo.filePath,
        message: `PDF file not found: ${pdfInfo.fileName}. Please upload the file to the public/pdfs directory.`
      };
    }
  } catch (error) {
    return {
      exists: false,
      filePath: pdfInfo.filePath,
      message: `Error checking PDF file: ${pdfInfo.fileName}. File may not exist.`
    };
  }
};

// Validate all zodiac PDFs
export const validateAllZodiacPdfs = async (): Promise<Record<string, PdfValidationResult>> => {
  const zodiacSigns = [
    "Aries ♈", "Taurus ♉", "Gemini ♊", "Cancer ♋", "Leo ♌", "Virgo ♍",
    "Libra ♎", "Scorpio ♏", "Sagittarius ♐", "Capricorn ♑", "Aquarius ♒", "Pisces ♓"
  ];

  const results: Record<string, PdfValidationResult> = {};

  for (const sign of zodiacSigns) {
    results[sign] = await validateZodiacPdf(sign);
  }

  return results;
};

// Get summary of PDF validation status
export const getPdfValidationSummary = async (): Promise<{
  totalPdfs: number;
  availablePdfs: number;
  missingPdfs: string[];
  allReady: boolean;
}> => {
  const results = await validateAllZodiacPdfs();
  const entries = Object.entries(results);
  
  const availablePdfs = entries.filter(([_, result]) => result.exists).length;
  const missingPdfs = entries
    .filter(([_, result]) => !result.exists)
    .map(([sign]) => sign);

  return {
    totalPdfs: entries.length,
    availablePdfs,
    missingPdfs,
    allReady: availablePdfs === entries.length
  };
}; 