import { Navigation } from "react-minimal-side-navigation";
import { useHistory, useLocation } from "react-router-dom";
import Icon from "awesome-react-icons";
import React, { useState } from "react";

import "react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css";

export const NavSidebar = () => {
  const history = useHistory();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <React.Fragment>
     
      <div
        onClick={() => setIsSidebarOpen(false)}
        className={`fixed inset-0 z-20 block transition-opacity bg-black opacity-50 lg:hidden ${
          isSidebarOpen ? "block" : "hidden"
        }`}
      />



      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 ease-out transform translate-x-0 bg-white border-r-2 lg:translate-x-0 lg:static lg:inset-0 ${
          isSidebarOpen ? "ease-out translate-x-0" : "ease-in -translate-x-full"
        }`}
      >
       
       <div className="absolute top-0 w-full my-8">
          <Navigation
            activeItemId={location.pathname}
            items={[
              {
                title: "Test",
                elemBefore: () => <Icon name="users" />
              }
            ]}
            onSelect={() => {
                // go to edit merchant
             alert("Beer");
            }}
          />
        </div>
        <Navigation
          activeItemId={location.pathname}
          onSelect={({ itemId }) => {
            history.push(itemId);
          }}
          items={[
            {
              title: "MainPage",
              itemId: "/MainPage",
              // Optional
              elemBefore: () => <Icon name="users" />
            },
            {
              title: "Product",
              elemBefore: () => <Icon name="users" />,
              subNav: [
                {
                  title: "All Product",
                  itemId: "/login",
                  // Optional
                  elemBefore: () => <Icon name="users" />
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
                elemBefore: () => <Icon name="users" />
              }
            ]}
            onSelect={() => {
                //clear localstorage
             alert("Beer");
            }}
          />
        </div>
      </div>
    </React.Fragment>
  );
};
