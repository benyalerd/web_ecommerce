import React from 'react';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import * as registerAction from '../actions/Register/RegisterAction'
import * as registerApiAction from '../actions/api/RegisterApiAction'
import '../assets/css/index.css';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';


class Register extends React.Component{
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
      const options = [
        'Admin', 'Owner'
      ];
      const defaultOption = options[0];
      return(
        <div className="form-group row" style={{height:this.state.height}}>       
        <div className="col-4" style={this.state.width <= 998 ?{display:'none'}:{backgroundColor:'#4f6137'}} ></div>
      <div className={this.state.width <= 998 ?"col-12":"col-8"} style={{position:'relative'}}>
        <div className="vertical-center" style={{width:'100%'}}>
      <div className="brown-Bold-Topic-Text" style={{textAlign:'center'}}>Register</div>
      <div className="form-group row">
      <div className="form-group input col-6" >
      <label for="InputFirstname" className="brown-input-Text">Firstname</label>
      <input type="text" class="form-control"  id="InputFirstname"/>
     </div>
     <div className="form-group input col-6">
      <label for="InputLastname" className="brown-input-Text">Lastname</label>
      <input type="text" class="form-control"  id="InputLastname"/>
     </div>
    </div>

    <div className="form-group row">
      <div className="form-group input col-6">
      <label for="InputTel" className="brown-input-Text">Tel</label>
      <input type="text" class="form-control"  id="InputTel"/>
     </div>
     <div className="form-group input col-6">
     <label for="InputEmail" className="brown-input-Text">Email</label>
        <input type="email" class="form-control"  id="InputEmail"/>
     </div>
    </div>

    <div className="form-group row">
      <div className="form-group input col-6">
      <label for="InputPassword" className="brown-input-Text">Password</label>
      <input type="password" class="form-control"  id="InputPassword"/>
     </div>
     <div className="form-group input col-6">
     <label for="InputConfirmPassword" className="brown-input-Text">Confirm Password</label>
        <input type="password" class="form-control"  id="InputConfirmPassword"/>
     </div>
    </div>

    <div className="form-group row">
      <div className="form-group input col-6">
      <label for="InputRole" className="brown-input-Text">Role</label>
      <Dropdown options={options} value={defaultOption}/>
     </div>
     <div className="form-group input col-6">
     </div>
    </div>
    <div className="form-group" style={{padding:'40px 0px',display:'flex',justifyContent:'center',margin:'0px 15px'}}>
     
      <button  className="primary-button" style={{width:'250px',marginRight:'10px'}}>Login</button>
      <button  className="secondary-button" style={{width:'250px'}}>Cancel</button>
     
    </div>
    
  
  
   </div>
   </div>
   </div>
      );
    }
  }
  const mapStateToProps = state =>({
    Register :state.Register
  });
  
  const mapDispatchToProps = dispatch =>({
    RegisterAction : bindActionCreators(registerAction,dispatch),
    RegisterApiAction : bindActionCreators(registerApiAction,dispatch)
  });
  
  
  export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Register));