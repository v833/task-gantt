<template>
  <table
    ref="ganttHeaderRef"
    class="xg-gantt-header"
    :style="{ height: `${$param.headerHeight}px` }"
    cellpadding="0"
    cellspacing="0"
    border="0"
  >
    <colgroup>
      <template v-for="(c, i) in dateList[1]" :key="i">
        <col
          :width="`${getGanttUnitColumnWidth(
            c.date.date,
            i === 0
              ? 'after'
              : i === dateList[1].length - 1
              ? 'before'
              : undefined
          )}px`"
        />
      </template>
    </colgroup>

    <thead>
      <tr v-for="(r, trIndex) in dateList" :key="trIndex">
        <th
          v-for="(c, i) in r"
          :key="i"
          :class="[
            'xg-gantt-header-cell',
            {
              highlight:
                $styleBox.highlightDate &&
                trIndex === dateList.length - 1 &&
                ['day', 'hour'].includes(ganttHeader.unit) &&
                ($param.hoverItem?.start.isSame(
                  c.date,
                  ganttHeader.unit,
                  true
                ) ||
                  $param.hoverItem?.end.isSame(c.date, ganttHeader.unit))
            },
            { 'xg-gantt-header-cell__each': trIndex !== 0 }
          ]"
          :style="{
            'border-color': $styleBox.borderColor,
            'border-right-color':
              ganttHeader.unit !== 'day' ? '#babcbf' : $styleBox.borderColor,
            color: $styleBox.headerStyle?.textColor,
            backgroundColor:
              $styleBox.headerStyle?.bgColor || $styleBox.primaryColor,
            'text-align':
              trIndex === 0 && ganttHeader.unit !== 'year' ? 'left' : 'center',
            'padding-left':
              trIndex === 0 && ganttHeader.unit !== 'year'
                ? `${c.colSpan / 2}px`
                : '0'
          }"
          :colspan="c.colSpan"
          :rowspan="c.rowSpan"
        >
          <template v-if="showMileStone(c)">
            <div
              v-for="item in getMileStoneDate(c.date)"
              :key="item.date.getDate()"
            >
              <slot name="mile-stone" :data="item"></slot>
            </div>
          </template>

          {{ c.label }}
        </th>
      </tr>
    </thead>
  </table>
</template>

<script lang="ts" setup>
import useData from '@/composables/useData';
import useGanttWidth from '@/composables/useGanttWidth';
import useStyle from '@/composables/useStyle';
import useParam from '@/composables/useParam';
import useElement from '@/composables/useElement';
import { onMounted, onUpdated } from 'vue';
import useGanttHeader from '@/composables/useGanttHeader';
import { XDate } from '@/models/param/date';
import { GanttColumn } from '@/models/param/header';

const { $param } = useParam();
const { $styleBox } = useStyle();
const { dateList } = useData();
const { getGanttUnitColumnWidth } = useGanttWidth();
const { ganttHeaderRef, updateHeaderHeight } = useElement();
const { ganttHeader } = useGanttHeader();
onMounted(updateHeaderHeight);
onUpdated(updateHeaderHeight);

const ONE_DAY_GAP = 86400000;

const showMileStone = (column: GanttColumn) => {
  if (column.level === 1) return false;
  const date = column.date;
  if (ganttHeader.unit === 'day') {
    return !!$styleBox.mileStones.find(m => {
      return +new Date(m.date[0].date) === +new Date(date.date);
    });
  }
  if (ganttHeader.unit === 'week') {
    return !!$styleBox.mileStones.find(m => {
      return (
        +new Date(m.date[0].date) > +new Date(date.date) - 7 * ONE_DAY_GAP &&
        +new Date(m.date[0].date) <= +new Date(date.date)
      );
    });
  }
  if (ganttHeader.unit === 'month') {
    return !!$styleBox.mileStones.find(m => {
      return (
        +new Date(m.date[0].date) >= +new Date(date.date) &&
        +new Date(m.date[0].date) < +new Date(date.date) + 30 * ONE_DAY_GAP
      );
    });
  }
};

const getMileStoneDate = (date: XDate) => {
  if (ganttHeader.unit === 'day') {
    return [date];
  }
  if (ganttHeader.unit === 'week') {
    const dateList: XDate[] = [];
    $styleBox.mileStones.forEach(m => {
      if (
        +new Date(m.date[0].date) > +new Date(date.date) - 7 * ONE_DAY_GAP &&
        +new Date(m.date[0].date) <= +new Date(date.date)
      ) {
        dateList.push(m.date[0]);
      }
    });
    return dateList;
  }
  if (ganttHeader.unit === 'month') {
    const dateList: XDate[] = [];
    $styleBox.mileStones.forEach(m => {
      if (
        +new Date(m.date[0].date) >= +new Date(date.date) &&
        +new Date(m.date[0].date) < +new Date(date.date) + 30 * ONE_DAY_GAP
      ) {
        dateList.push(m.date[0]);
      }
    });
    return dateList;
  }
};
</script>

<style lang="scss">
.xg-gantt-header {
  width: 100%;
  table-layout: fixed;
  border-collapse: separate;
  top: 0;
  position: sticky;
  z-index: 10;
  white-space: nowrap;
  overflow: hidden;

  .xg-gantt-header-cell {
    text-overflow: ellipsis;
    vertical-align: middle;
    text-align: center;
    position: relative;
    box-sizing: border-box;
    border-bottom: 1px solid #e5e5e5;
    /* border-right: 1px solid #e5e5e5; */
    border-right: 1px solid #909399;
    font-size: 14px;
  }

  .xg-gantt-header-cell__each {
    font-size: 12px;
    word-wrap: break-word;
  }

  .highlight {
    filter: brightness(1.2);
  }
}
</style>
