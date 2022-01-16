import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter} from 'react-router-dom'
import { applyMiddleware, createStore } from 'redux';
import rootReducer from './reducers';
import thunk from 'redux-thunk'
import logger from 'redux-logger';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import Popper from 'popper.js';
import "./style/main.bundle.css";

let storeSet = null;
if(process.env.NODE_ENV !='development' & window.ProdBuild === true)
{
  console.log = () =>{}
  storeSet = createStore(rootReducer,applyMiddleware(thunk));
}
else{
  storeSet = createStore(rootReducer,applyMiddleware(thunk,logger));
}
export const store = storeSet;
const rootElement = document.getElementById("root");

ReactDOM.render(
  <Provider store={store}>
  <BrowserRouter>  
    <App />    
  </BrowserRouter>
  </Provider>,
  rootElement
 
);


