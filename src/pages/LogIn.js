import React from 'react';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import * as loginAction from '../actions/Login/LogInAction'
import * as loginApiAction from '../actions/api/LoginApiAction'

class LogIn extends React.Component{
    constructor(props){
      super(props);
      this.state = {      
      }
    }
  
    async componentDidMount(){

    }
  
    render(){
      return(
    <div className="form-row">
        <div>Test</div>
        <div>Login</div>
        <button type="button" class="btn btn-primary">Primary</button>
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