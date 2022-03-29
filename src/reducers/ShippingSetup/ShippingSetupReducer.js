import Action from '../../actions/index';
var initialState = {
   IsAddShippingOpen:false,
   shippingSelect:[],
   isEdit:false
}
function PaymentSetup(state = initialState,action){
    switch (action.type) {     
            case Action.set_Add_Shipping_Dialog_Open:
            return{...state,IsAddShippingOpen:action.IsAddShippingOpen,shippingSelect:action.shippingSelect};
            case Action.set_Shipping_Edit:
                return{...state,isEdit:action.isEdit};
        default:
            return state;
    }
}
export default PaymentSetup;