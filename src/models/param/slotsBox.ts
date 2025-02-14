import Variables from '@/constants/vars';
import SliderVue from '@/components/slider/index.vue';
import {
  type Component,
  type VNode,
  h,
  type Slots,
  Comment,
  isVNode,
  Fragment
} from 'vue';
import { TableHeader } from './header';

export default class SlotsBox {
  tableHeaders!: TableHeader;
  cols!: VNode[];
  slider!: VNode;
  mileStones!: VNode[];

  constructor() {
    this.init();
  }

  private init() {
    this.tableHeaders = new TableHeader();
    this.cols = [];
    this.slider = h(SliderVue);
  }

  private static __checkType(type: string, target: string) {
    return (
      type.replace(/-/g, '').toLocaleLowerCase() === target.toLocaleLowerCase()
    );
  }

  private static __isCustomComponent(v: any): v is Component {
    return !!v.type?.name && !!v.type?.setup;
  }

  private static __isValidComponent(v: any): v is Component {
    return !(isVNode(v) && v.type === Comment);
  }

  /**
   * 将 slots 中的 fragment 平铺
   */
  private __flatFragment(slots: VNode[]): VNode[] {
    return slots.reduce<VNode[]>((p, v) => {
      if (
        v.type === Fragment &&
        Array.isArray(v.children) &&
        v.children.length > 0
      ) {
        return [...p, ...(v.children as VNode[])];
      } else {
        return [...p, v];
      }
    }, []);
  }

  private setMultiColumn(col: VNode, column: TableHeader['columns'][0]) {
    const slot: () => VNode[] = (col.children as any)?.default;

    if (slot) {
      try {
        const s = this.__flatFragment(slot());
        s.filter(v => {
          const type = (v.type as Component)?.name;
          return (
            type &&
            SlotsBox.__isValidComponent(v) &&
            SlotsBox.__isCustomComponent(v) &&
            SlotsBox.__checkType(type, Variables.name.column)
          );
        }).forEach(v => {
          const c = this.tableHeaders.setSubColumn(v, column);

          this.setMultiColumn(v, c);
        });
      } catch (err) {
        // pass
      }
    }
  }

  /**
   * 将 columns 的叶子结点平铺
   */
  private setLeafCols() {
    this.cols = this.tableHeaders.leafs.map((v, i) => {
      const w = v.node.props?.width ?? Variables.default.tableColumnWidth;
      v.width = typeof w === 'number' ? w : Number.parseInt(w);

      v.node.props = Object.assign({}, v.node.props, { __index: i });

      return v.node;
    });
  }

  setSlots(slots: Slots | VNode[]) {
    this.init();

    let s: VNode[];
    if (!Array.isArray(slots)) {
      s = slots.default ? slots.default() : [];
    } else {
      s = slots;
    }

    // 首先要处理循环等非节点的情况
    s = this.__flatFragment(s);

    // 1、slots.default 应该只包含 x-gantt-column 和 x-gantt-slider
    if (s.length > 0) {
      let index = 0;

      s.filter(v => {
        const type = (v.type as Component)?.name;

        // 只接收自定义的两个组件
        return (
          type &&
          SlotsBox.__isValidComponent(v) &&
          SlotsBox.__isCustomComponent(v) &&
          [Variables.name.column, Variables.name.slider]
            .map(n => SlotsBox.__checkType(type, n))
            .includes(true)
        );
      }).forEach(v => {
        const type = (v.type as Component).name as string;

        if (SlotsBox.__checkType(type, Variables.name.slider)) {
          // 如果是 slider，直接赋值。多个 XGanttSlider 保留最后一个
          this.slider = v;
        } else if (SlotsBox.__checkType(type, Variables.name.column)) {
          // column，则要放到 header 中去，然后还要有叶子结点的渲染
          this.tableHeaders.setColumn(v);

          // 看一下有没有嵌套 x-gantt-column，如果有，表示需要嵌套表头
          this.setMultiColumn(v, this.tableHeaders.columns[index++]);
        }
      });

      // 生成表头需要的内容
      this.tableHeaders.generate();

      // 生成完表头，就可以获取用于渲染内容的叶子节点的 column
      this.setLeafCols();
    }

    // 2、如果有预定义的命名插槽，单独处理
    this.mileStones = slots['mile-stone']?.() ?? [];
  }
}
