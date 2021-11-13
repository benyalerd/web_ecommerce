import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter} from 'react-router-dom'
import { applyMiddleware, createStore } from 'redux';
import rootReducer from './reducers';
import thunk from 'redux-thunk'
import logger from 'redux-logger';
import { Provider } from 'react-redux';


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


