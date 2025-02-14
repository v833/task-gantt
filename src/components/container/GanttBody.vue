<template>
  <div
    ref="ganttBodyRef"
    class="xg-gantt-body"
    :style="{ height: bodyHeight, width: `${ganttWidth}px` }"
  >
    <!-- 滑动条 -->
    <template v-for="d in inView" :key="d.uuid">
      <RowVue :data="d" class="xg-gantt-row" :render-style="false" long-press>
        <component :is="$slotsBox.slider" :data="d" />
      </RowVue>
    </template>

    <!-- 连线 -->
    <svg class="xg-gantt-body-line-wrap" :style="{ width: `${ganttWidth}px` }">
      <LinkPath v-for="link in $links.links" :key="link.uuid" :link="link" />

      <Linking />
    </svg>

    <!-- 行样式 -->
    <template v-for="d in inView" :key="d.uuid">
      <RowVue :data="d" />
    </template>

    <!-- 周末 -->
    <template v-for="(date, i) in ganttHeader.datesByUnit">
      <div
        v-if="$styleBox.showWeekend"
        :key="i"
        class="xg-gantt-body-date-line weekend"
        :style="{
          borderRightColor: genBorderRightColor(date),
          width: `${ganttColumnWidth}px`,
          left: `${ganttColumnWidth * i}px`,
          backgroundColor: 'fff'
        }"
      ></div>
    </template>

    <!-- 里程碑 -->
    <template v-for="mileStones in $styleBox.mileStones">
      <div
        v-for="date in mileStones.date"
        :key="date.toString()"
        class="xg-gantt-body-date-line holiday"
        :style="{
          left: `${calcLeft(date)}px`,
          opacity: 1,
          border: `1px solid ${mileStones.color || '#F53F3F'}`,
          'z-index': 10
        }"
      ></div>
    </template>

    <!-- 今天 -->
    <div
      v-if="showToday"
      class="xg-gantt-body-date-line today"
      :style="{
        'margin-top': '5px',
        width: `0px`,
        left: `${todayLeft + (1 / 2) * ganttColumnWidth - 1}px`,
        backgroundColor: 'none',
        border: '2px dashed #1e49f4',
        'z-index': 11,
        opacity: 1
      }"
    ></div>

    <!-- 节假日 -->
    <template v-for="holidays in $styleBox.holidays">
      <div
        v-for="date in holidays.date.filter(
          d =>
            d.compareTo(ganttHeader.start) === 'r' &&
            d.compareTo(ganttHeader.end) === 'l'
        )"
        :key="date.toString()"
        class="xg-gantt-body-date-line holiday"
        :style="{
          width: `${ganttColumnWidth}px`,
          left: `${calcLeft(date)}px`,
          backgroundColor: holidays.color
        }"
      ></div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import useGanttHeader from '@/composables/useGanttHeader';
import useGanttWidth from '@/composables/useGanttWidth';
import useInView from '@/composables/useInView';
import useSlotsBox from '@/composables/useSlotsBox';
import useStyle from '@/composables/useStyle';
import useToday from '@/composables/useToday';
import useLinks from '@/composables/useLinks';
import RowVue from './Row.vue';
import LinkPath from '@/components/links/LinkPath.vue';
import Linking from '@/components/links/Linking.vue';
import useElement from '@/composables/useElement';
import { XDate } from '@/models/param/date';
import dayjs from 'dayjs';

const { $slotsBox } = useSlotsBox();
const { bodyHeight, $styleBox } = useStyle();
const { ganttWidth, ganttColumnWidth, headerShowUnit, currentMillisecond } =
  useGanttWidth();
const { inView } = useInView();
const { todayLeft, showToday } = useToday();
const { ganttHeader } = useGanttHeader();
const { $links } = useLinks();
const { ganttBodyRef } = useElement();

const isLastDayOfMonth = (date: Date) => {
  // 使用dayjs将给定的日期包装起来
  const givenDate = dayjs(date);

  // 获取给定日期所在月份的最后一天
  const lastDayOfMonth = givenDate.endOf('month');

  // 比较给定日期是否与该月的最后一天相同
  return givenDate.isSame(lastDayOfMonth, 'day');
};
const genBorderRightColor = (date: XDate) => {
  switch (ganttHeader.unit) {
    case 'year':
      return date.date.getMonth() === 11 ? '#909399' : '#e5e6eb';
    case 'month':
      return isLastDayOfMonth(date.date) ? '#909399' : '#e5e6eb';
    case 'week':
      return date.date.getDay() === 0 ? '#909399' : '#e5e6eb';

    default:
      return '#e5e6eb';
  }
};

const calcLeft = (date: XDate) => {
  const start = ganttHeader.start?.clone();
  start?.startOf(headerShowUnit.value);

  date.startOf(headerShowUnit.value);
  return (
    (date.intervalTo(start) / currentMillisecond.value) * ganttColumnWidth.value
  );
};
</script>

<style lang="scss">
.xg-gantt-body {
  position: relative;
  z-index: 9;

  .xg-gantt-row {
    z-index: 9;
  }

  .xg-gantt-body-line-wrap {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 5;
    pointer-events: none;
  }

  .xg-gantt-body-date-line {
    box-sizing: border-box;
    z-index: 2;
    height: 100%;
    position: absolute;
    top: 0;
    opacity: 0.6;
    pointer-events: none;
    border: 1px solid #e5e6eb;
  }
}
</style>
