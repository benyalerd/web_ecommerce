import React,{Component,Suspense} from 'react';
import { connect } from 'react-redux';
import {Route,Switch,Redirect} from 'react-router-dom';


const Test = React.lazy(() => import("./pages/test"));
const Test2 = React.lazy(() => import("./pages/test2"));
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
        <Route exact path="/" component={Test2}/>
        <Route path="/test" component={Test}/>
        <Redirect to="/test"/>
      </Switch>
    </Suspense>
    )
  }
}

export default connect(null,null)(App);