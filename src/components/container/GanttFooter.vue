<template>
  <div class="xg-gantt-footer">
    <div class="xg-gantt-footer-title">星期</div>

    <template v-for="(date, i) in ganttHeader.datesByUnit" :key="i">
      <div
        class="xg-gantt-body-date-line weekend xg-gantt-footer-line"
        :style="{
          width: `${ganttColumnWidth}px`,
          left: `${ganttColumnWidth * i}px`,
          backgroundColor: '#ffffff',
          flex: 'none'
        }"
      >
        {{ dayjs(date).format('dddd').slice(-1) }}
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import useGanttHeader from '@/composables/useGanttHeader';
import useGanttWidth from '@/composables/useGanttWidth';
import dayjs from 'dayjs';
const { ganttHeader } = useGanttHeader();
const { ganttColumnWidth } = useGanttWidth();
</script>

<style lang="scss">
.xg-gantt-footer {
  display: flex;
  position: sticky;
  bottom: 0;
  height: 20px;
  z-index: 99;
}
.xg-gantt-footer-title {
  position: absolute;
  margin-left: -61px;
  border: 1px solid #e5e6eb;

  width: 60px;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  text-align: center;
  color: #86909c;
}
.xg-gantt-footer-line {
  box-sizing: border-box;
  height: 22px;
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  text-align: center;
  letter-spacing: 0em;
  color: #86909c;
  border: 1px solid #e5e6eb;
}
</style>
