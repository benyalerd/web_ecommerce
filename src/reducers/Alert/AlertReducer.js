import Action from '../../actions/index';

var initialState = {
    AlertType: 0,
    Message: '',
    AlertOpen:false,
    ConfirmMessage: '',
    ConfirmAction : null,
    AlertConfirmOpen : false
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
            case Action.Set_Confirm_Alert:
                return {
                    ...state,
                    ConfirmMessage: action.ConfirmMessage,
                    ConfirmAction : action.ConfirmAction,
                    AlertConfirmOpen : action.AlertConfirmOpen
                };
        default:
            return state;
    }
}

export default Alert;