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
import ProductMainPageTabLayout from './ProductMainPageTabLayout'
import * as productManagementAction from '../actions/ProductManagement/ProductManagementAction'

class ProductMainPage extends React.Component{
    constructor(props) {
      super(props);
      this.state = 
      { width: 0, 
        height: 0,
        isloading:false,
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

    async onClickTab(tabID) {
        await this.props.ProductManagementAction.setProductTabId(tabID);
    }
    render(){
        return(      
            <React.Fragment>   
              <DashboardLayout merchantName={this.props.Merchant?.Merchant?.name} shopId={this.props?.Shop?.Shop?._id}>        
            <div className="form-group"> 

{/*Tab Menu*/}  
<ul className="nav nav-tab-menu-ul">
    <li className={this.props.ProductManagement.productTabId === 1 ? "nav-tab-menu-li-active" : "nav-tab-menu-li"} style={{cursor:'pointer'}}><a className={this.props.ProductManagement.productTabId === 1 ? "nav-li-active" : "nav-li"} id="allproduct-tab" data-toggle="tab"  role="tab" aria-controls="allproduct" aria-selected="false" onClick={() => this.onClickTab(1)}>สินค้าทั้งหมด</a></li>
    <li className={this.props.ProductManagement.productTabId === 2 ? "nav-tab-menu-li-active" : "nav-tab-menu-li"} style={{cursor:'pointer'}}><a className={this.props.ProductManagement.productTabId === 2 ? "nav-li-active" : "nav-li"} id="outofstock-tab" data-toggle="tab"  role="tab" aria-controls="outofstock" aria-selected="false" onClick={() => this.onClickTab(2)}>สินค้าหมด</a></li>
  </ul>


{/*Layout Each Tab Menu*/} 
<div className="form-group normal-background" style={{height:this.state.height,marginTop:'0px'}}> 
<div className="tab-inline">

    {/*All Product Tab Menu*/}    
     <ProductMainPageTabLayout/>
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
    Merchant:state.Merchant,
    ProductManagement:state.ProductManagement
  });

  const mapDispatchToProps = dispatch =>({
    ShopAction : bindActionCreators(shopAction,dispatch),
    ShopApiAction : bindActionCreators(shopApiAction,dispatch),
      MerchantAction : bindActionCreators(merchantAction,dispatch),
      AlertAction : bindActionCreators(alertAction,dispatch),
      RegisterApiAction : bindActionCreators(registerApiAction,dispatch),
      ProductManagementAction : bindActionCreators(productManagementAction,dispatch)
  });
  
  
  export default withRouter(connect(mapStateToProps,mapDispatchToProps)(ProductMainPage));
  
