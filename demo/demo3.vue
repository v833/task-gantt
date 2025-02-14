<template>
  <div style="height: 300px">
    <XGantt
      locale="zh-cn"
      ref="gantt"
      header-height="50"
      :row-height="50"
      data-id="id"
      start-key="startDate"
      end-key="endDate"
      :gantt-column-size="colSize"
      highlight-date
      show-today
      show-expand
      border="0"
      :data="ganttData"
      :mile-stones="milestoneList"
      :unit="unit"
      :header-style="headerStyle"
      :body-style="bodyStyle"
      :fullMode="fullMode"
      :endOffset="4 * 24 * 60 * 60 * 1000"
    >
      <XGanttSlider
        alignment="center"
        prop="startDate"
        date-format=""
        empty-data=""
        resize-left
        resize-right
        move
        move-by-unit
        :allow-link="false"
        linked-resize
        progress
        progress-decimal
        bg-c010r="#2387ff"
      >
        <template #content="{ row }">
          <div>
            <el-tooltip v-if="isTopLevel(row)">
              <div
                class="slider-level-one"
                :style="{
                  background: '#f2f3f5',
                  filter: 'opacity(0.5)',
                  height: '13px',
                  borderRadius: '4px'
                }"
              />
              <template #content>
                <tooltip-content row="row" today="today" />
              </template>
            </el-tooltip>
            <el-tooltip v-else>
              <div
                :style="{
                  background: 'red',
                  height: '25px',
                  borderRadius: '2px'
                }"
              />
              <template #content>
                <tooltip-content row="row" today="today" />
              </template>
            </el-tooltip>
          </div>
        </template>
        <template #left="{ row }">
          <div class="resize-chunk" />
        </template>
        <template #right="{ row }">
          <div class="resize-chunk" />
        </template>
      </XGanttSlider>
      <XGanttColumn prop="summary" width="200">
        <template #default="{ row }">
          <div class="summary-container">
            <el-tag>{{ row.startDate }}</el-tag>
          </div>
        </template>
      </XGanttColumn>
      <template #mile-stone="data">
        <div
          v-if="data?.data?.date"
          :style="{
            position: 'absolute',
            top: '-10px',
            height: '150%',
            left: '0px',
            'border-right': '2px solid red'
          }"
        ></div>
        <div
          :style="{
            position: 'absolute',
            top: '-30px',
            left: '0px',
            cursor: 'pointer'
          }"
        >
          {{ data?.data?.date }}
        </div>
      </template>
    </XGantt>
  </div>
  <button @click="changeUnit">切换单位</button>
  <button @click="changeYear">年</button>
  <button @click="changeFullMode">Full</button>
</template>

<script setup>
import { ganttData, STATUS_CONFIG_MAP, milestoneList } from './data';
import { ref } from 'vue';
const isTopLevel = row => {
  return row.type == 'stage';
};

const colSize = ref({
  day: 45,
  week: 30,
  month: 20,
  year: 40
});
// const colSize = ref({
//   day: 10,
//   week: 2,
//   month: 2
// });
const fullMode = ref(false);
const changeFullMode = () => {
  fullMode.value = !fullMode.value;
};
const unit = ref('month');
const changeUnit = () => {
  const u = ['month', 'week', 'day'];
  unit.value = u[(u.indexOf(unit.value) + 1) % u.length];
};

const changeYear = () => {
  unit.value = 'year';
};

const headerStyle = {
  bgColor: '#f2f3f5',
  textColor: '#86909C'
};
const bodyStyle = { bgColor: '#ffffff', todayColor: '#ffeecc' };
</script>
