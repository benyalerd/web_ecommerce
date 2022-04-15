import axios from 'axios';
export  const  GetTransactionList = (shopId,limit,page,searchText,sorting,sortingDesc,transactionTabId)=> async (dispatch)=>{
    try
    {
    const apiEndpoint = "/api/transaction/searchTransaction";
    var token = localStorage.getItem('token');
    const request = JSON.stringify({
        "shopId":shopId,
        "limit":limit,
        "page":page,
        "orderCode":searchText,
        "sortingValue":sorting,
        "sortingDesc":sortingDesc,
        "tabType":transactionTabId
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

export  const  GetTransactionDetail = (transactionId)=> async (dispatch)=>{
    try
    {
    const apiEndpoint = "/api/transaction/getTransactionDetail";
    var token = localStorage.getItem('token');
    var request = {
          "transactionId":transactionId
    };
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

export  const  UpdateTransaction = (request)=> async (dispatch)=>{
    try
    {
    const apiEndpoint = "/api/transaction/updateTransactionDetail";
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