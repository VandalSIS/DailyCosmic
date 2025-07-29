// Zodiac PDF mapping system
export interface ZodiacPdfMapping {
  filename: string;
  displayName: string;
  blobUrl?: string; // Vercel Blob URL - will be populated after upload
}

export const zodiacPdfMapping: Record<string, ZodiacPdfMapping> = {
  aries: {
    filename: 'aries-calendar.pdf',
    displayName: 'Aries Daily Planner',
    blobUrl: 'https://jf7h0ykfn8fx1fma.public.blob.vercel-storage.com/aries-calendar.pdf'
  },
  taurus: {
    filename: 'taurus-calendar.pdf',
    displayName: 'Taurus Daily Planner',
    blobUrl: 'https://jf7h0ykfn8fx1fma.public.blob.vercel-storage.com/taurus-calendar.pdf'
  },
  gemini: {
    filename: 'gemini-calendar.pdf',
    displayName: 'Gemini Daily Planner',
    blobUrl: 'https://jf7h0ykfn8fx1fma.public.blob.vercel-storage.com/gemini-calendar.pdf'
  },
  cancer: {
    filename: 'cancer-calendar.pdf',
    displayName: 'Cancer Daily Planner',
    blobUrl: 'https://jf7h0ykfn8fx1fma.public.blob.vercel-storage.com/cancer-calendar.pdf'
  },
  leo: {
    filename: 'leo-calendar.pdf',
    displayName: 'Leo Daily Planner',
    blobUrl: 'https://jf7h0ykfn8fx1fma.public.blob.vercel-storage.com/leo-calendar.pdf'
  },
  virgo: {
    filename: 'virgo-calendar.pdf',
    displayName: 'Virgo Daily Planner',
    blobUrl: 'https://jf7h0ykfn8fx1fma.public.blob.vercel-storage.com/virgo-calendar.pdf'
  },
  libra: {
    filename: 'libra-calendar.pdf',
    displayName: 'Libra Daily Planner',
    blobUrl: 'https://jf7h0ykfn8fx1fma.public.blob.vercel-storage.com/libra-calendar.pdf'
  },
  scorpio: {
    filename: 'scorpio-calendar.pdf',
    displayName: 'Scorpio Daily Planner',
    blobUrl: 'https://jf7h0ykfn8fx1fma.public.blob.vercel-storage.com/scorpio-calendar.pdf'
  },
  sagittarius: {
    filename: 'sagittarius-calendar.pdf',
    displayName: 'Sagittarius Daily Planner',
    blobUrl: 'https://jf7h0ykfn8fx1fma.public.blob.vercel-storage.com/sagittarius-calendar.pdf'
  },
  capricorn: {
    filename: 'capricorn-calendar.pdf',
    displayName: 'Capricorn Daily Planner',
    blobUrl: 'https://jf7h0ykfn8fx1fma.public.blob.vercel-storage.com/capricorn-calendar.pdf'
  },
  aquarius: {
    filename: 'aquarius-calendar.pdf',
    displayName: 'Aquarius Daily Planner',
    blobUrl: 'https://jf7h0ykfn8fx1fma.public.blob.vercel-storage.com/aquarius-calendar.pdf'
  },
  pisces: {
    filename: 'pisces-calendar.pdf',
    displayName: 'Pisces Daily Planner',
    blobUrl: 'https://jf7h0ykfn8fx1fma.public.blob.vercel-storage.com/pisces-calendar.pdf'
  }
};

// Helper function to get clean zodiac sign (remove emoji)
function getCleanZodiacSign(zodiacSign: string): string {
  return zodiacSign.split(' ')[0].toLowerCase();
}

// Helper function to get PDF URL (Blob URL or fallback)
export function getPdfUrl(zodiacSign: string): string | null {
  const cleanSign = getCleanZodiacSign(zodiacSign);
  const mapping = zodiacPdfMapping[cleanSign];
  if (!mapping) return null;
  
  // Use Blob URL if available, otherwise return null
  return mapping.blobUrl || null;
}

// Helper function to check if all PDFs are uploaded to Blob
export function areAllPdfsUploaded(): boolean {
  return Object.values(zodiacPdfMapping).every(mapping => mapping.blobUrl);
}

// Helper function to get missing PDFs
export function getMissingPdfs(): string[] {
  return Object.entries(zodiacPdfMapping)
    .filter(([_, mapping]) => !mapping.blobUrl)
    .map(([sign, _]) => sign);
} 