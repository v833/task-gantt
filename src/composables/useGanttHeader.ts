import { useStore } from '@/store';
import { watch } from 'vue';
import useGanttWidth from './useGanttWidth';
import useTableWidth from './useTableWidth';
import { debounce } from 'lodash';

let loading = false;

export default () => {
  const store = useStore();
  const { getGanttUnitColumnWidth } = useGanttWidth();
  const { tableWidth } = useTableWidth();

  // 设置甘特日期头
  function setGanttHeaders() {
    let minLen = Math.ceil(
      (window.innerWidth - tableWidth.value) /
        getGanttUnitColumnWidth(new Date())
    );
    if (store.ganttHeader.unit === 'year') {
      minLen += 2;
    }
    store.ganttHeader.setDate(
      // 使用 window 的宽度减去 table 的宽度，就是最小需要的列数，再加一个阈值即可
      minLen,
      store.$data.start,
      store.$data.end,
      store.$styleBox.unit
    );
  }

  const debouncedSetGanttHeaders = debounce(() => {
    setGanttHeaders();
    loading = false;
  }, 100);

  watch(
    () => store.$styleBox.unit,
    (value, oldValue) => {
      if (loading) return;
      loading = true;
      debouncedSetGanttHeaders();
    }
  );

  return {
    setGanttHeaders,
    ganttHeader: store.ganttHeader
  };
};
