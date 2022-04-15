import Action from '../index';

export function setProductTabId(data){
    return {
       type:Action.Set_Product_TabId,
       productTabId:data
    };
}

