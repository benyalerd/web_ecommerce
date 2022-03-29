import {combineReducers} from 'redux';
import Merchant from './Merchant/MerchantReducer';
import Shop from './Shop/ShopReducer';
import PaymentSetup from './PaymentSetup/PaymentSetupReducer';
import SessionAlert from './Alert/SessionAlert';
import ShippingSetup from './ShippingSetup/ShippingSetupReducer'
import Alert  from './Alert/AlertReducer'

const appReducer = combineReducers({
    Merchant:Merchant,
    Shop:Shop,
    PaymentSetup:PaymentSetup,
    SessionAlert: SessionAlert,
    ShippingSetup:ShippingSetup,
    Alert:Alert
});

const rootReducer = (state,action) =>{
    return appReducer(state,action)
}

export default rootReducer;