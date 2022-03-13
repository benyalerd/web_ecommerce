 export function SetAccountNumberDisplay(accountNo){
    if(accountNo){
    if(accountNo.length == 10)
    {
        return accountNo.substring(0, 3) +"-"+accountNo.substring(3, 4) +"-"+accountNo.substring(4, 9)+"-"+accountNo.substring(9, 10);
    }
    else if(accountNo.length >= 5){
        return accountNo.substring(0, 3) +"-"+accountNo.substring(3, 4) +"-"+accountNo.substring(4, accountNo.length);
    }
    else if(accountNo.length == 4){
        return accountNo.substring(0, 3) +"-"+accountNo.substring(3, 4)
    }
    else{
        return accountNo
    }

}
    return "";
}