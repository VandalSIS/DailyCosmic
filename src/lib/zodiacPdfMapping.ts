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
    blobUrl: 'https://jf7h0ykfn8fx1fma.public.blob.vercel-storage.com/aries-calendar-TvKkvqf5gU4sV50Ze7zpMoZhHzmBHa.pdf'
  },
  taurus: {
    filename: 'taurus-calendar.pdf',
    displayName: 'Taurus Daily Planner',
    blobUrl: 'https://jf7h0ykfn8fx1fma.public.blob.vercel-storage.com/Taurus%2520Astrology%2520Calendar%2520%25E2%2580%2593%2520July%25202025-0z1DCFmeGIoZGd9nDS1irXLdUubLAz.pdf'
  },
  gemini: {
    filename: 'gemini-calendar.pdf',
    displayName: 'Gemini Daily Planner',
    blobUrl: 'https://jf7h0ykfn8fx1fma.public.blob.vercel-storage.com/Gemini%2520Astrology%2520Calendar%2520%25E2%2580%2593%2520July%25202025-vaDoM71E7xF6S72QsBXmujM38aBJqZ.pdf'
  },
  cancer: {
    filename: 'cancer-calendar.pdf',
    displayName: 'Cancer Daily Planner',
    blobUrl: 'https://jf7h0ykfn8fx1fma.public.blob.vercel-storage.com/Cancer%2520Astrology%2520Calendar%2520%25E2%2580%2593%2520July%25202025-RQCbA1n6KzAhLU0AzOwuepUoxzlkAD.pdf'
  },
  leo: {
    filename: 'leo-calendar.pdf',
    displayName: 'Leo Daily Planner',
    blobUrl: 'https://jf7h0ykfn8fx1fma.public.blob.vercel-storage.com/Leo%2520Astrology%2520Calendar%2520%25E2%2580%2593%2520July%25202025-6FtRD8yaWPCbQZHC8ZubG9O1GiHbIn.pdf'
  },
  virgo: {
    filename: 'virgo-calendar.pdf',
    displayName: 'Virgo Daily Planner',
    blobUrl: 'https://jf7h0ykfn8fx1fma.public.blob.vercel-storage.com/Virgo%2520Astrology%2520Calendar%2520%25E2%2580%2593%2520July%25202025-ZhDgkfAQaA7cdxdM0TWVj06GJghRpc.pdf'
  },
  libra: {
    filename: 'libra-calendar.pdf',
    displayName: 'Libra Daily Planner',
    blobUrl: 'https://jf7h0ykfn8fx1fma.public.blob.vercel-storage.com/Libra%2520Astrology%2520Calendar%2520%25E2%2580%2593%2520July%25202025-HezBGjxZjLoLEHKkvu1qj23ZTST2wv.pdf'
  },
  scorpio: {
    filename: 'scorpio-calendar.pdf',
    displayName: 'Scorpio Daily Planner',
    blobUrl: 'https://jf7h0ykfn8fx1fma.public.blob.vercel-storage.com/Scorpio%2520Astrology%2520Calendar%2520%25E2%2580%2593%2520July%25202025-VaR5QSMzAwbdvvQ3AlyORkxZx3ynVX.pdf'
  },
  sagittarius: {
    filename: 'sagittarius-calendar.pdf',
    displayName: 'Sagittarius Daily Planner',
    blobUrl: 'https://jf7h0ykfn8fx1fma.public.blob.vercel-storage.com/Sagittarius%2520Astrology%2520Calendar%2520%25E2%2580%2593%2520July%25202025-5VhvnUU2BY2v4FZIl7K5WkMVJdLvRC.pdf'
  },
  capricorn: {
    filename: 'capricorn-calendar.pdf',
    displayName: 'Capricorn Daily Planner',
    blobUrl: 'https://jf7h0ykfn8fx1fma.public.blob.vercel-storage.com/Capricorn%2520Astrology%2520Calendar%2520%25E2%2580%2593%2520July%25202025-S0lixufWlVh8LLDIwdu4kDyJrTkc4y.pdf'
  },
  aquarius: {
    filename: 'aquarius-calendar.pdf',
    displayName: 'Aquarius Daily Planner',
    blobUrl: 'https://jf7h0ykfn8fx1fma.public.blob.vercel-storage.com/Aquarius%2520Astrology%2520Calendar%2520%25E2%2580%2593%2520July%25202025-tAHcVTaM1xOEuyTAfHGHOPy2hUTe2L.pdf'
  },
  pisces: {
    filename: 'pisces-calendar.pdf',
    displayName: 'Pisces Daily Planner',
    blobUrl: 'https://jf7h0ykfn8fx1fma.public.blob.vercel-storage.com/Pisces%2520Astrology%2520Calendar%2520%25E2%2580%2593%2520July%25202025-twRDjWJGXqJJaPDdQMRgPKB06qLbqX.pdf'
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

// Helper function to get all zodiac PDFs
export function getAllZodiacPdfs(): Record<string, ZodiacPdfMapping> {
  return zodiacPdfMapping;
}

// Helper function to get PDF by zodiac sign
export function getPdfByZodiacSign(zodiacSign: string): ZodiacPdfMapping | null {
  const cleanSign = getCleanZodiacSign(zodiacSign);
  return zodiacPdfMapping[cleanSign] || null;
} 