import React from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {DashboardLayout} from '../component/Layout';
class MainPage extends React.Component{
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
        //check have merchant or not
        //yes - next step
        //no - go to log in
        //check add shop or not
        //yes - render + set up merchant
        //no - go to add shop
      }
      
      componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
      }

      updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
      }
render(){
      //show shop detail + button edit shop
    return (
        <DashboardLayout>
         
        </DashboardLayout>
      )
  }
}
const mapStateToProps = state =>({

  });
  
  const mapDispatchToProps = dispatch =>({
  
  });
  
  
  export default withRouter(connect(mapStateToProps,mapDispatchToProps)(MainPage));
