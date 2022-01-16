import React from 'react';
import {Oval} from 'react-loader-spinner'
const Loading = () => {
  return (
               <div style={{width: 'fit-content',margin: 'auto',marginTop:'20px'}}>
    <Oval arialLabel="loading-indicator" color="#4f6137"  visible={true}/>
    </div>
  );
};

export default Loading;