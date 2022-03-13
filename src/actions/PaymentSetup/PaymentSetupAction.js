import Action from '../index';

export function setBookBankListDialogOpen(data){
    return {
       type:Action.set_BookBankList_Dialog_Open,
       IsOpen:data
    };
}

export function setAddPaymentDialogOpen(data,isOpen){
    return {
       type:Action.set_Add_Payment_Dialog_Open,
       IsAddPaymentOpen:isOpen,
       bankSelect:data
    };
}

export function setPaymentEdit(isEdit){
    return {
       type:Action.set_Payment_Edit,
       isEdit:isEdit,
    };
}
