import React from 'react';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import ReactDOM from "react-dom";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import * as shippingSetupAction from '../../actions/Shipping/ShippingSetupAction';
import styled from 'styled-components';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import '../../assets/css/index.css';
import 'react-dropdown/style.css';
import {onlyNumber} from '../../helper/Regex'
import {Loading} from '../../component/Loadind';
import { ToastContainer, toast } from 'react-toastify';
import * as shippingSetupApiAction from '../../actions/api/ShippingSetupApiAction';
import {IsNullOrEmpty} from '../../helper/Common';
import * as masterApiAction from '../../actions/api/MasterApiAction'

class AddShippingDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            price: 0,
            priceDisplay: "",
            maxDay: 0,
            minDay: 0,
            periodError: "",
            priceError: "",
            IsLoading: false,
            screenWidth: window.innerWidth,
            priceLength:10,
            shippingList: null,
            selectShipping:null,
        }
        window.addEventListener("resize", this.updateScreenWidth);
    };

    updateScreenWidth = async () => {
        await this.setState({ screenWidth: window.innerWidth });
    };

    async componentDidMount() {
        await this.getMasterData();
        const shippingSelectDetail = this.props.ShippingSetup.shippingSelect;
        this.setState({ maxDay: shippingSelectDetail?.maxDay, minDay: shippingSelectDetail.minDay, priceDisplay: shippingSelectDetail?.price?.toFixed(2) });
    }

    async componentDidUpdate(prevProps, prevState) {
     if(prevProps.ShippingSetup.IsAddShippingOpen != this.props.ShippingSetup.IsAddShippingOpen)
     {
        await this.getMasterData();
        const shippingSelectDetail = this.props.ShippingSetup.shippingSelect;
        this.setState({ maxDay: shippingSelectDetail?.maxDay, minDay: shippingSelectDetail.minDay, priceDisplay: shippingSelectDetail?.price?.toFixed(2) });
     }
    }

    getMasterData = async() => {
        try {
            await this.setState({IsLoading:true});          
            const response = await this.props.MasterApiAction.GetMasterData(2);
            console.log("Master Shipping : " + JSON.stringify(response));
            if(response?.data?.isError == true){
                await this.setState({IsLoading:false});
                this.props.AlertAction.setAlert(2,response?.data?.errorMsg,true);
                return;
            }           
            await this.setState({shippingList:response?.data?.masters});
            if(response?.data?.masters != null || response?.data?.masters.length > 0 ){
                await this.setState({IsLoading:false,shippingList:response?.data?.masters[1]});
            }
        } 
        catch (error) {
            console.log("error");
            toast.error("เกิดข้อผิดพลาด กรุณาติดต่อเจ้าหน้าที่"); 
        }       
    };

    onClose = async() => {
        await this.props.ShippingSetupAction.setAddShippingDialogOpen([],false);
    };

    handleClose = async() => {
        await this.props.ShippingSetupAction.setAddShippingDialogOpen([],false);
    }

  
    onMaxDayChange = async(e) =>{
        var value = e.target.value
        
          if(value)
        {          
            if(!onlyNumber.test(value)){         
            value = value.substring(0,value.length-1);          
            }  
        }      
        await this.setState({maxDay:value,periodError:''}); 
      }

      onMinDayChange = async(e) =>{
        var value = e.target.value
          var value = e.target.value
        
          if(value)
        {          
            if(!onlyNumber.test(value)){         
            value = value.substring(0,value.length-1);          
            }  
        }      
        await  this.setState({minDay:value,periodError:''}); 
      }
      
      onPriceChange = async(e) =>{
        var value = e.target.value
        if(value)
        {          
            if(!onlyNumber.test(value)){         
            value = value.substring(0,value.length-1);          
            }  
        }      
        await this.setState({priceDisplay:value,priceError:'',price:value});
      }

      onPriceFocus = (e) =>{
       
        var value = e.target.value
          this.setState({priceDisplay:this.state.price,priceLength:7});
      }

      
      onPriceBlur = (e) =>{
        var value = e.target.value   
        var x = value.toFixed(2);
        this.setState({priceDisplay:value,priceLength:10});
    }

    addShippingApi = async (selectShippingDetail) =>{
        var res = await this.props.ShippingSetupApiAction.InsertShipping(selectShippingDetail);
        if(res?.data?.isError == true){
            this.props.AlertAction.setAlert(2,res?.data?.errorMsg,true);
            await this.setState({IsLoading:false});
            return;
          }
          await this.props.ShippingSetupAction.setPaymentEdit(false); 
          await this.props.ShippingSetupAction.setAddPaymentDialogOpen([],false);
    }

    updateShippingApi = async(selectShippingDetail) =>{
        var res = await this.props.ShippingSetupApiAction.EditShipping(selectShippingDetail);
        if(res?.data?.isError == true){
            this.props.AlertAction.setAlert(2,res?.data?.errorMsg,true);
             await this.setState({IsLoading:false});
             return;
           }
           await this.props.ShippingSetupAction.setPaymentEdit(false); 
           await this.props.ShippingSetupAction.setAddPaymentDialogOpen([],false);
    }

    Onsubmit = async() =>{
     
        var isValid = true;
        if(IsNullOrEmpty(this.state.price)){
        this.setState({accountNameError:"กรุณากรอกราคา"});
        isValid = false;
        }       
        if(IsNullOrEmpty(this.state.minDay) || IsNullOrEmpty(this.state.maxDay)){
        this.setState({loginErrorText:"กรุณากรอกระยะเวลา"});
        isValid = false;
        }
        else if(this.state.minDay > this.state.maxDay){
            this.setState({loginErrorText:"กรุณากรอกระยะเวลาให้ถูกต้อง"});
            isValid = false;
        }

        if(isValid === true){
            try
            {
              await this.setState({IsLoading:true});
              const shippingSelectDetail = this.props.ShippingSetup.shippingSelect;
              shippingSelectDetail.price = this.state.price;
              shippingSelectDetail.minDay = this.state.minDay;
              shippingSelectDetail.maxDay = this.state.maxDay;
              
             if(this.props.ShippingSetup.isEdit)
             {
             //TO DO POPUP CONFIRM
             }
             else
             {
                shippingSelectDetail.masterName= this.state.selectShipping.masterName;
                shippingSelectDetail.masterImg = this.state.selectShipping.masterImg;
                shippingSelectDetail.masterId = this.state.selectShipping._id;
                //TO DO POPUP CONFIRM
             }
             
          }
          catch(ex){
            console.log("Error: "+JSON.stringify(ex));
            toast.error("เกิดข้อผิดพลาด กรุณาติดต่อเจ้าหน้าที่");
            }
            await this.setState({IsLoading:false});
   
        }
        
    }
     
    async onClickSelectShippingName(e) {
        var value = e.target.value; 
        var select = this.state.shippingList?.find(x => x._id = value);
        await this.setState({selectShipping:select});
    }
    render() {
        let theme = null;
        const { SessionAlert } = this.props;
        const selectShippingDetail = this.props.ShippingSetup.shippingSelect;
        const {screenWidth} = this.state;

        if (this.props.ShippingSetup.IsAddPaymentOpen === true) {
            theme = createTheme({
                overrides: {
                    MuiDialog: {
                        paperFullWidth: {
                            maxWidth: '560px !important',
                            height: screenWidth <= 991.98 ? '450px !important' : '500px !important'
                        }
                    },
                    MuiDialogContent: {
                        root: {
                            padding: '0px !important'
                        }
                    }
                }
            });
        }

        return (
            <React.Fragment>
                {SessionAlert.alertstatus === true ? null
                    :
                    <React.Fragment>
                        <ThemeProvider theme={theme}>
                            <Dialog
                                fullWidth={true}
                                maxWidth={true}
                                open={this.props.ShippingSetup.IsAddShippingOpen}
                                onClose={this.handleClose}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                                style={{ zIndex: '100000' }}
                            >
                                <DialogContent>
                            
       <Loading height={this.state.height} onLoading={this.state.Isloading}/>

                                    <div style={{ overflowX: 'hidden', marginTop: screenWidth <= 767 ? '40px' : '80px', textAlign: 'center' }}>
                                        
                                         {/*Master Data - Shipping logo / Shiiping Name*/}     
                                        <div className="form-group row">
                                            <div className="col-md-12">
                                                <div style={{ display: 'inline-flex' }}>
                                                    <div className="select-book-bank-logobox" style={{ display: screenWidth <= 767 ? 'contents' : 'flex' }} >           
                                                           {/*(Edit) Master Data - Shipping logo / Shiiping Name*/} 
                                                           {this.props.ShippingSetup.isEdit?  
                                                           
                                                           <React.Fragment>
                                                                 <img className="select-book-bank-logo " src={this.state.selectShipping.masterImg ? this.state.selectShipping.masterImg :require('../../assets/images/noimage.png').default}  />
                                                                 <div>
      <select id="shippingName" onClick={this.onClickSelectShippingName.bind(this)}  value={this.state.selectShipping._id} style={{width:'150px',height:'35px',border:'1px solid lightgray'}}>
      <React.Fragment>
                                        {this.state.shippingList?.map(({
                                            _id,
                                            masterName,
                                            masterImg,                                    
                                        },index) =>
                                        <React.Fragment>    
                  <option value={_id}>{masterName}</option>
                  </React.Fragment>    
                   )}
                   </React.Fragment>                  
               </select>
               </div>
                                                           </React.Fragment>
                                                           :
                                                            <React.Fragment>
                                                                <img className="select-book-bank-logo " src={selectShippingDetail.masterImg ? selectShippingDetail.masterImg :require('../../assets/images/noimage.png').default}  />
                                                                <div style={{ fontSize: screenWidth <= 767 ? '20px' : '20px', fontWeight: 'bold', marginTop: '10px' }}>{selectShippingDetail.masterName ? selectShippingDetail.masterName:""}</div>
                                                          </React.Fragment>   
    }                                                    
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                            <React.Fragment>     
                                                 {/*ราคา*/}                                          
                                                <div className="form-group input" >
                                                <label for="shippingPrice" className="brown-input-Text" style={{display: 'flex'}}>ราคาค่าขนส่ง : </label>
                                                <input type="text" class="form-control"  id="shippingPrice" value={this.state.priceDisplay ? this.state.priceDisplay :""} autoComplete="off" maxLength={this.state.priceLength} onChange={this.onPriceChange.bind(this)} onFocus={this.onPriceFocus.bind(this)} onBlur={this.onPriceBlur.bind(this)}/> 
                                                </div>

                                                {/*Error Text*/}         
                                                <div className="form-group input"  style={{padding:'10px 0px',textAlign:'center'}}>
                                                 <div className="text-error">{this.state.priceError}</div>
                                                </div>
                                                                                            
                                            </React.Fragment>

                                             {/*ระยะเวลา*/}      
                                                <div className="form-group input" >
                                                <label for="shippingPeriod" className="brown-input-Text" style={{display: 'flex'}}>ระยะเวลาในการจัดส่ง : </label>
                                                <div className="form-row" style={{ display: 'flex',justifyContent: 'flex-start'}}>
                                                <input type="text" class="form-control"  id="shippingPeriod" style={{width:'75px',marginRight:'10px',display:'unset'}} value={this.state.minDay ?this.state.minDay :""} autoComplete="off" maxLength={5} onChange={this.onMinDayChange.bind(this)} />
                                                <div  className="brown-input-Text" style={{marginRight:'10px',display:'unset'}}>-</div>
                                                <input type="text" class="form-control"  id="shippingPeriod" style={{width:'75px',marginRight:'10px',display:'unset'}} value={this.state.maxDay ?this.state.maxDay :""} autoComplete="off" maxLength={5} onChange={this.onMaxDayChange.bind(this)} /> 
                                                <div  className="brown-input-Text" style={{display:'unset'}}>วัน</div>
                                                </div>
                                                </div>

                                            {/*Error Text*/}      
                                                <div className="form-group input"  style={{padding:'10px 0px',textAlign:'center'}}>
                                                 <div className="text-erroัr">{this.state.periodError}</div>
                                                </div>
                                                </div>
                                                                               
                                    {screenWidth <= 767 ?
                                        <div style={{ marginBottom: '40px' }} />
                                        :
                                        <React.Fragment>
                                            <br />
                                            <br />
                                        </React.Fragment>
                                    }

                                     {/*Button*/}      
                                    <div style={{ display: 'block', textAlign: 'center' }}>
                                        <button onClick={this.onClose} type="button" className="secondary-button"
                                            style={screenWidth <= 767 ? { width: '40%', height: '55px', fontSize: '24px', marginRight: '5px',border: 'solid 1px #4f6137' } : { width: '155px', height: '55px', marginRight: '5px',border: 'solid 1px #4f6137'}}>ยกเลิก</button>
                                        <button onClick={this.Onsubmit} type="button" className="primary-button"
                                            style={screenWidth <= 767 ? { width: '40%', height: '55px', fontSize: '24px' } : { width: '155px', height: '55px' }}>ตกลง</button>
                                    </div>
                                    
                                    {screenWidth <= 767 ?
                                        <div style={{ marginBottom: '10px' }} />
                                        :
                                        <br />
                                    }
                                </DialogContent>
                            </Dialog>
                        </ThemeProvider>
                    </React.Fragment >
                }
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    ShippingSetup:state.ShippingSetup,
    SessionAlert:state.SessionAlert,
});

const mapDispatchToProps = dispatch => ({
    ShippingSetupAction : bindActionCreators(shippingSetupAction,dispatch),
    ShippingSetupApiAction : bindActionCreators(shippingSetupApiAction,dispatch),
    MasterApiAction : bindActionCreators(masterApiAction,dispatch)
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddShippingDialog));
