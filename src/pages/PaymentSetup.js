import React from 'react';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import * as merchantAction from '../actions/Merchant/MerchantAction'
import * as registerApiAction from '../actions/api/RegisterApiAction'
import '../assets/css/index.css';
import 'react-dropdown/style.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {DashboardLayout} from '../component/Layout';
import * as shopApiAction from '../actions/api/ShopApiAction'
import * as shopAction from '../actions/Shop/ShopAction'
import * as paymentSetupAction from '../actions/PaymentSetup/PaymentSetupAction'
import {Loading} from '../component/Loadind';
import BookBankListDialog from '../component/dialog/BookBankListDialog';
import AddPaymentDialog from '../component/dialog/AddPaymentDialog';
import * as paymentSetupApiAction from '../actions/api/PaymentSetupApiAction';
import queryString from 'query-string';
import {IsNullOrEmpty} from '../helper/Common';
import AlertDialog from '../component/dialog/AlertDialog';
import * as alertAction from '../actions/Alert/AlertAction';
import ConfirmAlertDialog from '../component/dialog/ConfirmAlertDialog';

class PaymentSetup extends React.Component{
  constructor(props) {
    super(props);
    this.state = 
    { width: 0, 
      height: 0,
      isloading:false,
      paymentList:null,
      selectIndex:0,
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }
  
  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    this.checkLoginAndAddShop();
    this.getAllPayment();
     
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.PaymentSetup.IsAddPaymentOpen !== this.props.PaymentSetup.IsAddPaymentOpen){
      this.getAllPayment();
    }
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
 
