import React from 'react';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import * as shopAction from '../actions/Shop/ShopAction'
import * as shopApiAction from '../actions/api/ShopApiAction'
import '../assets/css/index.css';
import 'react-dropdown/style.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Loading} from '../component/Loadind';
import {IsNullOrEmpty} from '../helper/Common';
import AlertDialog from '../component/dialog/AlertDialog';
import * as alertAction from '../actions/Alert/AlertAction';


class AddShop extends React.Component{
  constructor(props) {
    super(props);
    this.state = 
    { 
      width: 0, 
      height: 0,
      shopImage:"",
      shopName:"",
      shopEmail:"",
      shopTel:"",
      shopAddress:"",
      shopNameErrorText:"",
      shopImageErrorText:"",
      IsRegisterDisable:true,
      merchantId:"",
      isloading:false     
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }
  
  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    this.checkLogin();
  }
  
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  
  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  checkLogin = async() =>{
     var merchantId = localStorage.getItem('merchantId');
      if(!merchantId){
      this.props.history.push('/Login');
      }
      await this.setState({merchantId:merchantId});
  }

  CheckDisableRegisterButton = () =>{
  if(!IsNullOrEmpty(this.state.shopNameErrorText)|| IsNullOrEmpty(this.state.shopName))
  {
    return true;
  } 
  return false
  }

  addShopOnClick = async() =>{
 try
  {
    //TO DO POPUP CONFIRM
  }
  catch(ex){
  toast.error("เกิดข้อผิดพลาด กรุณาติดต่อเจ้าหน้าที่");
  }
  await this.setState({isloading:false});
}

addShopApi = async() =>{
     await this.setState({isloading:true});
     const res = await this.props.ShopApiAction.AddShop(this.state.shopImage,this.state.shopName,this.state.shopEmail,this.state.shopTel,this.state.shopAddress,this.state.merchantId);
     if(res?.data?.isError == true){
     await this.setState({isloading:false});
     this.props.AlertAction.setAlert(2,res?.data?.errorMsg,true);
     return;
   }
   await this.setState({isloading:false});
   this.props.AlertAction.setAlert(1,"ทำรายการสำเร็จ",true);
   this.props.history.push('/MainPage');   
 }

cancelOnClick = () =>{
  this.props.history.push('/Login');
}
 
validateshopName = async(e) =>{
   var value = e.target.value
    if(IsNullOrEmpty(value)){
      await this.setState({shopName:value,shopNameErrorText:'กรุณากรอกชื่อ'});
    }
    else{
      await this.setState({shopName:value,shopNameErrorText:''});
    }   
 }

 validateshopImage = async(e) =>{
   var value = e.target.value
    if(IsNullOrEmpty(value)){
      await this.setState({shopImage:value,shopImageErrorText:'กรุณากรอกเลือกรูป'});
    }
    else{
      await this.setState({shopImage:value,shopImageErrorText:''});

    }
    var isDisable = this.CheckDisableRegisterButton(value,this.state.shopImageErrorText);
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
         <Loading height={this.state.height} onLoading={this.state.isloading} />
         <React.Fragment>
         <ToastContainer />  
        <div className="form-group row" style={{height:this.state.height}}>
        {/*Background Side*/}           
        <div className="col-4" style={this.state.width <= 998 ?{display:'none'}:{backgroundColor:'#4f6137'}} ></div>
        {/*Text Box Side*/}
        <div className={this.state.width <= 998 ?"col-12":"col-8"} style={{position:'relative'}}>

        <div className="vertical-center" style={{width:'100%'}}>
           {/*Register Shop*/}
      <div className="brown-Bold-Topic-Text" style={{textAlign:'center'}}>Register Shop</div>

        {/*Image Shop*/}
      <div className="form-group input">
       <div className="input" style={{padding:'0px',width:'150px',height:'150px',border:'1px solid lightgray',borderRadius:'5px'}}>
            <img className="imageCenter" src={this.state.shopImage!= null && this.state.shopImage != ""?this.state.shopImage: require('../assets/images/add_image.png').default} style={{margin:'37px'}}/>
       </div>
      </div>

        {/*Shop Image Error Text*/}
     <div className="form-group input"  style={{padding:'10px 0px',textAlign:'center'}}>
       <div className="text-error">{this.state.shopImageErrorText}</div>
     </div>

        {/*Shop Name*/}
      <div className="form-group input">
      <label for="InputShopname" className="brown-input-Text">Shop Name</label>
      <input type="text" class="form-control"  id="InputShopname" value={this.state.shopName} onChange={this.validateshopName.bind(this)}/>
     </div>

    {/*Shop Name Error Text*/}
     <div className="form-group input"  style={{padding:'10px 0px',textAlign:'center'}}>
       <div className="text-error">{this.state.shopNameErrorText}</div>
     </div>

      {/*Shop Email*/}
      <div className="form-group input" >
        <label for="InputEmail" className="brown-input-Text">Email</label>
        <input type="email" class="form-control"  id="InputEmail" value={this.state.shopEmail} onChange={this.emailOnchange.bind(this)}/>     
      </div>

        {/*Shop Tel*/}
      <div className="form-group input">
      <label for="InputTel" className="brown-input-Text">Tel</label>
      <input type="text" class="form-control"  id="InputTel" value={this.state.shopTel} onChange={this.telOnchange.bind(this)}/>
     </div>

  {/*Shop Address*/}
     <div className="form-group input" style={{height:'150px'}}>
      <label for="InputShopname" className="brown-input-Text">Address</label>
      <input type="text" class="form-control"  id="InputShopname" value={this.state.shopAddress} onChange={this.addressOnchange.bind(this)}/>
     </div>

       {/*Button*/}
    <div className="form-group" style={{padding:'40px 0px',display:'flex',justifyContent:'center',margin:'0px 15px'}}>
     
      <button  className={!this.state.IsRegisterDisable?"primary-button":"primary-button disabled"} style={{width:'250px',marginRight:'10px'}} onClick={this.addShopOnClick}>Register</button>
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
    Shop :state.Shop,
    Merchant :state.Merchant
  });
  
  const mapDispatchToProps = dispatch =>({
    ShopAction : bindActionCreators(shopAction,dispatch),
    ShopApiAction : bindActionCreators(shopApiAction,dispatch),
    AlertAction : bindActionCreators(alertAction,dispatch),
  });
  
  
  export default withRouter(connect(mapStateToProps,mapDispatchToProps)(AddShop));