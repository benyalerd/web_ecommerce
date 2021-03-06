import React from 'react';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import ReactDOM from "react-dom";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import * as paymentSetupAction from '../../actions/PaymentSetup/PaymentSetupAction';
import styled from 'styled-components';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import '../../assets/css/index.css';
import {SetAccountNumberDisplay} from '../../helper/Format';
import {onlyNumber} from '../../helper/Regex'
import {Loading} from '../../component/Loadind';
import { ToastContainer, toast } from 'react-toastify';
import * as paymentSetupApiAction from '../../actions/api/PaymentSetupApiAction';
import {IsNullOrEmpty} from '../../helper/Common';
import ConfirmAlertDialog from '../../component/dialog/ConfirmAlertDialog';
import * as alertAction from '../../actions/Alert/AlertAction';

class AddPaymentDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            accountNumber: "",
            accountNumberDisplay: "",
            accountName: "",
            accountNumberError: "",
            accountNameError: "",
            IsLoading: false,
            screenWidth: window.innerWidth,
            accountNumberLength:13,
            selectBankDetail:[]
        }
        window.addEventListener("resize", this.updateScreenWidth);
    };

    updateScreenWidth = async () => {
        await this.setState({ screenWidth: window.innerWidth });
    };

    async componentDidMount() {
        const selectBankDetail = this.props.PaymentSetup.bankSelect;
        this.setState({ accountNumber: selectBankDetail?.accountNumber, accountNumberDisplay: SetAccountNumberDisplay(selectBankDetail.accountNumber), accountName: selectBankDetail?.accountName });
    }

    async componentDidUpdate(prevProps, prevState) {
     if(prevProps.PaymentSetup.IsAddPaymentOpen != this.props.PaymentSetup.IsAddPaymentOpen)
     {
        const selectBankDetail = this.props.PaymentSetup.bankSelect;
        this.setState({ accountNumber: selectBankDetail?.accountNumber, accountNumberDisplay: SetAccountNumberDisplay(selectBankDetail.accountNumber), accountName: selectBankDetail?.accountName });
     }
    }

    onClose = async() => {
        await this.props.PaymentSetupAction.setAddPaymentDialogOpen([],false);
    };

    handleClose = async() => {
        await this.props.PaymentSetupAction.setAddPaymentDialogOpen([],false);
    }

  
    onAccountNameChange = (e) =>{
        var value = e.target.value
          this.setState({accountName:value,accountNameError:''}); 
      }
      
      onAccountNumberChange = async(e) =>{
        var value = e.target.value
        if(value)
        {          
            if(!onlyNumber.test(value)){         
            value = value.substring(0,value.length-1);          
            }  
        }      
        await this.setState({accountNumberDisplay:value,accountNumberError:'',accountNumber:value});
      }

      onAccountNumberFocus = (e) =>{
       
        var value = e.target.value
          this.setState({accountNumberDisplay:this.state.accountNumber,accountNumberLength:10});
      }

      
      onAccountNumberBlur = (e) =>{
        var value = e.target.value   
        var x = SetAccountNumberDisplay(value);
        this.setState({accountNumberDisplay:SetAccountNumberDisplay(value),accountNumberLength:13});
    }

    addPaymentApi = async () =>{
        var res = await this.props.PaymentSetupApiAction.InsertPayment(this.state.selectBankDetail);
        if(res?.data?.isError == true){
            this.props.AlertAction.setAlert(2,res?.data?.errorMsg,true);
            await this.setState({IsLoading:false});
            return;
          }
          await this.props.PaymentSetupAction.setPaymentEdit(false); 
          await this.props.PaymentSetupAction.setAddPaymentDialogOpen([],false);
    }

    updatePaymentApi = async() =>{
        var res = await this.props.PaymentSetupApiAction.EditPayment(this.state.selectBankDetail);
        if(res?.data?.isError == true){
            this.props.AlertAction.setAlert(2,res?.data?.errorMsg,true);
             await this.setState({IsLoading:false});
             return;
           }
           await this.props.PaymentSetupAction.setPaymentEdit(false); 
           await this.props.PaymentSetupAction.setAddPaymentDialogOpen([],false);
    }

    Onsubmit = async() =>{
     
        var isValid = true;
        if(IsNullOrEmpty(this.state.accountName)){
        this.setState({accountNameError:"??????????????????????????????????????????????????????"});
        isValid = false;
        }       
        if(IsNullOrEmpty(this.state.accountNumber)){
        this.setState({loginErrorText:"????????????????????????????????????????????????????????????"});
        isValid = false;
        }
        else if(this.state.accountNumber.length < 10){
        this.setState({loginErrorText:"???????????????????????????????????????????????????????????????"});
        isValid = false;
        }

        if(isValid === true){
            try
            {
              await this.setState({IsLoading:true});
              const selectBankDetail = this.props.PaymentSetup.bankSelect;
              selectBankDetail.accountName = this.state.accountName;
              selectBankDetail.accountNumber = this.state.accountNumber;
              await this.setState({selectBankDetail:selectBankDetail});
             if(this.props.PaymentSetup.isEdit)
             {
                await this.props.AlertAction.setConfirmAlert('????????????????????????????????????????????????????????????',this.updatePaymentApi.bind(this),true);
             }
             else
             {
                await this.props.AlertAction.setConfirmAlert('????????????????????????????????????????????????????????????',this.addPaymentApi.bind(this),true);
             }
             
          }
          catch(ex){
            console.log("Error: "+JSON.stringify(ex));
            toast.error("?????????????????????????????????????????? ??????????????????????????????????????????????????????????????????");
            }
            await this.setState({IsLoading:false});
   
        }
        
    }
              
    render() {
        let theme = null;
        const { SessionAlert } = this.props;
        const selectBankDetail = this.props.PaymentSetup.bankSelect;
        const {screenWidth} = this.state;

        if (this.props.PaymentSetup.IsAddPaymentOpen === true) {
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
                                open={this.props.PaymentSetup.IsAddPaymentOpen}
                                onClose={this.handleClose}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                                style={{ zIndex: '100000' }}
                            >
                                <DialogContent>
                            
       <Loading height={this.state.height} onLoading={this.state.Isloading}/>
       <ConfirmAlertDialog/>
                                    <div style={{ overflowX: 'hidden', marginTop: screenWidth <= 767 ? '40px' : '80px', textAlign: 'center' }}>
                                        
                                         {/*Master Data - Bank logo / Bank Name*/}     
                                        <div className="form-group row">
                                            <div className="col-md-12">
                                                <div style={{ display: 'inline-flex' }}>
                                                    <div className="select-book-bank-logobox" style={{ display: screenWidth <= 767 ? 'contents' : 'flex' }} >           
                                                            <React.Fragment>
                                                                <img className="select-book-bank-logo " src={selectBankDetail?.master?.masterImg ? selectBankDetail?.master?.masterImg :require('../../assets/images/noimage.png').default}  />
                                                                <div style={{ fontSize: screenWidth <= 767 ? '20px' : '20px', fontWeight: 'bold', marginTop: '10px' }}>{selectBankDetail?.master?.masterName ? selectBankDetail.masterName:""}</div>
                                                          </React.Fragment>                                                       
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                            <React.Fragment>     
                                                 {/*?????????????????????????????????*/}                                          
                                                <div className="form-group input" >
                                                <label for="accountNumber" className="brown-input-Text" style={{display: 'flex'}}>????????????????????????????????? : </label>
                                                <input type="text" class="form-control"  id="accountNumber" value={this.state.accountNumberDisplay ? this.state.accountNumberDisplay :""} autoComplete="off" maxLength={this.state.accountNumberLength} onChange={this.onAccountNumberChange.bind(this)} onFocus={this.onAccountNumberFocus.bind(this)} onBlur={this.onAccountNumberBlur.bind(this)}/> 
                                                </div>

                                                {/*Error Text*/}         
                                                <div className="form-group input"  style={{padding:'10px 0px',textAlign:'center'}}>
                                                 <div className="text-error">{this.state.accountNumberError}</div>
                                                </div>
                                                                                            
                                            </React.Fragment>

                                             {/*???????????????????????????*/}      
                                                <div className="form-group input" >
                                                <label for="accountName" className="brown-input-Text" style={{display: 'flex'}}>??????????????????????????? : </label>
                                                <input type="text" class="form-control"  id="accountName" value={this.state.accountName ?this.state.accountName :""} autoComplete="off" maxLength={200} onChange={this.onAccountNameChange.bind(this)} /> 
                                                </div>

                                            {/*Error Text*/}      
                                                <div className="form-group input"  style={{padding:'10px 0px',textAlign:'center'}}>
                                                 <div className="text-error">{this.state.accountNameError}</div>
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
                                            style={screenWidth <= 767 ? { width: '40%', height: '55px', fontSize: '24px', marginRight: '5px',border: 'solid 1px #4f6137' } : { width: '155px', height: '55px', marginRight: '5px',border: 'solid 1px #4f6137'}}>??????????????????</button>
                                        <button onClick={this.Onsubmit} type="button" className="primary-button"
                                            style={screenWidth <= 767 ? { width: '40%', height: '55px', fontSize: '24px' } : { width: '155px', height: '55px' }}>????????????</button>
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
    PaymentSetup:state.PaymentSetup,
    SessionAlert:state.SessionAlert,
    
});

const mapDispatchToProps = dispatch => ({
    PaymentSetupAction : bindActionCreators(paymentSetupAction,dispatch),
    PaymentSetupApiAction : bindActionCreators(paymentSetupApiAction,dispatch),
    AlertAction : bindActionCreators(alertAction,dispatch),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddPaymentDialog));
