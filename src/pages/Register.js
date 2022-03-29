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
import {Loading} from '../component/Loadind';
import {IsNullOrEmpty,SetToken} from '../helper/Common';
import AlertDialog from '../component/dialog/AlertDialog';
import * as alertAction from '../actions/Alert/AlertAction';


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
      role:"1",
         isloading:false

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

  validateFirstName = async(e) =>{
   var value = e.target.value
    if(IsNullOrEmpty(value)){
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
  if(IsNullOrEmpty(value)){
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
  if(IsNullOrEmpty(value)){
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
  if(IsNullOrEmpty(value)){
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
  if(IsNullOrEmpty(value)){
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
      await this.setState({isloading:true});
      const res = await this.props.RegisterApiAction.RegisterMerchant(this.state.firstname,this.state.lastname,this.state.password,this.state.repeat_password,this.state.email,this.state.role,this.state.tel);
      if(res?.data?.isError == true){
        this.props.AlertAction.setAlert(2,res?.data?.errorMsg,true);
      await this.setState({isloading:false});
      return;
  }

  await SetToken(res?.data?.token);
  this.props.history.push('/Register-Shop');
}
catch(ex){
  toast.error("เกิดข้อผิดพลาด กรุณาติดต่อเจ้าหน้าที่");
  }
  await this.setState({isloading:false});
}

cancelOnClick = () =>{
  this.props.history.push('/Login');
}

CheckDisableRegisterButton = () =>{
  if(!IsNullOrEmpty(this.state.firstnameErrorText)|| IsNullOrEmpty(this.state.firstname))
  {
    return true;
  }
  if(!IsNullOrEmpty(this.state.lastnameErrorText)|| IsNullOrEmpty(this.state.lastname))
  {
    return true;
  }
  if(!IsNullOrEmpty(this.state.telErrorText)|| IsNullOrEmpty(this.state.tel))
  {
    return true;
  }
  if(!IsNullOrEmpty(this.state.emailErrorText)|| IsNullOrEmpty(this.state.email))
  {
    return true;
  }
  if(!IsNullOrEmpty(this.state.passwordErrorText)|| IsNullOrEmpty(this.state.password))
  {
    return true;
  }
  if(!IsNullOrEmpty(this.state.confirmPasswordErrorText)|| IsNullOrEmpty(this.state.confirmPassword))
  {
    return true;
  }
  return false
  }

    render(){
      
      return(
       <React.Fragment>
           <AlertDialog/>
       <Loading height={this.state.height}  onLoading={this.state.isloading} />
       <React.Fragment>
        <ToastContainer />  
        <div className="form-group row" style={{height:this.state.height}}>     
        {/*Background Side*/} 
        <div className="col-4" style={this.state.width <= 998 ?{display:'none'}:{backgroundColor:'#4f6137'}} ></div>
        
         {/*Text Box Side*/}
        <div className={this.state.width <= 998 ?"col-12":"col-8"} style={{position:'relative'}}>

        <div className="vertical-center" style={{width:'100%'}}>

        {/*Register*/}
        <div className="brown-Bold-Topic-Text" style={{textAlign:'center'}}>Register</div>

      <div className="form-group row">

        {/*Firstname*/}
      <div className="form-group input col-6" >
      <label for="InputFirstname" className="brown-input-Text">Firstname</label>
      <input type="text" class="form-control"  id="InputFirstname" value={this.state.firstname} onChange={this.validateFirstName.bind(this)}/>    
     </div>
     
      {/*Lastname*/}
     <div className="form-group input col-6">
      <label for="InputLastname" className="brown-input-Text">Lastname</label>
      <input type="text" class="form-control"  id="InputLastname" value={this.state.lastname}  onChange={this.validateLastName.bind(this)}/>
     </div>
    </div>

     {/*Error Text*/}
    <div className="form-group row">
    <div className="input col-6"  style={{padding:'0px',textAlign:'center'}}>
       <div className="text-error">{this.state.firstnameErrorText}</div>
     </div>
     <div className="input col-6"  style={{padding:'0px',textAlign:'center'}}>
       <div className="text-error">{this.state.lastnameErrorText}</div>
     </div>
     </div>

     
    <div className="form-group row">
       {/*Tel*/}
      <div className="form-group input col-6">
      <label for="InputTel" className="brown-input-Text">Tel</label>
      <input type="text" class="form-control" maxLength={10}  id="InputTel" value={this.state.tel} onChange={this.validateTel.bind(this)}/>
     </div>

      {/*Email*/}
     <div className="form-group input col-6">
     <label for="InputEmail" className="brown-input-Text">Email</label>
        <input type="email" class="form-control"  id="InputEmail" value={this.state.email} onChange={this.validateEmail.bind(this)}/>
     </div>
    </div>

     {/*Error Text*/}
    <div className="form-group row">
    <div className="input col-6"  style={{padding:'0px',textAlign:'center'}}>
       <div className="text-error">{this.state.telErrorText}</div>
     </div>
     <div className="input col-6"  style={{padding:'0px',textAlign:'center'}}>
       <div className="text-error">{this.state.emailErrorText}</div>
     </div>
     </div>


    <div className="form-group row">

       {/*Password*/}
      <div className="form-group input col-6">
      <label for="InputPassword" className="brown-input-Text">Password</label>
      <input type="password" class="form-control"  id="InputPassword" value={this.state.password} onChange={this.validatePasword.bind(this)} />
     </div>

      {/*Confirm Password*/}
     <div className="form-group input col-6">
     <label for="InputConfirmPassword" className="brown-input-Text">Confirm Password</label>
        <input type="password" class="form-control"  id="InputConfirmPassword" value={this.state.confirmPassword} onChange={this.validateConfirmPasword.bind(this)}/>
     </div>
    </div>

     {/*Error Text*/}
    <div className="form-group row">
    <div className="input col-6"  style={{padding:'0px',textAlign:'center'}}>
       <div className="text-error">{this.state.passwordErrorText}</div>
     </div>
     <div className="input col-6"  style={{padding:'0px',textAlign:'center'}}>
       <div className="text-error">{this.state.confirmPasswordErrorText}</div>
     </div>
     </div>


    <div className="form-group row">
 {/*Role*/}
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

     {/*Button*/}
    <div className="form-group" style={{padding:'40px 0px',display:'flex',justifyContent:'center',margin:'0px 15px'}}>
     
      <button  className={!this.state.IsRegisterDisable?"primary-button":"primary-button disabled"} style={{width:'250px',marginRight:'10px'}} onClick={this.registerOnClick}>Register</button>
      <button  className="secondary-button" style={{width:'250px'}} onClick={this.cancelOnClick}>Cancel</button>
     
    </div>
    
  
  
   </div>
   </div>
   </div>
   </React.Fragment>
   </React.Fragment>
      );
    }
  }
  const mapStateToProps = state =>({
    Merchant :state.Merchant
  });
  
  const mapDispatchToProps = dispatch =>({
    MerchantAction : bindActionCreators(merchantAction,dispatch),
    RegisterApiAction : bindActionCreators(registerApiAction,dispatch),
    AlertAction : bindActionCreators(alertAction,dispatch),
  });
  
  
  export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Register));