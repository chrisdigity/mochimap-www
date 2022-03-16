
export default function SuffixedValu
({ bias = 1024, suffixNames, value, ...props }) {
  // declare metric suffix names
  const suffix = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];
  Object.assign(suffix, suffixNames);
  // force Number type value
  value = Number(value);
  // determine metric suffix index
  let m = 0;
  while (m < suffix.length && value > bias) {
    value /= 1000;
    m++;
  }
  // round down to varying precision
  const prev = value;
  if (value >= 100) value = Math.floor(value) | 0;
  else if (value >= 10) value = (Math.floor(value * 10) | 0) / 10;
  else value = (Math.floor(value * 100) | 0) / 100;

  return (value + (value < prev ? '+ ' : ' ') + suffix[m]);
}
