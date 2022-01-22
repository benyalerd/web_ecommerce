import Action from '../../actions/index';
var initialState = {
   Merchant:null ,
}
function Merchant(state = initialState,action){
    switch (action.type) {
        case Action.set_Merchant_Info:
            return{...state,Merchant:action.Merchant};
           
        default:
            return state;
    }
}
export default Merchant;