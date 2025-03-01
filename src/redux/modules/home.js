// 对应home首页的UI状态
import url from '../../utils/url';
import { FETCH_DATA } from '../middleware/api';
import { schema } from './entities/products';
import { combineReducers } from 'redux';

// 请求参数使用到的常量对象
export const params = {
  PATH_LIKES: 'likes',
  PATH_DISCOUNTS: 'discounts',
  PAGE_SIZE_LIKES: 5,
  PAGE_SIZE_DISCOUNTS: 3
}

export const types = {
  // 获取猜你喜欢
  FETCH_LIKES_REQUEST: 'HOME/FETCH_LIKES_REQUEST',
  // 获取猜你喜欢成功
  FETCH_LIKES_SUCCESS: 'HOME/FETCH_LIKES_SUCCESS',
  // 获取猜你喜欢失败
  FETCH_LIKES_FAILURE: 'HOME/FETCH_LIKES_FAILURE',
  // 获取超值特惠
  FETCH_DISCOUNTS_REQUEST: 'HOME/FETCH_DISCOUNTS_REQUEST',
  // 成功
  FETCH_DISCOUNTS_SUCCESS: 'HOME/FETCH_DISCOUNTS_SUCCESS',
  // 失败
  FETCH_DISCOUNTS_FAILURE: 'HOME/FETCH_DISCOUNTS_FAILURE'
};

const initialState = {
  likes: {
    isFetching: false,
    pageCount: 0,
    ids: []
  },
  discounts: {
    isFetching: false,
    ids: []
  }
};

export const actions = {
  // 加载猜你喜欢的数据
  loadLikes: () => {
    return (dispatch, getState) => {
      // 猜你喜欢的rowIndex即，用户刷新了多少次页面
      const { pageCount } = getState().home.likes;
      const rowIndex = pageCount * params.PAGE_SIZE_LIKES;
      const endpoint = url.getProductList(
        params.PATH_LIKES, 
        rowIndex, 
        params.PAGE_SIZE_LIKES
      );
      return dispatch(fetchLikes(endpoint));
    }
  },
  // 加载特惠商品
  loadDiscounts: () => {
    return (dispatch, getState) => {
      const { ids } = getState().home.discounts;
      // 对redux进行检索，避免history重复渲染
      if (ids.length > 0) {
        return null;
      }
      const endpoint = url.getProductList(
        params.PATH_DISCOUNTS, 
        0, 
        params.PAGE_SIZE_DISCOUNTS
      );
      return dispatch(fetchDiscounts(endpoint));
    }
  }
};

// 中间件处理的特殊结构
const fetchLikes = endpoint => ({
  [FETCH_DATA]: {
    types: [
      types.FETCH_LIKES_REQUEST,
      types.FETCH_LIKES_SUCCESS,
      types.FETCH_LIKES_FAILURE
    ],
    endpoint,
    schema
  }
});

const fetchDiscounts = endpoint => ({
  [FETCH_DATA]: {
    types: [
      types.FETCH_DISCOUNTS_REQUEST,
      types.FETCH_DISCOUNTS_SUCCESS,
      types.FETCH_DISCOUNTS_FAILURE
    ],
    endpoint,
    schema
  }
});

// 猜你喜欢reducer 
const likes = (state = initialState.likes, action) => {
  switch(action.type) {
    case types.FETCH_LIKES_REQUEST:
      return { ...state, isFetching: true };
    case types.FETCH_LIKES_SUCCESS:
      return { 
        ...state,
        isFetching: false, 
        pageCount: state.pageCount + 1, 
        ids: state.ids.concat(action.response.ids)
      };
    case types.FETCH_LIKES_FAILURE:
      return { ...state, isFetching: false };
    default:
      return state;
  }
};

// 特惠商品reducer
const discounts = (state = initialState.discounts, action) => {
  switch (action.type) {
    case types.FETCH_DISCOUNTS_REQUEST:
      return { ...state, isFetching: true };     
    case types.FETCH_DISCOUNTS_SUCCESS:
      return { 
        ...state, 
        isFetching: false,
        ids: state.ids.concat(action.response.ids)
      };
    case types.FETCH_DISCOUNTS_FAILURE:
    default:
      return state;
  }
};

export default combineReducers({
  discounts,
  likes
});

// selectors
// 获取猜你喜欢state
export const getLikes = state => {
  return state.home.likes.ids.map(id => {
    return state.entities.products[id];
  });
};

// 获取特惠商品state
export const getDiscounts = state => {
  return state.home.discounts.ids.map(id => {
    return state.entities.products[id];
  });
};

// 猜你喜欢当前分页码
export const getPageCountOfLikes = state => {
  return state.home.likes.pageCount;
};