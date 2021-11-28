import React from 'react';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import * as loginAction from '../actions/Login/LogInAction'
import * as loginApiAction from '../actions/api/LoginApiAction'
import '../assets/css/index.css';
import { buildQueries } from '@testing-library/dom';

class LogIn extends React.Component{
  constructor(props) {
    super(props);
    this.state = 
    { width: 0, 
      height: 0 };
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
        <div className="brown-Bold-Topic-Text" style={{textAlign:'center'}}>Login</div>
        <div className="form-group input" >
        <label for="InputEmail" className="brown-input-Text">Email</label>
        <input type="email" class="form-control"  id="InputEmail"/>
      </div>
       <div className="form-group input">
       <label for="InputPassword" className="brown-input-Text">Password</label>
       <input type="password" class="form-control" id="InputPassword"/>
     </div>
     <div className="form-group input"  style={{width:'250px'}}>
      <button  className="primary-button">Login</button>
     </div>
     <div className="form-group"  style={{padding:'10px 0px',textAlign:'center'}}>
       <a className="text-link">Register</a>
     </div>
     </div>
     </div>
     </div>
     
      );
    }
  }
  const mapStateToProps = state =>({
    Login :state.Login
  });
  
  const mapDispatchToProps = dispatch =>({
    LoginAction : bindActionCreators(loginAction,dispatch),
    LoginApiAction : bindActionCreators(loginApiAction,dispatch)
  });
  
  
  export default withRouter(connect(mapStateToProps,mapDispatchToProps)(LogIn));