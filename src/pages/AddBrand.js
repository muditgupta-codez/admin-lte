import { useState } from "react";
import Header from "../components/header/Header";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import { toast } from "react-toastify";
import StatusToast from "../components/StatusToast";
const AddBrand = () => {
  const data = useLocation().state;
  const [name, setName] = useState(data?.name || "");
  const [slug, setSlug] = useState(data?.slug || "");
  const [description, setDescription] = useState(data?.description || "");
  const [thumbnail, setThumbnail] = useState(data?.image?.src || "");
  const [isSubmit, setIsSubmit] = useState(false);
  const { auth } = useAuth();
  const navigate = useNavigate();
  const addBrand = async () => {
    if (isSubmit) return;
    setIsSubmit(true);
    if (!name) {
      document.forms[1].classList.add("was-validated");
      setIsSubmit(false);
      return;
    }
    try {
      let req_url;
      if (data) {
        req_url = "/update";
      } else {
        req_url = "/add";
      }
      let payload = new FormData();
      data?.term_id && payload.append("id", data?.term_id);
      payload.append("name", name);
      payload.append("slug", slug);
      payload.append("description", description);
      payload.append("thumbnail", thumbnail);
      let response = axios.post("/admin/brands" + req_url, payload, {
        headers: {
          authorization: "Bearer " + auth.token,
          "content-type": "multipart/form-data",
        },
      });
      response = await toast.promise(response, {
        pending: "Adding brand",
        success: "brand Added Successfully!",
        error: "Something went Wrong!",
      });
      console.log("addbrand response:", response.data);
      navigate("/brands/list");
    } catch (err) {
      console.log(err);
    } finally {
      setIsSubmit(false);
    }
  };
  return (
    <>
      <Header page={data ? "Edit brand" : "Add brand"} />
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
                    <label htmlFor="brand-name">Brand Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="brand-name"
                      placeholder="Enter brand Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <div className="invalid-feedback">
                      brand Name is Required!
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="slug">Slug</label>
                    <input
                      type="text"
                      className="form-control"
                      id="slug"
                      placeholder="Enter Slug"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <input
                      type="text"
                      className="form-control"
                      id="description"
                      placeholder="Enter Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="image">Thumbnail</label>
                    <input
                      type="file"
                      className="form-control"
                      id="image"
                      placeholder="Enter Thumbnail URL"
                      onChange={(e) => setThumbnail(e.target.files[0])}
                    />
                  </div>
                </div>

                <div className="card-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      addBrand();
                    }}
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
export default AddBrand;
