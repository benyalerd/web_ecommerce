import axios from 'axios';
export  const  RegisterMerchant = (name,lastname,password,repeat_password,email,role,tel)=> async (dispatch)=>{
    try
    {
    const apiEndpoint = "/api/merchant/register";
    const request = JSON.stringify({
        "name":name,
        "lastname":lastname,
        "password":password,
        "repeat_password":repeat_password,
        "email":email,
        "role":role,
        "tel":tel
    });
        const data = axios.post(apiEndpoint,request,{
            headers:{
                "Content-Type":"application/json"
            }
        });
        return data;
    }
    catch(error){
        throw error;
    }
}



