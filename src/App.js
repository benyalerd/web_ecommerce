import React,{Component,Suspense} from 'react';
import { connect } from 'react-redux';
import {Route,Switch,Redirect} from 'react-router-dom';
import {Oval} from 'react-loader-spinner'

const Login = React.lazy(() => import("./pages/LogIn"));
const Register = React.lazy(() => import("./pages/Register"));
const AddShop = React.lazy(() => import("./pages/AddShop"));
const MainPage = React.lazy(() => import("./pages/MainPage"))
const Loading = React.lazy(() => import("./component/Loadind"))

class App extends Component{
  displayName = "Ecommerce";

  render(){
    return(
    <Suspense fallback={
       <div style={{width: 'fit-content',margin: 'auto',marginTop:'20px'}}>
    <Oval arialLabel="loading-indicator" color="#4f6137"  visible={true}/>
    </div>
    }>
      <Switch>
        <Route exact path="/" component={Login}/>
        <Route path="/Register" component={Register}/>
        <Route path="/Register-Shop" component={AddShop}/>
        <Route path="/MainPage" component={MainPage}/>
         <Route path="/Loading" component={Loading}/>
        
        <Redirect to="/"/>
      </Switch>
    </Suspense>
    )
  }
}

export default connect(null,null)(App);