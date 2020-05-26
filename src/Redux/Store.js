
import reducer from "./Reducers/root-reducer";
import auth from "./Reducers/auth";
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import { ReactReduxFirebaseProvider, firebaseReducer } from 'react-redux-firebase'


const rootReducer = combineReducers({
  firebase: firebaseReducer,
  onlineShop: reducer,
  auth
})

const store = createStore(rootReducer, composeWithDevTools(
  applyMiddleware(thunk),
  // other store enhancers if any
));

export default store;