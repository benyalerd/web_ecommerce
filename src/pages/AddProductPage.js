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
import * as productManagementAction from '../actions/ProductManagement/ProductManagementAction'
import * as productManagementApiAction from '../actions/api/ProductManagementApiAction'
import queryString from 'query-string';
import ConfirmAlertDialog from '../component/dialog/ConfirmAlertDialog';
import {IsNullOrEmpty} from '../helper/Common';
import $ from 'jquery';

class AddProductPage extends React.Component{
    constructor(props) {
      super(props);
      this.state = 
      { width: 0, 
        height: 0,
        isloading:false,
        productName:"",
        productDesc:"",
        productMainContent : [],
        isAddOption : false,
        productNameErrorText:"",
        productDescErrorText:"",
        IsSaveDisable:true,
        productSkuList:[
          {
            skuName: "",
            option: "",
            ProductSkuContent: {
                product: "",
                sku: "",
                mediaType: 1,
                imagePath: "",
                contentType: 3
            },
            fullPrice:0,
            stock:0
        }
        ]
      };
      this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }
    
    componentDidMount() {
      this.updateWindowDimensions();
      window.addEventListener('resize', this.updateWindowDimensions);
      this.checkLoginAndAddShop();
    }
    
    componentWillUnmount() {
      window.removeEventListener('resize', this.updateWindowDimensions);
    }
    
