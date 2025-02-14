import useStore from '@/store';
import { type MoveSliderData } from '@/typings/data';
import { type LinkProps } from '@/typings/link';
import { toRaw } from 'vue';

export default () => {
  const { rootEmit } = useStore();

  const toRowData = (data?: any) => {
    return { ...toRaw(data) };
  };

  /**
   * 点击行事件
   * @param row 该行的原始数据
   */
  function EmitRowClick(row: any) {
    rootEmit.value?.('row-click', toRowData(row));
  }

  /**
   * 双击行事件
   * @param row 该行的原始数据
   */
  function EmitRowDblClick(row: any) {
    rootEmit.value?.('row-dbl-click', toRowData(row));
  }

  /**
   * 选择行事件 checkbox
   * @param state 选择状态
   * @param list 该行的原始数据
   */
  function EmitRowChecked(state: boolean, data: any, list: any[] = []) {
    rootEmit.value?.('row-checked', state, toRowData(data), [
      toRowData(data),
      ...list.map(item => toRowData(item))
    ]);
  }

  /**
   * 移动滑块事件
   * @param data 移动的所有原始数据集合（时间已被更新）。每一行包含旧时间
   */
  function EmitMoveSlider(data: MoveSliderData[]) {
    rootEmit.value?.(
      'move-slider',
      data.map(item => {
        return {
          row: toRowData(item.row),
          old: item.old
        };
      })
    );
  }

  /**
   * 添加连线事件
   */
  function EmitAddLink(
    link: LinkProps,
    data: { from: any; to: any },
    cb: (link: LinkProps) => void
  ) {
    rootEmit.value?.(
      'add-link',
      link,
      { from: toRowData(data.from), to: toRowData(data.to) },
      cb
    );
  }

  /**
   * 点击连线事件
   */
  function EmitClickLink(link: LinkProps | null) {
    rootEmit.value?.('click-link', link ? toRowData(link) : null);
  }

  /**
   * 日期不存在当前组件中事件
   */
  function EmitNoDateError(date: Date) {
    rootEmit.value?.('no-date-error', date);
  }

  return {
    EmitRowClick,
    EmitRowDblClick,
    EmitRowChecked,
    EmitMoveSlider,
    EmitAddLink,
    EmitClickLink,
    EmitNoDateError
  };
};
