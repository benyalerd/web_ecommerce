import axios from 'axios';
export  const  InsertPayment = (request)=> async (dispatch)=>{
    try
    {
    const apiEndpoint = "/api/payment/addPayment";
    var token = localStorage.getItem('token');
        const data = axios.post(apiEndpoint,request,{
            headers:{
                "Content-Type":"application/json",
                "x-auth-token":token
            }
        });
        return data;
    }
    catch(error){
        throw error;
    }
}

export  const  GetPayment = (shopId)=> async (dispatch)=>{
    try
    {
    const apiEndpoint = "/api/payment/getAllPayment";
    var token = localStorage.getItem('token');
    const request = JSON.stringify({
        "shopId":shopId
    });  
        const data = axios.post(apiEndpoint,request,{
            headers:{
                "Content-Type":"application/json",
                "x-auth-token":token
            }
        });
        return data;
    }
    catch(error){
        throw error;
    }
}

export  const  EditPayment = (request)=> async (dispatch)=>{
    try
    {
       
    const apiEndpoint = "/api/payment/editPayment";
    var token = localStorage.getItem('token'); 
        const data = axios.post(apiEndpoint,request,{
            headers:{
                "Content-Type":"application/json",
                "x-auth-token":token
            }
        });
       
        return data;
    }
    catch(error){
        throw error;
    }
}

export  const  DeletePayment = (request)=> async (dispatch)=>{
    try
    {
       
    const apiEndpoint = "/api/payment/deletePayment";
    var token = localStorage.getItem('token'); 
        const data = axios.post(apiEndpoint,request,{
            headers:{
                "Content-Type":"application/json",
                "x-auth-token":token
            }
        });
       
        return data;
    }
    catch(error){
        throw error;
    }
}

