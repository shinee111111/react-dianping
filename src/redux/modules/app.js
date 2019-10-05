// 初始状态的state
const initialState = {
  error: null
};

// action-type
export const types = {
  CLEAR_ERROR: 'APP/CLEAR_ERROR'
};

// action-creators
export const actions = {
  clearError: () => ({
    type: types.CLEAR_ERROR
  })
};


// 前端的通用基础状态
// reducer的处理可以通过action-type，也可以通过特有的返回属性，如error进行处理
const reducer = (state = initialState, action) => {
  const { type, error } = action;
  if (type === types.CLEAR_ERROR) {
    return { ...state, error: null };
  } else if (error) {
    return { ...state, error };
  }
  return state;
};

export default reducer;

// selector 从state中去获取某一部分的状态
// ui层和状态管理层通信，实现解耦
export const getError = (state) => {
  return state.app.error
};