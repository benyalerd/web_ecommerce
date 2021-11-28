import Action from '../index';

export function setUserInfo(data){
    return {
       type:Action.set_user_info,
       UserInfo:data
    };
}