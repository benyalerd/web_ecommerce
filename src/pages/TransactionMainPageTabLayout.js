import React from 'react';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import '../assets/css/index.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Loading} from '../component/Loadind';
import AlertDialog from '../component/dialog/AlertDialog';
import * as alertAction from '../actions/Alert/AlertAction';
import {DashboardLayout} from '../component/Layout';
import * as shopAction from '../actions/Shop/ShopAction'
import * as shopApiAction from '../actions/api/ShopApiAction'
import * as merchantAction from '../actions/Merchant/MerchantAction'
import * as registerApiAction from '../actions/api/RegisterApiAction'
import * as transactionManagementAction from '../actions/TransactionManagement/TransactionManagementAction'
import * as transactionManagementApiAction from '../actions/api/TransactionManagementApiAction'
import Pagination from "react-js-pagination";
import queryString from 'query-string';
import ConfirmAlertDialog from '../component/dialog/ConfirmAlertDialog';



class TransactionMainPageTabLayout extends React.Component{
    constructor(props) {
      super(props);
      this.state = 
      { width: 0, 
        height: 0,
        isloading:false,
        searchText:"",
        sorting:"",
        sortingDesc:false,
        totalCount:0,
        activePage:0,
        limit:10,
        transactionList:[],
        selectTransactionId:0
      };
      this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }
    
    componentDidMount() {
      this.updateWindowDimensions();
      window.addEventListener('resize', this.updateWindowDimensions);
      this.getTransactionList();
    }
    
    componentWillUnmount() {
      window.removeEventListener('resize', this.updateWindowDimensions);
    }
    
