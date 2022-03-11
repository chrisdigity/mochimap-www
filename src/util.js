
/* global BigInt */

export const applyObjDiff = (target, diff) => {
  for (const key in diff) {
    if (diff[key] === undefined) delete target[key];
    else if (!(key in target)) target[key] = diff[key];
    else if (diff[key] && typeof diff[key] === 'object' &&
      (typeof diff[key] === typeof target[key])) {
      // determine object vs array
      if (diff[key].constructor === Array &&
        ((diff[key].constructor === target[key].constructor))) {
        // handle arrays
        for (let i = 0; i < diff[key].length; i++) {
          if (diff[key][i]) target[key][i] = diff[key][i];
        }
      } else {
        // handle objects
        applyObjDiff(target[key], diff[key]);
      }
    } else target[key] = diff[key];
  }
};

export const asUint64String = (num) => {
  return BigInt.asUintN(64, BigInt(num)).toString(16).padStart(16, '0');
};

export const capitalize = (str) => {
  return str && str.length ? str[0].toUpperCase() + str.slice(1) : '';
};

export const dupObj = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

export const isTagged = (tag) => {
  return Boolean(
    typeof tag === 'string' && !['00', '42'].includes(tag.slice(0, 2))
  );
};