    updateWindowDimensions() {
      this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    AddOptionOnclick() {
      this.setState({ isAddOption: true});
    }

    DeleteOptionOnclick() {
      this.setState({ isAddOption: false});
    }

    deleteEachOption = async(index)=> {
    var optionList =  this.state.productSkuList.splice(index, 1);
    await this.setState({productSkuList:optionList});
    }

    validateProductName = async(e) =>{
      var value = e.target.value
       if(IsNullOrEmpty(value)){
         await this.setState({productName:value,productNameErrorText:'กรุณากรอกชื่อสินค้า'});
       }
       else{
         await this.setState({productName:value,productNameErrorText:''});
       }   
       var isDisable = this.CheckDisableSaveButton();
       this.setState({IsRegisterDisable:isDisable});
    }

    validateProductDesc = async(e) =>{
      var value = e.target.value
      if(IsNullOrEmpty(value)){
        await this.setState({productDesc:value,productDescErrorText:'กรุณากรอกชื่อสินค้า'});
      }
      else{
        await this.setState({productDesc:value,productDescErrorText:''});
      }   
      var isDisable = this.CheckDisableSaveButton();
      this.setState({IsRegisterDisable:isDisable});
    }

    CheckDisableSaveButton = () =>{
      if(!IsNullOrEmpty(this.state.productNameErrorText)|| IsNullOrEmpty(this.state.productName))
      {
        return true;
      } 
      if(!IsNullOrEmpty(this.state.productDescErrorText)|| IsNullOrEmpty(this.state.productDesc))
      {
        return true;
      } 
        return false
      }

    AddMoreOptionOnClick(){
      var sku = {
        skuName: "",
        option: "",
        ProductSkuContent: {
            product: "",
            sku: "",
            mediaType: 1,
            imagePath: "",
            contentType: 3
        },
        fullPrice:0,
        stock:0
    }
    var existingSku = this.state.productSkuList
    existingSku.push(sku);
    this.setState({productSkuList:existingSku})
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


    selectShopImage = async(e) =>{
      var value = e.target.files
      if (value.length != 0){
       e.preventDefault();
       
       for(let i = 0; i < value.length; i++ ){
        let currentfile = e.target.files[i];
        let currentfileType = currentfile.type;
        let currentfileSize = currentfile.size;
        let resultSize = this.validateSize(currentfileSize);
        let resultType = this.validateType(currentfileType);
        if (!resultSize || !resultType) {
            return;
        }
         
        var base64 = await this.getBase64(currentfile);
       
        var content = {
          product: "",
          sku: "",
          mediaType: 1,
          imagePath: base64,
          contentType: this.state.productMainContent?.length > 1 ? 2 : 1
        }
        this.setState(prevState => ({
          ...prevState,
          productMainContent: [...prevState.productMainContent,content]
       }))
       }
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

   deleteImage = async(index) =>{ 
    
     await this.state.productMainContent.splice(index, 1);
    await this.setState({productMainContent: this.state.productMainContent});
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

{/*Add Product*/}  
<div className="brown-Bold-Topic-Text" style={{padding:'0px 20px'}}>Add Product</div>

<div className="form-group normal-background" style={{minHeight:this.state.height}}> 



{/*Add Product*/}  
<div className="brown-Bold-Topic-Text" style={{textAlign:'center'}}>Add Product</div>

 {/*ข้อมูลสินค้า*/}     
 <div className="form-group row" style={{marginLeft: '30px',paddingTop: '30px'}}>
        <div className="imageTopic col-3" />
        <div className="black-Bold-Topic-Text col-9" >ข้อมูลสินค้า</div>       
        </div >


        <div className="form-group row" style={{margin:'10px',marginRight: '50px'}}>
       {/*ชื่อสินค้า*/}
      <div className="col-2" style={{alignItems: 'center',display: 'flex',justifyContent: 'end'}}>
        <div> <a style={{color:'red'}}>*</a> ชื่อสินค้า :</div>
     </div>

      {/*ชื่อสินค้า Input*/}
     <div className="col-10">
        <input type="text" class="form-control" value={this.state.productName} onChange={this.validateProductName.bind(this)}  id="InputProductName" maxLength={200} />
     </div>
    </div>

 {/*Error Text Product Name*/}
    <div className="form-group row" style={this.state.productNameErrorText?{margin:'10px'}:{margin:'10px',display:'none'}}>

    <div className="col-2" style={{alignItems: 'center',display: 'flex',justifyContent: 'end'}}>
        <div></div>
     </div>

     
     <div className="col-10">
     <div className="form-group input"  style={{padding:'10px 0px',textAlign:'start'}}>
       <div className="text-error">{this.state.productNameErrorText}</div>
     </div>
     </div>
     
    </div>

    <div className="form-group row" style={{margin:'10px',marginRight: '50px'}}>
       {/*รายละเอียดสินค้า*/}
      <div className="col-2" style={{alignItems: 'center',display: 'flex',justifyContent: 'end'}}>
        <div> <a style={{color:'red'}}>*</a>รายละเอียดสินค้า :</div>
     </div>

      {/*รายละเอียดสินค้า Input*/}
     <div className="col-10">
        <textarea value={this.state.productDesc} onChange={this.validateProductDesc.bind(this)} type="text" class="form-control"  id="InputProductDesc" maxLength={500} />
     </div>

    </div>

{/*Error Text Product Desc*/}
<div className="form-group row" style={this.state.productDescErrorText?{margin:'10px'}:{margin:'10px',display:'none'}}>

<div className="col-2" style={{alignItems: 'center',display: 'flex',justifyContent: 'end'}}>
    <div></div>
 </div>

 
 <div className="col-10">
 <div className="form-group input"  style={{padding:'10px 0px',textAlign:'start'}}>
   <div className="text-error">{this.state.productDescErrorText}</div>
 </div>
 </div>
 
</div>

    <div className="form-group row" style={{margin:'10px',marginRight: '50px'}}>
       {/*อัพโหลดรูปภาพสินค้า*/}
      <div className="col-2" style={{alignItems: 'center',display: 'flex',justifyContent: 'end'}}>
        <div> <a style={{color:'red'}}>*</a>อัพโหลดรูปภาพสินค้า :</div>
     </div>

      {/*อัพโหลดรูปภาพสินค้า Input*/}
     <div className="col-10">
     <div style={{display: 'flex',flexWrap: 'wrap'}}>
     <input type="file" id="images" multiple name="images" style={{ display: 'none' }} accept="image/*" onChange={this.selectShopImage.bind(this)} onClick={(event) => { event.target.value = null }}/>
       
        {/*รูปปก*/}
        
        <div style={this.state.productMainContent.length > 0 ?{marginRight:'15px',display:'table-cell',position:'relative',padding:'0px',width:'150px',height:'150px',border:'1px solid lightgray',borderRadius:'5px',cursor:'pointer'}:{marginRight:'15px',padding:'0px',width:'150px',height:'150px',border:'1px solid lightgray',borderRadius:'5px',cursor:'pointer',display: 'table-cell' }} onClick={this.addImage} >
            <img className={this.state.productMainContent.length > 0?"vertical-center":"imageCenter"} src={this.state.productMainContent.length > 0?this.state.productMainContent[0].imagePath : require('../assets/images/add_image.png').default} style={this.state.productMainContent.length > 0 ?{}:{margin:'37px'}}/>
            {this.state.productMainContent.length > 0 ?  <button style={{ display: 'inline', zIndex: '1'}}><img  style={{position: 'absolute',width: '25px',height: '25px',right: '0px',top: '3px'}} onClick={() => this.deleteImage(0)} src={require('../assets/images/crossIcon.png').default} /></button> : null}
            <div style={{textAlign: 'center',fontSize: '14px',color: 'gray',paddingTop: '5px'}}>รูปปก</div>
       </div>
      

  {/*รูป 2*/}
  <div style={this.state.productMainContent.length > 1 ?{marginRight:'15px',display:'table-cell',position:'relative',padding:'0px',width:'150px',height:'150px',border:'1px solid lightgray',borderRadius:'5px',cursor:'pointer'}:{marginRight:'15px',padding:'0px',width:'150px',height:'150px',border:'1px solid lightgray',borderRadius:'5px',cursor:'pointer',display: 'table-cell' }} onClick={this.addImage} >
            <img className={this.state.productMainContent.length > 1?"vertical-center":"imageCenter"} src={this.state.productMainContent.length > 1?this.state.productMainContent[1].imagePath : require('../assets/images/add_image.png').default} style={this.state.productMainContent.length > 1 ?{}:{margin:'37px'}}/>
            {this.state.productMainContent.length > 1 ?  <button style={{ display: 'inline', zIndex: '1'}}><img  style={{position: 'absolute',width: '25px',height: '25px',right: '0px',top: '3px'}} onClick={() => this.deleteImage(1)} src={require('../assets/images/crossIcon.png').default} /></button> : null}
            <div style={{textAlign: 'center',fontSize: '14px',color: 'gray',paddingTop: '5px'}}>รูป 2</div>
       </div>

  {/*รูป 3*/}
  <div style={this.state.productMainContent.length > 2 ?{marginRight:'15px',display:'table-cell',position:'relative',padding:'0px',width:'150px',height:'150px',border:'1px solid lightgray',borderRadius:'5px',cursor:'pointer'}:{marginRight:'15px',padding:'0px',width:'150px',height:'150px',border:'1px solid lightgray',borderRadius:'5px',cursor:'pointer',display: 'table-cell' }} onClick={this.addImage}  >
            <img className={this.state.productMainContent.length > 2?"vertical-center":"imageCenter"} src={this.state.productMainContent.length > 2?this.state.productMainContent[2].imagePath : require('../assets/images/add_image.png').default} style={this.state.productMainContent.length > 2 ?{}:{margin:'37px'}}/>
            {this.state.productMainContent.length > 2 ?  <button style={{ display: 'inline', zIndex: '1'}}><img  style={{position: 'absolute',width: '25px',height: '25px',right: '0px',top: '3px'}} onClick={() => this.deleteImage(2)} src={require('../assets/images/crossIcon.png').default} /></button> : null}
            <div style={{textAlign: 'center',fontSize: '14px',color: 'gray',paddingTop: '5px'}}>รูป 3</div>
       </div>

  {/*รูป 4*/}
  <div style={this.state.productMainContent.length > 3 ?{marginRight:'15px',display:'table-cell',position:'relative',padding:'0px',width:'150px',height:'150px',border:'1px solid lightgray',borderRadius:'5px',cursor:'pointer'}:{marginRight:'15px',padding:'0px',width:'150px',height:'150px',border:'1px solid lightgray',borderRadius:'5px',cursor:'pointer',display: 'table-cell' }}  onClick={this.addImage} >
            <img className={this.state.productMainContent.length > 3?"vertical-center":"imageCenter"} src={this.state.productMainContent.length > 3?this.state.productMainContent[3].imagePath : require('../assets/images/add_image.png').default} style={this.state.productMainContent.length > 3 ?{}:{margin:'37px'}}/>
            {this.state.productMainContent.length > 3 ?  <button style={{ display: 'inline', zIndex: '1'}}><img  style={{position: 'absolute',width: '25px',height: '25px',right: '0px',top: '3px'}} onClick={() => this.deleteImage(3)} src={require('../assets/images/crossIcon.png').default} /></button> : null}
            <div style={{textAlign: 'center',fontSize: '14px',color: 'gray',paddingTop: '5px'}}>รูป 4</div>
       </div>
     
       
      </div>
     </div>

    </div>

    <div className="form-group row" style={{margin:'10px',marginRight: '50px',marginTop:'40px'}}>

 {/*ตัวเลือกสินค้า*/}
 <div className="col-2" style={{alignItems: 'center',display: 'flex',justifyContent: 'end'}}>
        <div>ตัวเลือกสินค้า :</div>
     </div>

     <div className="col-10"  style={!this.state.isAddOption?{}:{paddingBottom:'15px',border: '2px solid #d7c6b4',borderStyle: 'dashed',position:'relative'}}>
         
     {!this.state.isAddOption ?
     <button onClick={this.AddOptionOnclick.bind(this)} style={{width:'100%', border:'2px solid #d7c6b4', color:'#d7c6b4',height:'35px',fontSize:'12px',cursor:'pointer',borderStyle: 'dashed'}} >
            <span>+ เพิ่มตัวเลือกสินค้า</span>
            </button>  

            : 
            <React.Fragment>
              
            <div className="form-group row" style={{margin:'10px',marginRight: '50px'}}>
            <button style={{ display: 'inline', zIndex: '1'}}><img  style={{position: 'absolute',width: '25px',height: '25px',right: '0px',top: '3px'}} onClick={this.DeleteOptionOnclick.bind(this)} src={require('../assets/images/crossIcon.png').default} /></button>
            
            {/*ชื่อตัวเลือก*/}
  <div className="col-2" style={{alignItems: 'center',display: 'flex',justifyContent: 'start'}}>
    <div style={{fontSize:'14px',}}>ชื่อ :</div>
 </div>

  {/*ชื่อตัวเลือก Input*/}
  <div className="col-10" >
    <input type="text" class="form-control"  id="InputOptionName" maxLength={200} />
 </div>

</div>

<React.Fragment>
  {this.state.productSkuList?.map(({
   skuName,
   option,
   ProductSkuContent,
   fullPrice,
   stock
},index) =>

  <React.Fragment>
    <div className="form-group" style={{position:'relative'}} >
     
<div className="form-group row" style={{margin:'10px',marginRight: '50px'}}>
                {/*ตัวเลือก*/}
      <div className="col-2" style={{fontSize:'14px',alignItems: 'center',display: 'flex',justifyContent: 'start'}}>
        <div>ตัวเลือก :</div>
     </div>

      {/*ตัวเลือก Input*/}
      <div className="col-10" >
        <input type="text" class="form-control"  id="InputOption1" maxLength={200} />
     </div>

     {this.state.productSkuList?.length > 1 ? <button style={{ display: 'inline', zIndex: '1'}}><img  style={{position: 'absolute',width: '25px',height: '25px',right: '15px',top: '3px'}} onClick={() => this.deleteEachOption(index)} src={require('../assets/images/deleteIcon.png').default} /></button>:null}
    
</div>

<div className="form-group row" style={{margin:'10px',marginRight: '50px'}}>
                {/**/}
      <div className="col-2" style={{alignItems: 'center',display: 'flex',justifyContent: 'end'}}>
     </div>

      {/*ราคา*/}
     <div className="col-1" style={{fontSize:'14px', alignItems: 'center',display: 'flex',justifyContent: 'end'}}>
        <div>ราคา :</div>
     </div>

      {/*ราคา Input*/}
      <div className="col-4">
        <input type="text" class="form-control"  id="InputOption1Price" maxLength={200} />
     </div>

{/*Stock*/}
     <div className="col-2" style={{fontSize:'14px',alignItems: 'center',display: 'flex',justifyContent: 'end'}}>
        <div>จำนวน :</div>
     </div>

       {/*Stock Input*/}
       <div className="col-3">
        <input type="text" class="form-control"  id="InputOption1Stock" maxLength={200} />
     </div>
    
</div>

</div>
   </React.Fragment>
  )}
  </React.Fragment>

  {this.state.productSkuList?.length >=3?null:

<div className="form-group row" style={{margin:'10px'}}>
  
  <div className="col-2" style={{alignItems: 'center',display: 'flex',justifyContent: 'end'}}>
    <div></div>
 </div>

  {/*Button เพิ่มตัวเลือก*/}
  <div className="col-10">

  <button onClick={this.AddMoreOptionOnClick.bind(this)} style={{width:'100%', border:'2px solid #d7c6b4', color:'#d7c6b4',height:'35px',fontSize:'12px',cursor:'pointer',borderStyle: 'dashed'}} >
 <span>+ เพิ่มตัวเลือก</span>
 </button>  

 </div>

 </div>
}

<div className="form-group row" style={{margin:'10px',marginRight: '50px'}}>
       {/**/}
      <div className="col-2" style={{alignItems: 'center',display: 'flex',justifyContent: 'end'}}>
        <div></div>
     </div>

{/*อัพโหลดรูป SKU Input*/}
<div className="col-10">
     <div style={{display: 'flex',flexWrap: 'wrap'}}>
     <input type="file" id="images" name="images" style={{ display: 'none' }} accept="image/*" />
       
        {/*SKU IMAGE*/}
        
        <React.Fragment>
  {this.state.productSkuList?.map(({
   skuName,
   option,
   ProductSkuContent,
   fullPrice,
   stock
},index) =>

  <React.Fragment>
        <div style={this.state.shopImage?{marginRight:'15px',display:'table-cell',position:'relative',padding:'0px',width:'150px',height:'150px',border:'1px solid lightgray',borderRadius:'5px',cursor:'pointer'}:{marginRight:'15px',padding:'0px',width:'150px',height:'150px',border:'1px solid lightgray',borderRadius:'5px',cursor:'pointer',display: 'table-cell' }}  >
            <img className={this.state.ProductSkuContent?.imagePath ?"vertical-center":"imageCenter"} src={this.state.shopImage?this.state.shopImage : require('../assets/images/add_image.png').default} style={this.state.shopImage?{}:{margin:'37px'}}/>
            {this.state.ProductSkuContent?.imagePath ?  <button style={{ display: 'inline', zIndex: '1'}}><img  style={{position: 'absolute',width: '25px',height: '25px',right: '0px',top: '3px'}} src={require('../assets/images/crossIcon.png').default} /></button> : null}
            <div style={{textAlign: 'center',fontSize: '14px',color: 'gray',paddingTop: '5px'}}>{"SKU "+index+1}</div>
       </div>
       </React.Fragment>
  )}
  </React.Fragment>
       </div>
       </div>

     </div>
</React.Fragment>
  }


</div>

  {/*Button*/}
  <div className="form-group" style={{padding:'40px 0px',display:'flex',justifyContent:'center',margin:'0px 15px'}}>
     
     <button  className={!this.state.IsSaveDisable?"primary-button":"primary-button disabled"} style={{width:'250px',marginRight:'10px'}} >Save</button>
     <button  className="secondary-button" style={{width:'250px'}} >Cancel</button>
    
   </div>

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
    ProductManagement:state.ProductManagement
  });

  const mapDispatchToProps = dispatch =>({
    ShopAction : bindActionCreators(shopAction,dispatch),
    ShopApiAction : bindActionCreators(shopApiAction,dispatch),
      MerchantAction : bindActionCreators(merchantAction,dispatch),
      AlertAction : bindActionCreators(alertAction,dispatch),
      RegisterApiAction : bindActionCreators(registerApiAction,dispatch),
      ProductManagementAction : bindActionCreators(productManagementAction,dispatch),
      ProductManagementApiAction : bindActionCreators(productManagementApiAction,dispatch),
  });
  
  
  export default withRouter(connect(mapStateToProps,mapDispatchToProps)(AddProductPage));
  
