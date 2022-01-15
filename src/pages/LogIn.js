import React from 'react';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import * as merchantAction from '../actions/Merchant/MerchantAction'
import * as loginApiAction from '../actions/api/LoginApiAction'
import '../assets/css/index.css';
import {validEmail,validPassword} from '../helper/Regex'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jwt_decode from "jwt-decode";


class LogIn extends React.Component{
  constructor(props) {
    super(props);
    this.state = 
    { width: 0, 
      height: 0,
      loginErrorText:"",   
      email:"",
      password:""
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }
  
  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }
  
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  
  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  IsNullOrEmpty = (value) =>{
    return  (!value || value == undefined || value == "" || value.length == 0);
 }

 onChangeEmail = (e) =>{
  var value = e.target.value
    this.setState({email:value,emailErrorText:''}); 
}

onChangePasword = (e) =>{
  var value = e.target.value
    this.setState({password:value});
}
  LoginOnClick = async() =>{
   if(this.IsNullOrEmpty(this.state.email) || this.IsNullOrEmpty(this.state.password) || !validEmail.test(this.state.email) || !validPassword.test(this.state.password)){
       this.setState({loginErrorText:"อีเมล์หรือรหัสผ่านไม่ถูกต้อง"})
   }
   else{
    try
    {
    const res = await this.props.LoginApiAction.Login(this.state.email,this.state.password);
    if(res.data.isError){
      toast.error(res.data.errorMsg);
      return;
    }
    var merchant = jwt_decode(res.data.token);
    localStorage.setItem('merchant',merchant);
    this.props.history.push('/MainPage');
   
  }
  catch(ex){
    toast.error("เกิดข้อผิดพลาด กรุณาติดต่อเจ้าหน้าที่");
    }
   }
  }

  RegisterLinkOnclick = () => {
    this.props.history.push('/Register');
  }
    render(){
      return(
       
        <div className="form-group row" style={{height:this.state.height}}>       
          <div className="col-4" style={this.state.width <= 998 ?{display:'none'}:{backgroundColor:'#4f6137'}} ></div>
        <div className={this.state.width <= 998 ?"col-12":"col-8"} style={{position:'relative'}}>
          <div className="vertical-center" style={{width:'100%'}}>
        <div className="brown-Bold-Topic-Text" style={{textAlign:'center'}}>Login</div>
        <div className="form-group input" >
        <label for="InputEmail" className="brown-input-Text">Email</label>
        <input type="email" class="form-control"  id="InputEmail" value={this.state.email} onChange={this.onChangeEmail.bind(this)}/>
       
      </div>
       <div className="form-group input">
       <label for="InputPassword" className="brown-input-Text">Password</label>
       <input type="password" class="form-control" id="InputPassword" value={this.state.password} onChange={this.onChangePasword.bind(this)}/>
       <label className="text-error"></label>
     </div>
     <div className="form-group input"  style={{padding:'10px 0px',textAlign:'center'}}>
       <div className="text-error">{this.state.loginErrorText}</div>
     </div>
     <div className="form-group input"  style={{width:'250px'}}>
      <button  className="primary-button" onClick={this.LoginOnClick}>Login</button>
     </div>
     <div className="form-group"  style={{padding:'10px 0px',textAlign:'center'}}>
       <a className="text-link" onClick={this.RegisterLinkOnclick} style={{cursor:'pointer'}}>Register</a>
     </div>
     </div>
     </div>
     </div>
     
      );
    }
  }
  const mapStateToProps = state =>({
    Merchant :state.Merchant
  });
  
  const mapDispatchToProps = dispatch =>({
    MerchantAction : bindActionCreators(merchantAction,dispatch),
    LoginApiAction : bindActionCreators(loginApiAction,dispatch)
  });
  
  
  export default withRouter(connect(mapStateToProps,mapDispatchToProps)(LogIn));