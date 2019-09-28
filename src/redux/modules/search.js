import url from '../../utils/url.js';
import { FETCH_DATA } from '../middleware/api.js';
import { schema as keywordSchema, getKeywordById } from '../modules/entities/keywords.js';
import { schema as shopSchema, getShopById } from '../modules/entities/shops.js';
import { combineReducers } from 'redux';

export const types = {
  // 获取热门关键词
  FETCH_POPULAR_KEYWORDS_REQUEST:
    'SEARCH/FETCH_POPULAR_KEYWORDS_REQUEST',
  FETCH_POPULAR_KEYWORDS_SUCCESS:
    'SEARCH/FETCH_POPULAR_KEYWORDS_SUCCESS',
  FETCH_POPULAR_KEYWORDS_FAILURE:
    'SEARCH/FETCH_POPULAR_KEYWORDS_FAILURE',
  // 根据输入的文本，获取相关关键字
  FETCH_RELATED_KEYWORDS_REQUEST:
    'SEARCH/FETCH_RELATED_KEYWORDS_REQUEST',
  FETCH_RELATED_KEYWORDS_SUCCESS:
    'SEARCH/FETCH_RELATED_KEYWORDS_SUCCESS',
  FETCH_RELATED_KEYWORDS_FAILURE:
    'SEARCH/FETCH_RELATED_KEYWORDS_FAILURE',
  // 设置input输入
  SET_INPUT_TEXT: 'SEARCH/SET_INPUT_TEXT',
  // 清除input输入
  CLEAR_INPUT_TEXT: 'SEARCH/CLEAR_INPUT_TEXT',
  // 添加一条历史
  ADD_HISTORY_KEYWORD: 'SEARCH/ADD_HISTORY_KEYWORD',
  // 删除一条历史
  CLEAR_HISTORY_KEYWORDS: 'SEARCH/CLEAR_HISTORY_KEYWORDS',
  // 根据关键词查询到店铺相关结果
  FETCH_SHOPS_REQUEST: 'SEARCH/FETCH_SHOP_REQUEST',
  FETCH_SHOPS_SUCCESS: 'SEARCH/FETCH_SHOP_SUCCESS',
  FETCH_SHOPS_FAILURE: 'SEARCH/FETCH_SHOP_FAILURE'
};

const initialState = {
  inputText: '',
  popularKeywords: {
    isFetching: false,
    ids: []
  },
  /**
   * relatedKeywords对象结构
   * {
   *   '火锅': {
   *      isFetching: false,
   *      ids: []
   *   }
   * }
   */
  relatedKeywords: {},
  historyKeywords: [], //保存关键词id
  /**
   * searchedShopsByKeywords结构
   * {
   *   'keywordId': {
   *      isFetching: false,
   *      ids: []
   *   }
   * }
   */
  searchedShopsByKeyword: {}
};

export const actions = {
  // 获取热门关键词
  loadPopularKeywords: () => {
    return (dispatch, getState) => {
      // 检查是否已获取过热门数据
      const { ids } = getState().search.popularKeywords;
      if (ids.length > 0) {
        return null;
      }
      // ids为空，则向服务端发送请求获取热门数据
      const endpoint = url.getPopularKeywords();
      return dispatch(fetchPopularKeywords(endpoint));
    };
  },
  // 根据输入获取相关关键词
  loadRelatedKeywords: (text) => {
    return (dispatch, getState) => {
      const { relatedKeywords } = getState().search;
      if (relatedKeywords[text]) {
        return null;
      }
      const endpoint = url.getRelatedKeywords(text);
      return dispatch(fetchRelatedKeywords(text, endpoint));
    };
  },
  // 根据关键词查询店铺
  loadRelatedShops: (keyword) => {
    return (dispatch, getState) => {
      // 无需传参，因为最近一个历史记录即关键词
      const { searchedShopsByKeyword } = getState().search;
      if (searchedShopsByKeyword[keyword]) {
        return null;
      }
      const endpoint = url.getRelatedShops(keyword);
      return dispatch(fetchRelatedShops(keyword, endpoint));
    }
  },
  // 对输入信息进行操作
  setInputText: text => ({
    type: types.SET_INPUT_TEXT,
    text
  }),
  // 清除
  clearInputText: () => ({
    type: types.CLEAR_INPUT_TEXT
  }),
  // 添加历史
  addHistoryKeyword: keywordId => ({
    type: types.ADD_HISTORY_KEYWORD,
    text: keywordId
  }),
  // 清除
  clearHistoryKeywords: () => ({
    type: types.CLEAR_HISTORY_KEYWORDS
  })
};

const fetchPopularKeywords = endpoint => ({
  [FETCH_DATA]: {
    types: [
      types.FETCH_POPULAR_KEYWORDS_REQUEST,
      types.FETCH_POPULAR_KEYWORDS_SUCCESS,
      types.FETCH_POPULAR_KEYWORDS_FAILURE,
    ],
    schema: keywordSchema,
    endpoint
  }
});

const fetchRelatedKeywords = (text, endpoint) => ({
  [FETCH_DATA]: {
    types: [
      types.FETCH_RELATED_KEYWORDS_REQUEST,
      types.FETCH_RELATED_KEYWORDS_SUCCESS,
      types.FETCH_RELATED_KEYWORDS_FAILURE
    ],
    schema: keywordSchema,
    endpoint
  },
  text
});

