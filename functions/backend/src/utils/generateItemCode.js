let lastItemNumber = 0;



export default function generateItemCode() {
  lastItemNumber++;
  return `ITM${String(lastItemNumber).padStart(3, '3')}`;
}