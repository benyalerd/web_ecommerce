import React,{Component,Suspense} from 'react';
import { connect } from 'react-redux';
import {Route,Switch,Redirect} from 'react-router-dom';



const Login = React.lazy(() => import("./pages/LogIn"));
const Register = React.lazy(() => import("./pages/Register"));
const AddShop = React.lazy(() => import("./pages/AddShop"));
const MainPage = React.lazy(() => import("./pages/MainPage"))
class App extends Component{
  displayName = App.name;
  
  render(){
    return(
    <Suspense fallback={
      <div>
        <h1>Loading..</h1>
      </div>
    }>
      <Switch>
        <Route exact path="/" component={Login}/>
        <Route path="/Register" component={Register}/>
        <Route path="/Register-Shop" component={AddShop}/>
        <Route path="/MainPage" component={MainPage}/>
        <Redirect to="/"/>
      </Switch>
    </Suspense>
    )
  }
}

export default connect(null,null)(App);