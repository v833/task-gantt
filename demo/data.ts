const data = [
  {
    startDate: 1716151194000,
    endDate: 1726151194000,
    key: 18,
    keyPair: 'L6UKAXKNID-18',
    summary: '审图意见处理',
    subIssues: [
      {
        startDate: 1716251194000,
        endDate: 1729251194000,
        key: 19,
        keyPair: 'L6UKAXKNID-20',
        summary: 'test',
        subIssues: []
      }
    ]
  }
];

const formatIssueData = item => {
  // debugger;
  let startDate = new Date();
  let endDate = new Date();
  if (item.startDate && item.endDate) {
    startDate = new Date(+new Date(item.startDate) - 8 * 60 * 60 * 1000 - 1);
    endDate = new Date(+new Date(item.endDate) + 16 * 60 * 60 * 1000 - 1);
  }

  return {
    id: item.keyPair,
    issueKey: item.key,
    summary: item.summary,
    startDate,
    endDate,
    assignee: {
      fullName: item.assignee?.fullName || 'none',
      userName: item.assignee?.userName || '',
      pic: item.assignee?.pic || ''
    },
    children: [],
    canEdit: ['TODO', 'INPROGRESS'].includes(status)
  };
};
const parseData = issues => {
  const result = [];
  for (const item of issues) {
    if (item.parentIssue) continue;
    const parent = formatIssueData(item);
    const subIssues = item.subIssues || [];
    for (const subItem of subIssues) {
      parent.children.push(formatIssueData(subItem));
    }
    result.push(parent);
  }
  return result;
};

export const ganttData = parseData(data);

export const STATUS_CONFIG_MAP = {
  TODO: {
    intlId: 'task.todo',
    color: '#86909C',
    bgColor: '#f2f3f5',
    borderColor: '#C9CDD4',
    ganttColor: '#c9cdd4',
    ganttShadowColor: '#96959d'
  },
  INPROGRESS: {
    intlId: 'task.inprogress',
    co1or: '#456EF6',
    bgColor: '#e8feff',
    borderColor: '#BED3FD',
    ganttColor: '#456ef6',
    ganttShadowColor: '#3952b4'
  },
  REVIEW: {
    intlId: 'task.review',
    color: '#FF9A2E',
    bgColor: '#fff7e8',
    borderColor: '#FFCF8B',
    ganttColor: '#ff9a2e',
    ganttShadowColor: '#bb7128'
  },
  REVIEW_DONE: {
    intlId: 'task.reviewDone',
    color: '#0AA5A8',
    bgColor: '#e8fffb',
    borderColor: '#B5F4EA',
    ganttColor: '#b5e241',
    ganttShadowColor: '#87a435'
  },
  DONE: {
    intlId: 'task.done',
    c01or: '#23C343',
    bgColor: '#e8ffea',
    borderColor: '#AFF0B5',
    ganttColor: '#23c343',
    ganttShadowColor: '#218e36'
  }
};

export const milestoneList = [
  // {
  //   id: 64,
  //   name: 'test',
  //   date: +new Date('2024-01-12')
  // },
  // {
  //   id: 65,
  //   name: 'test2',
  //   date: +new Date('2024-02-06')
  // }
];
