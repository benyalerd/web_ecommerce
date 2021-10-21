import Action from '../index';

export function setTest(data){
    return {
       type:Action.set_test_text,
       testText:data
    };
}