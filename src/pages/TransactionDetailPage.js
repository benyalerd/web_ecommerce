import React from 'react';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import '../assets/css/index.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Loading} from '../component/Loadind';
import AlertDialog from '../component/dialog/AlertDialog';
import * as alertAction from '../actions/Alert/AlertAction';
import {DashboardLayout} from '../component/Layout';
import * as shopAction from '../actions/Shop/ShopAction'
import * as shopApiAction from '../actions/api/ShopApiAction'
import * as merchantAction from '../actions/Merchant/MerchantAction'
import * as registerApiAction from '../actions/api/RegisterApiAction'
import * as transactionManagementAction from '../actions/TransactionManagement/TransactionManagementAction'
import * as transactionManagementApiAction from '../actions/api/TransactionManagementApiAction'
import queryString from 'query-string';
import ConfirmAlertDialog from '../component/dialog/ConfirmAlertDialog';
import {IsNullOrEmpty} from '../helper/Common';
import $ from 'jquery';

class TransactionDetailPage extends React.Component{
    constructor(props) {
      super(props);
      this.state = 
      { width: 0, 
        height: 0,
        isloading:false,
        orderCode:"",
        tranType:0,
        tranDate:"",
        paymentDate:"",
        transactionDetail : [],
        reasonErrorText:"",
        trackingNumberErrorText:"",
        customerName:"",
        customerTel:"",
        customerAddress:"",
        isAprrove:false,
        paymentImage:"",
        trackingNumber:"",
        shippingName:"",
        shippingImage:"",
       
      };
      this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }
    
    componentDidMount() {
      this.updateWindowDimensions();
      window.addEventListener('resize', this.updateWindowDimensions);
      this.checkLoginAndAddShop();
      this.getTransactionDetail();
    }
    
    componentWillUnmount() {
      window.removeEventListener('resize', this.updateWindowDimensions);
    }
    
    updateWindowDimensions() {
      this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    cancelOnClick = () =>{
    this.props.history.push('/MainPage');
    }

    onsubmit = async() =>{
    try{
        await this.props.AlertAction.setConfirmAlert('อัพเดทข้อมูลรายการสั่งซื้อ',this.addProductApi.bind(this),true);
    }
    catch(ex){
        toast.error("เกิดข้อผิดพลาด กรุณาติดต่อเจ้าหน้าที่");
    }
}

updateTransactionApi = async() =>{
var isValid = await this.submitValidation();
if(isValid){
    let tranType = this.state.tranType;
    const query = queryString.parse(this.props.location.search);
    if(this.state.isAprrove){
        tranType = 5;
    }
    else if(!IsNullOrEmpty(this.state.reason)){
        tranType = 4;
    }
    else if(!IsNullOrEmpty(this.state.trackingNumber)){
        tranType = 6;
    }
    var request = {
        transactionId : query.transactionId,
        reason:this.state.reason,
        tranType:tranType,
        trackingNumber:this.state.trackingNumber,
        merchantId:this.props.Merchant.Merchant.id
    };
  await this.setState({isloading:true});
     const res = await this.props.TransactionManagementApiAction.UpdateTransaction(request);
     if(res?.data?.isError == true){
     await this.setState({isloading:false});
     this.props.AlertAction.setAlert(2,res?.data?.errorMsg,true);
     return;
   }
   await this.setState({isloading:false});
   this.props.AlertAction.setAlert(1,"ทำรายการสำเร็จ",true);
   this.props.history.push('/Transaction-MainPage');   
}
}

async submitValidation (){
  var isValid = true;
  if(this.state.tranType == 3 && !this.state.isAprrove){
      if(IsNullOrEmpty(this.state.reason)){
          isValid = false;
          this.setState({reasonErrorText:'กรุณาใส่เหตุผล'})
      }
  }
  else if(this.state.tranType == 5 && IsNullOrEmpty(this.state.trackingNumber)){
    
        isValid = false;
        this.setState({trackingNumberErrorText:'กรุณาใส่เลขแทรคกิ้ง'})
    
}
  return isValid
}

async getTransactionDetail (){
    await this.setState({isloading:true});
    const query = queryString.parse(this.props.location.search);
    var res = await this.props.TransactionManagementApiAction.GetTransactionDetail(query.transactionId);
    if(res?.data?.isError == true){
      this.props.AlertAction.setAlert(2,res?.data?.errorMsg,true);
    await this.setState({isloading:false});
    return;
  }
  var transaction = res?.data;
  
  await this.setState({transactionDetail:transaction.transactionDetail,orderCode:transaction.orderCode,tranType:transaction.tranType,tranDate:transaction.tranDate,paymentDate:transaction.paymentDate,customerName:transaction.customerName,customerTel:transaction.customerTel,customerAddress:transaction.customerAddress,paymentImage:transaction.paymentImg,trackingNumber:transaction.trackingNumber,reason:transaction.reason});
  
  }
    
    render(){
        return(      
        <React.Fragment>   
  <DashboardLayout merchantName={this.props.Merchant?.Merchant?.name} shopId={this.props?.Shop?.Shop?._id}>        
            <AlertDialog/>
            <ConfirmAlertDialog/>
            <Loading height={this.state.height} onLoading={this.state.isloading} />
            <React.Fragment>
            <ToastContainer />
            <div className="form-group" > 

{/*Transaction Detail*/}  
<div className="brown-Bold-Topic-Text" style={{padding:'0px 20px'}}>Transaction Detail</div>

<div className="form-group normal-background" style={{minHeight:this.state.height}}> 



{/*Transaction Detail*/}  
<div className="brown-Bold-Topic-Text" style={{textAlign:'center'}}>Transaction Detail</div>

 {/*ข้อมูลทั่วไป*/}     
 <div className="form-group row" style={{marginLeft: '30px',paddingTop: '30px'}}>
        <div className="imageTopic col-3" />
        <div className="black-Bold-Topic-Text col-9" >ข้อมูลทั่วไป</div>       
        </div >


       
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
    TransactionManagement:state.TransactionManagement
  });

  const mapDispatchToProps = dispatch =>({
    ShopAction : bindActionCreators(shopAction,dispatch),
    ShopApiAction : bindActionCreators(shopApiAction,dispatch),
      MerchantAction : bindActionCreators(merchantAction,dispatch),
      AlertAction : bindActionCreators(alertAction,dispatch),
      RegisterApiAction : bindActionCreators(registerApiAction,dispatch),
      TransactionManagementAction : bindActionCreators(transactionManagementAction,dispatch),
      TransactionManagementApiAction : bindActionCreators(transactionManagementApiAction,dispatch),
  });
  
  
  export default withRouter(connect(mapStateToProps,mapDispatchToProps)(TransactionDetailPage));
  
