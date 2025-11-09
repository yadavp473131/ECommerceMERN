import { Route, Routes } from "react-router-dom"
import AuthLayout from "./components/auth/layout"
import AdminLayout from "./components/admin-view/layout"
import AuthLogin from "./pages/auth/login"
import AuthRegister from "./pages/auth/register"
// import "./App.css"
import AdminDashboard from "./pages/admin-view/dashboard"
import AdminProducts from "./pages/admin-view/products"
import AdminOrders from "./pages/admin-view/orders"
import AdminFeatures from "./pages/admin-view/features"
import ShoppingLayout from "./components/shopping-view/layout"
import NotFound from "./pages/not-found"
import ShoppingHome from "./pages/shopping-view/home"
import ShoppingCheckout from "./pages/shopping-view/checkout"
import ShoppingListing from "./pages/shopping-view/listing"
import ShoppingAccount from "./pages/shopping-view/account"
import {checkAuth} from "./store/auth-slice"
import UnauthPage from "./pages/unauth-page"
import { useDispatch, useSelector } from "react-redux"
import { useEffect,useState } from "react"
import CheckAuth from "./components/common/check-auth"
import { Skeleton } from "@/components/ui/skeleton"
import PaypalReturnPage from "./pages/shopping-view/paypal-return"
import PaymentSuccessPage from "./pages/shopping-view/payment-success"
import SearchProducts from "./pages/shopping-view/search"
import Toast from "./components/ui/toast"

function App() {

   const dispatch = useDispatch();
   const {user, isAuthenticated, isLoading} = useSelector(state=> state.auth)
   const [toast, setToast] = useState({ message: "", type: "" });
  
   const showToast = (message, type) => {
    setToast({ message, type });
  };

   
   
   useEffect(()=>{
      const token = JSON.parse(sessionStorage.getItem('token'));
      //sends checkAuth action to store
      dispatch(checkAuth(token));
   },[dispatch])
   

   if(isLoading) return <Skeleton className="h-[800px] w-[600px]" />;

   return (
      <div className="flex flex-col overflow-hidden bg-white">
         <Routes>
            <Route 
            path="/" element={
               <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                  
               </CheckAuth>
            }
            />
            <Route path="/auth" element={
               // CheckAuth is childern in CheckAuth component props
               <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                  <AuthLayout  />
               </CheckAuth>
            }>
               <Route path="login" element={<AuthLogin showToast={showToast}/>} />
               <Route path="register" element={<AuthRegister showToast={showToast}/>} />
            </Route>
            <Route path="/admin" element={
               <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                  <AdminLayout showToast={showToast}/>
               </CheckAuth>
            }>
               <Route path="dashboard" element={<AdminDashboard showToast={showToast}/>} />
               <Route path="products" element={<AdminProducts showToast={showToast}/>} />
               <Route path="orders" element={<AdminOrders showToast={showToast}/>} />
               <Route path="features" element={<AdminFeatures />} />
            </Route>
            <Route path="/shop" element={
               <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                  <ShoppingLayout showToast={showToast}/>
               </CheckAuth>
            }>
               <Route path="account" element={<ShoppingAccount showToast={showToast}/>} />
               <Route path="checkout" element={<ShoppingCheckout showToast={showToast}/>} />
               <Route path="listing" element={<ShoppingListing showToast={showToast}/>} />
               <Route path="home" element={<ShoppingHome showToast={showToast}/>} />
               <Route path="paypal-return" element={<PaypalReturnPage showToast={showToast}/>} />
               <Route path="payment-success" element={<PaymentSuccessPage showToast={showToast}/>} />
               <Route path="search" element={<SearchProducts showToast={showToast}/>} />
            </Route>
            <Route path="/unauth-page" element={<UnauthPage/>} />
            <Route path="*" element={<NotFound />} />
         </Routes>
         {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: "", type: "" })}
        />
      )}  
      </div>
   )
}

export default App
