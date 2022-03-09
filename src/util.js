
/* global BigInt */

export const asUint64String = (num) => {
  return BigInt.asUintN(64, BigInt(num)).toString(16).padStart(16, '0');
};

export const capitalize = (str) => {
  return str && str.length ? str[0].toUpperCase() + str.slice(1) : '';
};

export const isTagged = (tag) => {
  return Boolean(
    typeof tag === 'string' && !['00', '42'].includes(tag.slice(0, 2))
  );
};
