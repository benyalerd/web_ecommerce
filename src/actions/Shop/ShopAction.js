import Action from '../index';

export function setShopInfo(data){
    return {
       type:Action.set_Shop_Info,
       Shop:data
    };
}

