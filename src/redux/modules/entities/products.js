import createReducer from '../../../utils/createReducer';

export const schema = {
  name: 'products',
  id: 'id'
};
// 产品信息
// 将当前的数据保存到products模块当中，keyValue
// 数据合并到领域数据状态下
const reducer = createReducer(schema.name);

export default reducer;

// selectors
export const getProductDetail = (state, id) => {
  // 首先，所有reducer都会执行
  // 而product 包含了基本信息 和 详情信息
  // 故需判断，再金进行返回，则更加对象字段
  const product = state.entities.products[id];
  return product && product.detail && product.purchaseNotes ? product : null;
};

// export const getProductById = (state, id) => {
//   return state.entities.products[id];
// };

export const getAllProducts = (state) =>
  state.entities.products;