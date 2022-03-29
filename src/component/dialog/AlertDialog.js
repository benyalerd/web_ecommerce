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


class AlertDialog extends React.Component {

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
        await this.props.AlertAction.setAlert(0,'',false);
    };

    handleClose = async() => {
        await this.props.AlertAction.setAlert(0,'',false);
    }

    render() {
        let theme = null;
        const { SessionAlert } = this.props;
        const {screenWidth} = this.state;

        if (this.props.Alert.AlertOpen === true) {
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
                                open={this.props.Alert.AlertOpen}
                                onClose={this.handleClose}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                                style={{ zIndex: '100000' }}
                            >
                                <DialogContent>
                            

                                    <div style={{ overflowX: 'hidden', marginTop: screenWidth <= 767 ? '40px' : '80px', textAlign: 'center' }}>
                                        
                                         {/*Master Data - Bank logo / Bank Name*/}     
                                        <div className="form-group">
                                            <div className="col-md-12">
                                                <div style={{ display: 'inline-flex' }}>
                                                    <div>           
                                                            <React.Fragment>
                                                                <img src={this.props.Alert.AlertType == 1 ? require('../../assets/images/correctIcon.png').default :require('../../assets/images/errorIcon.png').default}  style={{display :'unset'}}/>
                                                                <div style={{ fontSize: screenWidth <= 767 ? '20px' : '20px', fontWeight: 'bold', marginTop: '10px' }}>{this.props.Alert.Message}</div>
                                                          </React.Fragment>                                                       
                                                    </div>
                                                </div>
                                            </div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AlertDialog));