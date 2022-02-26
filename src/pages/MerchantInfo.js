import React from 'react';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import * as merchantAction from '../actions/Merchant/MerchantAction'
import * as registerApiAction from '../actions/api/RegisterApiAction'
import '../assets/css/index.css';
import 'react-dropdown/style.css';
import {validEmail,validTel} from '../helper/Regex'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jwt_decode from "jwt-decode";
import {DashboardLayout} from '../component/Layout';
import * as shopApiAction from '../actions/api/ShopApiAction'
import * as shopAction from '../actions/Shop/ShopAction'
import {Loading} from '../component/Loadind';


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
      IsRegisterDisable:true,
      firstname:"",
      lastname:"",
      email:"",
      tel:"",
      role:"",
      isEdit:false,
         isloading:false
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }
  
  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
      this.checkLoginAndAddShop();
   
  }
  checkLoginAndAddShop = async() => {
    this.setState({isloading:true});
       var merchantId = localStorage.getItem('merchantId');
      if(merchantId == null || merchantId == 'undefined'){
      this.props.history.push('/Login');
        }
          var merchant = {
       "id":  localStorage.getItem('merchantId'),
     "fullname":localStorage.getItem('merchantFullname'),
      "email":localStorage.getItem('merchantEmail'),
       "role":localStorage.getItem('merchantRole'),
     "tel": localStorage.getItem('merchantTel')
        }
      await this.props.MerchantAction.setMerchantInfo(merchant);
      await this.setState({firstname:merchant.fullname.split(" ")[0],lastname:merchant.fullname.split(" ")[1],email:merchant.email,tel:merchant.tel,role:merchant.role})
      var res = await this.props.ShopApiAction.GetShopInfo(this.props.Merchant.Merchant.id);
      if(res.data?.isError == true){
    toast.error(res.data.errorMsg);
    return;
  }
 
      if(!res.data?.shops){
      this.props.history.push('/Register-Shop');
        }
         await this.props.ShopAction.setShopInfo(res.data?.shops);
         this.setState({isloading:false});
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

selectRole = (e) =>{
  var value = e.target.value; 
    this.setState({role:value});
}

updateMerchantOnClick = async() =>{
  try
  {
    this.setState({isloading:true});
  const res = await this.props.RegisterApiAction.updateMerchant(this.state.firstname,this.state.lastname,this.state.tel);
  if(res.data.isError == true){
    toast.error(res.data.errorMsg);
    return;
  }
  var merchant = jwt_decode(res.data.token);
    var merchant = {
       "id":  localStorage.getItem('merchantId'),
     "fullname":localStorage.getItem('merchantFullname'),
      "email":localStorage.getItem('merchantEmail'),
       "role":localStorage.getItem('merchantRole'),
     "tel": localStorage.getItem('merchantTel')
        }
   await this.props.MerchantAction.setMerchantInfo(merchant);     
  await this.setState({firstname:merchant.fullname.split(" ")[0],lastname:merchant.fullname.split(" ")[1],email:merchant.email,tel:merchant.tel,role:merchant.role})
  this.setState({isloading:false});
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
  return false
  }


  
    render(){
      
      return(
         <React.Fragment>
       {this.state.isloading?
       <Loading height={this.state.height} />:null}
           <DashboardLayout merchantName={this.props.Merchant?.Merchant?.fullname}>
        <div>
           <ToastContainer />  
        <div className="form-group row" style={{height:this.state.height, backgroundColor:'white'}}>     
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
    : <div className="black-Bold-18-Text" >{this.state.firstname != null && this.state.firstname!=""?this.state.firstname:"-"}</div>
    }
     </div>
     
     <div className="form-group input col-6">
      <label for="InputLastname" className="brown-input-Text">Lastname</label>
      {this.state.isEdit?
      <input type="text" class="form-control"  id="InputLastname" value={this.state.lastname}  onChange={this.validateLastName.bind(this)}/>
    :<div className="black-Bold-18-Text" >{this.state.lastname != null && this.state.lastname != ""?this.state.lastname:"-"}</div>
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
    :<div className="black-Bold-18-Text" >{this.state.tel != null && this.state.tel != ""?this.state.tel:"-"}</div>
    }
    
     </div>
     <div className="form-group input col-6">
     <label for="InputEmail" className="brown-input-Text">Email</label>
     <div className="black-Bold-18-Text" >{this.state.email != null && this.state.email != ""?this.state.email:"-"}</div>
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
      <label for="InputRole" className="brown-input-Text">Role</label>
       <div className="black-Bold-18-Text" >{this.state.role == 2 ?"Owner":"Admin"}</div>
     </div>
     
     <div className="form-group input col-6">
     </div>
     
    </div>
         {this.state.isEdit?
    <div className="form-group" style={{padding:'40px 0px',display:'flex',justifyContent:'center',margin:'0px 15px'}}>
     
      <button  className={!this.state.IsRegisterDisable?"primary-button":"primary-button disabled"} style={{width:'250px',marginRight:'10px'}} onClick={this.updateMerchantOnClick}>Register</button>
      <button  className="secondary-button" style={{width:'250px'}} onClick={this.cancelOnClick}>Cancel</button>
     
    </div>:null
    }
    
    </div>
    
   
  
  
   </div>
      
   </div>
   </div>
   
   </DashboardLayout>
   </React.Fragment>
        
      );
    }
  }
  const mapStateToProps = state =>({
    Shop :state.Shop,
  Merchant:state.Merchant
  });
  
  const mapDispatchToProps = dispatch =>({
     ShopAction : bindActionCreators(shopAction,dispatch),
    MerchantAction : bindActionCreators(merchantAction,dispatch),
    RegisterApiAction : bindActionCreators(registerApiAction,dispatch),
     ShopApiAction : bindActionCreators(shopApiAction,dispatch)
  });
  
  
  export default withRouter(connect(mapStateToProps,mapDispatchToProps)(MerchantInfo));