// Subscription Manager - handles subscribers and integrates with PayPal
import { Subscriber } from './paypalService';

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

export interface SubscriberData {
  id: string;
  email: string;
  name: string;
  zodiacSign: string;
  paypalSubscriptionId: string;
  status: 'active' | 'cancelled' | 'expired' | 'payment_failed';
  nextBillingDate: string;
  createdAt: string;
  lastHoroscopeSent?: string; // Last month sent ("2024-01")
  totalHoroscopesReceived: number;
}

// In-memory storage for development (în production va fi baza de date)
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

// Add new subscriber
export function addSubscriber(subscriberData: Omit<SubscriberData, 'id' | 'createdAt' | 'totalHoroscopesReceived'>): SubscriberData {
  const subscriber: SubscriberData = {
    ...subscriberData,
    id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    totalHoroscopesReceived: 0
  };
  
  subscribers.push(subscriber);
  console.log(`✅ New subscriber added: ${subscriber.email} (${subscriber.zodiacSign})`);
  
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
export function updateSubscriberStatus(
  subscriberId: string, 
  status: SubscriberData['status'], 
  nextBillingDate?: string
): boolean {
  const subscriber = subscribers.find(sub => sub.id === subscriberId);
  if (!subscriber) return false;
  
  subscriber.status = status;
  if (nextBillingDate) {
    subscriber.nextBillingDate = nextBillingDate;
  }
  
  console.log(`📝 Subscriber ${subscriber.email} status updated to: ${status}`);
  return true;
}

// Update subscriber PayPal subscription ID
export function updateSubscriberPayPalId(
  subscriberId: string, 
  paypalSubscriptionId: string
): boolean {
  const subscriber = subscribers.find(sub => sub.id === subscriberId);
  if (!subscriber) return false;
  
  subscriber.paypalSubscriptionId = paypalSubscriptionId;
  console.log(`🔗 Subscriber ${subscriber.email} linked to PayPal subscription: ${paypalSubscriptionId}`);
  return true;
}

// Mark horoscope as sent to subscriber
export function markHoroscopeSent(subscriberId: string, month: string): boolean {
  const subscriber = subscribers.find(sub => sub.id === subscriberId);
  if (!subscriber) return false;
  
  subscriber.lastHoroscopeSent = month;
  subscriber.totalHoroscopesReceived++;
  
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