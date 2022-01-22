import React from 'react';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import * as merchantAction from '../actions/Merchant/MerchantAction'
import * as registerApiAction from '../actions/api/RegisterApiAction'
import '../assets/css/index.css';
import 'react-dropdown/style.css';
import {validEmail,validTel,validPassword} from '../helper/Regex'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jwt_decode from "jwt-decode";
import {DashboardLayout} from '../component/Layout';


class MerchantInfo extends React.Component{
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
      role:"1",
      isEdit:false
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }
  
  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    //check this.prop merchant
    //no  - call api + setup
    //set value from this.prop to state
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

  validateFirstName = async(e) =>{
   var value = e.target.value
    if(this.IsNullOrEmpty(value)){
      await this.setState({firstname:value,firstnameErrorText:'กรุณากรอกชื่อ'});
    }
    else{
      await this.setState({firstname:value,firstnameErrorText:''});

    }
    var isDisable = this.CheckDisableRegisterButton(value,this.state.firstnameErrorText);
    this.setState({IsRegisterDisable:isDisable});
 }

 validateLastName = async(e) =>{
  var value = e.target.value
  if(this.IsNullOrEmpty(value)){
    await this.setState({lastname:value,lastnameErrorText:'กรุณากรอกนามสกุล'});
  }
  else{
    await this.setState({lastname:value,lastnameErrorText:''});
  }
  var isDisable = this.CheckDisableRegisterButton(value,this.state.lastnameErrorText);
  this.setState({IsRegisterDisable:isDisable});
}

validateEmail = async(e) =>{
  var value = e.target.value
  if(this.IsNullOrEmpty(value)){
    await this.setState({email:value,emailErrorText:'กรุณากรอกอีเมล์'});
  }
  else if(!validEmail.test(value)){
    await this.setState({email:value,emailErrorText:'อีเมล์ไม่ถูกต้อง'});
  }
  else{
    await this.setState({email:value,emailErrorText:''});
  }
  var isDisable = this.CheckDisableRegisterButton(value,this.state.emailErrorText);
  this.setState({IsRegisterDisable:isDisable});
}

validateTel = async(e) =>{
  var value = e.target.value
  if(this.IsNullOrEmpty(value)){
    await this.setState({tel:value,telErrorText:'กรุณากรอกเบอร์โทรศัพท์'});
  }
  else if(!validTel.test(value)){
    await this.setState({tel:value,telErrorText:'เบอร์โทรศัพท์ไม่ถูกต้อง'});
  }
  else{
    await this.setState({tel:value,telErrorText:''});
  }

  var isDisable = this.CheckDisableRegisterButton(value,this.state.telErrorText);
  this.setState({IsRegisterDisable:isDisable});
}

validatePasword = async(e) =>{
  var value = e.target.value
  if(this.IsNullOrEmpty(value)){
    await this.setState({password:value,passwordErrorText:'กรุณากรอกรหัสผ่าน'});
  }
  else if(!validPassword.test(value)){
    await this.setState({password:value,passwordErrorText:'รหัสผ่านต้องเป็นตัวเลขหรือตัวอักษรขนาด 8-20 ตัว'});
  }
  else{
    await this.setState({password:value,passwordErrorText:''});
  }

  var isDisable = this.CheckDisableRegisterButton(value,this.state.passwordErrorText);
  this.setState({IsRegisterDisable:isDisable});
}

validateConfirmPasword = async(e) =>{
  var value = e.target.value
  if(this.state.password != value){
    await this.setState({confirmPassword:value,confirmPasswordErrorText:'รหัสผ่านไม่ตรงกัน'});
  }
  else{
    await this.setState({confirmPassword:value,confirmPasswordErrorText:''});
  }
  
  var isDisable = this.CheckDisableRegisterButton(value,this.state.confirmPasswordErrorText);
  this.setState({IsRegisterDisable:isDisable});
}


selectRole = (e) =>{
  var value = e.target.value; 
    this.setState({role:value});
}

registerOnClick = async() =>{
  try
  {
  const res = await this.props.RegisterApiAction.RegisterMerchant(this.state.firstname,this.state.lastname,this.state.password,this.state.repeat_password,this.state.email,this.state.role,this.state.tel);
  if(res.data.isError){
    toast.error(res.data.errorMsg);
    return;
  }
  var merchant = jwt_decode(res.data.token);
  localStorage.setItem('merchant',merchant);
  this.props.history.push('/Register-Shop');
}


catch(ex){
  toast.error("เกิดข้อผิดพลาด กรุณาติดต่อเจ้าหน้าที่");
  }
}

editOnClick = async() =>{
    await this.setState({isEdit:true})
}

cancelOnClick = async() =>{
   await this.setState({isEdit:false})
}

