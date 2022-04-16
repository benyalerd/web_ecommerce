export const validEmail = new RegExp(
    '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'
 );

 export const validTel = new RegExp(
    '^((\\+66|0)(\\d{1,2}\\-?\\d{3}\\-?\\d{3,4}))$'
 );

 export const validPassword = new RegExp(
    '^[a-zA-Z0-9]{8,20}$'
 );

 export const onlyNumber = new RegExp(
   '^[0-9]+$'
);

export const onlyNumberAndEngText = new RegExp(
   '^[a-zA-Z0-9]+$'
);