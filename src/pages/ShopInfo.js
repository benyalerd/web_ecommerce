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
      shopImageErrorText:"",
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
     var res = await this.props.ShopApiAction.GetShopInfo(this.props.Merchant.Merchant.id);
      if(res.data?.isError == true){
    toast.error(res.data.errorMsg);
    return;
  }
  var shop = res.data?.shops;
      if(!shop){
      this.props.history.push('/Register-Shop');
        }
         await this.props.ShopAction.setShopInfo(shop);
         await this.setState({shopImage:shop?.coverImage,shopName:shop?.shopName,shopEmail:shop?.email,shopTel:shop?.tel,shopAddress:shop?.address})
        this.setState({isloading:false});
      }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  
  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  CheckDisableRegisterButton = () =>{
  if(!this.IsNullOrEmpty(this.state.shopNameErrorText)|| this.IsNullOrEmpty(this.state.shopName))
  {
    return true;
  }
  return false
  }

  updateShopOnClick = async() =>{
    try
    {
        this.setState({isloading:true});
  const res = await this.props.ShopApiAction.UpdateShop(this.state.shopImage,this.state.shopName,this.state.shopEmail,this.state.shopTel,this.state.shopAddress,this.props.Merchant.Merchant.id);
  console.log("Res : " +JSON.stringify(res));
  
  if(res.data.isError === true){
    
    toast.error(res.data.errorMsg);
    return;
  }
  var shop = res.data?.shops;
  await this.props.ShopAction.setShopInfo(shop);
  await this.setState({shopImage:shop?.coverImage,shopName:shop?.shopName,shopEmail:shop?.email,shopTel:shop?.tel,shopAddress:shop?.address})
    this.setState({isloading:false});
}
catch(ex){
  toast.error("เกิดข้อผิดพลาด กรุณาติดต่อเจ้าหน้าที่");
  }
}

editOnClick = async() =>{
    var isDisable = await this.CheckDisableRegisterButton(this.state.shopName,this.state.shopNameErrorText);
    await this.setState({IsRegisterDisable:isDisable});
    await this.setState({isEdit:true})
}

cancelOnClick = async() =>{
   await this.setState({isEdit:false})
}

  IsNullOrEmpty = (value) =>{
     return  (!value || value == undefined || value == "" || value.length == 0);
  }

  validateshopName = async(e) =>{
   var value = e.target.value
    if(this.IsNullOrEmpty(value)){
      await this.setState({shopName:value,shopNameErrorText:'กรุณากรอกชื่อ'});
    }
    else{
      await this.setState({shopName:value,shopNameErrorText:''});

    }
    var isDisable = this.CheckDisableRegisterButton(value,this.state.shopNameErrorText);
    this.setState({IsRegisterDisable:isDisable});
 }

 validateshopImage = async(e) =>{
   var value = e.target.value
    if(this.IsNullOrEmpty(value)){
      await this.setState({shopImage:value,shopImageErrorText:'กรุณากรอกเลือกรูป'});
    }
    else{
      await this.setState({shopImage:value,shopImageErrorText:''});

    }
    
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
       {this.state.isloading?
       <Loading height={this.state.height} />:null}
         <DashboardLayout merchantName={this.props.Merchant?.Merchant?.fullname}>
        
          <div>
           <ToastContainer />  
        <div className="form-group row" style={{height:this.state.height,backgroundColor:'white'}} > 

       <div className={"col-12"} style={{position:'relative'}}>
        <div className="vertical-center" style={{width:'100%'}}>
        {!this.state.isEdit?
        <button  className={"primary-button"} style={{width:'150px',marginRight:'10px',right:'90px',position:'absolute',top:'-60px'}} onClick={this.editOnClick} >Edit</button>:null}
     
   <div className="brown-Bold-Topic-Text" style={{textAlign:'center'}}>Register Shop</div>
      <div className="form-group input">
       <div className="input" style={{padding:'0px',width:'150px',height:'150px',border:'1px solid lightgray',borderRadius:'5px'}}>
            <img className="imageCenter" src={this.state.shopImage!= null && this.state.shopImage != ""?this.state.shopImage: require('../assets/images/add_image.png').default} style={{margin:'37px'}}/>
       </div>
      </div>
      <div className="form-group input">
      <label for="InputShopname" className="brown-input-Text">Shop Name</label>
      {this.state.isEdit?
      <input type="text" class="form-control"  id="InputShopname" value={this.state.shopName} onChange={this.validateshopName.bind(this)}/>
     :<div className="black-Bold-18-Text" >{this.state.shopName != null && this.state.shopName != ""?this.state.shopName:"-" }</div>}</div>
      
      <div className="form-group input" >
        <label for="InputEmail" className="brown-input-Text">Email</label>
        {this.state.isEdit?
        <input type="email" class="form-control"  id="InputEmail" value={this.state.shopEmail} onChange={this.emailOnchange.bind(this)}/>
    :<div className="black-Bold-18-Text" >{this.state.shopEmail != null && this.state.shopEmail != ""?this.state.shopEmail :"-"}</div>}</div>
    
    <div className="form-group input">
      <label for="InputTel" className="brown-input-Text">Tel</label>
      {this.state.isEdit?
      <input type="text" class="form-control"  id="InputTel" value={this.state.shopTel} onChange={this.telOnchange.bind(this)}/>
     
     :<div className="black-Bold-18-Text" >{this.state.shopTel != null && this.state.shopTel !=""?this.state.shopTel:"-"}</div>}
     </div>
    

     <div className="form-group input" style={{height:'150px'}}>
      <label for="InputShopname" className="brown-input-Text">Address</label>
      {this.state.isEdit?
      <input type="text" class="form-control"  id="InputShopname" value={this.state.shopAddress} onChange={this.addressOnchange.bind(this)}/>
     :
     <div className="black-Bold-18-Text" >{this.state.shopAddress != null && this.state.shopAddress != ""?this.state.shopAddress:"-"}</div>}
     </div>
      
    
     
    
      {this.state.isEdit?
    <div className="form-group" style={{padding:'40px 0px',display:'flex',justifyContent:'center',margin:'0px 15px'}}>
     
      <button  className={!this.state.IsRegisterDisable?"primary-button":"primary-button disabled"} style={{width:'250px',marginRight:'10px'}} onClick={this.updateShopOnClick}>OK</button>
      <button  className="secondary-button" style={{width:'250px'}} onClick={this.cancelOnClick}>Cancel</button>
     
    </div>
    :null}
    
  
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
    Merchant :state.Merchant
  });
  
  const mapDispatchToProps = dispatch =>({
    ShopAction : bindActionCreators(shopAction,dispatch),
    ShopApiAction : bindActionCreators(shopApiAction,dispatch),
     MerchantAction : bindActionCreators(merchantAction,dispatch)
  });
  
  
  export default withRouter(connect(mapStateToProps,mapDispatchToProps)(AddShop));