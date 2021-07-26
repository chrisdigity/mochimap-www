
export default function MCMSuffix ({ value, forceDecimals, disableLocale }) {
  if (typeof forceDecimals !== 'number') forceDecimals = Boolean(forceDecimals);
  // determine sign and make value absolute
  const sign = Number(value) < 0 ? -1 : 1;
  let amount = Number(value) * sign;
  let options = {};
  // compare amount against predetermined breakpoints
  if (amount > 1e+15) options = { reduce: 1e+15, dec: 1, suffix: '𝕄' };
  else if (amount > 1e+12) options = { reduce: 1e+12, dec: 2, suffix: 'κ' };
  else if (amount < 1e+6) options = { suffix: 'η' };
  else options = { reduce: 1e+9 };
  // (re)apply sign and options
  amount *= sign;
  if (options.reduce) amount /= options.reduce;
  if (!disableLocale) {
    amount = amount.toLocaleString(undefined, options.dec
      ? { minimumFractionDigits: options.dec, maximumFractionDigits: options.dec }
      : undefined);
  }
  // return MCMSuffix JSX in a span
  return (
    <span title={`${value?.toLocaleString()} nanoMochimo`}>
      {amount}{value && options.suffix ? options.suffix : ''} MCM
    </span>
  );
}
