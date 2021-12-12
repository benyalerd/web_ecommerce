import React from 'react';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import * as merchantAction from '../actions/Merchant/MerchantAction'
import * as registerApiAction from '../actions/api/RegisterApiAction'
import '../assets/css/index.css';
import 'react-dropdown/style.css';
import {validEmail,validTel,validPassword} from '../helper/Regex'
import { BubbleSpinLoader } from 'react-css-loaders';
import 'style.css'


class Register extends React.Component{
  constructor(props) {
    super(props);
    this.state = 
    { width: 0, 
      height: 0,
      firstnameErrorText:"",
      lastnameErrorText:"",
      emailErrorText:"",
      telErrorText:"",
      passwordErrorText:"",
      confirmPasswordErrorText:"",
      IsRegisterDisable:true,
      firstname:"",
      lastname:"",
      email:"",
      tel:"",
      password:"",
      confirmPassword:"",
      role:"1" 
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

  validateFirstName = (e) =>{
   var value = e.target.value
    if(this.IsNullOrEmpty(value)){
      this.setState({firstname:value,firstnameErrorText:'กรุณากรอกชื่อ'});
    }
    else{
      this.setState({firstname:value,firstnameErrorText:''});

    }
    var isDisable = this.CheckDisableRegisterButton();
    this.setState({IsRegisterDisable:isDisable});
 }

 validateLastName = (e) =>{
  var value = e.target.value
  if(this.IsNullOrEmpty(value)){
    this.setState({lastname:value,lastnameErrorText:'กรุณากรอกนามสกุล'});
  }
  else{
    this.setState({lastname:value,lastnameErrorText:''});
  }
  var isDisable = this.CheckDisableRegisterButton();
  this.setState({IsRegisterDisable:isDisable});
}

validateEmail = (e) =>{
  var value = e.target.value
  if(this.IsNullOrEmpty(value)){
    this.setState({email:value,emailErrorText:'กรุณากรอกอีเมล์'});
  }
  else if(!validEmail.test(value)){
    this.setState({email:value,emailErrorText:'อีเมล์ไม่ถูกต้อง'});
  }
  else{
    this.setState({email:value,emailErrorText:''});
  }
  var isDisable = this.CheckDisableRegisterButton();
  this.setState({IsRegisterDisable:isDisable});
}

validateTel = (e) =>{
  var value = e.target.value
  if(this.IsNullOrEmpty(value)){
    this.setState({tel:value,telErrorText:'กรุณากรอกเบอร์โทรศัพท์'});
  }
  else if(!validTel.test(value)){
    this.setState({tel:value,telErrorText:'เบอร์โทรศัพท์ไม่ถูกต้อง'});
  }
  else{
    this.setState({tel:value,telErrorText:''});
  }

  var isDisable = this.CheckDisableRegisterButton();
  this.setState({IsRegisterDisable:isDisable});
}

validatePasword = (e) =>{
  var value = e.target.value
  if(this.IsNullOrEmpty(value)){
    this.setState({password:value,passwordErrorText:'กรุณากรอกรหัสผ่าน'});
  }
  else if(!validPassword.test(value)){
    this.setState({password:value,passwordErrorText:'รหัสผ่านต้องเป็นตัวเลขหรือตัวอักษรขนาด 8-20 ตัว'});
  }
  else{
    this.setState({password:value,passwordErrorText:''});
  }

  var isDisable = this.CheckDisableRegisterButton();
  this.setState({IsRegisterDisable:isDisable});
}

validateConfirmPasword = (e) =>{
  var value = e.target.value
  if(this.state.password != value){
    this.setState({confirmPassword:value,confirmPasswordErrorText:'รหัสผ่านไม่ตรงกัน'});
  }
  else{
    this.setState({confirmPassword:value,confirmPasswordErrorText:''});
  }
  
  var isDisable = this.CheckDisableRegisterButton();
  this.setState({IsRegisterDisable:isDisable});
}


selectRole = (e) =>{
  var value = e.target.value; 
    this.setState({role:value});
}

registerOnClick = async() =>{
  const res = await this.props.RegisterApiAction.RegisterMerchant(this.state.firstname,this.state.lastname,this.state.password,this.state.repeat_password,this.state.email,this.state.role,this.state.tel);
  console.log(JSON.stringify(res));
}

cancelOnClick = () =>{
  this.props.history.goBack(); 
}

CheckDisableRegisterButton = () =>{
  if(this.IsNullOrEmpty(this.state.firstnameErrorText) &&
  this.IsNullOrEmpty(this.state.lastnameErrorText)&&
  this.IsNullOrEmpty(this.state.passwordErrorText)&&
  this.IsNullOrEmpty(this.state.confirmPasswordErrorText) &&
  this.IsNullOrEmpty(this.state.emailErrorText)&&
  this.IsNullOrEmpty(this.state.telErrorText)&&
  !this.IsNullOrEmpty(this.state.firstname)&&
  !this.IsNullOrEmpty(this.state.lastname)&&
  !this.IsNullOrEmpty(this.state.password)&&
  !this.IsNullOrEmpty(this.state.confirmPassword)&&
  !this.IsNullOrEmpty(this.state.email)&&
  !this.IsNullOrEmpty(this.state.tel)){
    return true;
  }
  return false;
}
  
    render(){
      
      return(
        <div className="form-group row" style={{height:this.state.height}}>       
        <div className="col-4" style={this.state.width <= 998 ?{display:'none'}:{backgroundColor:'#4f6137'}} ></div>
      <div className={this.state.width <= 998 ?"col-12":"col-8"} style={{position:'relative'}}>
        <div className="vertical-center" style={{width:'100%'}}>
      <div className="brown-Bold-Topic-Text" style={{textAlign:'center'}}>Register</div>
      <div className="form-group row">
      <div className="form-group input col-6" >
      <label for="InputFirstname" className="brown-input-Text">Firstname</label>
      <input type="text" class="form-control"  id="InputFirstname" value={this.state.firstname} onChange={this.validateFirstName.bind(this)}/>
     
     </div>
     
     <div className="form-group input col-6">
      <label for="InputLastname" className="brown-input-Text">Lastname</label>
      <input type="text" class="form-control"  id="InputLastname" value={this.state.lastname}  onChange={this.validateLastName.bind(this)}/>
     </div>
    </div>
    <div className="form-group row">
    <div className="input col-6"  style={{padding:'0px',textAlign:'center'}}>
       <div className="text-error">{this.state.firstnameErrorText}</div>
     </div>
     <div className="input col-6"  style={{padding:'0px',textAlign:'center'}}>
       <div className="text-error">{this.state.lastnameErrorText}</div>
     </div>
     </div>
    <div className="form-group row">
      <div className="form-group input col-6">
      <label for="InputTel" className="brown-input-Text">Tel</label>
      <input type="text" class="form-control"  id="InputTel" value={this.state.tel} onChange={this.validateTel.bind(this)}/>
     </div>
     <div className="form-group input col-6">
     <label for="InputEmail" className="brown-input-Text">Email</label>
        <input type="email" class="form-control"  id="InputEmail" value={this.state.email} onChange={this.validateEmail.bind(this)}/>
     </div>
    </div>
    <div className="form-group row">
    <div className="input col-6"  style={{padding:'0px',textAlign:'center'}}>
       <div className="text-error">{this.state.telErrorText}</div>
     </div>
     <div className="input col-6"  style={{padding:'0px',textAlign:'center'}}>
       <div className="text-error">{this.state.emailErrorText}</div>
     </div>
     </div>
    <div className="form-group row">
      <div className="form-group input col-6">
      <label for="InputPassword" className="brown-input-Text">Password</label>
      <input type="password" class="form-control"  id="InputPassword" value={this.state.password} onChange={this.validatePasword.bind(this)} />
     </div>
     <div className="form-group input col-6">
     <label for="InputConfirmPassword" className="brown-input-Text">Confirm Password</label>
        <input type="password" class="form-control"  id="InputConfirmPassword" value={this.state.confirmPassword} onChange={this.validateConfirmPasword.bind(this)}/>
     </div>
    </div>
    <div className="form-group row">
    <div className="input col-6"  style={{padding:'0px',textAlign:'center'}}>
       <div className="text-error">{this.state.passwordErrorText}</div>
     </div>
     <div className="input col-6"  style={{padding:'0px',textAlign:'center'}}>
       <div className="text-error">{this.state.confirmPasswordErrorText}</div>
     </div>
     </div>
    <div className="form-group row">
      <div className="form-group input col-6">
      <label for="InputRole" className="brown-input-Text">Role</label>
      <div>
      <select id="lang" onChange={this.selectRole.bind(this)} value={this.state.role} style={{width:'100%',height:'35px',border:'1px solid lightgray'}}>
                  <option value="1">Admin</option>
                  <option value="2">Owner</option>
               </select>
               </div>
     </div>
     <div className="form-group input col-6">
     </div>
    </div>
    <div className="form-group" style={{padding:'40px 0px',display:'flex',justifyContent:'center',margin:'0px 15px'}}>
     
      <button  className={!this.state.IsRegisterDisable?"primary-button":"primary-button disabled"} style={{width:'250px',marginRight:'10px'}} onClick={this.registerOnClick}>Register</button>
      <button  className="secondary-button" style={{width:'250px'}} onClick={this.cancelOnClick}>Cancel</button>
     
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
    RegisterApiAction : bindActionCreators(registerApiAction,dispatch)
  });
  
  
  export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Register));