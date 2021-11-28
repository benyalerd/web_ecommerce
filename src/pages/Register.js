import React from 'react';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

class Register extends React.Component{
    constructor(props){
      super(props);
      this.state = {      
      }
    }
  
    async componentDidMount(){

    }
  
    render(){
      return(
        <div className="form-group row" style={{height:this.state.height}}>       
        <div className="col-4" style={{backgroundColor:'#4f6137'}}></div>
      <div className="col-8" style={{position:'relative'}}>
        <div className="vertical-center" style={{width:'100%'}}>
      <div className="brown-Bold-Topic-Text" style={{textAlign:'center'}}>Login</div>
      <div className="form-group" style={{padding:'10px 350px'}}>
      <label for="InputEmail" className="brown-input-Text">Email</label>
      <input type="email" class="form-control" id="InputEmail"/>
    </div>
     <div className="form-group"  style={{padding:'10px 350px'}}>
     <label for="InputPassword" className="brown-input-Text">Password</label>
     <input type="password" class="form-control" id="InputPassword"/>
   </div>
   <div className="form-group"  style={{padding:'10px 400px'}}>
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
   
  });
  
  const mapDispatchToProps = dispatch =>({
    
  });
  
  
  export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Register));