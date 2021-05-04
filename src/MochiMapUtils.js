
export const defaultTag = '420000000e00000001000000';

export function capitalize (str) {
  return str.length ? str[0].toUpperCase() + str.slice(1) : '';
}

export function integerRange (start, end, arr = []) {
  if (isNaN(start) || isNaN(end) || start > end) return [];
  return Array.from({ length: end - start + 1 }, (_, i) => i + parseInt(start));
}

export function mcm (bignum, locale = true, prefixType = 1) {
  if (typeof prefixType !== 'number') prefixType = 1;
  if (typeof locale !== 'number') locale = Boolean(locale);
  bignum = Number(bignum);
  let unit = [
    ['MCM', 'MCM', 'Mochimo'],
    ['MCM', 'ηMCM', 'nano-Mochimo'],
    ['MCM', 'κMCM', 'thousand-Mochimo'],
    ['MCM', '𝕄MCM', 'million-Mochimo']
  ];
  if (bignum > 1e+15 && prefixType > 0) {
    if (typeof locale !== 'number') locale = 1;
    bignum /= 1e+15;
    unit = unit[3];
  } else if (bignum > 1e+12 && prefixType > 0) {
    if (typeof locale !== 'number') locale = 2;
    bignum /= 1e+12; // thousand-MCM
    unit = unit[2];
  } else if (bignum < 1e+5) {
    unit = unit[1];
  } else {
    bignum /= 1e+9;
    unit = unit[0];
  }
  if (locale) {
    bignum = typeof locale !== 'number'
      ? bignum.toLocaleString()
      : bignum.toLocaleString(undefined, { maximumFractionDigits: locale });
  }
  return `${bignum} ${unit[bignum === '0' ? 0 : prefixType]}`;
}

export function preBytes (bytes, forceindex, nolocale) {
  const units = ['', 'Ki', 'Mi', 'Gi', 'Ti', 'Pi', 'Ei', 'Zi', 'Yi']; // binary
  const uIndex = Math.min(forceindex || parseInt(Math.log2(bytes) / 10), 8);
  bytes >>>= (uIndex * 10);
  return `${nolocale ? bytes : bytes.toLocaleString()} ${units[uIndex]}B`;
}
