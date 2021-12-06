import {combineReducers} from 'redux';
import Merchant from './Merchant/MerchantReducer';
import Shop from './Shop/ShopReducer';

const appReducer = combineReducers({
    Merchant:Merchant,
    Shop:Shop
});

const rootReducer = (state,action) =>{
    return appReducer(state,action)
}

export default rootReducer;