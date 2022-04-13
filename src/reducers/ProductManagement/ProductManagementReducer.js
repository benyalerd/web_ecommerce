import Action from '../../actions/index';
var initialState = {
    productTabId:1
}
function ProductManagement(state = initialState,action){
    switch (action.type) {     
        case Action.Set_Product_TabId:
            return{...state,productTabId:action.productTabId};
        default:
            return state;
    }
}
export default ProductManagement;