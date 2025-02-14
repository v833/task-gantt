import { day } from '@/utils/date';

enum DateEnum {
  '4years',
  'year',
  'month',
  'week',
  'day',
  'hour',
  'minute',
  'second',
  'millisecond'
}

/**
 * 内部使用的日期对象，所有日期都是用该对象包装
 */
export class XDate {
  date: Date;

  constructor(date?: LikeDate) {
    this.date = day(date).toDate();
  }

  /**
   * 设置一个新日期
   */
  setDate(date: Date) {
    this.date = day(date).toDate();
  }
  formatZhCnDate(dateString: string) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // getMonth() 返回的月份是从 0 开始的，所以需要加 1

    // 格式化月份，确保始终是两位数
    const formattedMonth = month < 10 ? `0${month}` : `${month}`;

    // 返回格式化的字符串
    return `${year}年${formattedMonth}月`;
  }

  /**
   * 基于单位获取当前日期的格式化字符
   */
  getString(unit: DateUnit, format?: string) {
    if (format) return day(this.date).format(format);

    switch (unit) {
      case '4years':
        const year = day(this.date).format('YYYY');
        return `${year}年~${Number(year) + 3}年`;
      case 'year':
        return day(this.date).format('YYYY') + '年';
      case 'month':
        const date = day(this.date).format('YYYY-MM');
        return this.formatZhCnDate(date);
      case 'week':
        // return day(this.date).format('wo');
        return '第' + Math.ceil(+day(this.date).format('D') / 7) + '周';
      case 'day':
        return day(this.date).format('D');
      case 'hour':
        return day(this.date).format('H');
      case 'minute':
        return day(this.date).format('m');
      case 'second':
        return day(this.date).format('s');
      case 'millisecond':
        return day(this.date).format('SSS');
      default:
        return '';
    }
  }

  /**
   * 获取两个时间的间隔时间戳
   */
  intervalTo(date?: XDate) {
    return this.date.getTime() - (date?.date.getTime() ?? 0);
  }

  /**
   * 比较大小，返回字符，l 左小，r 右小，e 相等
   */
  compareTo(date: XDate) {
    const l = this.date.getTime();
    const r = date.date.getTime();
    if (l < r) return 'l';
    if (l > r) return 'r';
    return 'e';
  }

  /**
   * 比较日期大小。
   * @param date 要比较的日期
   * @param precision 精度，可以通过不同单位来调整判断精度
   */
  isSame(date: XDate, precision: DateUnit, start?: boolean) {
    const t = this.date.toLocaleString().split(/\s|\/|:/);
    if (start && precision === 'day') {
      t[2] = Number(t[2]) + 1 + '';
    }
    t.splice(2, 0, day(this.date).week().toString());
    t.push(this.date.getMilliseconds().toString());

    const d = date.date.toLocaleString().split(/\s|\/|:/);
    d.splice(2, 0, day(date.date).week().toString());
    d.push(date.date.getMilliseconds().toString());

    return (
      t.slice(0, DateEnum[precision] + 1).join('') ===
      d.slice(0, DateEnum[precision] + 1).join('')
    );
  }

  /**
   * 获取一个位移后的日期对象。该对象不会影响原始对象。
   */
  getOffset(offset: number) {
    return new XDate(day(this.date.getTime() + offset).toDate());
  }

  getFourYears(start: XDate): string {
    const startYear = day(start.date).year();
    const fourGap = Number(startYear) + 3;
    const target = startYear + '-' + fourGap;
    if (
      day(this.date).year() >= startYear &&
      day(this.date).year() <= fourGap
    ) {
      return target;
    }
    return this.getFourYears(
      new XDate(day(start.date).add(4, 'year').toDate())
    );
  }

  /**
   * 通过不同单位获取当前时间的不同精度值
   */
  getBy(unit: DateUnit, start?: XDate) {
    const t = [];
    if (start) {
      t.push(this.getFourYears(start));
    } else {
      t.push(day(this.date).year());
    }
    t.push(day(this.date).year());
    t.push(day(this.date).month() + 1);
    t.push(day(this.date).week());
    t.push(day(this.date).date());
    t.push(day(this.date).hour());
    t.push(day(this.date).minute());
    t.push(day(this.date).second());
    t.push(day(this.date).millisecond());

    return t[DateEnum[unit]];
  }

  /**
   * 返回一个可格式化的日期字符串
   */
  toString(format: string = 'YYYY-MM-DD : HH:mm:ss') {
    return day(this.date).format(format);
  }

  /**
   * 返回一个全新的日期对象
   */
  clone() {
    return new XDate(this.date);
  }

  /**
   * 该日期是否为周末
   * @returns
   */
  isWeekend() {
    const d = day(this.date).day();
    return d === 6 || d === 0;
  }

  /**
   * 将日期置为单位的起始位置。如果传入日期，则按照日期精度调整
   */
  startOf(unit: DateUnit, date?: XDate) {
    switch (unit) {
      // case 'year':
      //   this.date.setMonth(0);
      // case 'month':
      //   this.date.setDate(1);
      // case 'week':
      //   this.date.setDate(this.date.getDate() - day(this.date).day());
      // case 'day':
      //   this.date.setHours(0);
      // case 'hour':
      //   this.date.setMinutes(0);
      // case 'minute':
      //   this.date.setSeconds(0);
      // case 'second':
      //   this.date.setMilliseconds(0);
      //   break;
      case 'year':
        this.date.setMonth(date?.date ? day(date.date).month() : 0);
      case 'month':
      case 'week':
        if (unit === 'month')
          this.date.setDate(date?.date ? day(date.date).date() : 1);
        else if (unit === 'week')
          this.date.setDate(
            (date?.date ?? this.date).getDate() -
              day(date?.date ?? this.date).day()
          );
      case 'day':
        this.date.setHours(date?.date ? day(date.date).hour() : 0);
      case 'hour':
        this.date.setMinutes(date?.date ? day(date.date).minute() : 0);
      case 'minute':
        this.date.setSeconds(date?.date ? day(date.date).second() : 0);
      case 'second':
        this.date.setMilliseconds(
          date?.date ? day(date.date).millisecond() : 0
        );
        break;
    }
  }

  /**
   * 将日期置为单位的结束位置。如果传入日期，则按照日期精度调整
   */
  endOf(unit: DateUnit, date?: XDate) {
    // switch (unit) {
    //   case 'year':
    //     this.date.setMonth(11);
    //   case 'month':
    //     this.date.setDate(day(this.date).daysInMonth());
    //   case 'week':
    //     this.date.setDate(this.date.getDate() + (6 - day(this.date).day()));
    //   case 'day':
    //     this.date.setHours(23);
    //   case 'hour':
    //     this.date.setMinutes(59);
    //   case 'minute':
    //     this.date.setSeconds(59);
    //   case 'second':
    //     this.date.setMilliseconds(999);
    //     break;
    // }
    switch (unit) {
      case 'year':
        this.date.setMonth(date?.date ? day(date.date).month() : 11);
      case 'month':
        this.date.setDate(
          date?.date
            ? day(date.date).daysInMonth()
            : day(this.date).daysInMonth()
        );
      case 'week':
        this.date.setDate(
          (date?.date ?? this.date).getDate() +
            (6 - day(date?.date ?? this.date).day())
        );
      case 'day':
        this.date.setHours(date?.date ? day(date.date).hour() : 23);
      case 'hour':
        this.date.setMinutes(date?.date ? day(date.date).minute() : 59);
      case 'minute':
        this.date.setSeconds(date?.date ? day(date.date).second() : 59);
      case 'second':
        this.date.setMilliseconds(
          date?.date ? day(date.date).millisecond() : 999
        );
        break;
    }
  }
}
