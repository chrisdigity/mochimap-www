
export default function ByteSuffix ({ bytes, forcePrefix, disableLocale }) {
  const units = ['', 'Ki', 'Mi', 'Gi', 'Ti', 'Pi', 'Ei', 'Zi', 'Yi']; // binary
  // determine units index via binary base log calculation
  const uIndex = Math.min(forcePrefix || parseInt(Math.log2(bytes) / 10), 8);
  // shift binary representation of bytes to appropriate value
  const amount = bytes >>> (uIndex * 10);
  // return BytesSuffix JSX in a span
  return (
    <span title={`${disableLocale ? bytes : bytes.toLocaleString()} Bytes`}>
      {disableLocale ? amount : amount.toLocaleString()} {units[uIndex]}Bytes
    </span>
  );
}
