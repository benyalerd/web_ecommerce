import Action from '../index';

export function setAlert(type, message,isOpen) {
    return {
        type: Action.Set_Alert,
        AlertType: type,
        Message: message,
        AlertOpen : isOpen
    };
}