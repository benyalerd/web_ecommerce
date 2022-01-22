import Action from '../index';

export function setMerchantInfo(data){
    return {
       type:Action.set_Merchant_Info,
       Merchant:data
    };
}

