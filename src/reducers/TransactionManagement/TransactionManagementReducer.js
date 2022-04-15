import Action from '../../actions/index';
var initialState = {
    transactionTabId:0,
}
function TransactionManagement(state = initialState,action){
    switch (action.type) {
        case Action.Set_Transaction_TabId:
            return{...state,transactionTabId:action.transactionTabId};             
        default:
            return state;
    }
}
export default TransactionManagement;