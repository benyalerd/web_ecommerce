import axios from 'axios';
export  const  AddShop = (shopImage,shopName,shopEmail,shopTel,shopAddress,merchantId)=> async (dispatch)=>{
    try
    {
    const apiEndpoint = "/api/shop/addshop";
    var token = localStorage.getItem('token');
    const request = JSON.stringify({
          "coverImg":shopImage,
        "shopName":shopName,
        "email":shopEmail,
        "tel":shopTel,
        "address":shopAddress,
        "merchantId":merchantId
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

export  const  GetShopInfo = (merchantId)=> async (dispatch)=>{
    try
    {
    const apiEndpoint = "/api/shop/getshop";
    var token = localStorage.getItem('token');
    const request = JSON.stringify({
        "merchantId":merchantId
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

export  const  UpdateShop = (shopImage,shopName,shopEmail,shopTel,shopAddress,merchantId,token)=> async (dispatch)=>{
    try
    {
    const apiEndpoint = "/api/shop/editshop";
    var token = localStorage.getItem('token');
    const request = JSON.stringify({
        "coverImg":shopImage,
        "shopName":shopName,
        "email":shopEmail,
        "tel":shopTel,
        "address":shopAddress,
        "merchantId":merchantId
    });  
    console.log("Request : "+JSON.stringify(request));  
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