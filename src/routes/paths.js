import Home from "../pages/Home";
import Login from "../pages/Login";
import UsersList from "../pages/UsersList";
import AddUser from "../pages/AddUser";
const path = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/user/add",
    component: AddUser
  },
  {
    path: "/user/list",
    component: UsersList
  },
  {
    path: "/login",
    component: Login,
    public: true,
  },
];

export default path;
