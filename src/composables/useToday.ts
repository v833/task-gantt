import { XDate } from '@/models/param/date';
import { computed } from 'vue';
import useGanttHeader from './useGanttHeader';
import useGanttWidth from './useGanttWidth';
import useParam from './useParam';
import useStyle from './useStyle';
export default () => {
  const { ganttHeader } = useGanttHeader();
  const { ganttColumnWidth, currentMillisecond, headerShowUnit } =
    useGanttWidth();
  const { $styleBox } = useStyle();
  const { $param } = useParam();
  const generateToday = computed(() => {
    const today = new XDate($param.today);
    today.startOf(headerShowUnit.value);
    return today;
  });

  const todayLeft = computed(() => {
    const start = ganttHeader.start?.clone();
    start?.startOf(headerShowUnit.value);
    return (
      (generateToday.value.intervalTo(start) / currentMillisecond.value) *
      ganttColumnWidth.value
    );
  });

  function isInArea(date: XDate) {
    if (ganttHeader.dates.length === 0) return false;

    const sd = ganttHeader.start;
    const ed = ganttHeader.end;

    return sd?.compareTo(date) === 'l' && ed?.compareTo(date) === 'r';
  }

  const showToday = computed(() => {
    return $styleBox.showToday && isInArea(generateToday.value);
  });

  return {
    todayLeft,
    showToday,
    isInArea
  };
};
