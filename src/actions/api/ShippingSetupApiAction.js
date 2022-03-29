import axios from 'axios';
export  const  GetShipping = (shopId)=> async (dispatch)=>{
    try
    {
    const apiEndpoint = "/api/shipping/getAllShipping";
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

export  const  DeleteShipping = (request)=> async (dispatch)=>{
    try
    {
       
    const apiEndpoint = "/api/shipping/deleteShipping";
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

export  const  InsertShipping = (request)=> async (dispatch)=>{
    try
    {
    const apiEndpoint = "/api/shipping/addShipping";
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

export  const  EditShipping = (request)=> async (dispatch)=>{
    try
    {
       
    const apiEndpoint = "/api/shipping/editShipping";
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
