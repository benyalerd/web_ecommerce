import Action from '../../actions/index';
var initialState = {
    Shop:null,
}
function Shop(state = initialState,action){
    switch (action.type) {
        case Action.set_user_info:
            return{...state,Shop:action.Shop};
             
        default:
            return state;
    }
}
export default Shop;