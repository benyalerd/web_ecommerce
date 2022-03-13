import Action from '../index';

export function setSessionAlert(status, textbody, action, buttonstyle, errorcode) {
    return {
        type: Action.Set_Session_Alert,
        AlertStatus: status,
        TextBody: textbody,
        Action: action,
        ButtonStyle: buttonstyle,
        ErrorCode: errorcode
    };
}