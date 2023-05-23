import { useState } from "react";
import Header from "../components/header/Header";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import StatusToast from "../components/StatusToast";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";
const AddStock = () => {
  const navigate = useNavigate();
  const data = useLocation().state;
  console.log(data);
  const [product, setProduct] = useState(data?.product_id || "");
  const [products, setProducts] = useState([]);
  const [stock, setStock] = useState(data?.stock || "");
  const [isSubmit, setIsSubmit] = useState(false);
  const { auth } = useAuth();
  const addVendor = async () => {
    if (isSubmit) return;
    setIsSubmit(true);
    if (!product || !stock) {
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
      const req = axios.post(
        "/admin/stocks" + req_url,
        {
          id: data?.id,
          productId: product,
          stock: stock,
        },
        {
          headers: { authorization: "Bearer " + auth.token },
        }
      );
      const response = await toast.promise(req, {
        pending: "Adding Stock",
        success: `Stock ${data ? "Updated" : "Added"} Successfully!`,
        error: "Something went Wrong!",
      });
      navigate("/stocks/list");
    } catch (err) {
      console.log(err);
    } finally {
      setIsSubmit(false);
    }
  };
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/admin/products/list", {
          headers: { authorization: "Bearer " + auth.token },
        });
        console.log(response.data);
        response?.data?.success && setProducts(response.data.products);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
      <Header page={data ? "Update Stock" : "Add Stock"} />
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
                    <label htmlFor="full-name">Product</label>
                    <select
                      disabled={data ? true : false}
                      required
                      type="text"
                      className="form-control"
                      id="product"
                      value={product}
                      onChange={(e) => setProduct(e.target.value)}
                    >
                      <option key="0" value="">
                        Select Product
                      </option>
                      {products.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                    <div className="invalid-feedback">Product is Required!</div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="stock">Stock</label>
                    <input
                      type="text"
                      className="form-control"
                      id="stock"
                      placeholder="Enter Stock"
                      value={stock}
                      required
                      onChange={(e) => setStock(e.target.value)}
                    />
                    <div className="invalid-feedback">Stock is Required!</div>
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
export default AddStock;
