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
    const apiEndpoint = "/api/product/deleteProductDetail";
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