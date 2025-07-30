// Subscription Manager - handles subscribers and integrates with PayPal
import { zodiacPdfMapping, getPdfUrl } from './zodiacPdfMapping';

export interface MonthlyHoroscope {
  id: string;
  month: string; // "2024-01", "2024-02", etc.
  zodiacSign: string;
  pdfUrl?: string; // Blob URL after upload
  filename: string;
  uploadedAt?: string;
  scheduledSendDate: string; // When to send this horoscope
  sentAt?: string; // When it was actually sent
}

interface SubscriberData {
  id: string;
  name: string;
  email: string;
  zodiacSign: string;
  status: 'pending' | 'active' | 'cancelled';
  paypalSubscriptionId?: string;
  nextDeliveryDate?: string;
  lastHoroscopeSent?: string;
  totalHoroscopesReceived?: number;
  createdAt: string;
  updatedAt: string;
}

// In-memory storage for development
let subscribers: SubscriberData[] = [];
let monthlyHoroscopes: MonthlyHoroscope[] = [];

// Get current month in YYYY-MM format
export function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

// Get next month
export function getNextMonth(month?: string): string {
  const current = month ? new Date(month + '-01') : new Date();
  const next = new Date(current.getFullYear(), current.getMonth() + 1, 1);
  return `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}`;
}

// Get next delivery date (15th of next month)
function getNextDeliveryDate(): string {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  // If we're past the 15th, schedule for next month
  // If we're before the 15th, schedule for this month
  let deliveryDate = new Date(currentYear, currentMonth, 15);
  if (now.getDate() >= 15) {
    deliveryDate = new Date(currentYear, currentMonth + 1, 15);
  }
  
  return deliveryDate.toISOString();
}

