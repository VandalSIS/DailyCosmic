// Server-side subscription manager
let subscribers = new Map();

export function addSubscriber(data) {
  const subscriber = {
    id: data.id,
    name: data.name,
    email: data.email,
    zodiacSign: data.zodiacSign,
    status: data.status || 'pending',
    paypalSubscriptionId: data.paypalSubscriptionId,
    nextDeliveryDate: data.nextDeliveryDate,
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString()
  };
  
  subscribers.set(subscriber.id, subscriber);
  return subscriber;
}

export function getSubscriberById(id) {
  return subscribers.get(id);
}

export function updateSubscriberPayPalId(subscriberId, paypalSubscriptionId) {
  const subscriber = subscribers.get(subscriberId);
  if (subscriber) {
    subscriber.paypalSubscriptionId = paypalSubscriptionId;
    subscriber.updatedAt = new Date().toISOString();
    subscribers.set(subscriberId, subscriber);
    return true;
  }
  return false;
}

export function updateSubscriberStatus(subscriberId, status) {
  const subscriber = subscribers.get(subscriberId);
  if (subscriber) {
    subscriber.status = status;
    subscriber.updatedAt = new Date().toISOString();
    subscribers.set(subscriberId, subscriber);
    return true;
  }
  return false;
}

export function getSubscriberByPayPalId(paypalSubscriptionId) {
  return Array.from(subscribers.values()).find(
    sub => sub.paypalSubscriptionId === paypalSubscriptionId
  );
}

// For development/testing
export function getAllSubscribers() {
  return Array.from(subscribers.values());
}

export function clearSubscribers() {
  subscribers.clear();
} 