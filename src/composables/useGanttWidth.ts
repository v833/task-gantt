import Variables from '@/constants/vars';
import { XDate } from '@/models/param/date';
import { useStore } from '@/store';
import { day } from '@/utils/date';
import { computed } from 'vue';

export default () => {
  const store = useStore();

  const headerShowUnit = computed(() => {
    switch (store.$styleBox.unit) {
      case 'year':
        return 'month';
      case 'hour':
        return 'hour';
      case 'day':
      case 'week':
      case 'month':
        return 'day';
      default:
        return 'day';
    }
  });

  const ganttColumnWidth = computed(() => {
    const size = store.$styleBox.ganttColumnSize;
    if (typeof size === 'object') {
      return Object.assign({}, Variables.size.ganttColumnWidth.normal, size)[
        store.$styleBox.unit
      ];
    }
    return Variables.size.ganttColumnWidth[size][store.$styleBox.unit];
  });

  function getGanttUnitColumnWidth(
    date: Date | number,
    condition?: 'after' | 'before'
  ) {
    const calc = (full: number): number => {
      if (condition === 'after') {
        // 计算全量之前的日期长度
        const d = new XDate(date);
        if (store.$styleBox.unit === 'week') {
          return full - day(date).weekday();
        }

        return full - (d.getBy(headerShowUnit.value) as number) + 1;
      }

      if (condition === 'before') {
        // 计算全量之前的日期长度
        const d = new XDate(date);
        if (store.$styleBox.unit === 'week') {
          return day(date).weekday() + 1;
        }

        return d.getBy(headerShowUnit.value) as number;
      }

      return full;
    };
    let gap = 1;

    switch (store.$styleBox.unit) {
      case 'week':
        gap = calc(7);
        break;
      case 'month':
        gap = calc(day(date).daysInMonth());
        break;
      case 'year':
        gap = calc(12);
        break;
      case 'day':
      case 'hour':
      default:
        gap = 1;
        break;
    }

    return ganttColumnWidth.value * gap;
  }

  const ganttWidth = computed(() => {
    return store.ganttHeader.datesByUnit.length * ganttColumnWidth.value;
  });

  const currentMillisecond = computed(() => {
    if (store.$styleBox.unit === 'hour') {
      return Variables.time.millisecondOf.hour;
    }
    if (store.$styleBox.unit === 'year') {
      return Variables.time.millisecondOf.day * 30;
    }

    return Variables.time.millisecondOf.day;
  });

  return {
    ganttWidth,
    headerShowUnit,

    /**
     * 获取甘特图一列的列宽
     */
    ganttColumnWidth,

    /**
     * 获取甘特图最小单位的列宽（基于当前单位）
     */
    getGanttUnitColumnWidth,

    /**
     * 获取当前单位的毫秒数（小时或天）
     */
    currentMillisecond
  };
};
