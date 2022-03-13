import axios from 'axios';
export  const  GetMasterData = (type)=> async (dispatch)=>{
    try
    {
    const apiEndpoint = "/api/master/getMasterData";
    var token = localStorage.getItem('token');
    const request = JSON.stringify({
        "type":type
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