import axios from 'axios';
export  const  Login = (email,password)=> async (dispatch)=>{
    try
    {
    const apiEndpoint = "/api/login";
    const request = JSON.stringify({
        "password":password,
        "email":email
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