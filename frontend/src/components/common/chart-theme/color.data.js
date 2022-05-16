const COLOR_DATA = [
  {
    type: 'complex',
    value: '1',
    colors: ['#B147B2', '#D17CBA', '#E99BCF', '#D9A14E', '#EFB187', '#F5BBB4', '#59BDD8', '#8DC9E0', '#B5C9E1']
  },
  {
    type: 'complex',
    value: '2',
    colors: ['#7799C8', '#9DC0E4', '#BEC8FB', '#C595B6', '#C9B6D1', '#F1DAE5', '#CEB663', '#DECA94', '#CFCEC7']
  },
  {
    type: 'complex',
    value: '3',
    colors: ['#87A6F8', '#ABC2F9', '#DED2FF', '#D65EA9', '#C6A6D8', '#E4C6EE', '#3CACBD', '#61D0B5', '#8AE6CE']
  },
  {
    type: 'complex',
    value: '4',
    colors: ['#CB8359', '#E7AC72', '#F8C20A', '#6996E0', '#66B2A9', '#9EC2D5', '#E77295', '#F6A8BF', '#F6A8A8']
  },
  {
    type: 'complex',
    value: '5',
    colors: ['#AFB843', '#D7CD4F', '#EBEA7C', '#936FF4', '#DD7EF5', '#E49898', '#6BABC6', '#5ABDBF', '#90CBFF']
  },
  {
    type: 'complex',
    value: '6',
    colors: ['#E52D2C', '#EF837C', '#F8DAD6', '#F0C536', '#F9E08F', '#FFE7CB', '#8EC2A4', '#BBD6A1', '#BDE7D3']
  },
  {
    type: 'complex',
    value: '7',
    colors: ['#B04E3B', '#BF8E69', '#D8862B', '#F4A649', '#FADC71', '#DEEEED', '#9AB4A6', '#BBD6A1', '#BDE7D3']
  },
  {
    type: 'complex',
    value: '8',
    colors: ['#48A554', '#8AC291', '#A8E4D8', '#CBE4DD', '#D6BB44', '#EAD89C', '#E5A3A9', '#FDD2D6', '#FDE6D2']

  },
  {
    type: 'complex',
    value: '9',
    colors: ['#64D4FC', '#649FFA', '#90ABD5', '#A86EA0', '#D0A0B5', '#E4D6DC', '#EC8A6F', '#F5CC9F', '#F5E79F']
  },
  {
    type: 'single',
    value: '10',
    colors: ['#17846A', '#2CAF90', '#2AC9A3', '#73E0C6', '#97EAD5', '#A3F7E1', '#CEFFF2', '#E7FFF9']
  },
  {
    type: 'single',
    value: '11',
    colors: ['#133CA6', '#2C59D1', '#6789E2', '#85A6FC', '#B9CCFF', '#D3DFFE', '#E4ECFF', '#F1F5FF']
  },
  {
    type: 'single',
    value: '12',
    colors: ['#3A15A4', '#5328CA', '#7645FF', '#9570FC', '#BFA8FF', '#D7C9FF', '#EBE3FF', '#F6F2FF']
  },
  {
    type: 'single',
    value: '13',
    colors: ['#416713', '#608533', '#70AE49', '#91CC68', '#B0EA87', '#C5F7A2', '#DBFCC4', '#ECFFDF']
  },
  {
    type: 'single',
    value: '14',
    colors: ['#A78B12', '#CEAB14', '#FFCF00', '#FDD937', '#FFE677', '#FFED9D', '#FFF4C4', '#FCF8E4']

  },
  {
    type: 'single',
    value: '15',
    colors: ['#980C5A', '#B91B73', '#D84898', '#E975B5', '#FF9CD3', '#FFC7E6', '#FFE0F1', '#FFEEF8']
  },
  {
    type: 'single',
    value: '16',
    colors: ['#A05400', '#CC6B00', '#FF8905', '#FEA23C', '#FFC27E', '#FFDBB3', '#FFE9D0', '#FFF0E0']
  },
  {
    type: 'single',
    value: '17',
    colors: ['#B50104', '#E10003', '#FF3134', '#FF5153', '#FF7A7B', '#FCA2A2', '#FFCACB', '#FFE3E3']
  }
]
function GET_COLOR_LIST(value) {
  const colorValue = value || '16'

  return COLOR_DATA.find(item => item.value === colorValue)?.colors
}

export { COLOR_DATA, GET_COLOR_LIST }
