import {combineReducers} from 'redux';
import login from './Login/LoginReducer';

const appReducer = combineReducers({
    login:login
});

const rootReducer = (state,action) =>{
    return appReducer(state,action)
}

export default rootReducer;