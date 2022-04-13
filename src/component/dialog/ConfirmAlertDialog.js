import React from 'react';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import ReactDOM from "react-dom";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import styled from 'styled-components';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import '../../assets/css/index.css';
import * as alertAction from '../../actions/Alert/AlertAction';

class ConfirmAlertDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            screenWidth: window.innerWidth,
        }
        window.addEventListener("resize", this.updateScreenWidth);
    };

    updateScreenWidth = async () => {
        await this.setState({ screenWidth: window.innerWidth });
    };

    async componentDidMount() {

    }

    async componentDidUpdate(prevProps, prevState) {
    
    }

    onClose = async() => {
        await this.props.AlertAction.setConfirmAlert('',null,false);
    };

    handleClose = async() => {
        await this.props.AlertAction.setConfirmAlert('',null,false);
    }
    onSubmit = async () => {
       
        const doFunction = this.props.Alert.ConfirmAction;
        if (doFunction !== null && doFunction !== undefined) {          
            doFunction();
        }
        await this.props.AlertAction.setConfirmAlert('',null,false);
    };
    render() {
        let theme = null;
        const { SessionAlert } = this.props;
        const {screenWidth} = this.state;
        if (this.props.Alert.AlertConfirmOpen === true) {
            theme = createTheme({
                overrides: {
                    MuiDialog: {
                        paperFullWidth: {
                            maxWidth: '450px !important',
                            height: screenWidth <= 991.98 ? '250px !important' : '250px !important'
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
                                open={this.props.Alert.AlertConfirmOpen}
                                onClose={this.handleClose}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                                style={{ zIndex: '100000' }}
                            >
                                <DialogContent>
                            

                                    <div style={{ overflowX: 'hidden', marginTop: screenWidth <= 767 ? '40px' : '80px', textAlign: 'center' }}>
                                        
                                       
                                        <div className="form-group">
                                            <div className="col-md-12">
                                                <div style={{ display: 'inline-flex' }}>
                                                            
                                                                <div style={{ fontSize: screenWidth <= 767 ? '20px' : '20px', fontWeight: 'bold', marginTop: '10px' }}>{this.props.Alert.ConfirmMessage}</div>                                                    
                                                    
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group" style={{padding:'40px 0px',display:'flex',justifyContent:'center',margin:'0px 15px'}}>
     
     <button  className="primary-button" style={{marginRight:'10px'}} onClick={this.onSubmit}>OK</button>
     <button  className="secondary-button" onClick={this.handleClose} style={{border:'1px solid #4f6137'}}>Cancel</button>
    
   </div>
   

                                        </div>

                                                         
                                   
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
    Alert:state.Alert,
    SessionAlert:state.SessionAlert,
});

const mapDispatchToProps = dispatch => ({
    AlertAction : bindActionCreators(alertAction,dispatch),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ConfirmAlertDialog));