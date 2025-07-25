let lastPONumber = 0;

export default function generatePONumber() {
  lastPONumber++;
  return `PO-${Math.floor(100000 + lastPONumber)}`;
}
