import { get } from '../../utils/request';

// 经过中间件处理的action所具有的标识
export const FETCH_DATA = 'FETCH_DATA';

// 函数式编程
export default store => next => action => {
  const callAPI = action[FETCH_DATA];
  if (typeof callAPI === 'undefined') {
    // 表明是其他类型的action
    return next(action);
  }

  // 进入异步action环节
  const { endpoint, schema, types } = callAPI;
  if (typeof endpoint !== 'string') {
    throw new Error('endpoint必须为字符串类型的URL');
  }
  // 需要获取schema进行扁平化处理
  if (!schema) {
    throw new Error('必须指定领域实体的schema');
  }
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('需要指定一个包含了3个action type的数组');
  }
  if (!types.every(type => typeof type === 'string')) {
    throw new Error('action type必须为字符串类型');
  }

  /**
   * 中间件action
   * @param {object} data
   * {
   *   type: 'FETCH_DATA_SUCCESS',
   *   response: {
   *     ids: [],
   *     [schema.name]: {}
   *   }
   * } 
   * 外界action
   * {
   *   [FETCH_DATA]: {},
   *   text
   * }
   * 处理后的action
   * {
   *   type: 'FETCH_DATA_SUCCESS',
   *   response: {...},
   *   text  // 作为扁平化键名的参数。
   * }
   */
  const actionWith = data => {
    const finalAction = { ...action, ...data };
    delete finalAction[FETCH_DATA];
    return finalAction;
  }

  const [requestType, successType, failureType] = types;

  next(actionWith({ type: requestType }));

  return fetchData(endpoint, schema).then(
    response => next(actionWith({
      type: successType,
      response
    })),
    error => next(actionWith({
      type: failureType,
      error: error.message || '获取数据失败'
    }))
  )

};

// 执行网络请求
const fetchData = (endpoint, schema) => {
  return get(endpoint).then(data => {
    return normalizeData(data, schema);
  });
}


const normalizeData = (data, schema) => {
  const { id, name } = schema;
  let kvObj = {};
  let ids = [];
  if (Array.isArray(data)) {
    data.forEach(item => {
      kvObj[item[id]] = item;
      ids.push(item[id]);
    })
  } else {
    kvObj[data[id]] = data;
    ids.push(data[id]);
  }
  return {
    [name]: kvObj, // name代表不同领域实体的名字
    ids
  };
}