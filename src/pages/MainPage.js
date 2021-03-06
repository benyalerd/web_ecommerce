import React from 'react';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import * as shopAction from '../actions/Shop/ShopAction'
import * as shopApiAction from '../actions/api/ShopApiAction'
import {DashboardLayout} from '../component/Layout';
import * as merchantAction from '../actions/Merchant/MerchantAction'
import * as registerApiAction from '../actions/api/RegisterApiAction'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jwt_decode from "jwt-decode";
import '../assets/css/index.css';
import {Loading} from '../component/Loadind';
import * as alertAction from '../actions/Alert/AlertAction';
import AlertDialog from '../component/dialog/AlertDialog';

class MainPage extends React.Component{
  constructor(props) {
        super(props);
        this.state = 
        { width: 0, 
          height: 0,
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
      console.log("Merchant mainpage : "+ JSON.stringify(merchant));
      await this.props.MerchantAction.setMerchantInfo(merchant);   
      console.log("Merchant Main Page :" + JSON.stringify(this.props.Merchant));
      var res = await this.props.ShopApiAction.GetShopInfo(this.props.Merchant.Merchant.id); 
      console.log("ShopMainPage : "+JSON.stringify(res))    
      if(res?.data?.isError == true){
      this.props.AlertAction.setAlert(2,res?.data?.errorMsg,true);
      await this.setState({isloading:false});
      return;
      }
     
      if(!res?.data?.shops){
      this.props.history.push('/Register-Shop');
      }
      await this.props.ShopAction.setShopInfo(res.data.shops);
      await this.setState({isloading:false});
      }
           
      componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
      }

      updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
      }

      ShopInfoOnclick = () => {
      this.props.history.push('/ShopInfo');
      }
      
render(){     
    return (
       <React.Fragment>
         <AlertDialog/>
       <Loading height={this.state.height} onLoading={this.state.isloading} />
       <DashboardLayout merchantName={this.props.Merchant?.Merchant?.name} shopId={this.props?.Shop?.Shop?._id}>        
       <React.Fragment>
        <ToastContainer />  
        <div style={{width: 'auto', height: this.state.height,backgroundColor:'white',margin:'20px',borderRadius:'10px'}}>

        {/*???????????????????????????????????????*/}     
        <div className="form-group row" style={{marginLeft: '30px',paddingTop: '30px'}}>
        <div className="imageTopic col-3" />
        <div className="black-Bold-Topic-Text col-9" >???????????????????????????????????????</div>       
        </div >

          <div className="form-group row" style={{backgroundColor:'#d7c6b4',margin:'20px 0px',height:'150px'}}>

          {/*Shop Image*/}  
          <div className="col-3" style={{position:'relative'}} >
          <div className="input vertical-center horizonCenter" style={{backgroundColor:'white', padding:'0px',margin:'0px',width:'100px',height:'100px',border:'1px solid lightgray',borderRadius:'5px'}}>
            <img  src={this.props.Shop?.Shop?.coverImg != null && this.props.Shop?.Shop?.coverImg != ""? this.props.Shop?.Shop?.coverImg: require('../assets/images/add_image.png').default} />
       </div>

    </div>

     {/*Shop Info*/}  
        <div className="col-7" style={{margin:'40px 0px'}}>

           {/*Shop Name*/}  
        <div className="form-group row" style={{marginBottom:'20px'}}>
        <div className="col-2 black-Bold-18-Text" style={{textAlign:'end'}}>????????????????????????????????? : </div>
        <div className="col-10 black-Bold-18-Text">{this.props.Shop?.Shop?.shopName != null && this.props.Shop?.Shop?.shopName != ""?this.props.Shop?.Shop?.shopName:"-"}</div>
        </div>

         {/*Shop Email*/}  
        <div className="form-group row">
         <div className="col-2 black-Bold-18-Text" style={{textAlign:'end'}}>Email : </div>
        <div className="col-10 black-Bold-18-Text">{this.props.Shop?.Shop?.email != null && this.props.Shop?.Shop?.email != ""?this.props.Shop?.Shop?.email:"-"}</div>
        </div>
        </div> 

         {/*Button ????????????????????????????????????*/}  
        <div className="col-2" style={{position:'relative'}}>
        <button  className="primary-button vertical-center horizonCenter" style={{width:'150px'}} onClick={this.ShopInfoOnclick}>????????????????????????????????????</button>
        </div>

  </div> 
 </div>
 </React.Fragment>
  </DashboardLayout>
  </React.Fragment>
      )
  }
}
const mapStateToProps = state =>({
  Shop :state.Shop,
  Merchant:state.Merchant
  });
  
  const mapDispatchToProps = dispatch =>({
    ShopAction : bindActionCreators(shopAction,dispatch),
    ShopApiAction : bindActionCreators(shopApiAction,dispatch),
      MerchantAction : bindActionCreators(merchantAction,dispatch),
      AlertAction : bindActionCreators(alertAction,dispatch),
      RegisterApiAction : bindActionCreators(registerApiAction,dispatch)
  });
  
  
  export default withRouter(connect(mapStateToProps,mapDispatchToProps)(MainPage));
