import { combineReducers } from 'redux';
import url from '../../utils/url';
import { FETCH_DATA } from '../middleware/api.js';
import {
  schema as shopSchema,
  // getRelatedShop,
  getAllShops
} from './entities/shops';
import {
  schema as productSchema,
  getProductDetail,
  // getProductById,
  getAllProducts

} from './entities/products';
import { createSelector } from 'reselect';

export const types = {
  // 获取产品详情
  FETCH_PRODUCT_DETAIL_REQUEST: 'DETAIL/FETCH_PRODUCT_DETAIL_REQUEST',
  FETCH_PRODUCT_DETAIL_SUCCESS: 'DETAIL/FETCH_PRODUCT_DETAIL_SUCCESS',
  FETCH_PRODUCT_DETAIL_FAILURE: 'DETAIL/FETCH_PRODUCT_DETAIL_FAILURE',
  // 获取关联店铺信息
  FETCH_SHOP_REQUEST: 'DETAIL/FETCH_SHOP_REQUEST',
  FETCH_SHOP_SUCCESS: 'DETAIL/FETCH_SHOP_SUCCESS',
  FETCH_SHOP_FAILURE: 'DETAIL/FETCH_SHOP_FAILURE'
};

const initialState = {
  product: {
    isFetching: false,
    id: null
  },
  relatedShop: {
    isFetching: false,
    id: null
  }
};

export const actions = {
  // 获取商品详情
  loadProductDetail: id => {
    return (dispatch, getState) => {
      // 发挥缓存层的作用，若数据已存在，则无需拉取
      const product = getProductDetail(getState(), id);
      if (product) {
        return dispatch(fetchProductDetailSuccess(id));
      }
      const endpoint = url.getProductDetail(id);
      return dispatch(fetchProductDetail(endpoint, id));
    };
  },
  // 获取店铺信息
  loadShopById: id => {
    return (dispatch, getState) => {
      const shop = getShopById(getState(), id);
      if (shop) {
        return dispatch(fetchShopSuccess(id));
      }
      const endpoint = url.getShopById(id);
      return dispatch(fetchShopById(endpoint, id));
    };
  }
};

const fetchProductDetail = (endpoint, id) => ({
  [FETCH_DATA]: {
    types: [
      types.FETCH_PRODUCT_DETAIL_REQUEST,
      types.FETCH_PRODUCT_DETAIL_SUCCESS,
      types.FETCH_PRODUCT_DETAIL_FAILURE
    ],
    endpoint,
    schema: productSchema,
    id
  }
});

const fetchShopById = (endpoint, id) => ({
  [FETCH_DATA]: {
    types: [
      types.FETCH_SHOP_REQUEST,
      types.FETCH_SHOP_SUCCESS,
      types.FETCH_SHOP_FAILURE
    ],
    endpoint,
    schema: shopSchema,
    id
  }
});

const fetchProductDetailSuccess = (id) => ({
  type: types.FETCH_PRODUCT_DETAIL_SUCCESS,
  id
});

const fetchShopSuccess = (id) => ({
  type: types.FETCH_SHOP_SUCCESS,
  id
});

// 商品详情reducer
const product = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_PRODUCT_DETAIL_REQUEST:
      return { ...state, isFetching: true };
    case types.FETCH_PRODUCT_DETAIL_SUCCESS:
      return { ...state, id: action.id, isFetching: false };
    case types.FETCH_PRODUCT_DETAIL_FAILURE:
      return { ...state, id: null, isFetching: false };
    default:
      return state;
  }
};

// 店铺reducer
const relatedShop = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_SHOP_REQUEST:
      return { ...state, isFetching: true };
    case types.FETCH_SHOP_SUCCESS:
      return { ...state, id: action.id, isFetching: false };
    case types.FETCH_SHOP_FAILURE:
      return { ...state, id: action.id, isFetching: true };
    default:
      return state;
  }
};

export default combineReducers({
  product,
  relatedShop
});

// selectors
// 获取商品详情信息
export const getProduct = (state, id) => {
  return getProductDetail(state, id);
};

// 获取管理的店铺信息
// export const getRelatedShop = (state, productId) => {
//   // 当productId存在的时候，才有意义去获取店铺的信息
//   const product = getProductById(state, productId);
//   let shopId = product ? product.nearestShop : null;
//   if (shopId) {
//     return getShopById(state, shopId);
//   }
//   return null;
// };

export const getShopById = createSelector(
  [getAllProducts, getAllShops, (state, productId) => productId],
  (products, shops, productId) => {
    const product = products[productId];
    return product && product.nearestShop
      ? shops[productId]
      : null;
  }
);