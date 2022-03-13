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
import {Loading} from '../../component/Loadind';
import { ToastContainer, toast } from 'react-toastify';
import * as masterApiAction from '../../actions/api/MasterApiAction'

export class BookBankListDialog extends React.Component {  
    constructor(props) {
        super(props);
        this.state = {
            IsLoading: false,
            height: 0,
            bankingList: null,
            screenWidth: window.innerWidth,
        }
        window.addEventListener("resize", this.updateScreenWidth);
    };

    updateScreenWidth = async () => {
        this.setState({ screenWidth: window.innerWidth, height: window.innerHeight });
    };

    async componentDidMount() {
       await this.getMasterData();
    }

    getMasterData = async() => {
        try {
            await this.setState({IsLoading:true});          
            const response = await this.props.MasterApiAction.GetMasterData(1);
            console.log("Data : " +JSON.stringify(response))
            if(response?.data?.isError == true){
                await this.setState({IsLoading:false});
                //TO DO CATCH POPUP
                return;
            }           
            await this.setState({IsLoading:false,bankingList:response?.data?.masters});
        } 
        catch (error) {
            toast.error("เกิดข้อผิดพลาด กรุณาติดต่อเจ้าหน้าที่"); 
        }       
    };

    onClose = async() => {
        await this.props.PaymentSetupAction.setBookBankListDialogOpen(false);
    };

    handleClose = async() => {
        await this.props.PaymentSetupAction.setBookBankListDialogOpen(false);
    }

    async onClickSelectBank(_id,masterName, masterImg) {

        const SelectAccount = {
            "id":null,
            "shopId": this.props.Shop.Shop._id,
            "masterId": _id,
            "accountName": null,
            "accountNumber": null,
            "masterName":masterName,
            "masterImg":masterImg,
            "merchantId":this.props.Merchant.Merchant.id
        }    
        await this.props.PaymentSetupAction.setBookBankListDialogOpen(false);
        await this.props.PaymentSetupAction.setAddPaymentDialogOpen(SelectAccount,true);
    }

    onImgError = (e) => {
        e.target.onerror = null;
        e.target.src = require('../../assets/images/noimage.png').default
    }

    render() {
        let theme = null;
        const bankingList = this.state.bankingList;
        const screenWidth = this.state.screenWidth;
        const { t, SessionAlert } = this.props;

        if (this.props.PaymentSetup.IsOpen === true) {
            theme = createTheme({
                overrides: {
                    MuiDialog: {
                        paperFullWidth: {
                            maxWidth: '560px !important',
                            height: screenWidth <= 991.98 ? '491px !important' : '550px !important'
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
                    <ThemeProvider theme={theme}>
                        <Dialog
                            fullWidth={true}
                            maxWidth={true}
                            open={this.props.PaymentSetup.IsOpen}
                            onClose={this.handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                            style={{ zIndex: '100000' }}
                        >
                            <DialogContent>
                            <Loading height={this.state.height} onLoading={this.state.isloading} />

                               
                                <div className='form-group row' style={{ marginRight: '0px', marginLeft: '0px', paddingTop: '20px', paddingBottom: '20px', borderBottom: '3px solid #4f6137', marginBottom: '15px' }}>
                                    {/*กรุณาเลือกธนาคาร*/} 
                                    <div className='col-8' style={{ fontSize: '20px', fontWeight: 'bold', paddingLeft: '20px' }}>
                                        กรุณาเลือกธนาคาร
                                    </div>

                                    {/*close button*/} 
                                    <div className='col-4'>
                                        <img className='book-bank-list-dislog-close-button' src={require('../../assets/images/closeIcon.png').default} onClick={this.onClose} />
                                    </div>
                                </div>

                                {/*Bank List*/} 
                                {bankingList === undefined || bankingList === null || bankingList.length <= 0  ?

                                    <React.Fragment>
                                        <center style={{ position: 'absolute', margin: 'auto', left: '0px', right: '0px', top: '0px', bottom: '0px', height: 'fit-content' }}>
                                            <div style={{ fontSize: screenWidth <= 767 ? '16px' : '16px' }}>ไม่พบข้อมูลบัญชีธนาคาร</div>                                           
                                        </center>
                                    </React.Fragment>
                                    :
                                    <React.Fragment>
                                        {bankingList?.map(({
                                            _id,
                                            masterName,
                                            masterImg,
                                          
                                        }) =>
                                            <React.Fragment>                                            
                                              <div className='form-row select-book-bank-list' onClick={() => this.onClickSelectBank(_id,masterName, masterImg)}>
                                                        <img src={masterImg ? masterImg : require('../../assets/images/noimage.png').default} style={{ width: '40px', height: '40px', marginRight: '20px',display:'unset' }} onError={this.onImgError} />
                                                        <div style={{ paddingTop: '7px', marginLeft: '-5px',display:'unset',fontSize:'16px' }}>{masterName}</div>
                                                    </div>
                                                  
                                            </React.Fragment>
                                        )}
                                    </React.Fragment>
                                }
                                <div style={{ marginBottom: '15px' }}></div>
                            </DialogContent>
                        </Dialog>
                    </ThemeProvider>
                }
            </React.Fragment >
        );
    }
}


const mapStateToProps = state => ({
    PaymentSetup:state.PaymentSetup,
    SessionAlert:state.SessionAlert,
    Shop :state.Shop,
    Merchant:state.Merchant
});

const mapDispatchToProps = dispatch => ({
    PaymentSetupAction : bindActionCreators(paymentSetupAction,dispatch),
    MasterApiAction : bindActionCreators(masterApiAction,dispatch)
});

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(BookBankListDialog));