
export function isUntagged (tag) {
  return Boolean(['00', '42'].includes(tag.slice(0, 2)));
}

export function capitalize (str) {
  return str.length ? str[0].toUpperCase() + str.slice(1) : '';
}

export function integerRange (start, end, arr = []) {
  if (isNaN(start) || isNaN(end) || start > end) return [];
  return Array.from({ length: end - start + 1 }, (_, i) => i + parseInt(start));
}

export function mcm (bignum, locale = true, suffixType, unitType) {
  const unit = ['', 'MCM', 'Mochimo'];
  const suffix = [
    ['', '', ''],
    ['', 'η', 'Nano'],
    ['', 'κ', 'Thousand'],
    ['', '𝕄', 'Million']
  ];
  let metric = 0;
  let negative = '';
  if (typeof unitType !== 'number') unitType = 1;
  if (typeof suffixType !== 'number') suffixType = 1;
  if (typeof locale !== 'number') locale = Boolean(locale);
  bignum = Number(bignum);
  if (bignum < 0) {
    negative = '-';
    bignum = Math.abs(bignum);
  }
  if (bignum > 1e+15 && suffixType > 0) {
    if (typeof locale !== 'number') locale = 1;
    bignum /= 1e+15;
    metric = 3;
  } else if (bignum > 1e+12 && suffixType > 0) {
    if (typeof locale !== 'number') locale = 2;
    bignum /= 1e+12; // thousand-MCM
    metric = 2;
  } else if (bignum < 1e+6 && suffixType > 0) metric = 1;
  else bignum /= 1e+9;
  if (locale) {
    bignum = typeof locale !== 'number' ? bignum.toLocaleString()
      : bignum.toLocaleString(undefined, {
        minimumFractionDigits: locale,
        maximumFractionDigits: locale
      });
  }
  if (bignum === '0') suffixType = 0;
  return `${negative}${bignum}${suffix[metric][suffixType]} ${unit[unitType]}`;
}

export function preBytes (bytes, forceindex, nolocale) {
  const units = ['', 'Ki', 'Mi', 'Gi', 'Ti', 'Pi', 'Ei', 'Zi', 'Yi']; // binary
  const uIndex = Math.min(forceindex || parseInt(Math.log2(bytes) / 10), 8);
  bytes >>>= (uIndex * 10);
  return `${nolocale ? bytes : bytes.toLocaleString()} ${units[uIndex]}B`;
}
