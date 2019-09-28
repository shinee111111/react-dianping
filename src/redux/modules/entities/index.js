import { combineReducers } from 'redux';
import products from './products';
import orders from './orders';
import shops from './shops';
import comments from './comments';
import keywords from './keywords';

const rootReducer = combineReducers({
  products,
  orders,
  shops,
  comments,
  keywords
});

export default rootReducer;