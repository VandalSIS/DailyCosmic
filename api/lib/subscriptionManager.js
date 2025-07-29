// Server-side subscription manager
const subscribers = new Map();

// Helper function to get next delivery date
function getNextDeliveryDate() {
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

export function addSubscriber(data) {
  const subscriber = {
    id: data.id,
    name: data.name,
    email: data.email,
    zodiacSign: data.zodiacSign,
    status: data.status || 'pending',
    paypalSubscriptionId: data.paypalSubscriptionId,
    nextDeliveryDate: data.nextDeliveryDate || getNextDeliveryDate(),
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString()
  };
  
  subscribers.set(subscriber.id, subscriber);
  console.log('Added subscriber:', subscriber);
  return subscriber;
}

export function getSubscriberById(id) {
  const subscriber = subscribers.get(id);
  console.log('Getting subscriber by ID:', id, subscriber);
  return subscriber;
}

export function updateSubscriberPayPalId(subscriberId, paypalSubscriptionId) {
  console.log('Updating PayPal ID for subscriber:', subscriberId, paypalSubscriptionId);
  const subscriber = subscribers.get(subscriberId);
  if (subscriber) {
    subscriber.paypalSubscriptionId = paypalSubscriptionId;
    subscriber.updatedAt = new Date().toISOString();
    subscribers.set(subscriberId, subscriber);
    console.log('Updated subscriber:', subscriber);
    return true;
  }
  console.log('Subscriber not found:', subscriberId);
  return false;
}

export function updateSubscriberStatus(subscriberId, status) {
  console.log('Updating status for subscriber:', subscriberId, status);
  const subscriber = subscribers.get(subscriberId);
  if (subscriber) {
    subscriber.status = status;
    subscriber.updatedAt = new Date().toISOString();
    if (status === 'active') {
      subscriber.nextDeliveryDate = getNextDeliveryDate();
    }
    subscribers.set(subscriberId, subscriber);
    console.log('Updated subscriber:', subscriber);
    return true;
  }
  console.log('Subscriber not found:', subscriberId);
  return false;
}

export function getSubscriberByPayPalId(paypalSubscriptionId) {
  console.log('Getting subscriber by PayPal ID:', paypalSubscriptionId);
  const subscriber = Array.from(subscribers.values()).find(
    sub => sub.paypalSubscriptionId === paypalSubscriptionId
  );
  console.log('Found subscriber:', subscriber);
  return subscriber;
}

// For development/testing
export function getAllSubscribers() {
  const allSubscribers = Array.from(subscribers.values());
  console.log('All subscribers:', allSubscribers);
  return allSubscribers;
}

export function clearSubscribers() {
  console.log('Clearing all subscribers');
  subscribers.clear();
} 