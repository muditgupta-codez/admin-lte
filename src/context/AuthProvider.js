import { createContext, useEffect, useState } from "react";
import axios from "../api/axios";
const AuthContext = createContext({});
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(
    {
      token: localStorage.getItem("token"),
      user: localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : null,
    } || {}
  );
  // const [isLoading, setIsLoading] = useState(true);
  // useEffect(() => {
  //   if (!auth?.token) {
  //     return;
  //   }
  // const fetchUser = async () => {
  //   try {
  //     const response = await axios.get("/user/profile", {
  //       headers: {
  //         authorization: "Bearer " + auth.token,
  //       },
  //     });
  //     console.log(response.data);
  //     setAuth({ ...auth, user: response.data.user });
  //     setIsLoading(false);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  // fetchUser();
  // }, []);
  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
