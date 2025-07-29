import { processMonthlyDeliveries } from './subscriptionManager';

// Check if it's time to send monthly horoscopes (15th of each month)
function isDeliveryDay(): boolean {
  const now = new Date();
  return now.getDate() === 15;
}

// Run the scheduler every day at 9:00 AM
export function startScheduler() {
  // Check current time
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  
  // Calculate time until next 9:00 AM
  const millisecondsUntil9AM = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    9,
    0,
    0,
    0
  ).getTime() - now.getTime();

  // If it's past 9:00 AM, schedule for tomorrow
  const delay = millisecondsUntil9AM > 0 
    ? millisecondsUntil9AM 
    : millisecondsUntil9AM + 24 * 60 * 60 * 1000;

  // Schedule first run
  setTimeout(() => {
    // Check if it's delivery day and process if needed
    if (isDeliveryDay()) {
      processMonthlyDeliveries();
    }

    // Schedule subsequent runs every 24 hours
    setInterval(() => {
      if (isDeliveryDay()) {
        processMonthlyDeliveries();
      }
    }, 24 * 60 * 60 * 1000);
  }, delay);
}

// Start the scheduler when the app starts
startScheduler(); 