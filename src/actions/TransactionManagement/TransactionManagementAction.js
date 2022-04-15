import Action from '../index';

export function setTransactionTabId(data){
    return {
       type:Action.Set_Transaction_TabId,
       transactionTabId:data
    };
}