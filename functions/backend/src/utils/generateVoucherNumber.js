let lastVONumber = 0;

export function generateVONumber() {
  lastVONumber++;
  return `SVI-${Math.floor(100000 + lastVONumber)}`;
}
