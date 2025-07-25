export default function generateGRNNumber() {
  const prefix = "GRN";
  const randomNumber = Math.floor(100000 + Math.random() * 900000); // 6-digit number
  return `${prefix}${randomNumber}`;
}
