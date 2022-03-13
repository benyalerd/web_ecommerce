import Action from '../../actions/index';

var initialState = {
    alertstatus: false,
    textbody: 'เนื้อหาแจ้งเตือน',
    action: false,
    buttonstyle: 0,
    errorcode: ''
};

function SessionAlert(state = initialState, action) {
    switch (action.type) {
        case Action.Set_Session_Alert:
            return {
                ...state,
                alertstatus: action.AlertStatus,
                textbody: action.TextBody,
                action: action.Action,
                buttonstyle: action.ButtonStyle,
                errorcode: action.ErrorCode
            };
        case Action.Set_Session_Alert_Default:
            return {
                ...state,
                alertstatus: false,
                textbody: 'เนื้อหาแจ้งเตือน',
                action: false,
                buttonstyle: 0,
                errorcode: ''
            };
        default:
            return state;
    }
}

export default SessionAlert;