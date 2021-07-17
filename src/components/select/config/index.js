export default {
  '#HZ001': {
    url: '',
    methods: 'get',
    keyword: 'key',
    remote: true,
    params: ['userId'],
    optionKey: {
      id: 'id',
      value: 'label'
    },
    handle (data) {
      return data.value
    }
  }
}
