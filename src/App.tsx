import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./providers/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Login from "./pages/Login";
import Profile from "./pages/Profile";

import ProtectedRoute from "./routes/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized";

import Overview from "./pages/Overview";
import OverviewOutlet from "./pages/OverviewOutlet";

import MyOutletProfile from "./pages/MyOutletProfile";

// Import Category Pages
import CategoryList from "./pages/categories/CategoryList";
import AddCategory from "./pages/categories/AddCategory";
import EditCategory from "./pages/categories/EditCategory";

// Import Product Pages
import ProductList from "./pages/products/ProductList";
import AddProduct from "./pages/products/AddProduct";
import EditProduct from "./pages/products/EditProduct";

// Import Warehouse Pages
import WarehouseList from "./pages/warehouses/WarehouseList";
import AddWarehouse from "./pages/warehouses/AddWarehouse";
import EditWarehouse from "./pages/warehouses/EditWarehouse";

// Import User Pages
import UserList from "./pages/users/UserList";
import AddUser from "./pages/users/AddUser";
import EditUser from "./pages/users/EditUser";

// Import Role Pages
import RoleList from "./pages/roles/RoleList";
import AddRole from "./pages/roles/AddRole";
import EditRole from "./pages/roles/EditRole";

// Import Outlet Pages
import OutletList from "./pages/outlets/OutletList";
import AddOutlet from "./pages/outlets/AddOutlet";
import EditOutlet from "./pages/outlets/EditOutlet";

// Import Transaction Pages
import TransactionList from "./pages/transactions/TransactionList";
import AddTransaction from "./pages/transactions/AddTransaction";

// Import Outlet Product Pages
import OutletProductList from "./pages/outlet_products/OutletProductList";
import DistribusiStok from "./pages/outlet_products/DistribusiStok";
import EditDistribusiStok from "./pages/outlet_products/EditDistribusiStok";

import WarehouseProductList from "./pages/warehouse_products/WarehouseProductList";
import AssignWarehouseProduct from "./pages/warehouse_products/DistribusiStok";
import EditWarehouseProduct from "./pages/warehouse_products/EditWarehouseProduct";
import AssignUserRoles from "./pages/user_roles/AssignUserRoles";
import TransactionDetails from "./pages/transactions/TransactionDetails";
import TransactionProvider from "./providers/TransactionProvider";
import TransactionSuccess from "./pages/transactions/TransactionSuccess";

