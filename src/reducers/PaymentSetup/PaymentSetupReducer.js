import Action from '../../actions/index';
var initialState = {
   IsOpen:false ,
   IsAddPaymentOpen:false,
   bankSelect:[],
   isEdit:false
}
function PaymentSetup(state = initialState,action){
    switch (action.type) {     
        case Action.set_BookBankList_Dialog_Open:
            return{...state,IsOpen:action.IsOpen};
            case Action.set_Add_Payment_Dialog_Open:
            return{...state,IsAddPaymentOpen:action.IsAddPaymentOpen,bankSelect:action.bankSelect};
            case Action.set_Payment_Edit:
                return{...state,isEdit:action.isEdit};
        default:
            return state;
    }
}
export default PaymentSetup;