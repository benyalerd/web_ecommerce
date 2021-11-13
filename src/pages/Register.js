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
      <h1>Test</h1>
  
      );
    }
  }
  const mapStateToProps = state =>({
   
  });
  
  const mapDispatchToProps = dispatch =>({
    
  });
  
  
  export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Register));