CheckDisableRegisterButton = () =>{
  if(!this.IsNullOrEmpty(this.state.firstnameErrorText)|| this.IsNullOrEmpty(this.state.firstname))
  {
    return true;
  }
  if(!this.IsNullOrEmpty(this.state.lastnameErrorText)|| this.IsNullOrEmpty(this.state.lastname))
  {
    return true;
  }
  if(!this.IsNullOrEmpty(this.state.telErrorText)|| this.IsNullOrEmpty(this.state.tel))
  {
    return true;
  }
  if(!this.IsNullOrEmpty(this.state.emailErrorText)|| this.IsNullOrEmpty(this.state.email))
  {
    return true;
  }
  if(!this.IsNullOrEmpty(this.state.passwordErrorText)|| this.IsNullOrEmpty(this.state.password))
  {
    return true;
  }
  if(!this.IsNullOrEmpty(this.state.confirmPasswordErrorText)|| this.IsNullOrEmpty(this.state.confirmPassword))
  {
    return true;
  }
  return false
  }


  
    render(){
      
      return(
           <DashboardLayout>
        <div>
           <ToastContainer />  
        <div className="form-group row" style={{height:this.state.height}}>     
       
      <div className={"col-12"} style={{position:'relative'}}>
        <div className="vertical-center" style={{width:'100%'}}>
        {!this.state.isEdit?
        <button  className={"primary-button"} style={{width:'150px',marginRight:'10px',right:'90px',position:'absolute',top:'-60px'}} onClick={this.editOnClick} >Edit</button>:null}
      <div className="brown-Bold-Topic-Text" style={{textAlign:'center'}}>Register</div>
      <div className="form-group row">
      <div className="form-group input col-6" >
      <label for="InputFirstname" className="brown-input-Text">Firstname</label>
      {this.state.isEdit?
      <input type="text" class="form-control"  id="InputFirstname" value={this.state.firstname} onChange={this.validateFirstName.bind(this)}/>
    : <div className="col-2 black-Bold-18-Text" >{this.state.firstname}</div>
    }
     </div>
     
     <div className="form-group input col-6">
      <label for="InputLastname" className="brown-input-Text">Lastname</label>
      {this.state.isEdit?
      <input type="text" class="form-control"  id="InputLastname" value={this.state.lastname}  onChange={this.validateLastName.bind(this)}/>
    :<div className="col-2 black-Bold-18-Text" >{this.state.lastname}</div>
    }
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
      {this.state.isEdit?
      <input type="text" class="form-control" maxLength={10}  id="InputTel" value={this.state.tel} onChange={this.validateTel.bind(this)}/>
    :<div className="col-2 black-Bold-18-Text" >{this.state.tel}</div>
    }
    
     </div>
     <div className="form-group input col-6">
     <label for="InputEmail" className="brown-input-Text">Email</label>
       {this.state.isEdit?
        <input type="email" class="form-control"  id="InputEmail" value={this.state.email} onChange={this.validateEmail.bind(this)}/>
    :<div className="col-2 black-Bold-18-Text" >{this.state.email}</div>
    }
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
      {this.state.isEdit?
      <input type="password" class="form-control"  id="InputPassword" value={this.state.password} onChange={this.validatePasword.bind(this)} />
     :<div className="col-2 black-Bold-18-Text" >{this.state.password}</div>
    }
     </div>
     <div className="form-group input col-6">
     <label for="InputConfirmPassword" className="brown-input-Text">Confirm Password</label>
     {this.state.isEdit?
        <input type="password" class="form-control"  id="InputConfirmPassword" value={this.state.confirmPassword} onChange={this.validateConfirmPasword.bind(this)}/>
    :<div className="col-2 black-Bold-18-Text" >{this.state.firstname}</div>
    }
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
      {this.state.isEdit?
      <div>
      <select id="lang" onChange={this.selectRole.bind(this)} value={this.state.role} style={{width:'100%',height:'35px',border:'1px solid lightgray'}}>
                  <option value="1">Admin</option>
                  <option value="2">Owner</option>
               </select>
               </div>
:<div className="col-2 black-Bold-18-Text" >{this.state.role == "1"?"Admin":"Owner"}</div>
    }
     </div>
     
     <div className="form-group input col-6">
     </div>
    </div>
     {this.state.isEdit?
    <div className="form-group" style={{padding:'40px 0px',display:'flex',justifyContent:'center',margin:'0px 15px'}}>
     
      <button  className={!this.state.IsRegisterDisable?"primary-button":"primary-button disabled"} style={{width:'250px',marginRight:'10px'}} onClick={this.registerOnClick}>Register</button>
      <button  className="secondary-button" style={{width:'250px'}} onClick={this.cancelOnClick}>Cancel</button>
     
    </div>:null
    }
    
  
  
   </div>
   </div>
   </div>
   </div>
   </DashboardLayout>
        
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
  
  
  export default withRouter(connect(mapStateToProps,mapDispatchToProps)(MerchantInfo));