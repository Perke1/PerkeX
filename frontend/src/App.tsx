import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "react-query";
import Main from "components/Main";
import ProductPage from "components/productPage/ProductPage";
import SellPage from "components/SellPage";
import BuyPage from "components/BuyPage";
import Dashboard from "components/dashboard/Dashboard";
import Settings from "components/dashboard/Settings";
import EditShipping from "components/dashboard/EditShipping";
import NavbarSell from "components/ui/NavbarSell";
import Selling from "components/dashboard/Selling";
import Buying from "components/dashboard/Buying";

import LoginPage from "components/auth/LoginPage";
import RegisterPage from "components/auth/RegisterPage";
import ForgotPasswordPage from "components/auth/ForgotPasswordPage";
import ResetPasswordPage from "components/auth/ResetPasswordPage";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient();

function App() {
  const { user, isLoggedInTemporary } = useSelector(
    (state: ReduxAuth) => state.auth
  );

  const isLoggedInPersisted = user.isLoggedInPersisted;
  const isLoggedTemporary = isLoggedInTemporary;
  const isLoggedCondition =
    isLoggedInPersisted === "true" || isLoggedTemporary === "true";

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<Navigate replace to={"/"} />} />
            <Route path="/" element={<Main />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/sell" element={<NavbarSell />} />
            <Route path="/sell/:id" element={<SellPage />} />
            <Route path="/buy/:id" element={<BuyPage />} />
            {isLoggedCondition && (
              <>
                <Route path="/dashboard/profile" element={<Dashboard />} />
                <Route path="/dashboard/settings" element={<Settings />} />
                <Route path="/dashboard/buying" element={<Buying />} />
                <Route path="/dashboard/selling" element={<Selling />} />
                <Route
                  path="/dashboard/settings/shipping"
                  element={<EditShipping />}
                />
              </>
            )}
            {!isLoggedCondition && (
              <>
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
              </>
            )}
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Routes>
        </BrowserRouter>
        <ToastContainer limit={3} style={{ width: "400px" }} />
      </QueryClientProvider>
    </>
  );
}

export default App;
