// index.js 聚合所有的UI状态 + 领域状态
import { combineReducers } from 'redux';
import entities from './entities';
import app from './app';
import detail from './detail';
import home from './home';
import search from './search';

// 合并成根reducer
const rootReducer = combineReducers({
  entities,
  app,
  detail,
  home,
  search
});

export default rootReducer;
