let lastOrderNumber = 370249; // You may want to persist this

export default function generateOrderNumber() {
  lastOrderNumber++;
  return `JO-${lastOrderNumber}`;
}
