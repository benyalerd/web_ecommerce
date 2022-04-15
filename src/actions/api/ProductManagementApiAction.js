import axios from 'axios';
export  const  GetProductList = (shopId,limit,page,searchText,sorting,sortingDesc,productTabId)=> async (dispatch)=>{
    try
    {
    const apiEndpoint = "/api/product/searchProduct";
    var token = localStorage.getItem('token');
    const request = JSON.stringify({
        "shopId":shopId,
        "limit":limit,
        "page":page,
        "productName":searchText,
        "sortingValue":sorting,
        "sortingDesc":sortingDesc,
        "tabType":productTabId
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

export  const  DeleteProduct = (productId)=> async (dispatch)=>{
    try
    {
    const apiEndpoint = "/api/product/deleteProduct";
    var token = localStorage.getItem('token');
    const request = JSON.stringify({
        "productId":productId
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

export  const  AddProduct = (request)=> async (dispatch)=>{
    try
    {
    const apiEndpoint = "/api/product/addProduct";
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

export  const  UpdateProduct = (request)=> async (dispatch)=>{
    try
    {
    const apiEndpoint = "/api/product/updateProductDetail";
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

export  const  GetProductDetail = (productId)=> async (dispatch)=>{
    try
    {
    const apiEndpoint = "/api/product/getProductDetail";
    var token = localStorage.getItem('token');
    var request = {
          "productId":productId
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