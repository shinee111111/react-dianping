import createReducer from '../../../utils/createReducer';

export const schema = {
  name: 'orders',
  id: 'id'
};

export const USER_TYPE = 1; // 已消费
export const TO_PAY_TYPE = 2; // 待付款
export const AVAILABLE_TYPE = 3; // 可使用
export const REFUND_TYPE = 4; // 退款

export const types = {
  // 删除订单
  DELETE_ORDER: 'ORDERS/DELETE_ORDER',
  // 新增评价
  ADD_COMMENT: 'ORDERS/ADD_COMMENT',
  // 新增订单
  ADD_ORDER: 'ORDERS/ADD_ORDER'
}

let orderIdCounter = 15;

export const actions = {
  // 删除订单
  deleteOrder: (orderId) => ({
    type: types.DELETE_ORDER,
    orderId
  }),
  // 新增评价
  addComment: (orderId, commentId) => ({
    type: types.ADD_COMMENT,
    orderId,
    commentId
  }),
  // 新增订单
  addOrder: (order) => ({
    type: types.ADD_ORDER,
    orderId: `o-${++orderIdCounter}`,
    order: {
      ...order,
      id: `o-${orderIdCounter}`
    }
  })
}

const normalReducer = createReducer(schema.name);

const reducer = (state = {}, action) => {
  if (action.type === types.ADD_COMMENT) {
    return {
      ...state,
      [action.orderId]: {
        ...state[action.orderId],
        commentId: action.commentId
      }
    }
  } else if (action.type === types.ADD_ORDER) {
    return Object.assign(
      { [action.orderId]: action.order },
      state
    );
  } else if (action.type === types.DELETE_ORDER) {
    const { [action.orderId]: deleteOrder, ...restOrders } = state;
    // 已返回删除指定order的orders
    return restOrders;
  } else {
    return normalReducer(state, action);
  }
}

export default reducer;

// selectors
export const getOrderById = (state, id) =>
  state.entities.orders[id];

export const getAllOrders = (state) => state.entities.orders;