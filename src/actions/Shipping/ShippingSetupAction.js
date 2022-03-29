import Action from '../index';


export function setAddShippingDialogOpen(data,isOpen){
    return {
       type:Action.set_Add_Shipping_Dialog_Open,
       IsAddShippingOpen:isOpen,
       shippingSelect:data
    };
}

export function setShippingEdit(isEdit){
    return {
       type:Action.set_Shipping_Edit,
       isEdit:isEdit,
    };
}