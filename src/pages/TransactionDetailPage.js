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
import {onlyNumberAndEngText} from '../helper/Regex'
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
        isAprrove:true,
        paymentImage:"",
        trackingNumber:"",
        shippingName:"",
        shippingImage:"",
       totalProductPrice:0,
       totalPrice:0,
       shippingPrice:0
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

    cancelOnClick = () =>{
    this.props.history.push('/MainPage');
    }

    onsubmit = async() =>{
    try{
        await this.props.AlertAction.setConfirmAlert('อัพเดทข้อมูลรายการสั่งซื้อ',this.updateTransactionApi.bind(this),true);
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
    if(!IsNullOrEmpty(this.state.trackingNumber)){
      
      tranType = 6;
  }
  else if(!IsNullOrEmpty(this.state.reason)){
    tranType = 4;
}
  else if(this.state.isAprrove){
        tranType = 5;
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
   await this.props.TransactionManagementAction.setTransactionTabId(tranType);
   await this.props.history.push({
    pathname: '/Transaction-MainPage',
    search: `?shopId=${this.props?.Shop?.Shop?._id}`,
  });  
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

onApproveRadioChange = async(e) =>{
  var value = e.target.value;
  if(value == 1)
  {      
    await this.setState({isAprrove: true})   
  }else{
    await this.setState({isAprrove: false})   
  }   
}

onTrackingChange = async(e) =>{
  var value = e.target.value;
  if(value)
  {      
    if(!onlyNumberAndEngText.test(value)){  
      alert(value);       
      value = value.substring(0,value.length-1);          
      }      
  } 
  await this.setState({trackingNumber: value})     
}

onReasonChange = async(value) =>{
  if(value)
  {          
    await this.setState({reason: value})
  }      
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
  var transaction = res?.data?.transaction;
  var transactionDetail = res?.data?.transactionDetail;
  console.log("transaction : " +JSON.stringify(transactionDetail));
  await this.setState({transactionDetail:transactionDetail,orderCode:transaction.orderCode,tranType:transaction.tranType,tranDate:transaction.tranDate,paymentDate:transaction.paymentDate,customerName:transaction.customerName,customerTel:transaction.customerTel,customerAddress:transaction.customerAddress,paymentImage:transaction.paymentImg,trackingNumber:transaction.trackingNumber,reason:transaction.reason,totalProductPrice:transaction.totalProductPrice,shippingPrice:transaction.shippingPrice,totalPrice:transaction.totalPrice,shippingImage:transaction.shippingImg});
  
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

        <div className="form-group row" style={{margin:'10px',marginRight: '50px'}}>
       {/*หมายเลขคำสั่งซื้อ : */}
      <div className="col-2 topic-add-detail-div" style={{fontWeight:'bold'}}>
        <div>หมายเลขคำสั่งซื้อ :</div>
     </div>

      {/*Order Code*/}
     <div className="col-4 value-add-detail-div" >
     <div>{this.state.orderCode}</div>
     </div>

     {/*สถานะการสั่งซื้อ : */}
     <div className="col-2 topic-add-detail-div" style={{fontWeight:'bold'}}>
        <div>สถานะการสั่งซื้อ :</div>
     </div>

      {/*Order Code*/}
     <div className="col-4 value-add-detail-div" style={this.state.tranType == 7?{color:'green'}:this.state.tranType != 8 && this.state.tranType != 4?{color:'blue'}:{color:'red'}}>
     <div>{this.state.tranType == 2 ?"รอชำระ":this.state.tranType == 3 ?"รอยืนยันการชำระ": this.state.tranType == 4 ?"ชำระไม่สำเร็จ" :this.state.tranType == 5?"รอจัดส่ง":this.state.tranType == 6 ?"ระหว่างจัดส่ง":this.state.tranType == 7?"จัดส่งสำเร็จ":"ยกเลิก"}</div>
     </div>

    </div>

    <div className="form-group row" style={{margin:'10px',marginRight: '50px'}}>
       {/*วันที่สั่งซื้อ : */}
      <div className="col-2 topic-add-detail-div" style={{fontWeight:'bold'}}>
        <div>วันที่สั่งซื้อ :</div>
     </div>

      {/*Tran Date*/}
     <div className="col-4 value-add-detail-div" >
     <div>{this.state.tranDate}</div>
     </div>

     {/*วันที่ชำระ : */}
     <div className="col-2 topic-add-detail-div" style={{fontWeight:'bold'}}>
        <div>วันที่ชำระ :</div>
     </div>

      {/*Order Code*/}
     <div className="col-4 value-add-detail-div" >
     <div>{this.state.paymentDate}</div>
     </div>

    </div>

       {/*ข้อมูลจัดส่ง*/}     
 <div className="form-group row" style={{marginLeft: '30px',paddingTop: '30px'}}>
        <div className="imageTopic col-3" />
        <div className="black-Bold-Topic-Text col-9" >ข้อมูลจัดส่ง</div>       
        </div >

        <div className="form-group row" style={{margin:'10px',marginRight: '50px'}}>
       {/*ชื่อผู้รับ : */}
      <div className="col-2 topic-add-detail-div" style={{fontWeight:'bold'}}>
        <div>ชื่อผู้รับ :</div>
     </div>

      {/*Customer Name*/}
     <div className="col-4 value-add-detail-div" >
     <div>{this.state.customerName}</div>
     </div>

     {/*เบอร์โทร : */}
     <div className="col-2 topic-add-detail-div" style={{fontWeight:'bold'}}>
        <div>เบอร์โทร :</div>
     </div>

      {/*Customer Tel*/}
     <div className="col-4 value-add-detail-div" >
     <div>{this.state.customerTel}</div>
     </div>

    </div>

    <div className="form-group row" style={{margin:'10px',marginRight: '50px'}}>
       {/*ที่อยู่ : */}
      <div className="col-2 topic-add-detail-div" style={{fontWeight:'bold'}}>
        <div>ที่อยู่ :</div>
     </div>

      {/*Cust Address*/}
     <div className="col-4 value-add-detail-div">
     <div>{this.state.customerAddress}</div>
     </div>

    </div>

 {/*รายละเอียดสินค้า*/}     
 <div className="form-group row" style={{marginLeft: '30px',paddingTop: '30px'}}>
        <div className="imageTopic col-3" />
        <div className="black-Bold-Topic-Text col-9" >รายละเอียดสินค้า</div>       
        </div >

       
      <table style={{width:'100%',margin: '20px 40px'}}>
        <tr>
          <th style={{width:'40%'}}>สินค้า</th>
          <th style={{width:'10%',textAlign: 'center'}}>จำนวน</th>
          <th style={{width:'20%', textAlign: 'center'}} >ราคาต่อชิ้น</th>
          <th style={{width:'20%', textAlign: 'center'}}>ราคารวม</th>
        </tr>
        {this.state.transactionDetail?.map((val, key) => {
          return (
            <tr key={key}>
              <td> <div className="row mr-0 ml-0">
                    <div style={{width: 'fit-content',padding: '20px 0px'}}>
                          {/*Image*/}  
                        <img style={{width: '100px',height: '100px',marginRight: '20px',display:'unset'}}  src={val.productImg?val.productImg: require('../assets/images/noimage.png').default}/> </div>
                        <div className="col-9" style={{padding: '20px 10px'}}>
                            {/*Product Name*/}  
                            <div style={{fontSize: '16px'}}>{val.productName}</div>
                              {/*Price*/}  
                            <div style={{fontWeight:'normal',color:'red',fontSize: '16px'}}>{val.option}</div>
                                                
                    </div>
                </div></td>
              <td style={{textAlign: 'center'}} >{val.qty}</td>
              <td style={{textAlign: 'center'}}>{val.productPrice}</td>
              <td style={{textAlign: 'center'}}>{val.qty * val.productPrice}</td>
            </tr>
          )
        })}
      </table>
    
      <div className="form-group row" style={{margin:'10px',marginRight: '50px'}}>
       {/*ราคาสินค้า*/}
      <div className="col-9 topic-add-detail-div" style={{fontWeight:'bold'}}>
        <div>ราคาสินค้า</div>
     </div>

      {/*ToTal Product Price*/}
     <div className="col-3" style={{alignItems: 'center',display: 'flex',justifyContent: 'center'}}>
     <div>{this.state.totalProductPrice}</div>
     </div>

    </div>

    <div className="form-group row" style={{margin:'10px',marginRight: '50px'}}>
       {/*ค่าส่ง*/}
      <div className="col-9 topic-add-detail-div" style={{fontWeight:'bold'}}>
        <div>ค่าส่ง</div>
     </div>

      {/*Shipping Price*/}
     <div className="col-3" style={{alignItems: 'center',display: 'flex',justifyContent: 'center'}}>
     <div>{this.state.shippingPrice}</div>
     </div>

    </div>

    <div className="form-group row" style={{margin:'10px',marginRight: '50px'}}>
       {/*ราคารวมทั้งหมด*/}
      <div className="col-9 topic-add-detail-div" style={{fontWeight:'bold'}}>
        <div>ราคารวมทั้งหมด</div>
     </div>

      {/*Total Price*/}
     <div className="col-3" style={{alignItems: 'center',display: 'flex',justifyContent: 'center'}}>
     <div>{this.state.totalPrice}</div>
     </div>

    </div>

      {/*หลักฐานการโอน*/}     
 <div className="form-group row" style={{marginLeft: '30px',paddingTop: '30px'}}>
        <div className="imageTopic col-3" />
        <div className="black-Bold-Topic-Text col-9" >หลักฐานการโอน</div>       
        </div >

        {/*รูปสลิปโอนเงิน*/} 
<div  className="form-group row" style={{justifyContent: 'center',margin: '10px'}}>
<img style={{border: '1px solid lightgray',width: '450px',height: 'auto',maxHeight: '450px'}}  src={this.state.paymentImage?this.state.paymentImage: require('../assets/images/noimage.png').default}/>
  </div>

  {this.state.tranType == 3 ?
  <React.Fragment>
  {/*Radio Button*/} 
  <div  className="form-group row" style={{justifyContent: 'center',margin: '10px',alignItems: 'center'}}>

     {/*Approve Radio Button*/} 
  <input
                type="radio"
                name="approve"
                value={1}
                checked={this.state.isAprrove}
                style={{width: 'fit-content'}}
                onChange={this.onApproveRadioChange.bind(this)}
              />
              <div style={{width: 'fit-content',paddingRight: '400px'}}>{"Approve"}</div>

  {/*Reject Radio Button*/} 
              <input
                type="radio"
                name="reject"
                value={2}
                checked={!this.state.isAprrove}
                style={{width: 'fit-content'}}
                onChange={this.onApproveRadioChange.bind(this)}
              />
              <div style={{width: 'fit-content'}}>{"Reject"}</div>
  </div>

  {/*เหตุผล :*/} 
  <div  className="form-group row" style={{justifyContent: 'center',margin: '10px 150px',alignItems: 'center'}}>
  <div className="col-2" style={{ textAlign: 'end'}}>เหตุผล :</div>

  {/*เหตุผล Input*/} 
  <div className="col-10">
  <textarea  type="text" class="form-control"  id="RejectReason" maxLength={500} value={this.state.reason} onChange={this.onReasonChange.bind(this)} disabled={this.state.isAprrove} />
  </div>
    </div>
    </React.Fragment> : null}
  
    {this.state.tranType == 4 ?
  <React.Fragment>
  {/*Radio Button*/} 
  <div  className="form-group row" style={{justifyContent: 'center',margin: '10px',alignItems: 'center'}}>

     {/*Approve Radio Button*/} 
  <input
                type="radio"
                name="approve"
                checked={false}
                style={{width: 'fit-content'}}
                disabled={true}
                
              />
              <div style={{width: 'fit-content',paddingRight: '400px'}}>{"Approve"}</div>

  {/*Reject Radio Button*/} 
              <input
                type="radio"
                name="reject"
                checked={true}
                disabled={true}
              />
              <div style={{width: 'fit-content'}}>{"Reject"}</div>
  </div>

  {/*เหตุผล :*/} 
  <div  className="form-group row" style={{justifyContent: 'center',margin: '10px 150px',alignItems: 'center'}}>
  <div className="col-2" style={{ textAlign: 'end'}}>เหตุผล :</div>

  {/*เหตุผล Input*/} 
  <div className="col-10">
  <textarea  type="text" class="form-control"  id="RejectReason" maxLength={500} value={this.state.reason} disabled={true} />
  </div>
  
    </div>
    </React.Fragment> : null}

{/*ข้อมูลขนส่ง*/}     
<div className="form-group row" style={{marginLeft: '30px',paddingTop: '30px'}}>
        <div className="imageTopic col-3" />
        <div className="black-Bold-Topic-Text col-9" >ข้อมูลขนส่ง</div>       
        </div >

        <div className="form-group row" style={{margin:'10px',marginRight: '50px'}}>
       {/*ข้อมูลการขนส่ง : */}
      <div className="col-2 topic-add-detail-div" style={{fontWeight:'bold'}}>
        <div>ข้อมูลการขนส่ง : </div>
     </div>

      {/*Shipping Image*/}
     <div className="col-4 value-add-detail-div" >
     <img style={{width: '75px',height: 'auto',display:'unset'}} src={this.state.shippingImage} />  
     </div>

    </div>

{this.state.tranType >= 5?
        <div className="form-group row" style={{margin:'10px',marginRight: '50px'}}>
       {/*หมายเลขพัสดุ : */}
      <div className="col-2 topic-add-detail-div" style={{fontWeight:'bold'}}>
        <div>หมายเลขพัสดุ : </div>
     </div>

      {/*Tracking Number*/}
     <div className="col-4 value-add-detail-div" >
     {this.state.tranType !=5 ? <div>{this.state.trackingNumber}</div> :
     <input type="text" class="form-control" id="trackingNumber" maxLength={15} value={this.state.trackingNumber} onChange={this.onTrackingChange.bind(this)}/>
}
     </div>

    </div> 
    : null
    }
  
  {this.state.tranType == 5 || this.state.tranType == 3 ?
  <React.Fragment>
    {/*Button*/}
    <div className="form-group" style={{padding:'40px 0px',display:'flex',justifyContent:'center',margin:'0px 15px'}}>
     
      <button  className={"primary-button"} style={{width:'250px',marginRight:'10px'}} onClick={this.onsubmit} >Update</button>
      <button  className="secondary-button" style={{width:'250px'}} onClick={this.cancelOnClick}>Cancel</button>
     
    </div>
    </React.Fragment>
    : null
    }
       
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
  
