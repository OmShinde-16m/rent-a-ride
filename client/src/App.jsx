import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";

// Layout & auth guards load eagerly (small, needed on every route)
import With_nav from "./components/Layout/WithNav";
import PrivateRoute from "./components/PrivateRoute";
import { PrivateSignin } from "./components/PrivateRoute";
import AdminPrivateRoutes from "./components/AdminPrivateRoutes";
import VendorPrivateRoute from "./components/VendorPrivateRoute";

// ---------- Lazy-loaded pages (code-split) ----------

// User pages
const Home = lazy(() => import("./pages/user/Home"));
const SignUp = lazy(() => import("./pages/user/SignUp"));
const SignIn = lazy(() => import("./pages/user/SignIn"));
const Vehicles = lazy(() => import("./pages/user/Vehicles"));
const Profile = lazy(() => import("./pages/user/Profile"));
const Enterprise = lazy(() => import("./pages/user/Enterprise"));
const Contact = lazy(() => import("./pages/user/Contact"));
const VehicleDetails = lazy(() => import("./pages/user/VehicleDetails"));
const Orders = lazy(() => import("./pages/user/Orders"));
const AvailableVehicles = lazy(() => import("./pages/user/AvailableVehiclesAfterSearch"));
const CheckoutPage = lazy(() => import("./pages/user/CheckoutPage"));
const Razorpay = lazy(() => import("./pages/user/Razorpay"));
const AllVehiclesofSameModel = lazy(() => import("./pages/user/AllVehiclesofSameModel"));
const CarNotFound = lazy(() => import("./pages/user/CarNotFound"));

// Vendor pages
const VendorSignin = lazy(() => import("./pages/vendor/pages/VendorSignin"));
const VendorSignup = lazy(() => import("./pages/vendor/pages/VendorSignup"));
const VendorDashboard = lazy(() => import("./pages/vendor/Dashboard/VendorDashboard"));
const VendorEditProductComponent = lazy(() => import("./pages/vendor/Components/VendorEditProductComponent"));
const VendorDeleteVehicleModal = lazy(() => import("./pages/vendor/Components/VendorDeleteVehicleModal"));
const VendorAddProductModal = lazy(() => import("./pages/vendor/Components/VendorAddVehilceModal"));

// Admin pages
const Layout = lazy(() => import("./pages/admin/layouts/Layout"));
const AdminDashNew = lazy(() => import("./pages/admin/dashboard/AdminDashNew"));
const EditProductComponent = lazy(() => import("./pages/admin/components/EditProductComponent"));
const AddProductModal = lazy(() => import("./pages/admin/components/AddProductModal"));

// Loading fallback
const PageLoader = () => (
  <div style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    fontSize: "1.2rem",
    color: "#666",
  }}>
    Loading…
  </div>
);

function App() {
  return (
    <>
      <BrowserRouter>
        {/* <ThemeProvider theme={theme}> */}
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* if user enter wrong url show this page */}
            <Route path="*" element={<CarNotFound />} />
            {/* components with Navbar */}
            <Route element={<With_nav />}>
              <Route path="/" element={<Home />} />
              <Route path="/vehicles" element={<Vehicles />} />
              <Route path="/enterprise" element={<Enterprise />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            {/* components without Navbar */}
            <Route>
              {/* Signin not accesible if logedin */}
              <Route element={<PrivateSignin />}>
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/vendorSignin" element={<VendorSignin />} />
                <Route path="/vendorSignup" element={<VendorSignup />} />
              </Route>
            </Route>

            {/* user private routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/profile/*" element={<Profile />} />
              <Route path="/allVariants" element={<AllVehiclesofSameModel />} />
              <Route path="/vehicleDetails" element={<VehicleDetails />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/availableVehicles" element={<AvailableVehicles />} />
              <Route path="/checkoutPage" element={<CheckoutPage />} />
              <Route path="/razorpay" element={<Razorpay />} />
            </Route>

            {/* vendor private routes */}
            <Route element={<VendorPrivateRoute />}>
              <Route path="/vendorDashboard/*" element={<VendorDashboard />} />
              <Route
                path="/vendorDashboard/vendorEditProductComponent"
                element={<VendorEditProductComponent />}
              />
              <Route
                path="/vendorDashboard/vendorDeleteVehicleModal"
                element={<VendorDeleteVehicleModal />}
              />
              <Route
                path="vendorDashboard/vendorAddProduct"
                element={<VendorAddProductModal />}
              />
            </Route>

            {/* admin private routes */}

            <Route element={<AdminPrivateRoutes />}>
              <Route element={
                <Suspense fallback={<PageLoader />}>
                  <Layout />
                </Suspense>
              }>
                <Route path="/adminDashboard/*" element={<AdminDashNew />} />

                <Route
                  path="/adminDashboard/editProducts"
                  element={<EditProductComponent />}
                />
                <Route
                  path="/adminDashboard/addProducts"
                  element={<AddProductModal />}
                />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;
