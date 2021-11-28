import Action from '../../actions/index';
var initialState = {
    UserInfo:null
}
function Register(state = initialState,action){
    switch (action.type) {
        case Action.set_user_info:
            return{...state,UserInfo:action.UserInfo};
              
        default:
            return state;
    }
}
export default Register;