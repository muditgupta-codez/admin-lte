import { useState } from "react";
import Header from "../components/header/Header";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import StatusToast from "../components/StatusToast";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
const AddVendor = () => {
  const navigate = useNavigate();
  const data = useLocation().state;
  const [userType, setUserType] = useState(data?.role || 2);
  const [name, setName] = useState(data?.name || "");
  const [email, setEmail] = useState(data?.email || "");
  const [mobile, setMobile] = useState(data?.mobile || "");
  const [storeName, setStoreName] = useState(data?.store_name || "");
  const [address, setAddress] = useState(data?.address || "");
  const [password, setPassword] = useState(data?.password || "");
  const [isSubmit, setIsSubmit] = useState(false);
  const { auth } = useAuth();
  const addVendor = async () => {
    if (isSubmit) return;
    console.log("here");
    setIsSubmit(true);
    if (!name || !email || !mobile || !password) {
      document.forms[0].classList.add("was-validated");
      setIsSubmit(false);
      return;
    }
    console.log({
      id: data?.id,
      userType: userType,
      name: name,
      email: email,
      mobile: mobile,
      store_name: userType == 2 ? storeName : "",
      address: userType == 2 ? address : "",
      password: password,
    });
    try {
      let req_url;
      if (data) {
        req_url = "/update";
      } else {
        req_url = "/add";
      }
      const req = axios.post(
        "/admin/vendors" + req_url,
        {
          id: data?.id,
          userType: userType,
          name: name,
          email: email,
          mobile: mobile,
          store_name: storeName,
          address: address,
          password: password,
        },
        {
          headers: { authorization: "Bearer " + auth.token },
        }
      );
      const response = await toast.promise(req, {
        pending: "Adding User",
        success: `User ${data ? "Updated" : "Added"} Successfully!`,
        error: "Something went Wrong!",
      });
      console.log("addProduct response:", response.data);
      navigate("/vendors/list");
    } catch (err) {
      console.log(err);
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <>
      <Header page={data ? "Edit Vendor" : "Add Vendor"} />
      <section className="content">
        <div className="row">
          <div className="col">
            <div className="card card-primary">
              <div className="card-header">
                {/* <h3 className="card-title">Quick Example</h3> */}
              </div>
              <form className="needs-validation" noValidate>
                <div className="card-body">
                  <div className="form-group">
                    <label htmlFor="user-type">User Type</label>
                    <select
                      required
                      type="text"
                      className="form-control"
                      id="user-type"
                      value={userType}
                      disabled={data ? true : false}
                      onChange={(e) => setUserType(Number(e.target.value))}
                    >
                      <option key={1} value="2">
                        Vendor
                      </option>
                      <option key={2} value="3">
                        Delivery Boy
                      </option>
                    </select>
                    <div className="invalid-feedback">
                      User Type is Required!
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="full-name">Full Name</label>
                    <input
                      required
                      type="text"
                      className="form-control"
                      id="full-name"
                      placeholder="Enter Your Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <div className="invalid-feedback">
                      Full Name is Required!
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="text"
                      className="form-control"
                      id="email"
                      placeholder="Enter Email Address"
                      value={email}
                      required
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className="invalid-feedback">
                      Email Address is Required!
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="mobile">Mobile Number</label>
                    <input
                      type="text"
                      className="form-control"
                      id="mobile"
                      placeholder="Enter Mobile Number"
                      value={mobile}
                      required
                      onChange={(e) => setMobile(e.target.value)}
                    />
                    <div className="invalid-feedback">
                      Mobile Number is Required!
                    </div>
                  </div>
                  {userType === 2 ? (
                    <>
                      <div className="form-group">
                        <label htmlFor="store">Store Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="store"
                          placeholder="Enter Store Name"
                          disabled={data ? true : false}
                          value={storeName}
                          required
                          onChange={(e) => setStoreName(e.target.value)}
                        />
                        <div className="invalid-feedback">
                          Store Name is Required!
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="address">Store Address</label>
                        <input
                          type="text"
                          className="form-control"
                          id="address"
                          placeholder="Enter Store Address"
                          disabled={data ? true : false}
                          value={address}
                          required
                          onChange={(e) => setAddress(e.target.value)}
                        />
                        <div className="invalid-feedback">
                          Address is Required!
                        </div>
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                  <div className="form-group">
                    <label htmlFor="password">password</label>
                    <input
                      type="text"
                      className="form-control"
                      id="password"
                      placeholder="Enter Your Password"
                      value={password}
                      required
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="invalid-feedback">
                      Password is Required!
                    </div>
                  </div>
                </div>

                <div className="card-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={addVendor}
                  >
                    Submit
                  </button>
                  <StatusToast />
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default AddVendor;
