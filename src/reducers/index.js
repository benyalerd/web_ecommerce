import {combineReducers} from 'redux';
import Merchant from './Merchant/MerchantReducer';
import Shop from './Shop/ShopReducer';
import PaymentSetup from './PaymentSetup/PaymentSetupReducer';
import SessionAlert from './Alert/SessionAlert';

const appReducer = combineReducers({
    Merchant:Merchant,
    Shop:Shop,
    PaymentSetup:PaymentSetup,
    SessionAlert: SessionAlert
});

const rootReducer = (state,action) =>{
    return appReducer(state,action)
}

export default rootReducer;