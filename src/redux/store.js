// 根据redux以及创建的模块，创建出最终的store
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'; // 处理异步action
import api from './middleware/api';
import rootReducer from './modules';

let store;

// create-react-app 已注入环境变量NODE_ENV
if (
  process.env.NODE_ENV !== 'production' &&
  window.__REDUX_DEVTOOLS_EXTENSION__ 
  ) {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
    store = createStore(rootReducer, composeEnhancers(
      applyMiddleware(thunk, api)
      )
    );
} else {
  store = createStore(rootReducer, applyMiddleware(thunk, api));
}


export default store;