import AddCategory from "../pages/AddCategory";
import AddBrand from "../pages/AddBrand";
import AddProduct from "../pages/AddProduct";
import AddTag from "../pages/AddTag";
import AddVendor from "../pages/AddVendor";
import CategoriesList from "../pages/CategoriesList";
import BrandsList from "../pages/BrandsList";
import Home from "../pages/Home";
import Login from "../pages/Login";
import OrdersList from "../pages/OrdersList";
import ProductsList from "../pages/ProductsList";
import TagsList from "../pages/TagsList";
import VendorsList from "../pages/VendorsList";
import StocksList from "../pages/StocksList";
import AddStock from "../pages/AddStock";
import AssignOrder from "../pages/AssignOrder";
import VendorsOrdersList from "../pages/VendorsOrdersList";
import AdminVendorOrders from "../pages/AdminVendorOrders";
import AdminDeliveryOrders from "../pages/AdminDeliveryOrders";
import DeliveryOrdersList from "../pages/DeliveryOrdersList";
const path = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/products/list",
    component: ProductsList,
    roles: [1, 2],
  },
  {
    path: "/products/add",
    component: AddProduct,
    roles: [1],
  },
  {
    path: "/brands/list",
    component: BrandsList,
    roles: [1],
  },
  {
    path: "/brands/add",
    component: AddBrand,
    roles: [1],
  },
  {
    path: "/categories/list",
    component: CategoriesList,
    roles: [1],
  },
  {
    path: "/categories/add",
    component: AddCategory,
    roles: [1],
  },
  // {
  //   path: "/tags/list",
  //   component: TagsList,
  //   roles: [1],
  // },
  // {
  //   path: "/tags/add",
  //   component: AddTag,
  //   roles: [1],
  // },
  {
    path: "/orders/assign",
    component: AssignOrder,
    roles: [1],
  },
  {
    path: "/orders/list",
    component: OrdersList,
    roles: [1],
  },
  {
    path: "/orders/list",
    component: VendorsOrdersList,
    roles: [2],
  },
  {
    path: "/orders/list",
    component: VendorsOrdersList,
    roles: [2],
  },
  {
    path: "/orders/list",
    component: DeliveryOrdersList,
    roles: [3],
  },
  {
    path: "/orders/vendor-orders",
    component: AdminVendorOrders,
    roles: [1],
  },
  {
    path: "/orders/delivery-orders",
    component: AdminDeliveryOrders,
    roles: [1],
  },
  {
    path: "/vendors/list",
    component: VendorsList,
    roles: [1],
  },
  {
    path: "/vendors/add",
    component: AddVendor,
    roles: [1],
  },
  {
    path: "/stocks/list",
    component: StocksList,
    roles: [2],
  },
  {
    path: "/stocks/add",
    component: AddStock,
    roles: [2],
  },
  {
    path: "/login",
    component: Login,
    public: true,
  },
];

export default path;
