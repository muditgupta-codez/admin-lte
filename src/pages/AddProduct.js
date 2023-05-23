import { useState } from "react";
import Header from "../components/header/Header";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import StatusToast from "../components/StatusToast";
import axios, { CancelToken } from "../api/axios";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";
const AddProduct = () => {
  const data = useLocation().state;
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [productImage, setProductImage] = useState();
  const [productGallary, setProductGallary] = useState([]);
  const navigate = useNavigate();
  const [payloadData, setPayloadData] = useState(
    data?.payloadData || {
      name: data?.name || "",
      // category: data?.categories.length ? data?.categories[0].id : "",
      category: data?.categories ? data.categories.split(",")[0] : "",
      regularPrice: data?.regular_price || "",
      shortDescription: data?.short_description || "",
      description: data?.description || "",
      // brand: data?.brands[0].id || "",
      brand: data?.brands ? data.brands.split(",")[0] : "",
    }
  );
  const [isSubmit, setIsSubmit] = useState(false);
  const { auth } = useAuth();
  const loadBrands = async (cancelToken) => {
    try {
      const response = await axios.get("/admin/brands/list", {
        cancelToken: cancelToken.token,
        headers: { authorization: "Bearer " + auth.token },
      });
      console.log(response.data);
      response?.data?.success && setBrands(response.data.brands);
    } catch (err) {
      console.error(err);
    }
  };
  const loadData = async (cancelToken) => {
    try {
      const response = await axios.get("/admin/categories/list", {
        cancelToken: cancelToken.token,
        headers: { authorization: "Bearer " + auth.token },
      });
      console.log(response.data);
      response?.data?.success && setCategories(response.data.categories);
    } catch (err) {
      console.error(err);
    }
  };
  const addProduct = async () => {
    if (isSubmit) return;
    setIsSubmit(true);
    if (
      !payloadData.name ||
      !payloadData.category ||
      !payloadData.regularPrice ||
      !payloadData.shortDescription ||
      !payloadData.description ||
      !payloadData.brand
    ) {
      document.forms[0].classList.add("was-validated");
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
      data?.id && payload.append("id", data.id);
      payload.append("name", payloadData.name);
      payload.append("category", payloadData.category);
      payload.append("regular_price", payloadData.regularPrice);
      payload.append("short_description", payloadData.shortDescription);
      payload.append("description", payloadData.description);
      payload.append("brand", payloadData.brand);
      productImage && payload.append("product_image", productImage);
      productGallary && payload.append("product_gallary", productGallary);
      const req = axios.post("/admin/products" + req_url, payload, {
        headers: {
          authorization: "Bearer " + auth.token,
          "content-type": "multipart/form-data",
        },
      });
      const response = await toast.promise(req, {
        pending: "Adding Product",
        success: "Product Added Successfully!",
        error: "Something went Wrong!",
      });
      navigate("/products/list");
    } catch (err) {
      console.log(err);
      setIsSubmit(false);
    } finally {
      setIsSubmit(false);
    }
  };
  useEffect(() => {
    const cancelToken = CancelToken.source();
    loadData(cancelToken);
    loadBrands(cancelToken);
  }, []);
  return (
    <>
      <Header page={data ? "Edit Product" : "Add Product"} />
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
                    <label htmlFor="product-name">Product Name</label>
                    <input
                      required
                      type="text"
                      className="form-control"
                      id="product-name"
                      placeholder="Enter Product Name"
                      value={payloadData?.name}
                      onChange={(e) =>
                        setPayloadData({ ...payloadData, name: e.target.value })
                      }
                    />
                    <div className="invalid-feedback">
                      Product Name is Required!
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="product-category">Product Category</label>
                    <select
                      type="text"
                      className="form-control"
                      id="product-category"
                      value={payloadData?.category}
                      required
                      onChange={(e) =>
                        setPayloadData({
                          ...payloadData,
                          category: e.target.value,
                        })
                      }
                    >
                      <option key="0" value="">
                        Select Category
                      </option>
                      {categories.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                    <div className="invalid-feedback">
                      Product Category is Required!
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="product-brand">Product Brand</label>
                    <select
                      type="text"
                      className="form-control"
                      id="product-brand"
                      value={payloadData?.brand}
                      required
                      onChange={(e) =>
                        setPayloadData({
                          ...payloadData,
                          brand: e.target.value,
                        })
                      }
                    >
                      <option key="0" value="">
                        Select Brand
                      </option>
                      {brands.map((item) => (
                        <option key={item.term_id} value={item.term_id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                    <div className="invalid-feedback">
                      Product Category is Required!
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="price">Regular Price</label>
                    <input
                      type="text"
                      className="form-control"
                      id="price"
                      placeholder="Enter Price"
                      value={payloadData?.regularPrice}
                      required
                      onChange={(e) =>
                        setPayloadData({
                          ...payloadData,
                          regularPrice: e.target.value,
                        })
                      }
                    />
                    <div className="invalid-feedback">Price is Required!</div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="short-description">Short Description</label>
                    <textarea
                      type="textarea"
                      className="form-control"
                      id="short-description"
                      placeholder="Enter Short Description"
                      value={payloadData?.shortDescription}
                      required
                      rows={4}
                      onChange={(e) =>
                        setPayloadData({
                          ...payloadData,
                          shortDescription: e.target.value,
                        })
                      }
                    />
                    <div className="invalid-feedback">
                      Short Description is Required!
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="long-description">Description</label>
                    <textarea
                      type="textarea"
                      className="form-control"
                      id="long-description"
                      placeholder="Enter Description"
                      value={payloadData?.description}
                      required
                      rows={8}
                      onChange={(e) =>
                        setPayloadData({
                          ...payloadData,
                          description: e.target.value,
                        })
                      }
                    />
                    <div className="invalid-feedback">
                      Description is Required!
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="product-image">Product Image</label>
                    <input
                      type="file"
                      className="form-control"
                      id="product-image"
                      rows={8}
                      required
                      onChange={(e) => setProductImage(e.target.files[0])}
                    />
                    <div className="invalid-feedback">
                      Product Image is Required!
                    </div>
                    {data?.image ? (
                      <img src={data.image} height="150px" width={"150px"} />
                    ) : (
                      ""
                    )}
                  </div>
                  {/* <div className="form-group">
                    <label htmlFor="product-gallary">Product Gallary</label>
                    <input
                      type="file"
                      className="form-control"
                      id="product-gallary"
                      multiple
                      rows={8}
                      onChange={(e) => setProductGallary(e.target.files)}
                    />
                    <div className="invalid-feedback">
                      Product Gallary is Required!
                    </div>
                  </div> */}
                </div>

                <div className="card-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={addProduct}
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
export default AddProduct;
