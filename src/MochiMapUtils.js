
export function mcm (bignum, nolocale) {
  bignum = bignum || 0;
  var unit = 'MCM';
  var prefix = ' ';
  if (bignum > 1e+15) {
    bignum /= 1e+15;
    bignum = Math.round(bignum * 10) / 10; // round to 1 decimal
    prefix = /* 'Μ' */ ' Ω'; // million-MCM
  } else if (bignum > 1e+12) {
    bignum /= 1e+12; // thousand-MCM
    bignum = Math.round(bignum * 100) / 100; // round to 2 decimals
    prefix = ' κ';
  } else if (bignum < 1e+5) prefix = ' η';
  else bignum /= 1e+9;
  return (nolocale ? bignum : Number(bignum).toLocaleString()) + prefix + unit;
}

export function preBytes (bytes) {
  const units = ['', 'Ki', 'Mi', 'Gi', 'Ti', 'Pi', 'Ei', 'Zi', 'Yi']; // binary
  const uIndex = Math.min(parseInt(Math.log2(bytes) / 10), units.length - 1);
  return `${bytes >>> (uIndex * 10)} ${units[uIndex]}B`;
}
