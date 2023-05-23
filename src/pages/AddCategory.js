import { useState } from "react";
import Header from "../components/header/Header";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import { toast } from "react-toastify";
import StatusToast from "../components/StatusToast";
const AddCategory = () => {
  const data = useLocation().state;
  const [name, setName] = useState(data?.name || "");
  const [slug, setSlug] = useState(data?.slug || "");
  const [parent, setParent] = useState(data?.parent || 0);
  const [description, setDescription] = useState(data?.description || "");
  const [display, setDisplay] = useState(data?.display || "default");
  const [thumbnail, setThumbnail] = useState(data?.image?.src || "");
  const [categories, setcategories] = useState([]);
  const [isSubmit, setIsSubmit] = useState(false);
  const { auth } = useAuth();
  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get("/admin/categories/list", {
          headers: { authorization: "Bearer " + auth.token },
        });
        setcategories(response?.data?.categories);
      } catch (err) {
        console.log(err);
      }
    };
    fetch();
  }, []);
  const addCategory = async () => {
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
      let response = axios.post(
        "/admin/categories" + req_url,
        {
          id: data?.id,
          name: name,
          slug: slug,
          parent: parent,
          description: description,
          display: display,
          thumbnail: thumbnail,
        },
        {
          headers: { authorization: "Bearer " + auth.token },
        }
      );
      response = await toast.promise(response, {
        pending: "Adding Category",
        success: "Category Added Successfully!",
        error: "Something went Wrong!",
      });
      console.log("addcategory response:", response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsSubmit(false);
    }
  };
  return (
    <>
      <Header page={data ? "Edit Category" : "Add Category"} />
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
                    <label htmlFor="category-name">Category Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="category-name"
                      placeholder="Enter Category Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <div className="invalid-feedback">
                      Category Name is Required!
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
                    <label htmlFor="parent">Parent Category</label>
                    <select
                      type="text"
                      className="form-control"
                      id="parent"
                      value={parent}
                      onChange={(e) => setParent(e.target.value)}
                    >
                      <option id="0" key="0" value="0">
                        None
                      </option>
                      {categories.map((item) => (
                        <option id={item.id} key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
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
                    <label htmlFor="display">Display Type</label>
                    <select
                      type="text"
                      className="form-control"
                      id="display"
                      value={display}
                      onChange={(e) => setDisplay(e.target.value)}
                    >
                      <option id="default" key="0" value="default">
                        Default
                      </option>
                      <option id="products" key="1" value="products">
                        Products
                      </option>
                      <option id="subcategories" key="2" value="subcategories">
                        Subcategories
                      </option>
                      <option id="both" key="3" value="both">
                        Both
                      </option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="image">Thumbnail</label>
                    <input
                      type="text"
                      className="form-control"
                      id="image"
                      placeholder="Enter Thumbnail URL"
                      value={thumbnail}
                      onChange={(e) => setThumbnail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="card-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      addCategory();
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
export default AddCategory;
