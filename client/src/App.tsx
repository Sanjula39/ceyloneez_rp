import React from "react";

import { Refine, AuthProvider } from "@pankod/refine-core";
import {
  notificationProvider,
  RefineSnackbarProvider,
  CssBaseline,
  GlobalStyles,
  ReadyPage,
  ErrorComponent,

  
} from "@pankod/refine-mui";
import{
  
  DashboardCustomizeOutlined ,
  StoreMallDirectoryOutlined,
  LegendToggleSharp,
  
  LocalShippingOutlined,
  GifBoxOutlined,
  StorefrontOutlined,
  AccountCircleOutlined
 
}from '@mui/icons-material'

import dataProvider from "@pankod/refine-simple-rest";
import { MuiInferencer } from "@pankod/refine-inferencer/mui";
import routerProvider from "@pankod/refine-react-router-v6";
import axios, { AxiosRequestConfig } from "axios";
import { ColorModeContextProvider } from "contexts";
import { Title, Sider, Layout, Header } from "components/layout";

import {
   Login ,
    Home,
    Agents,
    MyProfile,
    PropertyDetails,
    AllProperties,
    CreateProperty,
    AgentProfile,
    EditProperty,
    AllCertification,
    AllPackaging,
    AllShipping,
    ECommerce
    

} from "pages";
import { CredentialResponse } from "interfaces/google";
import { parseJwt } from "utils/parse-jwt";

const axiosInstance = axios.create();
axiosInstance.interceptors.request.use((request: AxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (request.headers) {
    request.headers["Authorization"] = `Bearer ${token}`;
  } else {
    request.headers = {
      Authorization: `Bearer ${token}`,
    };
  }

  return request;
});

function App() {
  const authProvider: AuthProvider = {
    login: ({ credential }: CredentialResponse) => {
      const profileObj = credential ? parseJwt(credential) : null;

      if (profileObj) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...profileObj,
            avatar: profileObj.picture,
          })
        );
      }

      localStorage.setItem("token", `${credential}`);

      return Promise.resolve();
    },
    logout: () => {
      const token = localStorage.getItem("token");

      if (token && typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        axios.defaults.headers.common = {};
        window.google?.accounts.id.revoke(token, () => {
          return Promise.resolve();
        });
      }

      return Promise.resolve();
    },
    checkError: () => Promise.resolve(),
    checkAuth: async () => {
      const token = localStorage.getItem("token");

      if (token) {
        return Promise.resolve();
      }
      return Promise.reject();
    },

    getPermissions: () => Promise.resolve(),
    getUserIdentity: async () => {
      const user = localStorage.getItem("user");
      if (user) {
        return Promise.resolve(JSON.parse(user));
      }
    },
  };

  return (
    <ColorModeContextProvider>
      <CssBaseline />
      <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
      <RefineSnackbarProvider>
        <Refine
          dataProvider={dataProvider("https://api.fake-rest.refine.dev")}
          notificationProvider={notificationProvider}
          ReadyPage={ReadyPage}
          catchAll={<ErrorComponent />}
          resources={[
            
            {
              name: "stores",
              options: {label: 'Store'},
              list: AllProperties,
              show: PropertyDetails, 
              create: CreateProperty,
              edit: EditProperty,
              icon: <StoreMallDirectoryOutlined/>,
              
            },
            {
              name: "certifications",
              options: {label: 'Certification'},
              list: AllCertification,
              icon: <LegendToggleSharp/>,
              
            },
            {
              name: "packaging",
              options: {label: 'Packaging'},
              list: AllPackaging,
              icon: <GifBoxOutlined/>,
              
            },
            {
              name: "shipping",
              options: {label: 'Shipping'},
              list: AllShipping,
              icon: <LocalShippingOutlined/>,
              
            },
            {
              name: "e-commerce",
              options: {label: 'E-commerce'},
              list: ECommerce,
              icon: <StorefrontOutlined/>,
              
            },
            {
              name: "myprofile",
              options: {label: 'My Profile'},
              list: MyProfile,
              icon: <AccountCircleOutlined/>,
              
            },
            
          ]}
          Title={Title}
          Sider={Sider}
          Layout={Layout}
          Header={Header}
          routerProvider={routerProvider}
          authProvider={authProvider}
          LoginPage={Login}
          DashboardPage={Home}
        />
      </RefineSnackbarProvider>
    </ColorModeContextProvider>
  );
}

export default App;
