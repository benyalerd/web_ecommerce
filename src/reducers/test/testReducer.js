import Action from '../../actions/index';
var initialState = {
    testText:""
}
function Test(state = initialState,action){
    switch (action.type) {
        case Action.set_test_text:
            return{...state,testText:action.testText};
              
        default:
            return state;
    }
}
export default Test;