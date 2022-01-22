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

class MainPage extends React.Component{
    constructor(props) {
        super(props);
        this.state = 
        { width: 0, 
          height: 0,
          shopName:"",
          shopEmail:"",
          shopImage:""
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
      }

      componentDidMount() {
        
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
        //check have merchant or not
        //yes - next step
        //no - go to log in
        //check add shop or not
        //yes - render+set up shop + set up merchant
        //no - go to add shop
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
        <DashboardLayout>
          <div style={{width: 'auto', height: this.state.height,backgroundColor:'white',margin:'20px',borderRadius:'10px'}}>
        <div className="form-group row" style={{marginLeft: '30px',paddingTop: '30px'}}>
        <div className="imageTopic col-3" />
        <div className="black-Bold-Topic-Text col-9" >ข้อมูลร้านค้า</div>       
 </div >
  <div className="form-group row" style={{backgroundColor:'#d7c6b4',margin:'20px 0px',height:'150px'}}>
    <div className="col-3" style={{position:'relative'}} >
     <div className="input vertical-center horizonCenter" style={{backgroundColor:'white', padding:'0px',margin:'0px',width:'100px',height:'100px',border:'1px solid lightgray',borderRadius:'5px'}}>
            <img  src={this.state.shopImage != null && this.state.shopImage != ""?this.state.shopImage: require('../assets/images/add_image.png').default} />
       </div>
    </div>
        <div className="col-7" style={{margin:'40px 0px'}}>
        <div className="form-group row" style={{marginBottom:'20px'}}>
        <div className="col-2 black-Bold-18-Text" style={{textAlign:'end'}}>ชื่อร้านค้า : </div>
        <div className="col-10 black-Bold-18-Text">{this.state.shopName != null && this.state.shopName != ""?this.state.shopName:"-"}</div>
        </div>
        <div className="form-group row">
         <div className="col-2 black-Bold-18-Text" style={{textAlign:'end'}}>Email : </div>
        <div className="col-10 black-Bold-18-Text">{this.state.shopEmail != null && this.state.shopEmail != ""?this.state.shopEmail:"-"}</div>
        </div>
        </div> 
        <div className="col-2" style={{position:'relative'}}>
        <button  className="primary-button vertical-center horizonCenter" style={{width:'150px'}} onClick={this.ShopInfoOnclick}>ดูรายละเอียด</button>
        </div>
  </div>
      
  
 </div>



        </DashboardLayout>
      )
  }
}
const mapStateToProps = state =>({
  Shop :state.Shop
  });
  
  const mapDispatchToProps = dispatch =>({
    ShopAction : bindActionCreators(shopAction,dispatch),
    ShopApiAction : bindActionCreators(shopApiAction,dispatch),
      MerchantAction : bindActionCreators(merchantAction,dispatch),
  });
  
  
  export default withRouter(connect(mapStateToProps,mapDispatchToProps)(MainPage));
