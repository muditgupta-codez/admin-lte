import { useRef, useState } from "react";
import Header from "../components/header/Header";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import StatusToast from "../components/StatusToast";
import axios, { CancelToken } from "../api/axios";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";
import Select from "react-dropdown-select";
import swal from "sweetalert";

const AddUser = () => {
  const location = useLocation();
  const data = location.state;
  console.log(data);
  const [Name, setName] = useState(data?.name || "");
  const [mobile, setMobile] = useState(data?.mobileNo || "");
  const [email, setEmail] = useState(data?.email || "");
  const [password, setPassword] = useState(data?.password || "");
  const navigate = useNavigate();
  const [isSubmit, setisSubmit] = useState(false);
  const { auth } = useAuth();

  const handleClose = async () => {
    navigate("/user/list");
  };

  const addUser = async () => {
    console.log(Name, mobile, email);
    if (!Name || !email) {
      return swal({
        title: "Failure!",
        text: `Please Fill All Fields`,
        icon: "error",
      });
    }
    if (isSubmit) return;
    setisSubmit(true);
    try {
      const id = data?.id;
      const url = data?.id ? "/admin/user/update/" + id : "/admin/user/create";
      const response = data?.id ? await axios.put(
        url,
        {
          "username": email,
          "password": password,
          "email": email,
          "name": Name,
          "mobileNo": mobile,
          "userType": 1
        },
        {
          headers: { authorization: "Bearer " + auth.token },
        }
      ) : await axios.post(
        url,
        {
          "username": email,
          "password": password,
          "email": email,
          "name": Name,
          "mobileNo": mobile,
          "userType": 1
        },
        {
          headers: { authorization: "Bearer " + auth.token },
        }
      )
      if (response?.data?.status == "SUCCESS") {
        swal({
          title: "Success!",
          text: `${response.data.message}`,
          icon: "success",
        });

        navigate("/user/list");
      } else {
        swal({
          title: "Failure!",
          text: `${response.data.message}`,
          icon: "error",
        });
      }
    } catch (err) {
      swal({ title: "Error!", text: `${err.message}`, icon: "error" });

    } finally {
      setisSubmit(false);
    }
  };

  return (
    <>
      <Header page="Add User" />
      <section className="content">
        <div className="row">
          <div className="col">
            <div className="card card-primary">
              <div className="card-header">
                <h3 className="card-title">Create User</h3>
              </div>
              <form className="needs-validation" noValidate>
                <div className="card-body">
                  <div className="form-group">
                    <div className="row" id="2">
                      <div className="col-md-3">
                        <label htmlFor="name">Name:</label>
                        <input
                          required
                          type="text"
                          className="form-control"
                          id="name"
                          placeholder="Enter Last Name"
                          value={Name}
                          onChange={(e) => setName(e.target.value)}
                        />
                        <div className="invalid-feedback">
                          Name is Required!
                        </div>
                      </div>
                      <div className="col-md-3">
                        <label htmlFor="username"> Mobile: </label>
                        <input
                          type="text"
                          className="form-control"
                          id="number"
                          placeholder="Enter Number"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                        />
                        <div className="invalid-feedback">
                          Mobile is Required!
                        </div>
                      </div>
                      <div className="col-md-3">
                        <label htmlFor="email">Email:</label>
                        <input
                          required
                          type="text"
                          className="form-control"
                          id="email"
                          value={email}
                          placeholder="Enter Email Address"
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <div className="invalid-feedback">
                          Email is Required!
                        </div>
                      </div>
                      {!data ? 
                      <div className="col-md-3">
                        <label htmlFor="whom">Password:</label>
                        <input
                          required
                          type="password"
                          className="form-control"
                          id="password"
                          placeholder="Enter Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="invalid-feedback">
                          Password is Required!
                        </div>
                      </div>: null}
                    </div>
                  </div>
                </div>
                <center>
                  <div className="card-footer">
                    <input
                      style={{
                        backgroundColor: "#00a65a",
                        color: "white",
                        width: "15%",
                        height: "38px",
                        border: "none",
                        marginRight: "40px",
                      }}
                      type="button"
                      value="Save"
                      name="add_save"
                      disabled={isSubmit}
                      onClick={addUser}
                    />
                    <input
                      style={{
                        backgroundColor: "#f39c12",
                        color: "white",
                        width: "15%",
                        height: "38px",
                        border: "none",
                        marginRight: "40px",
                      }}
                      type="button"
                      value="Close"
                      name="add_save"
                      onClick={handleClose}
                    />
                  </div>
                  <StatusToast />
                </center>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default AddUser;
