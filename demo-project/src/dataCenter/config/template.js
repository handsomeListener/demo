export default async function () {
  return {
    filterData: [
      {
        label: '工单号',
        type: 'input',
        valueKey: 'orderNo'
      },
      {
        label: '制定日期',
        type: 'dateSelect',
        valueKey: 'day',
        required: true
      },
      {
        label: '日期范围',
        type: 'dateSelect',
        valueKey: 'date',
        props: {
          type: 'RANGE',
          defaultValue: [-30, 0]
        }
      },
      {
        label: '工单类型',
        type: 'select',
        valueKey: 'type',
        props: {
          config: {
            multiple: true
          },
          type: '#HZ001'
        }
      },
      {
        label: '工单状态',
        type: 'select',
        valueKey: 'status',
        props: {
          config: {
            multiple: true,
            defaultValue: ['4'],
            optionsList: [
              { value: '草稿', id: '1' },
              { value: '待审核', id: '2' },
              { value: '已驳回', id: '3' },
              { value: '已审核', id: '4' },
              { value: '已作废', id: '7' }
            ]
          }
        }
      },
      {
        label: '所需地区',
        type: 'selfComponent',
        valueKey: 'invoiceNo',
        render: h => {
          return h('el-cascader', {
            props: {
              clearable: true,
              filterable: true,
              options: [
                {
                  value: '100',
                  label: '广东',
                  children: [
                    {
                      value: '110',
                      label: '广州',
                      children: [
                        {
                          value: '111',
                          label: '天河区'
                        },
                        {
                          value: '112',
                          label: '海珠区'
                        }
                      ]
                    },
                    {
                      value: '120',
                      label: '江门'
                    },
                    {
                      value: '130',
                      label: '佛山'
                    }
                  ]
                }
              ]
            },
            style: {
              width: '100%'
            }
          })
        }
      }
    ],
    buttonData: [
      {
        label: '+新建工单',
        status: 'primary'
      },
      {
        label: '导入'
      },
      {
        label: '导出'
      },
      {
        type: 'drop',
        label: '批量操作',
        list: [
          {id: '批量审批', name: '批量审批'},
          {id: '批量删除', name: '批量删除'}
        ],
        click: (id) => {
          alert(id)
        }
      }
    ],
    handlerConfig: {
      handle: true,
      // 通用配置
      commonConfig: {
        align: 'center',
        width: '120px'
      },
      date: {
        props: {
          width: '150px'
        }
      },
      'area|remark': {
        props: {
          width: '200px'
        }
      },
      quantity: {
        handle: (h, scope) => {
          return h('div', {
            style: {
              color: 'red',
              cursor: 'pointer'
            },
            on: {
              click: () => {
                alert(`当前数量为${scope.row.quantity}`)
              }
            }
          }, scope.row.quantity)
        }
      },
      operate: {
        handle: (h, scope) => {
          return h('div', {
            style: {
              color: 'blue',
              cursor: 'pointer',
              textDecoration: 'underline'
            }
          }, '查看详情')
        }
      }
    }
  }
}