// 获取查询到的店铺列表
const fetchRelatedShops = (text, endpoint) => ({
  [FETCH_DATA]: {
    types: [
      types.FETCH_SHOPS_REQUEST,
      types.FETCH_SHOPS_SUCCESS,
      types.FETCH_SHOPS_FAILURE
    ],
    schema: shopSchema,
    endpoint
  },
  text
})

// reducers
const popularKeywords = (state = initialState.popularKeywords, action) => {
  switch (action.type) {
    case types.FETCH_POPULAR_KEYWORDS_REQUEST:
      return { ...state, isFetching: true };
    case types.FETCH_POPULAR_KEYWORDS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        ids: state.ids.concat(action.response.ids)
      };
    case types.FETCH_POPULAR_KEYWORDS_FAILURE:
      return {
        ...state,
        isFetching: false
      };
    default:
      return state;
  }
};

const relatedKeywords = (state = initialState.relatedKeywords, action) => {
  switch (action.type) {
    case types.FETCH_RELATED_KEYWORDS_REQUEST:
    case types.FETCH_RELATED_KEYWORDS_SUCCESS:
    case types.FETCH_RELATED_KEYWORDS_FAILURE:
      return {
        ...state,
        [action.text]: relatedKeywordsByText(state[action.text], action)
      };
    default:
      return state;
  };
};

// child of relatedKeywords
const relatedKeywordsByText = (
  state = { isFetching: false, ids: [] },
  action
) => {
  switch (action.type) {
    case types.FETCH_RELATED_KEYWORDS_REQUEST:
      return { ...state, isFetching: true };
    case types.FETCH_RELATED_KEYWORDS_SUCCESS:
      return { ...state, isFetching: false, ids: state.ids.concat(action.response.ids) };
    case types.FETCH_RELATED_KEYWORDS_FAILURE:
      return { ...state, isFetching: false };
    default:
      return state;
  };
};

const inputText = (state = initialState.inputText, action) => {
  switch (action.type) {
    case types.SET_INPUT_TEXT:
      return action.text;
    case types.CLEAR_INPUT_TEXT:
      return '';
    default:
      return state;
  };
};

const historyKeywords = (state = initialState.historyKeywords, action) => {
  switch (action.type) {
    case types.ADD_HISTORY_KEYWORD:
      // 过滤处理，当前的state是否有了查询的关键词
      const data = state.filter(item => {
        if (item !== action.text) {
          return true;
        }
        return false;
      });
      return [action.text, ...data];
    case types.CLEAR_HISTORY_KEYWORDS:
      return [];
    default:
      return state;
  };
};

const searchedShopsByKeyword = (state = initialState.searchedShopsByKeyword, action) => {
  switch (action.type) {
    case types.FETCH_SHOPS_REQUEST:
    case types.FETCH_SHOPS_SUCCESS:
    case types.FETCH_SHOPS_FAILURE:
      return {
        ...state,
        [action.text]: searchedShops(state[action.text], action)
      }
      default:
        return state;
  }
};
// child of searchedShopsByKeyword
const searchedShops = (
  state = { isFetching: false, ids: [] },
  action
) => {
  switch (action.type) {
    case types.FETCH_SHOPS_REQUEST:
      return { ...state, isFetching: true };
    case types.FETCH_SHOPS_SUCCESS:
      return { ...state, isFetching: false, ids: state.ids.concat(action.response.ids) };
    case types.FETCH_SHOPS_FAILURE:
      return { ...state, isFetching: false };
    default:
      return state;
  }
}

export default combineReducers({
  popularKeywords,
  relatedKeywords,
  inputText,
  historyKeywords,
  searchedShopsByKeyword
});

// 编写selectors实现组件和状态管理层的连接
export const getPopularKeywords = state => {
  return state.search.popularKeywords.ids.map(id =>
    getKeywordById(state, id)
  );
};

export const getRelatedKeywords = state => {
  // console.log(state.search.relatedKeywords);
  const text = state.search.inputText;
  // 输入值无效 
  if (!text || text.trim().length === 0) {
    return [];
  }

  // 有效但未保存 
  const relatedKeywords = state.search.relatedKeywords[text];
  if (!relatedKeywords) {
    return [];
  }

  // 有效且已保存
  return relatedKeywords.ids.map(id =>
    getKeywordById(state, id)
  );
};

export const getInputText = state => {
  return state.search.inputText;
}

export const getHistoryKeywords = state => {
  // return state.search.historyKeywords;
  return state.search.historyKeywords.map(id =>
    getKeywordById(state, id)
  )
};

export const getSearchedShops = state => {
  const keywordId = state.search.historyKeywords[0];
  if (!keywordId) {
    return [];
  }
  const shops = state.search.searchedShopsByKeyword[keywordId];
  return shops.ids.map(id => {
    return getShopById(state, id);
  });
}

export const getCurrentKeyword = state => {
  const keywordId = state.search.historyKeywords[0];
  if (!keywordId) {
    return ''
  }
  return getKeywordById(state, keywordId).keyword;
}