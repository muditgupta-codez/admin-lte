import { useState } from "react";
import Header from "../components/header/Header";
import { useLocation } from "react-router-dom";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import StatusToast from "../components/StatusToast";
const AddTag = () => {
  const data = useLocation().state;
  const [name, setName] = useState(data?.name || "");
  const [slug, setSlug] = useState(data?.slug || "");
  const [description, setDescription] = useState(data?.description || "");
  const [isSubmit, setIsSubmit] = useState(false);
  const { auth } = useAuth();
  const addTag = async () => {
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
      let response = await axios.post(
        "/admin/tags" + req_url,
        {
          id: data?.id,
          name: name,
          slug: slug,
          description: description,
        },
        {
          headers: { authorization: "Bearer " + auth.token },
        }
      );
      response = await toast.promise(response, {
        pending: "Adding Tag",
        success: "Tag Added Successfully!",
        error: "Something went Wrong!",
      });
      console.log("addtag response:", response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <>
      <Header page={data ? "Edit Tag" : "Add Tag"} />
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
                    <label htmlFor="tag-name">Tag Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="tag-name"
                      placeholder="Enter Tag Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <div className="invalid-feedback">
                      Tag Name is Required!
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="slug">Slug</label>
                    <input
                      type="text"
                      className="form-control"
                      id="slug"
                      placeholder="Enter tag Type"
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
                </div>

                <div className="card-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={addTag}
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
export default AddTag;
