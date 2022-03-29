import Action from '../../actions/index';

var initialState = {
    AlertType: 0,
    Message: '',
    AlertOpen:false
};

function Alert(state = initialState, action) {
    switch (action.type) {
        case Action.Set_Alert:
            return {
                ...state,
                AlertType: action.AlertType,
                Message: action.Message,
                AlertOpen:action.AlertOpen
            };
        default:
            return state;
    }
}

export default Alert;