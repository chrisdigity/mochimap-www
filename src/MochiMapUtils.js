
export const defaultTag = '420000000e00000001000000';

export function capitalize (str) {
  return str.length ? str[0].toUpperCase() + str.slice(1) : '';
}

export function integerRange (start, end, arr = []) {
  if (isNaN(start) || isNaN(end) || start > end) return [];
  return Array.from({ length: end - start + 1 }, (_, i) => i + parseInt(start));
}

export function mcm (bignum, nolocale, humanize) {
  bignum = bignum || 0;
  var unit = 'MCM';
  var prefix = ' ';
  if (bignum > 1e+15) {
    bignum /= 1e+15;
    bignum = Math.round(bignum * 10) / 10; // round to 1 decimal
    prefix = humanize ? ' Million ' : /* 'Μ' */ ' Ω';
  } else if (bignum > 1e+12) {
    bignum /= 1e+12; // thousand-MCM
    bignum = Math.round(bignum * 100) / 100; // round to 2 decimals
    prefix = humanize ? ' Thousand' : ' κ';
  } else if (bignum < 1e+5) prefix = humanize ? ' nano' : ' η';
  else bignum /= 1e+9;
  return (nolocale ? bignum : Number(bignum).toLocaleString()) + prefix + unit;
}

export function preBytes (bytes, forceindex, nolocale) {
  const units = ['', 'Ki', 'Mi', 'Gi', 'Ti', 'Pi', 'Ei', 'Zi', 'Yi']; // binary
  const uIndex = Math.min(forceindex || parseInt(Math.log2(bytes) / 10), 8);
  bytes >>>= (uIndex * 10);
  return `${nolocale ? bytes : bytes.toLocaleString()} ${units[uIndex]}B`;
}
