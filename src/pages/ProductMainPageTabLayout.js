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
import Pagination from "react-js-pagination";
import queryString from 'query-string';
import ConfirmAlertDialog from '../component/dialog/ConfirmAlertDialog';



class ProductMainPageTabLayout extends React.Component{
    constructor(props) {
      super(props);
      this.state = 
      { width: 0, 
        height: 0,
        isloading:false,
        searchText:"",
        sorting:"",
        sortingDesc:false,
        totalCount:0,
        activePage:0,
        limit:10,
        productList:[],
        selectProductId:0
      };
      this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }
    
    componentDidMount() {
      this.updateWindowDimensions();
      window.addEventListener('resize', this.updateWindowDimensions);
      this.getProductList();
    }
    
    componentWillUnmount() {
      window.removeEventListener('resize', this.updateWindowDimensions);
    }
    
    updateWindowDimensions() {
      this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    getProductList = async() => {
      await this.setState({isloading:true});
      const query = queryString.parse(this.props.location.search);
      var res = await this.props.ProductManagementApiAction.GetProductList(query.shopId,this.state.limit,this.state.activePage,this.state.searchText,this.state.sorting,this.state.sortingDesc,this.props.ProductManagement.productTabId);
      if(res?.data?.isError == true){
        this.props.AlertAction.setAlert(2,res?.data?.errorMsg,true);
      await this.setState({isloading:false});
      return;
    }
    await this.setState({isloading:false,productList:res?.data?.productList,totalCount:res?.data?.totalRecord});
  }

    onChangeInputSearch = (e) =>{
      var value = e.target.value
        this.setState({searchText:value}); 
    }

    selectSorting = async (e) =>{
      var value = e.target.value
      var sorting = "createdDate";
      var sortingDesc = false;

      if(value === "1"){
        sortingDesc = true;
      }
      else if(value === "3"){
        sorting = "fullPrice"
      }
      else if(value === "4"){
        sorting = "fullPrice"
        sortingDesc = true;
      }
      
      await this.setState({sorting:sorting,sortingDesc:sortingDesc}); 
      await this.getProductList()
    }

    async handlePageChange (pageNumber) {
      this.setState({activePage: pageNumber});
      await this.getProductList()
    }
    async deleteProductOnclick (productId) {
      try{
        await this.setState({selectProductId:productId});
        await this.props.AlertAction.setConfirmAlert('ลบสินค้า',this.deleteProductApi.bind(this),true);
      }
      catch(ex){
        toast.error("เกิดข้อผิดพลาด กรุณาติดต่อเจ้าหน้าที่");
        }
    }

     onProductDetailClick = async(productId) => {
      await this.history.push(`/Product-ProductDetail?productId=${productId}`);
     }

    async deleteProductApi () {
      await this.setState({isloading:true});
      var res = await this.props.ProductManagementApiAction.DeleteProduct(this.state.selectProductId);
      if(res?.data?.isError == true){
        this.props.AlertAction.setAlert(2,res?.data?.errorMsg,true);
        await this.setState({isloading:false});
        return;
      
      }
      await this.setState({isloading:false});
      this.props.AlertAction.setAlert(1,"ทำรายการสำเร็จ",true);
      await this.componentDidMount();
    }

    addProductOnClick = () =>{
      this.props.history.push('/Product-AddProduct');
    }
    
    render(){
        return(      
        <React.Fragment>   

            <AlertDialog/>
            <ConfirmAlertDialog/>
            <Loading height={this.state.height} onLoading={this.state.isloading} />
            <React.Fragment>
            <ToastContainer />
        <div className="form-group row"  style={{padding: '10px 30px 10px 30px'}}>  

        {/*Input Search Text*/}     
        <div className="form-group col-7" >
        <input type="text" class="form-control"  id="InputSearch" value={this.state.searchText} onChange={this.onChangeInputSearch.bind(this)} placeholder="Enter ProductName"/>      
        </div>

        {/*Button Search*/}   
        <div className="form-group col-1" >
        <button  style={{width:'150px',backgroundColor:'#4f6137',width:'60px',height:'40px',borderRadius:'5px',fontSize:'16px',color:'white',cursor:'pointer'}} onClick={this.getProductList.bind(this)}>
        <img src={require('../assets/images/searchIcon.png').default} style={{marginTop: '0px',width:'30px',marginRight: '4px',display:'unset'}} ></img>
            </button>           
        </div>

 {/*Sorting DropDown*/}   
        <div className="form-group col-4">
        <div>
        <select id="sorting" onChange={this.selectSorting.bind(this)} value={this.state.sortingDisplay} style={{width:'100%',height:'40px',border:'1px solid lightgray',borderRadius:'5px',padding:'5px'}}>
                  <option value="1">สินค้าใหม่ไปเก่า</option>
                  <option value="2">สินค้าเก่าไปใหม่</option>
                  <option value="3">ราคาต่ำสุดไปสูงสุด</option>
                  <option value="4">ราคาสูงสุดไปต่ำสุด</option>
               </select>
               </div>
     </div>
        </div>


        <div className="form-group row"  style={{padding: '0px 30px 10px 30px'}}>  

{/*Total Record*/}     
<div className="form-group col-8"  style={{padding: '0px 15px'}}>
<div>{"Total "+this.state.totalCount+" Records"}</div>      
</div>

{/*Button เพิ่มสินค้า*/}   
<div className="form-group col-4"  style={{display:'flex',justifyContent:'end'}}>
<button style={{width:'150px',backgroundColor:'#4f6137',width:'175px',height:'40px',borderRadius:'5px',fontSize:'16px',color:'white',cursor:'pointer'}} onClick={this.addProductOnClick}>
            <img src={require('../assets/images/plusIcon.png').default} style={{marginTop: '0px',width:'30px',marginRight: '4px',display:'unset'}} ></img>
            <span>เพิ่มสินค้า</span>
            </button>       
</div>

</div>

<hr style={{border: '1px solid #4f6137', backgroundColor: '#4f6137',margin: '0px 30px'}}/> 

{/*Product List*/} 
<div className="row" style={{margin:'20px 40px', fontSize: '16px',height:'max-content'}}>
          {this.state.productList == null || this.state.productList.length <= 0?<div className="col-12" style={{background: 'white', padding: '10px 30px', fontWeight: 'bold', border: '1px solid lightgray', color: 'lightgray', borderRadius: '0px',textAlign:'center'}}>ไม่พบสินค้า</div>  :  
          
          <React.Fragment>
            {this.state.productList?.map(({
              _id,
              isActive,
              stock,
              minPrice,
              maxPrice,
              productName,
              productDesc,
              imagePath     
          },index) =>

            <React.Fragment>
            <div onClick={()=>this.onProductDetailClick(_id)} className="col-9" style={{background: 'white', height: '120px', padding: '10px 30px', fontWeight: 'bold', borderTop: '1px solid lightgray', borderBottom: '1px solid lightgray', borderLeft: '1px solid lightgray', color: 'black', borderRadius: '0px'}}>
                <div className="row mr-0 ml-0">
                    <div style={{width: 'fit-content'}}>
                          {/*Image*/}  
                        <img style={{width: '100px',height: '100px',marginRight: '20px',display:'unset'}}  src={imagePath ?imagePath:require('../assets/images/noimage.png').default}/> </div>
                        <div className="col-9" >
                            {/*Product Name*/}  
                            <div style={{fontSize: '16px'}}>{productName}</div>
                              {/*Price*/}  
                            <div style={{fontWeight:'normal',color:'red',fontSize: '16px'}}>{minPrice != maxPrice? "฿ "+minPrice+" - "+maxPrice:"฿ "+minPrice}</div>
                              {/*Stock*/}  
                            <div style={{fontWeight:'normal', fontSize: '13px'}}>{"คงเหลือ " +stock +" ชิ้น"}</div>
                            </div>                       
                    </div>
                </div>
                <div className="col-2" style={isActive?{display:'flex',justifyContent: 'center',alignItems: 'center',background: 'white', height: '120px', padding: '10px 30px', fontWeight: 'bold', borderTop: '1px solid lightgray', borderBottom: '1px solid lightgray', borderLeft: '1px solid lightgray', color: 'green', borderRadius: '0px'}:{display:'flex',justifyContent: 'center',alignItems: 'center',background: 'white', height: '120px', padding: '10px 30px', fontWeight: 'bold', borderTop: '1px solid lightgray', borderBottom: '1px solid lightgray', borderLeft: '1px solid lightgray', color: 'red', borderRadius: '0px'}}>
                  {!isActive?"ไม่พร้อมขาย":stock > 0 ?"ขายอยู่":"สินค้าหมด"}
                  </div>
 
 {/*Edit / Delete*/}  
       
       <div className="col-1" style={{background: 'white', height: '120px', fontWeight: 'bold', border: '1px solid lightgray', color: 'black', borderRadius: '0px',display: 'flex',alignItems: 'center',justifyContent: 'center'}}>        
           <img style={{width: '30px',height: '30px',display:'unset',cursor:'pointer'}} src={require('../assets/images/deleteIcon.png').default} onClick={() => this.deleteProductOnclick(_id)}/>
           
      </div>
      
       </React.Fragment>
         )}
         </React.Fragment>
       
       }
              </div>

              <hr style={{border: '1px solid #4f6137', backgroundColor: '#4f6137',margin: '0px 30px'}}/> 
        {/*Pagination*/} 
        {this.state.totalCount > 0 ?
<div className="form-group row"  style={{padding: '10px 30px 10px 30px'}}>
<Pagination
          innerClass="pagination pagination-ul"
          itemClass="pagination-li"
          itemClassFirst="pagination-li-first"
          activeClass="pagination-li-active"
          itemClassLast="pagination-li-last"
          hideDisabled={true}
          activePage={this.state.activePage+1}
          itemsCountPerPage={this.state.limit}
          totalItemsCount={this.state.totalCount}
          onChange={this.handlePageChange.bind(this)}
        />
  </div> : null
    }
     </React.Fragment>      
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
  
  
  export default withRouter(connect(mapStateToProps,mapDispatchToProps)(ProductMainPageTabLayout));
  
