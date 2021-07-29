
export default function MCMSuffix (props) {
  const { decimals, disableLocale, disableSuffix, disableUnits, value } = props;
  // determine sign and make value absolute
  const sign = Number(value) < 0 ? -1 : 1;
  let amount = Number(value) * sign;
  let options = {};
  // compare amount against predetermined breakpoints
  if (amount > 1e+15) options = { reduce: 1e+15, dec: 1, suffix: '𝕄' };
  else if (amount > 1e+12) options = { reduce: 1e+12, dec: 2, suffix: 'κ' };
  else if (amount < 1e+6) options = { suffix: 'η' };
  else options = { reduce: 1e+9 };
  // force specific options
  if (typeof decimals === 'number') options.dec = decimals;
  // apply options (re-apply sign in amount calculation)
  if (options.reduce) amount = sign * amount / options.reduce;
  if (!disableLocale) {
    amount = amount.toLocaleString(undefined, options.dec ? {
      minimumFractionDigits: options.dec, maximumFractionDigits: options.dec
    } : undefined);
  } else {
    const powFactor = Math.pow(10, options.dec || 0);
    amount = Math.floor(amount * powFactor) / powFactor;
  }
  // return MCMSuffix JSX in a span
  return (
    <span title={`${value?.toLocaleString()} nanoMochimo`}>
      {amount}{value && options.suffix ? options.suffix : ''} MCM
    </span>
  );
}
