import Action from '../../actions/index';
var initialState = {
    MerchantInfo:null
}
function Merchant(state = initialState,action){
    switch (action.type) {
        case Action.set_Merchant_Info:
            return{...state,MerchantInfo:action.MerchantInfo};
              
        default:
            return state;
    }
}
export default Merchant;