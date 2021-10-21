import {combineReducers} from 'redux';
import Test from './test/testReducer.js';

const appReducer = combineReducers({
Test:Test
});

const rootReducer = (state,action) =>{
    return appReducer(state,action)
}

export default rootReducer;