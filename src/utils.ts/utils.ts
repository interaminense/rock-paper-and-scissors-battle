export function getPos(min: number, max: number) {
  const pos = Math.random() * max;

  return pos < min ? min : pos > max - min ? max - min : pos;
}
