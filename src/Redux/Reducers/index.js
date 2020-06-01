import  {combineReducers } from 'redux';

import auth from './auth'
import rootReducer from './root-reducer'

export default combineReducers({
  auth,
  rootReducer,
});
