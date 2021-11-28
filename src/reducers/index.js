import {combineReducers} from 'redux';
import login from './Login/LoginReducer';
import Register from './Register/RegisterReducer';

const appReducer = combineReducers({
    login:login,
    Register:Register
});

const rootReducer = (state,action) =>{
    return appReducer(state,action)
}

export default rootReducer;