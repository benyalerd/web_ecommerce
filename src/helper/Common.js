import jwt_decode from "jwt-decode";
import {x} from '../actions/api/RegisterApiAction'


export function IsNullOrEmpty(value){
    return  (!value || value == undefined || value == "" || value.length == 0);
}

export function SetToken(token){
    localStorage.setItem('token',token);
    var merchant = jwt_decode(token);
    localStorage.setItem('merchantId',merchant.id);
}



