import _ from 'lodash';

/**
 * 从任意对象中获取一个数字，如果无法获取，返回默认值（如果没有提供，返回0）
 * @param v 任何需要转成数字的内容
 * @param defaultNumber 默认值
 * @param radix A value between 2 and 36 that specifies the base of the number in string. If this argument is not supplied, strings with a prefix of '0x' are considered hexadecimal. All other strings are considered decimal.
 */
export function parseNumber(v: any, defaultNumber = 0, radix = 10): number {
  if (v === undefined) {
    v = defaultNumber;
  } else {
    v = parseInt(v, radix);
    if (Number.isNaN(v)) {
      v = defaultNumber;
    }
  }
  return v;
}

/**
 * 生成uuid
 * @param len 指定uuid的长度
 * @param radix 进制，默认16进制
 */
export function uuid(len?: number, radix = 16): string {
  const chars =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  const res = [];
  let i;

  if (_.isNumber(len)) {
    // Compact form
    for (i = 0; i < len; i++) res[i] = chars[0 | (Math.random() * radix)];
  } else {
    // rfc4122, version 4 form
    let r;

    // rfc4122 requires these characters
    // eslint-disable-next-line no-multi-assign
    res[8] = res[13] = res[18] = res[23] = '-';
    res[14] = '4';

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!res[i]) {
        r = 0 | (Math.random() * 16);
        res[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return res.join('');
}

/**
 * 获得一个随机字符串
 * @param len 获取字符串长度
 */
export function getRandomString(len: number): string {
  len = len || 4;
  const $chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghijklmnopqrstuvwxyz0123456789';
  const maxPos = $chars.length;
  let s = '';
  for (let i = 0; i < len; i++) {
    s += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return s;
}

/**
 * 将短横线分隔样式转为驼峰样式
 * @param str 标签名
 */
export function kebabCasedToCamel(str: string): string {
  return str
    .split('-')
    .map(x => x.length > 0 && x[0].toUpperCase())
    .join('');
}

/**
 * 将驼峰样式转为短横线分隔样式
 * @param str 标签名
 * @returns
 */
export function camelToKebabCased(str: string): string {
  return str.replace(/([A-Z])/g, '-$1'.toLowerCase()).replace(/^-/, '');
}

/**
 * 查找一个数组是否存在该元素，如果不存在，则将其添加
 */
export function addIfNotExist<T>(arr: T[], item: T, cb?: (item: T) => unknown) {
  if (!item) return;

  if (cb ? !~arr.findIndex(cb) : !arr.includes(item)) {
    arr.push(item);
  }
}

/**
 * 将一个具有样式格式的字符串按照对象格式添加到对象中
 */
export function addStyleStrToObject(
  obj: Record<string, string>,
  styleStr: string
): void {
  styleStr.split(';').forEach(item => {
    const [key, value] = item.split(':');
    if (key && value) {
      obj[key.trim()] = value.trim();
    }
  });
}