// ✅ Create a QueryClient instance for React Query
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Protected Routes for Manager */}
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/overview" element={<ProtectedRoute roles={['manager']}><Overview /></ProtectedRoute>} />
          
          {/* Protected Routes for Keeper */}
          <Route path="/overview-outlet" element={<ProtectedRoute roles={['keeper']}><OverviewOutlet /></ProtectedRoute>} />
          <Route path="/my-outlet" element={<ProtectedRoute roles={['keeper']}><MyOutletProfile /></ProtectedRoute>} />
          
          {/* Category Routes */}
          <Route path="/categories" element={<ProtectedRoute roles={['manager']}><CategoryList /></ProtectedRoute>} />
          <Route path="/categories/add" element={<ProtectedRoute roles={['manager']}><AddCategory /></ProtectedRoute>} />
          <Route path="/categories/edit/:id" element={<ProtectedRoute roles={['manager']}><EditCategory /></ProtectedRoute>} />
          
          {/* Product Routes */}
          <Route path="/products" element={<ProtectedRoute roles={['manager']}><ProductList /></ProtectedRoute>} />
          <Route path="/products/add" element={<ProtectedRoute roles={['manager']}><AddProduct /></ProtectedRoute>} />
          <Route path="/products/edit/:id" element={<ProtectedRoute roles={['manager']}><EditProduct /></ProtectedRoute>} />
          
          {/* Warehouse Routes - Manager & Keeper */}
          <Route path="/warehouses" element={<ProtectedRoute roles={['manager', 'keeper']}><WarehouseList /></ProtectedRoute>} />
          <Route path="/warehouses/add" element={<ProtectedRoute roles={['manager']}><AddWarehouse /></ProtectedRoute>} />
          <Route path="/warehouses/edit/:id" element={<ProtectedRoute roles={['manager']}><EditWarehouse /></ProtectedRoute>} />
          
          {/* User Management Routes */}
          <Route path="/users" element={<ProtectedRoute roles={['manager']}><UserList /></ProtectedRoute>} />
          <Route path="/users/add" element={<ProtectedRoute roles={['manager']}><AddUser /></ProtectedRoute>} />
          <Route path="/users/edit/:id" element={<ProtectedRoute roles={['manager']}><EditUser /></ProtectedRoute>} />
          
          {/* Role Management Routes */}
          <Route path="/roles" element={<ProtectedRoute roles={['manager']}><RoleList /></ProtectedRoute>} />
          <Route path="/roles/add" element={<ProtectedRoute roles={['manager']}><AddRole /></ProtectedRoute>} />
          <Route path="/roles/edit/:id" element={<ProtectedRoute roles={['manager']}><EditRole /></ProtectedRoute>} />
          
          <Route path="/users/assign-roles" element={<ProtectedRoute roles={['manager']}><AssignUserRoles /></ProtectedRoute>} />
          
          {/* Outlet Management Routes */}
          <Route path="/outlets" element={<ProtectedRoute roles={['manager']}><OutletList /></ProtectedRoute>} />
          <Route path="/outlets/add" element={<ProtectedRoute roles={['manager']}><AddOutlet /></ProtectedRoute>} />
          <Route path="/outlets/edit/:id" element={<ProtectedRoute roles={['manager']}><EditOutlet /></ProtectedRoute>} /> 

          <Route path="/transactions" element={<ProtectedRoute roles={['keeper']}><TransactionList /></ProtectedRoute>} />
          <Route path="/transactions/add" element={
            <ProtectedRoute roles={['keeper']}>
              <TransactionProvider> {/* ✅ Wrap only the Add Transaction page */}
                <AddTransaction />
              </TransactionProvider>
            </ProtectedRoute>
          } />
          <Route path="/transactions/details/:id" element={<ProtectedRoute roles={['keeper']}><TransactionDetails /></ProtectedRoute>} />
          <Route path="/transactions/success" element={<ProtectedRoute roles={['keeper']}><TransactionSuccess /></ProtectedRoute>} />



          {/* Outlet Product Routes (Manager & Keeper) */}
          <Route path="/outlet-products/:id" element={<ProtectedRoute roles={['manager', 'keeper']}><OutletProductList /></ProtectedRoute>} />
          <Route path="/outlet-products/:id/distribusi-stok" element={<ProtectedRoute roles={['manager', 'keeper']}><DistribusiStok /></ProtectedRoute>} />

          {/* ✅ Updated Route for Editing Assigned Outlet Product */}
          <Route path="/outlet-products/:outletId/edit-distribusi-stok/:productId" 
            element={<ProtectedRoute roles={['manager', 'keeper']}><EditDistribusiStok /></ProtectedRoute>} />

          {/* warehouse Product Routes (Manager & Keeper) */}
          <Route path="/warehouse-products/:id" element={<ProtectedRoute roles={['manager', 'keeper']}><WarehouseProductList /></ProtectedRoute>} />
          <Route path="/warehouse-products/:id/assign" element={<ProtectedRoute roles={['manager', 'keeper']}><AssignWarehouseProduct /></ProtectedRoute>} />

          {/* ✅ Updated Route for Editing Assigned Warehouse Product */}
          <Route path="/warehouse-products/:warehouseId/edit-assign/:productId" 
            element={<ProtectedRoute roles={['manager', 'keeper']}><EditWarehouseProduct /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
