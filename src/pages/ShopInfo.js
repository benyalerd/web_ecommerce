import React from 'react';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import * as shopAction from '../actions/Shop/ShopAction'
import * as shopApiAction from '../actions/api/ShopApiAction'
import '../assets/css/index.css';
import 'react-dropdown/style.css';
import { ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {DashboardLayout} from '../component/Layout';
import * as merchantAction from '../actions/Merchant/MerchantAction'
import {Loading} from '../component/Loadind';
import {IsNullOrEmpty} from '../helper/Common';
import AlertDialog from '../component/dialog/AlertDialog';
import * as alertAction from '../actions/Alert/AlertAction';
import ConfirmAlertDialog from '../component/dialog/ConfirmAlertDialog';
import * as registerApiAction from '../actions/api/RegisterApiAction'
import $ from 'jquery';

class AddShop extends React.Component{
  constructor(props) {
    super(props);
    this.state = 
    { width: 0, 
      height: 0,
      shopImage:"",
      shopName:"",
      shopEmail:"",
      shopTel:"",
      shopAddress:"",
      shopNameErrorText:"",
      IsRegisterDisable:true,
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
      await this.setState({isloading:true});
      var merchantId = localStorage.getItem('merchantId');
      if(!merchantId){
      this.props.history.push('/Login');
      }
      var merchantRes = await this.props.RegisterApiAction.getMerchant();  
      if(merchantRes?.data?.isError == true){
        this.props.AlertAction.setAlert(2,merchantRes?.data?.errorMsg,true);
        await this.setState({isloading:false});
        return;
      } 
      var merchant = merchantRes?.data 
      await this.props.MerchantAction.setMerchantInfo(merchant);
      var res = await this.props.ShopApiAction.GetShopInfo(this.props.Merchant.Merchant.id);
      if(res?.data?.isError == true){
        this.props.AlertAction.setAlert(2,res?.data?.errorMsg,true);
      await this.setState({isloading:false});
      return;
  }

      var shop = res?.data?.shops;
      if(!shop){
        this.props.history.push('/Register-Shop');
      }
         await this.props.ShopAction.setShopInfo(shop);
         await this.setState({shopImage:shop?.coverImg,shopName:shop?.shopName,shopEmail:shop?.email,shopTel:shop?.tel,shopAddress:shop?.address})
         await this.setState({isloading:false});
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  
  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  CheckDisableRegisterButton = () =>{
  if(!IsNullOrEmpty(this.state.shopNameErrorText)|| IsNullOrEmpty(this.state.shopName))
  {
    return true;
  }
  return false
  }

  selectShopImage = async(e) =>{
    var value = e.target.files
    if (value.length != 0){
     e.preventDefault();
     let currentfile = e.target.files[0];
     let currentfileType = currentfile.type;
     let currentfileSize = currentfile.size;
     let resultSize = this.validateSize(currentfileSize);
     let resultType = this.validateType(currentfileType);
     if (!resultSize || !resultType) {
         return;
     }
      
     var base64 = await this.getBase64(currentfile);
     await this.setState({shopImage:base64});
     
    }
  }
 
  validateSize(e) {
   let result = false;
   const limitSize = 2097152; 
   const size = e;
   if (size < limitSize) {
       result = true;
   } else {
       result = false;
       this.props.AlertAction.setAlert(2,"ขนาดรูปภาพไม่ถูกต้อง",true);
   }
   return result;
 }
 
 validateType(e) {
   let result = false;
   const typejpeg = "image/jpeg";
   const typepng = "image/png";
   const currentType = e;
   if (currentType === typejpeg || currentType === typepng) {
       result = true;
   } else {
       result = false;
       this.props.AlertAction.setAlert(2,"ประเภทรูปภาพไม่ถูกต้อง",true);
   }
   return result;
 }
 
 
  getBase64(file) {
   return new Promise((resolve, reject) => {
       const reader = new FileReader();
       reader.onload = (event) => {
           resolve(event.target.result);
       };
       reader.onerror = (err) => {
           reject(err);
       };
       reader.readAsDataURL(file);
   });
 }
 
 deleteImage = async(e) =>{ 
   e.preventDefault();
   await this.setState({shopImage:""});
 }
 
  addImage = async() => {
   
   $(document).ready(async function () {
       try {
           $('#images').trigger('click')
       } catch (error) {
         toast.error("เกิดข้อผิดพลาด กรุณาติดต่อเจ้าหน้าที่");
       }
   });
 }

  updateShopOnClick = async() =>{
    try
    {
      await this.props.AlertAction.setConfirmAlert('แก้ไขข้อมูลร้านค้า',this.updateShopApi.bind(this),true);
       
    }
    catch(ex){
      toast.error("เกิดข้อผิดพลาด กรุณาติดต่อเจ้าหน้าที่");
    }
   await this.setState({isloading:false});
  }

updateShopApi = async() =>{
  
      await this.setState({isloading:true});
      const res = await this.props.ShopApiAction.UpdateShop(this.state.shopImage,this.state.shopName,this.state.shopEmail,this.state.shopTel,this.state.shopAddress,this.props.Merchant.Merchant.id);

      if(res?.data?.isError === true){    
        this.props.AlertAction.setAlert(2,res?.data?.errorMsg,true);
      await this.setState({isloading:false});
      return;
  }
  var shop = res?.data;
  await this.props.ShopAction.setShopInfo(shop);
  await this.setState({shopImage:shop?.coverImg,shopName:shop?.shopName,shopEmail:shop?.email,shopTel:shop?.tel,shopAddress:shop?.address})
  await this.setState({isloading:false,isEdit:false});
  this.props.AlertAction.setAlert(1,"ทำรายการสำเร็จ",true);
}

editOnClick = async() =>{
    var isDisable = await this.CheckDisableRegisterButton();
    await this.setState({IsRegisterDisable:isDisable});
    await this.setState({isEdit:true})
}

cancelOnClick = async() =>{
   await this.setState({isEdit:false})
}

  validateshopName = async(e) =>{
   var value = e.target.value
    if(IsNullOrEmpty(value)){
      await this.setState({shopName:value,shopNameErrorText:'กรุณากรอกชื่อ'});
    }
    else{
      await this.setState({shopName:value,shopNameErrorText:''});

    }
    var isDisable = this.CheckDisableRegisterButton();
    this.setState({IsRegisterDisable:isDisable});
 }



 emailOnchange = async(e) =>{
   var value = e.target.value
   await this.setState({shopEmail:value});
   
 }
 
 telOnchange = async(e) =>{
   var value = e.target.value
   await this.setState({shopTel:value});
   
 }

 addressOnchange = async(e) =>{
   var value = e.target.value
   await this.setState({shopAddress:value});
   
 }
    render(){
      return(
         <React.Fragment>
             <AlertDialog/>
             <ConfirmAlertDialog/>
       <Loading height={this.state.height}  onLoading={this.state.isloading}/>
         <DashboardLayout merchantName={this.props.Merchant?.Merchant?.name}  shopId={this.props?.Shop?.Shop?._id}>       
         <React.Fragment>
           <ToastContainer />  
        <div className="form-group row" style={{height:this.state.height,backgroundColor:'white'}} > 

       <div className={"col-12"} style={{position:'relative'}}>

        <div className="vertical-center" style={{width:'100%'}}>

           {/*Detail View*/}  
            {/*Edit Button*/} 
        {!this.state.isEdit?

       
        <button  className={"primary-button"} style={{width:'150px',marginRight:'10px',right:'90px',position:'absolute',top:'-60px'}} onClick={this.editOnClick} >Edit</button>:null}
     
     {/*Register Shop*/} 
   <div className="brown-Bold-Topic-Text" style={{textAlign:'center'}}>Shop Information</div>

 {/*Shop Image*/} 

       {/*Image Shop*/}
       <div className="form-group input">
      <input type="file" id="images" name="images" style={{ display: 'none' }} accept="image/*" onChange={this.selectShopImage.bind(this)} onClick={(event) => { event.target.value = null }}/>
       <div className="input" style={this.state.shopImage?{position:'relative',padding:'0px',width:'150px',height:'150px',border:'1px solid lightgray',borderRadius:'5px',cursor:'pointer'}:{padding:'0px',width:'150px',height:'150px',border:'1px solid lightgray',borderRadius:'5px',cursor:'pointer'}} onClick={()=> this.state.isEdit? this.addImage() : null} >
            <img className={this.state.shopImage?"vertical-center":"imageCenter"} src={this.state.shopImage?this.state.shopImage : require('../assets/images/add_image.png').default} style={this.state.shopImage?{}:{margin:'37px'}}/>
            {this.state.isEdit? this.state.shopImage ?  <button style={{ display: 'inline', zIndex: '1'}}><img onClick={this.deleteImage.bind(this)} style={{position: 'absolute',width: '25px',height: '25px',right: '0px',top: '3px'}} src={require('../assets/images/crossIcon.png').default} /></button> : null : null}
       </div>
       
      </div>

 {/*Shop Name*/} 
      <div className="form-group input">
      <label for="InputShopname" className="brown-input-Text">Shop Name</label>
      {this.state.isEdit?
      <input type="text" class="form-control"  id="InputShopname" value={this.state.shopName} onChange={this.validateshopName.bind(this)}/>
     :<div className="black-Bold-18-Text" >{this.state.shopName != null && this.state.shopName != ""?this.state.shopName:"-" }</div>}</div>
      
       {/*Shop Email*/} 
      <div className="form-group input" >
        <label for="InputEmail" className="brown-input-Text">Email</label>
        {this.state.isEdit?
        <input type="email" class="form-control"  id="InputEmail" value={this.state.shopEmail} onChange={this.emailOnchange.bind(this)}/>
    :<div className="black-Bold-18-Text" >{this.state.shopEmail != null && this.state.shopEmail != ""?this.state.shopEmail :"-"}</div>}</div>
    
     {/*Shop Tel*/} 
    <div className="form-group input">
      <label for="InputTel" className="brown-input-Text">Tel</label>
      {this.state.isEdit?
      <input type="text" class="form-control"  id="InputTel" value={this.state.shopTel} onChange={this.telOnchange.bind(this)}/>   
     :<div className="black-Bold-18-Text" >{this.state.shopTel != null && this.state.shopTel !=""?this.state.shopTel:"-"}</div>}
     </div>
    
 {/*Shop Address*/} 
     <div className="form-group input" style={{height:'150px'}}>
      <label for="InputShopname" className="brown-input-Text">Address</label>
      {this.state.isEdit?
      <input type="text" class="form-control"  id="InputShopname" value={this.state.shopAddress} onChange={this.addressOnchange.bind(this)}/>
     :
     <div className="black-Bold-18-Text" >{this.state.shopAddress != null && this.state.shopAddress != ""?this.state.shopAddress:"-"}</div>}
     </div>
      
     {/*Button*/}    
      {this.state.isEdit?
    <div className="form-group" style={{padding:'40px 0px',display:'flex',justifyContent:'center',margin:'0px 15px'}}>    
      <button  className={!this.state.IsRegisterDisable?"primary-button":"primary-button disabled"} style={{width:'250px',marginRight:'10px'}} onClick={this.updateShopOnClick}>Update</button>
      <button  className="secondary-button" style={{width:'250px'}} onClick={this.cancelOnClick}>Cancel</button>
     
    </div>
    :null}
     
   </div>
   </div>  
   </div>
   </React.Fragment>
   </DashboardLayout>
   </React.Fragment>
      );
    }
  }
  const mapStateToProps = state =>({
    Shop :state.Shop,
    Merchant :state.Merchant
  });
  
  const mapDispatchToProps = dispatch =>({
    ShopAction : bindActionCreators(shopAction,dispatch),
    ShopApiAction : bindActionCreators(shopApiAction,dispatch),
     MerchantAction : bindActionCreators(merchantAction,dispatch),
     AlertAction : bindActionCreators(alertAction,dispatch),
     RegisterApiAction : bindActionCreators(registerApiAction,dispatch),
  });
  
  
  export default withRouter(connect(mapStateToProps,mapDispatchToProps)(AddShop));