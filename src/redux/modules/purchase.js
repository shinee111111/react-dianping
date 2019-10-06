import { getProductDetail } from './entities/products';
import { actions as orderActions, AVAILABLE_TYPE } from './entities/orders';
import { actions as userActions } from './user';
import { createSelector } from 'reselect';

const initialState = {
  quantity: 1,
  showTip: false
};

export const types = {
  SET_ORDER_QUANTITY: 'PURCHASE/SET_ORDER_QUANTITY',
  CLOSE_TIP: 'PURCHASE/CLOSE_TIP',
  // 提交订单相关 
  SUBMIT_ORDER_REQUEST: 'PURCHASE/SUBMIT_ORDER_REQUEST',
  SUBMIT_ORDER_SUCCESS: 'PURCHASE/SUBMIT_ORDER_SUCCESS',
  SUBMIT_ORDER_FAILURE: 'PURCHASE/SUBMIT_ORDER_FAILURE'
};

// action creators
export const actions = {
  // 设置下单数量
  setOrderQuantity: quantity => ({
    type: types.SET_ORDER_QUANTITY,
    quantity
  }),
  // 开启提示弹窗 在SUBMIT_ORDER_SUCCESS逻辑中
  // 关闭提示弹窗 
  closeTip: () => ({
    type: types.CLOSE_TIP
  }),
  // 提交订单 
  submitOrder: productId => {
    return (dispatch, getState) => {
      dispatch({ type: types.SUBMIT_ORDER_REQUEST });
      return new Promise(resolve => {
        setTimeout(() => {
          // 获取产品的详情信息
          const product = getProductDetail(getState(), productId);
          const quantity = getState().purchase.quantity;
          const totalPrice = (product.currentPrice * quantity).toFixed(1);
          const text1 = `${quantity}张 | 总价: ${totalPrice}`;
          const text2 = product.validityPeriod;
          // 订单对象的创建
          const order = {
            title: `${product.shop}: ${product.product}`,
            orderPicUrl: product.picture,
            channel: '团购',
            statusText: '待消费',
            text: [text1, text2],
            type: AVAILABLE_TYPE
          };
          // 增加领域实体数据
          const newOrder = dispatch(orderActions.addOrder(order));
          // 增加领域实体数据
          dispatch(userActions.addOrder(newOrder.orderId));
          dispatch({ type: types.SUBMIT_ORDER_SUCCESS });
          resolve();
        }, 500);
      });
    };
  }
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_ORDER_QUANTITY:
      return { ...state, quantity: action.quantity };
    case types.CLOSE_TIP:
      return { ...state, showTip: false };
    case types.SUBMIT_ORDER_SUCCESS:
      return { ...state, showTip: true };
    default:
      return state;
  }
};

export default reducer;

// selectors
export const getQuantity = (state) =>
  state.purchase.quantity;

export const getTipStatus = (state) =>
  state.purchase.showTip;

export const getProduct = (state, id) =>
  getProductDetail(state, id);

export const getTotalPrice = createSelector(
  getQuantity,
  getProduct,
  (quantity, product) => {
    if (!product) {
      return 0;
    }
    return (quantity * product.currentPrice).toFixed(1);
  }
);

// export const getData1 = (state, { id }) => id;
// export const getData2 = (state, { name, age }) => [name, age];
// export const getData3 = (state, { sex, code }) => [sex, code];

// export const getDataInfo = createSelector(
//   getData1,
//   getData2,
//   getData3,
//   (d1, d2, d3) => {
//     console.log('d1: ' , d1);
//     console.log('d2: ' , d2);
//     console.log('d3: ' , d3);
//   }
// );