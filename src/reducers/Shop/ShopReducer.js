import Action from '../../actions/index';
var initialState = {
    Shop:null,
}
function Shop(state = initialState,action){
    switch (action.type) {
        case Action.set_Shop_Info:
            return{...state,Shop:action.Shop};
             
        default:
            return state;
    }
}
export default Shop;