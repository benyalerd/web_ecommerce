import React from 'react';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import * as shopAction from '../actions/Shop/ShopAction'
import * as shopApiAction from '../actions/api/ShopApiAction'
import '../assets/css/index.css';
import 'react-dropdown/style.css';


class AddShop extends React.Component{
  constructor(props) {
    super(props);
    this.state = 
    { width: 0, 
      height: 0,
     
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }
  
  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }
  
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  
  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }
  
    render(){
     
      return(
        <div className="form-group row" style={{height:this.state.height}}>       
        <div className="col-4" style={this.state.width <= 998 ?{display:'none'}:{backgroundColor:'#4f6137'}} ></div>
      <div className={this.state.width <= 998 ?"col-12":"col-8"} style={{position:'relative'}}>
        <div className="vertical-center" style={{width:'100%'}}>
      <div className="brown-Bold-Topic-Text" style={{textAlign:'center'}}>Register Shop</div>
      <div className="form-group input">
       <div className="input" style={{padding:'0px',width:'150px',height:'150px',border:'1px solid black',borderRadius:'5px'}}>
            <img src="http://cdn.onlinewebfonts.com/svg/img_203138.png"  style={{width:'75px',height:'auto',margin:'37px'}}/>
       </div>
      </div>
      <div className="form-group input">
      <label for="InputShopname" className="brown-input-Text">Shop Name</label>
      <input type="text" class="form-control"  id="InputShopname"/>
     </div>
      <div className="form-group input" >
        <label for="InputEmail" className="brown-input-Text">Email</label>
        <input type="email" class="form-control"  id="InputEmail"/>
       
      </div>
      <div className="form-group input">
      <label for="InputTel" className="brown-input-Text">Tel</label>
      <input type="text" class="form-control"  id="InputTel"/>
     </div>

     <div className="form-group input" style={{height:'150px'}}>
      <label for="InputShopname" className="brown-input-Text">Address</label>
      <input type="text" class="form-control"  id="InputShopname"/>
     </div>
    <div className="form-group" style={{padding:'40px 0px',display:'flex',justifyContent:'center',margin:'0px 15px'}}>
     
      <button  className="primary-button" style={{width:'250px',marginRight:'10px'}}>Register</button>
      <button  className="secondary-button" style={{width:'250px'}}>Cancel</button>
     
    </div>
    
  
  
   </div>
   </div>
   </div>
      );
    }
  }
  const mapStateToProps = state =>({
    Shop :state.Shop
  });
  
  const mapDispatchToProps = dispatch =>({
    ShopAction : bindActionCreators(shopAction,dispatch),
    ShopApiAction : bindActionCreators(shopApiAction,dispatch)
  });
  
  
  export default withRouter(connect(mapStateToProps,mapDispatchToProps)(AddShop));