   if(!res?.data?.shops){
    this.props.history.push('/Register-Shop');
    }
    await this.props.ShopAction.setShopInfo(res.data?.shops);
    await this.setState({isloading:false});
  }

  getAllPayment = async() => {
    await this.setState({isloading:true});
    const query = queryString.parse(this.props.location.search);
    var res = await this.props.PaymentSetupApiAction.GetPayment(query.shopId);
    if(res?.data?.isError == true){
      this.props.AlertAction.setAlert(2,res?.data?.errorMsg,true);
    await this.setState({isloading:false});
    return;
  }

  await this.setState({isloading:false,paymentList:res?.data?.payments});
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  
  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  addPaymentDialogOnclick = async () =>{
    await this.props.PaymentSetupAction.setBookBankListDialogOpen(true);
  }

  editBankInfo = async(index)=> {
  await this.props.PaymentSetupAction.setPaymentEdit(true); 
  await this.props.PaymentSetupAction.setAddPaymentDialogOpen({...this.state.paymentList[index],"merchantId":this.props.Merchant.Merchant.id},true);
  }

  deleteBankInfo = async(index)=> {
  try{
    await this.setState({selectIndex:index});
    await this.props.AlertAction.setConfirmAlert('???????????????????????????????????????????????????',this.deleteBankInfoApi.bind(this),true);
  }
  catch(ex){
    toast.error("?????????????????????????????????????????? ??????????????????????????????????????????????????????????????????");
    }
  }

  deleteBankInfoApi = async()=> {
    await this.setState({isloading:true});
    var res = await this.props.PaymentSetupApiAction.DeletePayment(this.state.paymentList[this.state.selectIndex]);
    if(res?.data?.isError == true){
      this.props.AlertAction.setAlert(2,res?.data?.errorMsg,true);
      await this.setState({isloading:false});
      return;
    
    }
    await this.setState({isloading:false});
    this.props.AlertAction.setAlert(1,"??????????????????????????????????????????",true);
    await this.componentDidMount();
  }


render(){
      return(
         <React.Fragment>
             <AlertDialog/>
             <ConfirmAlertDialog/>
           <BookBankListDialog />
           <AddPaymentDialog/>
           <Loading height={this.state.height} onLoading={this.state.isloading}/>
           <DashboardLayout merchantName={this.props.Merchant?.Merchant?.name} shopId={this.props?.Shop?.Shop?._id}>
           <React.Fragment>
           <ToastContainer />

        <div className="form-group" > 

        {/*Payment Set Up*/}  
        <div className="brown-Bold-Topic-Text" style={{padding:'0px 20px'}}>Payment Set Up</div>

        <div className="form-group normal-background" style={{height:this.state.height}}> 
        
        {/*Payment Set Up*/}  
        <div className="brown-Bold-Topic-Text" style={{textAlign:'center'}}>Payment Set Up</div>
        
        {/*Button ????????????????????????????????????????????????*/}  
        <div className="form-row" style={{position:'relative',height:'50px'}}>
        <button onClick={this.addPaymentDialogOnclick} style={{width:'150px',backgroundColor:'#4f6137',position:'absolute',right:'30px',width:'175px',height:'40px',borderRadius:'5px',fontSize:'16px',color:'white',cursor:'pointer'}}>
            <img src={require('../assets/images/plusIcon.png').default} style={{marginTop: '0px',width:'30px',marginRight: '4px',display:'unset'}} ></img>
            <span>????????????????????????????????????????????????</span>
            </button>       
      </div>

      <hr style={{border: '1px solid #4f6137', backgroundColor: '#4f6137',margin: '20px 30px'}}/>


      <div className="row" style={{marginLeft: '40px', marginRight: '40px', fontSize: '16px'}}>

          {/*Header*/}  
          <div className="col-9" style={{background: 'lightgray', height: '45px', padding: '10px 30px', fontWeight: 'bold', borderTop: '1px solid white', borderBottom: '1px solid white', borderLeft: '1px solid white', color: 'gray', borderRadius: '5px 0px 0px 0px'}}>?????????????????????????????????</div>
          <div className="col-3" style={{background: 'lightgray', height: '45px', padding: '10px 0px', fontWeight: 'bold', borderTop: '1px solid white', borderBottom: '1px solid white', borderLeft: '1px solid white', color: 'gray', borderRadius: '0px 5px 0px 0px',textAlign:'center'}}>???????????????????????????</div>
          
          </div>

        {/*Payment List*/}  
          <div className="row" style={{marginLeft: '40px', marginRight: '40px', fontSize: '16px',height:'max-content'}}>
          {this.state.paymentList == null || this.state.paymentList.length <= 0?<div className="col-12" style={{background: 'white', padding: '10px 30px', fontWeight: 'bold', border: '1px solid lightgray', color: 'lightgray', borderRadius: '0px',textAlign:'center'}}>??????????????????????????????????????????????????????????????????</div>  :  
          
          <React.Fragment>
            {this.state.paymentList?.map(({
              _id,
              master,
              accountName,
              accountNumber     
          },index) =>

            <React.Fragment>
            <div className="col-9" style={{background: 'white', height: '100px', padding: '10px 30px', fontWeight: 'bold', borderTop: '1px solid lightgray', borderBottom: '1px solid lightgray', borderLeft: '1px solid lightgray', color: 'black', borderRadius: '0px'}}>
                <div className="row mr-0 ml-0">
                    <div style={{width: 'fit-content'}}>
                          {/*Image*/}  
                        <img style={{width: '50px',height: '50px',marginRight: '20px',marginTop: '3px',display:'unset'}}  src={master.masterImg ?master.masterImg:require('../assets/images/noimage.png').default}/> </div>
                        <div className="col-9" >
                            {/*Bank Name*/}  
                            <div>{master.masterName}</div>
                              {/*Account Number*/}  
                            <div style={{fontWeight:'normal'}}>{accountNumber}</div>
                              {/*Account Name*/}  
                            <div style={{fontWeight:'normal'}}>{accountName}</div>
                            </div>                       
                    </div>
                </div>

  {/*Edit / Delete*/}  
       <div className="col-3" style={{background: 'white', height: '100px', fontWeight: 'bold', border: '1px solid lightgray', color: 'black', borderRadius: '0px',display: 'flex',alignItems: 'center',justifyContent: 'center'}}>
          
           <img style={{width: '40px',height: '40px',marginRight: '10px',display:'unset',cursor:'pointer'}} src={require('../assets/images/editIcon.png').default}  onClick={() => this.editBankInfo(index)}/>
           <img style={{width: '40px',height: '40px',display:'unset',cursor:'pointer'}} src={require('../assets/images/deleteIcon.png').default} onClick={() => this.deleteBankInfo(index)}/>
           
      </div>
      
       </React.Fragment>
         )}
         </React.Fragment>
       
       }
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
  Merchant:state.Merchant,
  PaymentSetup:state.PaymentSetup,
  SessionAlert:state.SessionAlert
  });
  
  const mapDispatchToProps = dispatch =>({
     ShopAction : bindActionCreators(shopAction,dispatch),
    MerchantAction : bindActionCreators(merchantAction,dispatch),
    RegisterApiAction : bindActionCreators(registerApiAction,dispatch),
     ShopApiAction : bindActionCreators(shopApiAction,dispatch),
     PaymentSetupAction : bindActionCreators(paymentSetupAction,dispatch),
     PaymentSetupApiAction : bindActionCreators(paymentSetupApiAction,dispatch),
     AlertAction : bindActionCreators(alertAction,dispatch),
     
  });

  
  
  export default withRouter(connect(mapStateToProps,mapDispatchToProps)(PaymentSetup));