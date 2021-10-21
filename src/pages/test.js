import React from 'react';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import * as testAction from '../actions/test/test'
import {connect} from 'react-redux';


class Test extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      test:"Test ja"
    }
  }

  
  async componentDidMount(){
  this.props.TestAction.setTest("Beer Narak");
  }

  render(){
    return(
      <div>
<h1>{this.state.test}</h1>
<h1>{this.props.Test.testText}</h1>
</div>

    );
  }
}
const mapStateToProps = state =>({
  Test :state.Test
});

const mapDispatchToProps = dispatch =>({
  TestAction : bindActionCreators(testAction,dispatch)
});


export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Test));