    updateWindowDimensions() {
      this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    getTransactionList = async() => {
      await this.setState({isloading:true});
      const query = queryString.parse(this.props.location.search);
      var res = await this.props.TransactionManagementApiAction.GetTransactionList(query.shopId,this.state.limit,this.state.activePage,this.state.searchText,this.state.sorting,this.state.sortingDesc,this.props.TransactionManagement.transactionTabId);
      if(res?.data?.isError == true){
        this.props.AlertAction.setAlert(2,res?.data?.errorMsg,true);
      await this.setState({isloading:false});
      return;
    }
    
    await this.setState({isloading:false,transactionList:res?.data?.transactionList,totalCount:res?.data?.totalRecord});
  }

    onChangeInputSearch = (e) =>{
      var value = e.target.value
        this.setState({searchText:value}); 
    }

    selectSorting = async (e) =>{
      var value = e.target.value
      var sorting = "createdDate";
      var sortingDesc = false;

      if(value === "1"){
        sortingDesc = true;
      }
      
      await this.setState({sorting:sorting,sortingDesc:sortingDesc}); 
      await this.getTransactionList()
    }

    async handlePageChange (pageNumber) {
      this.setState({activePage: pageNumber});
      await this.getTransactionList()
    }

     onTransactionDetailClick = async(transactionId) => {
      await this.history.push(`/Transaction-TransactionDetail?transactionId=${transactionId}`);
     }
    
    render(){
        return(      
        <React.Fragment>   

            <AlertDialog/>
            <ConfirmAlertDialog/>
            <Loading height={this.state.height} onLoading={this.state.isloading} />
            <React.Fragment>
            <ToastContainer />
        <div className="form-group row"  style={{padding: '10px 30px 10px 30px'}}>  

        {/*Input Search Text*/}     
        <div className="form-group col-7" >
        <input type="text" class="form-control"  id="InputSearch" value={this.state.searchText} onChange={this.onChangeInputSearch.bind(this)} placeholder="Enter ProductName"/>      
        </div>

        {/*Button Search*/}   
        <div className="form-group col-1" >
        <button  style={{width:'150px',backgroundColor:'#4f6137',width:'60px',height:'40px',borderRadius:'5px',fontSize:'16px',color:'white',cursor:'pointer'}} onClick={this.getTransactionList.bind(this)}>
        <img src={require('../assets/images/searchIcon.png').default} style={{marginTop: '0px',width:'30px',marginRight: '4px',display:'unset'}} ></img>
            </button>           
        </div>

 {/*Sorting DropDown*/}   
        <div className="form-group col-4">
        <div>
        <select id="sorting" onChange={this.selectSorting.bind(this)} value={this.state.sortingDisplay} style={{width:'100%',height:'40px',border:'1px solid lightgray',borderRadius:'5px',padding:'5px'}}>
                  <option value="1">วันที่ซื้อใหม่ไปเก่า</option>
                  <option value="2">วันที่ซื้อเก่าไปใหม่</option>
               </select>
               </div>
     </div>
        </div>


        <div className="form-group row"  style={{padding: '0px 30px 10px 30px'}}>  

{/*Total Record*/}     
<div className="form-group col-8"  style={{padding: '0px 15px'}}>
<div>{"Total "+this.state.totalCount+" Records"}</div>      
</div>

</div>

<hr style={{border: '1px solid #4f6137', backgroundColor: '#4f6137',margin: '0px 30px'}}/> 

{/*Transaction List*/} 
<div className="row" style={{margin:'20px 40px', fontSize: '16px',height:'max-content'}}>
          {this.state.transactionList == null || this.state.transactionList.length <= 0?<div className="col-12" style={{background: 'white', padding: '10px 30px', fontWeight: 'bold', border: '1px solid lightgray', color: 'lightgray', borderRadius: '0px',textAlign:'center'}}>ไม่พบรายการสั่งซื้อ</div>  :  
          
          <React.Fragment>
            {this.state.transactionList?.map(({
              _id,
              totalPrice,
              orderCode,
              shippingName,
              shippingImg,
              customerName,
              tranDate,
              tranType
          },index) =>

            <React.Fragment>
            <div onClick={()=>this.onTransactionDetailClick(_id)} className="col-8" style={{display:'flex',alignItems:'center',background: 'white', height: '120px', padding: '10px 30px', fontWeight: 'bold', borderTop: '1px solid lightgray', borderBottom: '1px solid lightgray', borderLeft: '1px solid lightgray', color: 'black', borderRadius: '0px'}}>
                
                   
                        <div className="col-12" >
                            {/*Order Code + Customer Name*/}  
                            <div style={{fontSize: '16px'}}>{"หมายเลขคำสั่งซื้อ : "+orderCode +" | "+customerName}</div>
                              {/*Tran Date*/}  
                            <div style={{fontWeight:'normal',color:'gray',fontSize: '14px'}}>{"วันที่สั่งซื้อ : "+tranDate}</div>
                              {/*ToTal Price*/}  
                            <div style={{fontWeight:'normal', fontSize: '14px'}}>{"ราคารวม : " +totalPrice}</div>
                            </div>                       
                    
      </div>

      <div className="col-2 tranType">
                {/*สถานะการสั่งซื้อ*/}  
                <div style={{fontSize: '12px',color:'gray'}}>{"สถานะการสั่งซื้อ"}</div>
                <div style={tranType == 7?{color:'green'}:tranType != 8 && tranType != 4?{color:'blue'}:{color:'red'}}>{tranType == 2 ?"รอชำระ":tranType == 3 ?"รอยืนยันการชำระ": tranType == 4 ?"ชำระไม่สำเร็จ" :tranType == 5?"รอจัดส่ง":tranType == 6 ?"ระหว่างจัดส่ง":tranType == 7?"จัดส่งสำเร็จ":"ยกเลิก"}</div>
                  </div>
 
 {/*Shipping Detail*/}  
       
       <div className="col-2 tranType" style={{borderRight : '1px solid lightgray'}}>        
       <div style={{fontSize: '12px',color:'gray'}}>{"ข้อมูลจัดส่ง"}</div>
           <img style={{width: '75px',height: 'auto',display:'unset'}} src={shippingImg} />         
      </div>
       </React.Fragment>
         )}
         </React.Fragment>
       
       }
              </div>

              <hr style={{border: '1px solid #4f6137', backgroundColor: '#4f6137',margin: '0px 30px'}}/> 
        {/*Pagination*/} 
        {this.state.totalCount > 0 ?
<div className="form-group row"  style={{padding: '10px 30px 10px 30px'}}>
<Pagination
          innerClass="pagination pagination-ul"
          itemClass="pagination-li"
          itemClassFirst="pagination-li-first"
          activeClass="pagination-li-active"
          itemClassLast="pagination-li-last"
          hideDisabled={true}
          activePage={this.state.activePage+1}
          itemsCountPerPage={this.state.limit}
          totalItemsCount={this.state.totalCount}
          onChange={this.handlePageChange.bind(this)}
        />
  </div> : null
    }
     </React.Fragment>      
        </React.Fragment>               
      );
    }
  }

const mapStateToProps = state =>({
    Shop :state.Shop,
    Merchant:state.Merchant,
    TransactionManagement:state.TransactionManagement
  });

  const mapDispatchToProps = dispatch =>({
    ShopAction : bindActionCreators(shopAction,dispatch),
    ShopApiAction : bindActionCreators(shopApiAction,dispatch),
      MerchantAction : bindActionCreators(merchantAction,dispatch),
      AlertAction : bindActionCreators(alertAction,dispatch),
      RegisterApiAction : bindActionCreators(registerApiAction,dispatch),
      TransactionManagementAction : bindActionCreators(transactionManagementAction,dispatch),
      TransactionManagementApiAction : bindActionCreators(transactionManagementApiAction,dispatch),
  });
  
  
  export default withRouter(connect(mapStateToProps,mapDispatchToProps)(TransactionMainPageTabLayout));
  