// Add new subscriber
export function addSubscriber(data: Omit<SubscriberData, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'nextDeliveryDate'>): SubscriberData {
  const subscriber: SubscriberData = {
    id: `sub_${Date.now()}`,
    ...data,
    status: 'pending',
    nextDeliveryDate: getNextDeliveryDate(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  subscribers.push(subscriber);
  return subscriber;
}

// Get subscriber by email
export function getSubscriberByEmail(email: string): SubscriberData | null {
  return subscribers.find(sub => sub.email === email) || null;
}

// Get subscriber by PayPal subscription ID
export function getSubscriberByPayPalId(paypalSubscriptionId: string): SubscriberData | null {
  return subscribers.find(sub => sub.paypalSubscriptionId === paypalSubscriptionId) || null;
}

// Get all active subscribers
export function getActiveSubscribers(): SubscriberData[] {
  return subscribers.filter(sub => sub.status === 'active');
}

// Get subscribers by zodiac sign
export function getSubscribersByZodiac(zodiacSign: string): SubscriberData[] {
  return subscribers.filter(sub => 
    sub.status === 'active' && 
    sub.zodiacSign.toLowerCase().includes(zodiacSign.toLowerCase())
  );
}

// Update subscriber status
export function updateSubscriberStatus(subscriberId: string, status: SubscriberData['status']): boolean {
  const subscriber = subscribers.find(s => s.id === subscriberId);
  if (subscriber) {
    subscriber.status = status;
    subscriber.updatedAt = new Date().toISOString();
    
    // If activated, set next delivery date
    if (status === 'active') {
      subscriber.nextDeliveryDate = getNextDeliveryDate();
    }
    
    return true;
  }
  return false;
}

// Update subscriber PayPal ID
export function updateSubscriberPayPalId(subscriberId: string, paypalSubscriptionId: string): boolean {
  const subscriber = subscribers.find(s => s.id === subscriberId);
  if (subscriber) {
    subscriber.paypalSubscriptionId = paypalSubscriptionId;
    subscriber.updatedAt = new Date().toISOString();
    return true;
  }
  return false;
}

// Mark horoscope as sent to subscriber
export function markHoroscopeSent(subscriberId: string, month: string): boolean {
  const subscriber = subscribers.find(sub => sub.id === subscriberId);
  if (!subscriber) return false;
  
  subscriber.lastHoroscopeSent = month;
  subscriber.totalHoroscopesReceived = (subscriber.totalHoroscopesReceived || 0) + 1;
  
  console.log(`📧 Horoscope sent to ${subscriber.email} for ${month}`);
  return true;
}

// Monthly Horoscope Management

// Add monthly horoscope template (before PDF upload)
export function addMonthlyHoroscopeTemplate(
  month: string, 
  zodiacSign: string, 
  scheduledSendDate: string
): MonthlyHoroscope {
  const horoscope: MonthlyHoroscope = {
    id: `horo_${month}_${zodiacSign}_${Date.now()}`,
    month,
    zodiacSign: zodiacSign.toLowerCase(),
    filename: `${zodiacSign.toLowerCase()}-horoscope-${month}.pdf`,
    scheduledSendDate,
    uploadedAt: undefined,
    pdfUrl: undefined,
    sentAt: undefined
  };
  
  monthlyHoroscopes.push(horoscope);
  console.log(`📅 Monthly horoscope template created: ${zodiacSign} for ${month}`);
  
  return horoscope;
}

// Update horoscope with PDF URL after upload
export function updateHoroscopePdf(
  horoscopeId: string, 
  pdfUrl: string
): boolean {
  const horoscope = monthlyHoroscopes.find(h => h.id === horoscopeId);
  if (!horoscope) return false;
  
  horoscope.pdfUrl = pdfUrl;
  horoscope.uploadedAt = new Date().toISOString();
  
  console.log(`📁 PDF uploaded for horoscope: ${horoscope.zodiacSign} ${horoscope.month}`);
  return true;
}

// Get horoscope for specific month and zodiac
export function getHoroscope(month: string, zodiacSign: string): MonthlyHoroscope | null {
  return monthlyHoroscopes.find(h => 
    h.month === month && 
    h.zodiacSign.toLowerCase() === zodiacSign.toLowerCase()
  ) || null;
}

// Get all horoscopes ready to send (have PDF and scheduled date has passed)
export function getHoroscopesReadyToSend(): MonthlyHoroscope[] {
  const now = new Date();
  return monthlyHoroscopes.filter(h => 
    h.pdfUrl && // Has PDF uploaded
    new Date(h.scheduledSendDate) <= now && // Scheduled time has passed
    !h.sentAt // Not sent yet
  );
}

// Get horoscopes that need PDF upload
export function getHoroscopesNeedingPdf(): MonthlyHoroscope[] {
  return monthlyHoroscopes.filter(h => !h.pdfUrl);
}

// Mark horoscope as sent
export function markHoroscopeAsSent(horoscopeId: string): boolean {
  const horoscope = monthlyHoroscopes.find(h => h.id === horoscopeId);
  if (!horoscope) return false;
  
  horoscope.sentAt = new Date().toISOString();
  console.log(`✅ Horoscope marked as sent: ${horoscope.zodiacSign} ${horoscope.month}`);
  return true;
}

// Scheduler Functions

// Create templates for next month (call this monthly)
export function createTemplatesForNextMonth(): MonthlyHoroscope[] {
  const nextMonth = getNextMonth();
  const zodiacSigns = [
    'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
    'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
  ];
  
  // Scheduled send date: 15th of the month at 9 AM UTC
  const scheduledDate = new Date(`${nextMonth}-15T09:00:00.000Z`);
  
  const createdTemplates: MonthlyHoroscope[] = [];
  
  zodiacSigns.forEach(zodiacSign => {
    // Check if template already exists
    const existing = getHoroscope(nextMonth, zodiacSign);
    if (!existing) {
      const template = addMonthlyHoroscopeTemplate(
        nextMonth,
        zodiacSign,
        scheduledDate.toISOString()
      );
      createdTemplates.push(template);
    }
  });
  
  console.log(`📅 Created ${createdTemplates.length} horoscope templates for ${nextMonth}`);
  return createdTemplates;
}

// Get all active subscribers due for delivery
export function getSubscribersDueForDelivery(): SubscriberData[] {
  const now = new Date();
  return subscribers.filter(subscriber => {
    if (subscriber.status !== 'active' || !subscriber.nextDeliveryDate) {
      return false;
    }
    
    const deliveryDate = new Date(subscriber.nextDeliveryDate);
    return deliveryDate <= now;
  });
}

// Update next delivery date for a subscriber
export function updateNextDeliveryDate(subscriberId: string): boolean {
  const subscriber = subscribers.find(s => s.id === subscriberId);
  if (subscriber) {
    subscriber.nextDeliveryDate = getNextDeliveryDate();
    subscriber.updatedAt = new Date().toISOString();
    return true;
  }
  return false;
}

// Process monthly deliveries
export async function processMonthlyDeliveries() {
  const dueSubscribers = getSubscribersDueForDelivery();
  
  for (const subscriber of dueSubscribers) {
    try {
      // Send calendar email
      const response = await fetch('/api/send-calendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: subscriber.email,
          name: subscriber.name,
          zodiacSign: subscriber.zodiacSign,
          orderType: 'subscription'
        })
      });

      if (response.ok) {
        // Update next delivery date
        updateNextDeliveryDate(subscriber.id);
      }
    } catch (error) {
      console.error(`Failed to process delivery for subscriber ${subscriber.id}:`, error);
    }
  }
}

// Get dashboard statistics
export function getDashboardStats() {
  const activeSubscribers = getActiveSubscribers();
  const horoscopesNeedingPdf = getHoroscopesNeedingPdf();
  const horoscopesReadyToSend = getHoroscopesReadyToSend();
  
  const zodiacBreakdown = activeSubscribers.reduce((acc, sub) => {
    const zodiac = sub.zodiacSign.split(' ')[0]; // Remove emoji
    acc[zodiac] = (acc[zodiac] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    totalActiveSubscribers: activeSubscribers.length,
    totalSubscribers: subscribers.length,
    horoscopesNeedingPdf: horoscopesNeedingPdf.length,
    horoscopesReadyToSend: horoscopesReadyToSend.length,
    currentMonth: getCurrentMonth(),
    nextMonth: getNextMonth(),
    zodiacBreakdown,
    recentSubscribers: subscribers
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
  };
}

// Export for development/testing
export function getAllSubscribers(): SubscriberData[] {
  return [...subscribers];
}

export function getAllHoroscopes(): MonthlyHoroscope[] {
  return [...monthlyHoroscopes];
}

// Initialize templates for current month (for development)
export function initializeCurrentMonth() {
  const currentMonth = getCurrentMonth();
  const templates = createTemplatesForNextMonth();
  console.log(`🎯 Initialized ${templates.length} templates for ${currentMonth}`);
  return templates;
} 