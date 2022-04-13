import Action from '../index';

export function setAlert(type, message,isOpen) {
    return {
        type: Action.Set_Alert,
        AlertType: type,
        Message: message,
        AlertOpen : isOpen
    };
}

export function setConfirmAlert(message,action,isOpen) {
   
    return {
        type: Action.Set_Confirm_Alert,
        ConfirmMessage: message,
        ConfirmAction : action,
        AlertConfirmOpen : isOpen
    };
}