import React from 'react';
import {Oval} from 'react-loader-spinner'

export const Loading = ({height,onLoading}) => {
  var visibility = onLoading?'visible':'hidden';
  
  return (
    <div style={{visibility:visibility,opacity:'0.5',backgroundColor:'lightgray',minHeight:height,width:'100%',position:'fixed',top:'0',left:'0',zIndex:'99999999999'}}>
    <div style={{position:'relative',height:height}}>
               <div className="vertical-center" style={{right:'50%',margin: 'auto'}}>
    <Oval arialLabel="loading-indicator" color="#4f6137"  visible={true}/>
    </div>
    </div>
    </div>
  );
};

