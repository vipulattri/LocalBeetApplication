export default function generateBOMNumber() {
  const prefix = "BOM";
  const randomNumber = Math.floor(100000 + Math.random() * 900000); // 6-digit number
  return `${prefix}${randomNumber}`;
}
