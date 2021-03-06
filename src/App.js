import React,{Component,Suspense} from 'react';
import { connect } from 'react-redux';
import {Route,Switch,Redirect} from 'react-router-dom';
import {Oval} from 'react-loader-spinner'

const Login = React.lazy(() => import("./pages/LogIn"));
const Register = React.lazy(() => import("./pages/Register"));
const AddShop = React.lazy(() => import("./pages/AddShop"));
const MainPage = React.lazy(() => import("./pages/MainPage"));
const MerchantInfo = React.lazy(() => import("./pages/MerchantInfo"));
const ShopInfo = React.lazy(() => import("./pages/ShopInfo"));
const PaymentSetup = React.lazy(() => import("./pages/PaymentSetup"));
const ShippingSetup = React.lazy(() => import("./pages/ShippingSetup"));
const ProductMainPage = React.lazy(() => import("./pages/ProductMainPage"));
const AddProductPage = React.lazy(()=> import("./pages/AddProductPage"));
const ProductDetailPage = React.lazy(()=> import("./pages/ProductDetailPage"));
const TransactionMainPage = React.lazy(()=> import("./pages/TransactionMainPage"));
const TransactionDetailPage= React.lazy(()=> import("./pages/TransactionDetailPage"));

class App extends Component{
  displayName = "Ecommerce";

  render(){
    const height = window.innerHeight;
    return(
    <Suspense fallback={
     <div></div>
    }>
      <Switch>
        <Route exact path="/" component={Login}/>
        <Route path="/Register" component={Register}/>
        <Route path="/Register-Shop" component={AddShop}/>
        <Route path="/MainPage" component={MainPage}/>
        <Route path="/MerchantInfo" component={MerchantInfo}/>
        <Route path="/ShopInfo" component={ShopInfo}/>
        <Route path="/ShippingSetup" component={ShippingSetup}/>
        <Route path="/PaymentSetup" component={PaymentSetup}/>
        <Route path="/Product-MainPage" component={ProductMainPage}/>
        <Route path="/Product-AddProduct" component={AddProductPage}/>
        <Route path="/Product-ProductDetail" component={ProductDetailPage}/>
        <Route path="/Transaction-MainPage" component={TransactionMainPage}/>
        <Route path="/Transaction-TransactionDetail" component={TransactionDetailPage}/>
       


        <Redirect to="/"/>
      </Switch>
    </Suspense>
    )
  }
}

export default connect(null,null)(App);