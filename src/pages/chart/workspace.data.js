/*
 * @Description: 工作台数据
 * @Date: 2022-02-28 16:05:07
 * @LastEditTime: 2022-02-28 16:06:23
 */
const CHART_OPTION = [
  {
    name: '二维表',
    value: 'twoDimensionalTable',
    metrics: 16,
    dimension: 16,
    rowCount: 100,
    rowCountDes: '0个或多个',
    columnCountDes: '0个或多个',
    characterCountDes: '0个或多个',
    className: 'twoDimensionalTable'
  },
  {
    name: '透视表',
    value: 'Multidimensional',
    metrics: 16,
    dimension: 100,
    rowCount: 100,
    rowCountDes: '1个或多个',
    columnCountDes: '1个或多个',
    characterCountDes: '1个或多个',
    className: 'multidimensional'
  },
  {
    name: '折线图',
    value: 'line',
    metrics: 4,
    dimension: 1,
    rowCount: 1,
    rowCountDes: '1个',
    columnCountDes: '1个',
    characterCountDes: '1个或多个数值',
    className: 'line'
  },
  {
    name: '柱状图',
    value: 'histogram',
    metrics: 4,
    dimension: 1,
    rowCount: 1,
    rowCountDes: '1个',
    columnCountDes: '1个',
    characterCountDes: '1个或多个数值',
    className: 'histogram'
  },
  {
    name: '饼图',
    value: 'pie',
    metrics: 1,
    dimension: 1,
    rowCount: 1,
    rowCountDes: '1个',
    columnCountDes: '1个',
    characterCountDes: '1个或多个',
    className: 'pie'
  },
  {
    name: '条形图',
    value: 'bar',
    metrics: 2,
    dimension: 1,
    rowCount: 1,
    rowCountDes: '1个',
    columnCountDes: '1个',
    characterCountDes: '1个或多个',
    className: 'bar'
  },
  {
    name: '环图',
    value: 'ring',
    metrics: 1,
    dimension: 1,
    rowCount: 1,
    rowCountDes: '1个',
    columnCountDes: '1个',
    characterCountDes: '1个或多个',
    className: 'ring'
  },
  {
    name: '瀑布图',
    value: 'waterfall',
    metrics: 1,
    dimension: 1,
    rowCount: 0,
    rowCountDes: '0个',
    columnCountDes: '1个',
    characterCountDes: '1个或多个',
    className: 'waterfall'
  },
  {
    name: '漏斗图',
    value: 'funnel',
    metrics: 2,
    dimension: 1,
    rowCount: 1,
    rowCountDes: '1个',
    columnCountDes: '1个',
    characterCountDes: '1个或多个',
    className: 'funnel'
  }
]

export { CHART_OPTION }
