import { Navigation } from "react-minimal-side-navigation";
import { useHistory, useLocation } from "react-router-dom";
import Icon from "awesome-react-icons";
import React, { useState } from "react";
import "react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css";

export const NavSidebar = (props) => {
  const history = useHistory();
  const location = useLocation();
  return (
    <React.Fragment>
     
      <div
        className={`fixed inset-0 z-20 block transition-opacity bg-black opacity-50 lg:hidden block`}
       />


      

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 ease-out transform translate-x-0 bg-white border-r-2 lg:translate-x-0 lg:static lg:inset-0 ease-out translate-x-0`}
      style={{paddingTop:'20px'}}>

      
        <Navigation
          
          activeItemId={location.pathname}
          onSelect={({ itemId }) => {
            var split = itemId?.split('|');         
            history.push({pathname:split?split[0]: ""
                          ,search: split?split[1]: ""});
          }}
          items={[
            {
              title: props.merchantName,
              itemId: "/MerchantInfo",
              // Optional
              elemBefore: () => <Icon name="user"/>
            },
            {
              title: "MainPage",
              itemId: "/MainPage",
              // Optional
              elemBefore: () => <Icon name="coffee" />
            },
            {
              title: "Setting",
              elemBefore: () => <Icon name="settings" />,
              subNav: [
                {
                  title: "Payment",
                  itemId: `/PaymentSetup|?shopId=${props.shopId}`,
                  // Optional
                  elemBefore: () => <Icon name="star" />
                },
                {
                  title: "Shipping",
                  itemId: `/ShippingSetup|?shopId=${props.shopId}`,
                  // Optional
                  elemBefore: () => <Icon name="star" />
                }
              ]
            }
          ]}
        />

        <div className="absolute bottom-0 w-full my-8">
          <Navigation
            activeItemId={location.pathname}
            items={[
              {
                title: "Logout",
                elemBefore: () => <Icon name="log-out" />
              }
            ]}
            onSelect={() => {
                 localStorage.removeItem('merchant');
                 history.push('/Login');
             
            }}
          />
        </div>
      
      
      
      
      
      </div>
    </React.Fragment>
  );
};

