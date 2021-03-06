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
import {onlyNumber} from '../helper/Regex'
import * as merchantAction from '../actions/Merchant/MerchantAction'
import * as registerApiAction from '../actions/api/RegisterApiAction'
import * as productManagementAction from '../actions/ProductManagement/ProductManagementAction'
import * as productManagementApiAction from '../actions/api/ProductManagementApiAction'
import queryString from 'query-string';
import ConfirmAlertDialog from '../component/dialog/ConfirmAlertDialog';
import {IsNullOrEmpty} from '../helper/Common';
import $ from 'jquery';

class ProductDetailPage extends React.Component{
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
        IsAddImageSku:false,
        skuName:"",
        productMainContentErrorText:"",
        productOptionErrorText:"",
        isEdit:false,
        stock:0,
        fullprice:0,
        isActive:true,
        productSkuList:[
          {
            skuName: "",
            option: "",
            productSkuContent: {
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
      this.getProductDetail();
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
      var result = [
        {
          skuName: "",
          option: "",
          productSkuContent: {
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
      this.setState({ isAddOption: false,productSkuList:result});
    }

    deleteEachOption = async(index)=> {
     
      this.state.productSkuList.splice(index, 1);
     await this.setState({productSkuList:this.state.productSkuList});
    }

    selectStatus = (e) =>{
        var value = e.target.value; 
        let isActive = true;
        if(value == "2")
        {
            isActive = false;
        }
  
        this.setState({isActive:isActive});
      }

    validateProductName = async(e) =>{
      var value = e.target.value
       if(IsNullOrEmpty(value)){
         await this.setState({productName:value,productNameErrorText:'?????????????????????????????????????????????????????????'});
       }
       else{
         await this.setState({productName:value,productNameErrorText:''});
       }   
       var isDisable = this.CheckDisableSaveButton();
       this.setState({IsSaveDisable:isDisable});
    }

    validateProductDesc = async(e) =>{
      var value = e.target.value
      if(IsNullOrEmpty(value)){
        await this.setState({productDesc:value,productDescErrorText:'?????????????????????????????????????????????????????????'});
      }
      else{
        await this.setState({productDesc:value,productDescErrorText:''});
      }   
      var isDisable = this.CheckDisableSaveButton();
      this.setState({IsSaveDisable:isDisable});
    }

    skuNameOnChange = async(e) =>{
      var value = e.target.value
      this.setState({skuName:value});
    }

    optionNameOnChange = async(index,value) =>{
      var sku = this.state.productSkuList;
          sku[index].option = value;
          await this.setState({productSkuList: sku})
    }

    onFullPriceChange = async(value) =>{
        if(value)
        {          
            if(!onlyNumber.test(value)){         
            value = value.substring(0,value.length-1);          
            }  
        }      
        await this.setState({fullprice: value})
      }
  
      onFullPriceFocus = async(value) =>{
        if(value == 0)
        {
         await this.setState({fullprice: ""})
        }
      }
  
      onFullPriceBlur = async (value) =>{
       if(!value)
       {
        await this.setState({fullprice: 0})
       }
    }
  
    onStockChange = async(value) =>{
      if(value)
      {          
          if(!onlyNumber.test(value)){         
          value = value.substring(0,value.length-1);          
          }  
      }      
      await this.setState({stock: value})
    }
  
    onStockFocus = async(value) =>{
      if(value == 0)
      {
       await this.setState({stock: ""})
      }
    }
  
    onStockBlur = async (value) =>{
     if(!value)
     {
      await this.setState({stock: 0})
     }
  }

    onPriceChange = async(index,value) =>{
      if(value)
      {          
          if(!onlyNumber.test(value)){         
          value = value.substring(0,value.length-1);          
          }  
      }      
      var sku = this.state.productSkuList;
          sku[index].fullPrice = value;
      await this.setState({productSkuList: sku})
    }

    onPriceFocus = async(index,value) =>{
      if(value == 0)
      {
       var sku = this.state.productSkuList;
       sku[index].fullPrice = "";
       await this.setState({productSkuList: sku})
      }
    }

    onPriceBlur = async (index,value) =>{
     if(!value)
     {
      var sku = this.state.productSkuList;
      sku[index].fullPrice = 0;
      await this.setState({productSkuList: sku})
     }
  }

  onSkuStockFocus = async(index,value) =>{
    if(value == 0)
    {
     var sku = this.state.productSkuList;
     sku[index].stock = "";
     await this.setState({productSkuList: sku})
    }
  }

  onSkuStockBlur = async (index,value) =>{
    if(!value)
    {
     var sku = this.state.productSkuList;
     sku[index].stock = 0;
     await this.setState({productSkuList: sku})
    }
 }

    onSkuStockChange = async(index,value) =>{
      if(value)
      {          
          if(!onlyNumber.test(value)){         
          value = value.substring(0,value.length-1);          
          }  
      }      
      var sku = this.state.productSkuList;
          sku[index].stock = value;
      await this.setState({productSkuList: sku})
    }

    getProductDetail = async() => {
        await this.setState({isloading:true});
        const query = queryString.parse(this.props.location.search);
        var res = await this.props.ProductManagementApiAction.GetProductDetail(query.productId);
        if(res?.data?.isError == true){
          this.props.AlertAction.setAlert(2,res?.data?.errorMsg,true);
        await this.setState({isloading:false});
        return;
      }
      var product = res?.data;
      let isAddOption = false;
      console.log("productSkuList : " +JSON.stringify(product.productSkuList));
      if(product.productSkuList?.length > 0){
          isAddOption = true;
      }
      var fullPrice = 0;
      if(product.maxPrice == product.minPrice){
        fullPrice = product.minPrice
      }
      await this.setState({isActive:product.isActive,skuName:product.skuName,isAddOption:isAddOption,fullprice:fullPrice,stock:product.stock,isloading:false,productName:product.productName,productDesc:product.productDesc,productMainContent:product.productMainContent,productSkuList:product.productSkuList});
      console.log("productSkuList State : " +JSON.stringify(this.state.productSkuList[0].productSkuContent));
      var isDisable = this.CheckDisableSaveButton();
      await this.setState({IsSaveDisable:isDisable});
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
        productSkuContent: {
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
       
        if(this.state.IsAddImageSku)
        {
          
          var sku = this.state.productSkuList;
          sku[i].productSkuContent.imagePath = base64;
           await this.setState({productSkuList: sku})
        }
        else
        {
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
    }
   
    validateSize(e) {
     let result = false;
     const limitSize = 2097152; 
     const size = e;
     if (size < limitSize) {
         result = true;
     } else {
         result = false;
         this.props.AlertAction.setAlert(2,"????????????????????????????????????????????????????????????",true);
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
         this.props.AlertAction.setAlert(2,"??????????????????????????????????????????????????????????????????",true);
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

  deleteSkuImage = async(index) =>{   
   
          var sku = this.state.productSkuList;
          sku[index].productSkuContent.imagePath = "";
           await this.setState({productSkuList: sku})
  }
   addImage = async() => {
    await this.setState({IsAddImageSku:false});
   $(document).ready(async function () {
       try {
           $('#images').trigger('click')
       } catch (error) {
         toast.error("?????????????????????????????????????????? ??????????????????????????????????????????????????????????????????");
       }
   });
 }

 addSkuImage = async() =>{

  await this.setState({IsAddImageSku:true});
  $(document).ready(async function () {
      try {
          $('#images').trigger('click')
      } catch (error) {
        toast.error("?????????????????????????????????????????? ??????????????????????????????????????????????????????????????????");
      }
  });
}

cancelOnClick = async() =>{
  await this.componentDidMount()
  await this.setState({isEdit:false})
}

editOnClick = async() =>{
    await this.setState({isEdit:true})
}

onsubmit = async() =>{
  try{
    await this.props.AlertAction.setConfirmAlert('?????????????????????????????????',this.updateProductApi.bind(this),true);
  }
  catch(ex){
    toast.error("?????????????????????????????????????????? ??????????????????????????????????????????????????????????????????");
    }
}

updateProductApi = async() =>{
var isValid = await this.submitValidation();
if(isValid){
  let maxPrice = parseFloat(this.state.fullprice);
  let minPrice =  parseFloat(this.state.fullprice);
  let stock = parseFloat(this.state.stock);
  var sku = this.state.productSkuList;
 
  if(this.state.isAddOption)
  {
  for(let i = 0;i<this.state.productSkuList?.length;i++){
    sku[i].skuName = this.state.skuName;
    if(parseFloat(sku[i].fullPrice) > maxPrice){
      maxPrice = parseFloat(sku[i].fullPrice)
    }
    if(minPrice <= 0)
    {
      minPrice = parseFloat(sku[i].fullPrice)
    }
    else if(parseFloat(sku[i].fullPrice) < minPrice){
      minPrice = parseFloat(sku[i].fullPrice)
    }
    stock = stock + parseFloat(sku[i].stock);
  }
}

  await this.setState({productSkuList: sku})
  const query = queryString.parse(this.props.location.search);
  var request =  {
    productId:query.productId,
    shopId: this.props.Shop.Shop._id,
    merchantId: this.props.Merchant.Merchant.id,
    maxPrice: maxPrice,
    minPrice:minPrice,
    productName: this.state.productName,
    productDesc: this.state.productDesc,
    productMainContent: this.state.productMainContent,
    productSku:this.state.productSkuList,
    stock:stock,
    fullPrice:this.state.fullPrice,
    isActive:this.state.isActive
  }

  await this.setState({isloading:true});
     const res = await this.props.ProductManagementApiAction.UpdateProduct(request);
     if(res?.data?.isError == true){
     await this.setState({isloading:false});
     this.props.AlertAction.setAlert(2,res?.data?.errorMsg,true);
     return;
   }
   await this.setState({isloading:false});
   this.props.AlertAction.setAlert(1,"??????????????????????????????????????????",true);
   this.props.history.push({
    pathname: '/Product-MainPage',
    search: `?shopId=${this.props?.Shop?.Shop?._id}`,
  });  
}
}

async submitValidation (){
  var isValid = true;
  await this.setState({productMainContentErrorText:"",productOptionErrorText:""})
  if(this.state.productMainContent.length <= 0 ){
      isValid = false;
      await this.setState({productMainContentErrorText:'??????????????????????????????????????????????????????????????????????????????????????????????????? 1 ?????????'})
  }
  if(this.state.isAddOption){
    if(IsNullOrEmpty(this.state.skuName)){
      isValid = false;
      await this.setState({productOptionErrorText:'????????????????????????????????????????????????????????????'})
     
    }
    else
    {
    for(let i = 0;i <this.state.productSkuList;i++){
      if(IsNullOrEmpty(this.state.productSkuList[i].option))
      {
        await this.setState({productOptionErrorText:'????????????????????????????????????????????????'})
        isValid = false;
        break;
      }
    }
  }
  }

  return isValid
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

{/*Product Detail*/}  
<div className="brown-Bold-Topic-Text" style={{padding:'0px 20px'}}>Product Detail</div>

<div className="form-group normal-background" style={{minHeight:this.state.height,position:'relative'}}> 



{/*Product Detail*/}  
<div className="brown-Bold-Topic-Text" style={{textAlign:'center'}}>Product Detail</div>

 {/*Detail View*/}     
         {/*Edit Button*/} 
         {!this.state.isEdit?
        <button  className={"primary-button"} style={{width:'150px',marginRight:'10px',right:'50px',position:'absolute',top:'50px'}} onClick={this.editOnClick} >Edit</button>:null}

 {/*????????????????????????????????????*/}     
 <div className="form-group row" style={{marginLeft: '30px',paddingTop: '30px'}}>
        <div className="imageTopic col-3" />
        <div className="black-Bold-Topic-Text col-9" >????????????????????????????????????</div>       
        </div >


        <div className="form-group row" style={{margin:'10px',marginRight: '50px'}}>
       {/*??????????????????????????????*/}
      <div className="col-2" style={{alignItems: 'center',display: 'flex',justifyContent: 'end'}}>
        <div> <a style={{color:'red'}}>*</a> ?????????????????????????????? :</div>
     </div>

      {/*?????????????????????????????? Input*/}
     <div className="col-10">
         {this.state.isEdit?
        <input type="text" class="form-control" value={this.state.productName} onChange={this.validateProductName.bind(this)}  id="InputProductName" maxLength={200} />
         :<div>{this.state.productName}</div>}
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
       {/*????????????????????????????????????????????????*/}
      <div className="col-2" style={{alignItems: 'center',display: 'flex',justifyContent: 'end'}}>
        <div> <a style={{color:'red'}}>*</a>???????????????????????????????????????????????? :</div>
     </div>

      {/*???????????????????????????????????????????????? Input*/}
     <div className="col-10">
         {this.state.isEdit?
         <textarea value={this.state.productDesc} onChange={this.validateProductDesc.bind(this)} type="text" class="form-control"  id="InputProductDesc" maxLength={500} />
        :<div>{this.state.productDesc}</div>}
        </div>

    </div>
    {!this.state.isAddOption?
    <React.Fragment>
    <div className="form-group row" style={this.state.option?{display:'none'}:{margin:'10px',marginRight: '50px'}}>
       {/*????????????*/}
      <div className="col-2" style={{alignItems: 'center',display: 'flex',justifyContent: 'end'}}>
        <div> <a style={{color:'red'}}>*</a> ???????????? :</div>
     </div>

      {/*???????????? Input*/}
     <div className="col-10">
         {this.state.isEdit?
        <input type="text" class="form-control" onFocus={(e) => this.onFullPriceFocus(e.target.value)}   value={this.state.fullprice} onBlur={(e)=> this.onFullPriceBlur(e.target.value)} onChange={(e)=>this.onFullPriceChange(e.target.value)}  id="InputProductFullprice" maxLength={20} />
        :<div>{this.state.fullprice}</div>}
        </div>
    </div>

 {/*Error Text Product Full Price*/}
    <div className="form-group row" style={this.state.fullPriceErrorText?{margin:'10px'}:{display:'none'}}>

    <div className="col-2" style={{alignItems: 'center',display: 'flex',justifyContent: 'end'}}>
        <div></div>
     </div>

     
     <div className="col-10">
     <div className="form-group input"  style={{padding:'10px 0px',textAlign:'start'}}>
       <div className="text-error">{this.state.fullPriceErrorText}</div>
     </div>
     </div>
     
    </div>

    <div className="form-group row" style={this.state.option?{display:'none'}:{margin:'10px',marginRight: '50px'}}>
       {/*???????????????*/}
      <div className="col-2" style={{alignItems: 'center',display: 'flex',justifyContent: 'end'}}>
        <div> <a style={{color:'red'}}>*</a> ??????????????? :</div>
     </div>

      {/*??????????????? Input*/}
     <div className="col-10">
         {this.state.isEdit?
        <input type="text" class="form-control" onFocus={(e) => this.onStockFocus(e.target.value)}   value={this.state.stock} onBlur={(e)=> this.onStockBlur(e.target.value)} onChange={(e)=>this.onStockChange(e.target.value)}  id="InputProductStock" maxLength={20} />
        :<div>{this.state.stock}</div>}
        </div>
    </div>

 {/*Error Text Product Stock*/}
    <div className="form-group row" style={this.state.stockErrorText?{margin:'10px'}:{display:'none'}}>

    <div className="col-2" style={{alignItems: 'center',display: 'flex',justifyContent: 'end'}}>
        <div></div>
     </div>

     
     <div className="col-10">
     <div className="form-group input"  style={{padding:'10px 0px',textAlign:'start'}}>
       <div className="text-error">{this.state.stockErrorText}</div>
     </div>
     </div>
     
    </div>

{/*Error Text Product Stock*/}
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
</React.Fragment> : null}

    <div className="form-group row" style={{margin:'10px',marginRight: '50px'}}>
       {/*?????????????????????????????????????????????????????????*/}
      <div className="col-2" style={{alignItems: 'center',display: 'flex',justifyContent: 'end'}}>
        <div> <a style={{color:'red'}}>*</a>????????????????????????????????????????????????????????? :</div>
     </div>

      {/*????????????????????????????????????????????????????????? Input*/}
     <div className="col-10">
     <div style={{display: 'flex',flexWrap: 'wrap'}}>
     <input type="file" id="images" multiple name="images" style={{ display: 'none' }} accept="image/*" onChange={this.selectShopImage.bind(this)} onClick={(event) => { event.target.value = null }}/>
       
        {/*???????????????*/}
        
        <div style={this.state.productMainContent.length > 0 ?{marginRight:'15px',display:'table-cell',position:'relative',padding:'0px',width:'150px',height:'150px',border:'1px solid lightgray',borderRadius:'5px',cursor:'pointer'}:{marginRight:'15px',padding:'0px',width:'150px',height:'150px',border:'1px solid lightgray',borderRadius:'5px',cursor:'pointer',display: 'table-cell' }} onClick={()=>this.state.isEdit?this.addImage():null} >
            <img className={this.state.productMainContent.length > 0?"vertical-center imgProduct":"imageCenter"} src={this.state.productMainContent.length > 0?this.state.productMainContent[0].imagePath : require('../assets/images/add_image.png').default} style={this.state.productMainContent.length > 0 ?{}:{margin:'37px'}}/>
            {this.state.productMainContent.length > 0 && this.state.isEdit ?  <button style={{ display: 'inline', zIndex: '1'}}><img  style={{position: 'absolute',width: '25px',height: '25px',right: '0px',top: '3px'}} onClick={() => this.deleteImage(0)} src={require('../assets/images/crossIcon.png').default} /></button> : null}
            <div style={this.state.productMainContent.length > 0 ?{fontSize: '14px',color: 'gray',position: 'absolute',bottom: '-25px',right: '35%'}:{textAlign: 'center',fontSize: '14px',color: 'gray',paddingTop: '5px'}}>???????????????</div>
       </div>
      

  {/*????????? 2*/}
  <div style={this.state.productMainContent.length > 1 ?{marginRight:'15px',display:'table-cell',position:'relative',padding:'0px',width:'150px',height:'150px',border:'1px solid lightgray',borderRadius:'5px',cursor:'pointer'}:{marginRight:'15px',padding:'0px',width:'150px',height:'150px',border:'1px solid lightgray',borderRadius:'5px',cursor:'pointer',display: 'table-cell' }} onClick={()=>this.state.isEdit?this.addImage():null} >
            <img className={this.state.productMainContent.length > 1?"vertical-center imgProduct":"imageCenter"} src={this.state.productMainContent.length > 1?this.state.productMainContent[1].imagePath : require('../assets/images/add_image.png').default} style={this.state.productMainContent.length > 1 ?{}:{margin:'37px'}}/>
            {this.state.productMainContent.length > 1 && this.state.isEdit?  <button style={{ display: 'inline', zIndex: '1'}}><img  style={{position: 'absolute',width: '25px',height: '25px',right: '0px',top: '3px'}} onClick={() => this.deleteImage(1)} src={require('../assets/images/crossIcon.png').default} /></button> : null}
            <div style={this.state.productMainContent.length > 1 ?{fontSize: '14px',color: 'gray',position: 'absolute',bottom: '-25px',right: '35%'}:{textAlign: 'center',fontSize: '14px',color: 'gray',paddingTop: '5px'}}>????????? 2</div>
       </div>

  {/*????????? 3*/}
  <div style={this.state.productMainContent.length > 2 ?{marginRight:'15px',display:'table-cell',position:'relative',padding:'0px',width:'150px',height:'150px',border:'1px solid lightgray',borderRadius:'5px',cursor:'pointer'}:{marginRight:'15px',padding:'0px',width:'150px',height:'150px',border:'1px solid lightgray',borderRadius:'5px',cursor:'pointer',display: 'table-cell' }} onClick={()=>this.state.isEdit?this.addImage():null} >
            <img className={this.state.productMainContent.length > 2?"vertical-center imgProduct":"imageCenter"} src={this.state.productMainContent.length > 2?this.state.productMainContent[2].imagePath : require('../assets/images/add_image.png').default} style={this.state.productMainContent.length > 2 ?{}:{margin:'37px'}}/>
            {this.state.productMainContent.length > 2 && this.state.isEdit?  <button style={{ display: 'inline', zIndex: '1'}}><img  style={{position: 'absolute',width: '25px',height: '25px',right: '0px',top: '3px'}} onClick={() => this.deleteImage(2)} src={require('../assets/images/crossIcon.png').default} /></button> : null}
            <div style={this.state.productMainContent.length > 2 ?{fontSize: '14px',color: 'gray',position: 'absolute',bottom: '-25px',right: '35%'}:{textAlign: 'center',fontSize: '14px',color: 'gray',paddingTop: '5px'}}>????????? 3</div>
       </div>

  {/*????????? 4*/}
  <div style={this.state.productMainContent.length > 3 ?{marginRight:'15px',display:'table-cell',position:'relative',padding:'0px',width:'150px',height:'150px',border:'1px solid lightgray',borderRadius:'5px',cursor:'pointer'}:{marginRight:'15px',padding:'0px',width:'150px',height:'150px',border:'1px solid lightgray',borderRadius:'5px',cursor:'pointer',display: 'table-cell' }}  onClick={()=>this.state.isEdit?this.addImage():null} >
            <img className={this.state.productMainContent.length > 3?"vertical-center imgProduct":"imageCenter"} src={this.state.productMainContent.length > 3?this.state.productMainContent[3].imagePath : require('../assets/images/add_image.png').default} style={this.state.productMainContent.length > 3 ?{}:{margin:'37px'}}/>
            {this.state.productMainContent.length > 3 && this.state.isEdit?  <button style={{ display: 'inline', zIndex: '1'}}><img  style={{position: 'absolute',width: '25px',height: '25px',right: '0px',top: '3px'}} onClick={() => this.deleteImage(3)} src={require('../assets/images/crossIcon.png').default} /></button> : null}
            <div style={this.state.productMainContent.length > 3 ?{fontSize: '14px',color: 'gray',position: 'absolute',bottom: '-25px',right: '35%'}:{textAlign: 'center',fontSize: '14px',color: 'gray',paddingTop: '5px'}}>????????? 4</div>
       </div>
     
       
      </div>
     </div>

    </div>

{/*Error Text Product Image*/}
<div className="form-group row" style={this.state.productMainContentErrorText?{margin:'10px'}:{margin:'10px',display:'none'}}>

<div className="col-2" style={{alignItems: 'center',display: 'flex',justifyContent: 'end'}}>
    <div></div>
 </div>

 
 <div className="col-10">
 <div className="form-group input"  style={{padding:'10px 0px',textAlign:'start'}}>
   <div className="text-error">{this.state.productMainContentErrorText}</div>
 </div>
 </div>
 
</div>
    <div className="form-group row" style={{margin:'10px',marginRight: '50px',marginTop:'40px'}}>

 {/*??????????????????????????????????????????*/}
 <div className="col-2" style={{alignItems: 'center',display: 'flex',justifyContent: 'end'}}>
        <div>?????????????????????????????????????????? :</div>
     </div>
     {this.state.productSkuList?.length > 0 ?
     <div className="col-10"  style={!this.state.isAddOption?{}:{paddingBottom:'15px',border: '2px solid #d7c6b4',borderStyle: 'dashed',position:'relative'}}>
        
     {!this.state.isAddOption ?
     <button onClick={this.AddOptionOnclick.bind(this)} style={{width:'100%', border:'2px solid #d7c6b4', color:'#d7c6b4',height:'35px',fontSize:'12px',cursor:'pointer',borderStyle: 'dashed'}} >
            <span>+ ?????????????????????????????????????????????????????????</span>
            </button>  

            : 
            <React.Fragment>
              
            <div className="form-group row" style={{margin:'10px',marginRight: '50px'}}>
              {this.state.isEdit?
            <button style={{ display: 'inline', zIndex: '1'}}><img  style={{position: 'absolute',width: '25px',height: '25px',right: '0px',top: '3px'}} onClick={this.DeleteOptionOnclick.bind(this)} src={require('../assets/images/crossIcon.png').default} /></button>
            :null}
            {/*????????????????????????????????????*/}
  <div className="col-2 value-add-detail-div" >

    <div style={{fontSize:'14px',}}>???????????? :</div>
 </div>

  {/*???????????????????????????????????? Input*/}
  <div className="col-10" >    
  {this.state.isEdit?
    <input type="text" class="form-control" value={this.state.skuName} onChange={this.skuNameOnChange.bind(this)}  id="InputOptionName" maxLength={100} />
    :null}
    </div>

</div>

<React.Fragment>
  
  {this.state.productSkuList?.map(({
   skuName,
   option,
   productSkuContent,
   fullPrice,
   stock
},index) =>

  <React.Fragment>
    <div className="form-group" style={{position:'relative'}} >
     
<div className="form-group row" style={{margin:'10px',marginRight: '50px'}}>
                {/*????????????????????????*/}
      <div className="col-2 value-add-detail-div" style={{fontSize:'14px'}}>
        <div>???????????????????????? :</div>
     </div>

      {/*???????????????????????? Input*/}
      <div className="col-10" >
          {this.state.isEdit?
        <input type="text" class="form-control"  id="InputOption1" maxLength={100} value={option} onChange={(e) => this.optionNameOnChange(index,e.target.value)} />
        :<div>{option}</div>}
        </div>

     {this.state.productSkuList?.length > 1 && this.state.isEdit ? <button style={{ display: 'inline', zIndex: '1'}}><img  style={{position: 'absolute',width: '25px',height: '25px',right: '15px',top: '3px'}} onClick={() => this.deleteEachOption(index)} src={require('../assets/images/deleteIcon.png').default} /></button>:null}
    
</div>

<div className="form-group row" style={{margin:'10px',marginRight: '50px'}}>
                {/**/}
      <div className="col-2" style={{alignItems: 'center',display: 'flex',justifyContent: 'end'}}>
     </div>

      {/*????????????*/}
     <div className="col-1" style={{fontSize:'14px', alignItems: 'center',display: 'flex',justifyContent: 'end'}} >
        <div>???????????? :</div>
     </div>

      {/*???????????? Input*/}
      <div className="col-4">
          {this.state.isEdit?
        <input type="text" class="form-control"  id="InputOption1Price" maxLength={20} onFocus={(e) => this.onPriceFocus(index,e.target.value)}   value={fullPrice} onBlur={(e)=> this.onPriceBlur(index,e.target.value)} onChange={(e)=>this.onPriceChange(index,e.target.value)}/>
        :<div>{fullPrice}</div>}
        </div>

{/*Stock*/}
     <div className="col-2" style={{fontSize:'14px',alignItems: 'center',display: 'flex',justifyContent: 'end'}}>
        <div>??????????????? :</div>
     </div>

       {/*Stock Input*/}
       <div className="col-3">
           {this.state.isEdit?
        <input type="text" class="form-control"  id="InputOption1Stock" maxLength={20} value={stock} onFocus={(e) => this.onSkuStockFocus(index,e.target.value)} onBlur={(e)=> this.onSkuStockBlur(index,e.target.value)} onChange={(e)=>this.onSkuStockChange(index,e.target.value)}/>
        :<div>{stock}</div>}
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

  {/*Button ???????????????????????????????????????*/}
  <div className="col-10">
  {this.state.isEdit?
  <button onClick={this.AddMoreOptionOnClick.bind(this)} style={{width:'100%', border:'2px solid #d7c6b4', color:'#d7c6b4',height:'35px',fontSize:'12px',cursor:'pointer',borderStyle: 'dashed'}} >
 <span>+ ???????????????????????????????????????</span>
 </button> :null}

 </div>

 </div>
}

<div className="form-group row" style={{margin:'10px',marginRight: '50px'}}>
       {/**/}
      <div className="col-2" style={{alignItems: 'center',display: 'flex',justifyContent: 'end'}}>
        <div></div>
     </div>

{/*?????????????????????????????? SKU Input*/}
<div className="col-10">
     <div style={{display: 'flex',flexWrap: 'wrap'}}>
     <input type="file" id="images" name="images" style={{ display: 'none' }} accept="image/*" />
       
        {/*SKU IMAGE*/}
        
        <React.Fragment>
  {this.state.productSkuList?.map(({
   skuName,
   option,
   productSkuContent,
   fullPrice,
   stock
},index) =>

  <React.Fragment>
        <div onClick={()=>this.state.isEdit ?this.addSkuImage():null} style={productSkuContent?.imagePath?{marginRight:'15px',display:'table-cell',position:'relative',padding:'0px',width:'150px',height:'150px',border:'1px solid lightgray',borderRadius:'5px',cursor:'pointer'}:{marginRight:'15px',padding:'0px',width:'150px',height:'150px',border:'1px solid lightgray',borderRadius:'5px',cursor:'pointer',display: 'table-cell' }}  >
            
            <img className={productSkuContent?.imagePath ?"vertical-center imgProduct":"imageCenter"} src={productSkuContent?.imagePath?productSkuContent?.imagePath : require('../assets/images/add_image.png').default} style={productSkuContent?.imagePath?{}:{margin:'37px'}}/>
            {productSkuContent?.imagePath && this.state.isEdit ?  <button style={{ display: 'inline', zIndex: '1'}}><img  style={{position: 'absolute',width: '25px',height: '25px',right: '0px',top: '3px'}} src={require('../assets/images/crossIcon.png').default} onClick={()=>this.deleteSkuImage(index)} /></button> : null}
            <div style={this.state.productMainContent.length > 0 ?{fontSize: '14px',color: 'gray',position: 'absolute',bottom: '-25px',right: '35%'}:{textAlign: 'center',fontSize: '14px',color: 'gray',paddingTop: '5px'}}>{"SKU "+index+1}</div>
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
  :<div>{"-"}</div>}
{/*Error Text Produc Option*/}
<div className="form-group row" style={this.state.productOptionErrorText?{margin:'10px'}:{margin:'10px',display:'none'}}>

<div className="col-2" style={{alignItems: 'center',display: 'flex',justifyContent: 'end'}}>
    <div></div>
 </div>

 
 <div className="col-10">
 <div className="form-group input"  style={{padding:'10px 0px',textAlign:'start'}}>
   <div className="text-error">{this.state.productOptionErrorText}</div>
 </div>
 </div>
 
</div>

<div className="col-10">
     <div className="form-group input"  style={{padding:'10px 0px',textAlign:'start'}}>
       <div className="text-error">{this.state.fullPriceErrorText}</div>
     </div>
     </div>
     
    </div>

    <div className="form-group row" style={{margin:'10px',marginRight: '50px'}}>
       {/*???????????????*/}
      <div className="col-2" style={{alignItems: 'center',display: 'flex',justifyContent: 'end'}}>
        <div>??????????????? :</div>
     </div>

      {/*??????????????? Input*/}
     <div className="col-10">
         {this.state.isEdit && this.state.stock > 0 ?
         <div>
         <select id="productStatus" onChange={this.selectStatus.bind(this)} style={{width:'100%',height:'35px',border:'1px solid lightgray',borderRadius:'5px',padding:'5px'}}>
                     <option value="1">?????????????????????</option>
                     <option value="2">?????????????????????????????????</option>
                  </select>
                  </div>
        :<div>{this.state.isActive?this.state.stock > 0 ?"?????????????????????":"???????????????????????????" :"?????????????????????????????????"}</div>}
        </div>
    </div>

  {/*Button*/}
  {this.state.isEdit?
  <div className="form-group" style={{padding:'40px 0px',display:'flex',justifyContent:'center',margin:'0px 15px'}}>
     
     <button  className={!this.state.IsSaveDisable?"primary-button":"primary-button disabled"} style={{width:'250px',marginRight:'10px'}} onClick={!this.state.IsSaveDisable?this.onsubmit.bind(this):null} >Save</button>
     <button  className="secondary-button" style={{width:'250px'}} onClick={this.cancelOnClick.bind(this)} >Cancel</button>
    
   </div>:null}

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
  
  
  export default withRouter(connect(mapStateToProps,mapDispatchToProps)(ProductDetailPage));
  
