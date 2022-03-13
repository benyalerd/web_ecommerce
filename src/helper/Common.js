import jwt_decode from "jwt-decode";

export function IsNullOrEmpty(value){
    return  (!value || value == undefined || value == "" || value.length == 0);
}

export function SetToken(token){
    localStorage.setItem('token',token);
    var merchant = jwt_decode(token);
    localStorage.setItem('merchantId',merchant.id);
    localStorage.setItem('merchantFullname',merchant.fullname);
    localStorage.setItem('merchantEmail',merchant.email);
    localStorage.setItem('merchantRole',merchant.role);
    localStorage.setItem('merchantTel',merchant.tel);
}

export  function GetMerchantFromToken(){
    var merchant = {
        "id":  localStorage.getItem('merchantId'),
        "fullname":localStorage.getItem('merchantFullname'),
        "email":localStorage.getItem('merchantEmail'),
        "role":localStorage.getItem('merchantRole'),
        "tel": localStorage.getItem('merchantTel')
        }

    return merchant;
}