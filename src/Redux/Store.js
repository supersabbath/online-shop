
import onlineShopReducer from "./Reducer";
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import firebase from 'firebase/app';
import { ReactReduxFirebaseProvider, firebaseReducer } from 'react-redux-firebase'

const fbConfig = {}

const rrfConfing = {
   userProfile: 'user'
}

firebase.initializeApp(fbConfig);

const rootReducer = combineReducers({
  firebase: firebaseReducer,
  onlineShop: onlineShopReducer
})

const store = createStore(rootReducer, composeWithDevTools(
  applyMiddleware(thunk),
  // other store enhancers if any
));

export default store;