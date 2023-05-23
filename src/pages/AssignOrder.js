import { useState } from "react";
import Header from "../components/header/Header";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import StatusToast from "../components/StatusToast";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";
import { Col, Row } from "react-bootstrap";

const OrderAssignment = ({
  order,
  updateOrder,
  deliveryBoys,
  vendor_id,
  delivery_id,
}) => {
  const { auth } = useAuth();
  const [vendors, setVendors] = useState([]);
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.post(
          "/admin/assignment/list-vendors",
          {
            product_id: order.product_id,
            quantity: order.quantity,
          },
          {
            headers: { authorization: "Bearer " + auth.token },
          }
        );
        console.log(response.data);
        response?.data?.success && setVendors(response.data.vendors);
      } catch (err) {
        console.error(err);
      }
    };
    fetchVendors();
  }, [order]);
  return (
    <Row md={4}>
      <Col>
        <div className="form-group">
          <label htmlFor="product">Product</label>
          <input
            required
            type="text"
            className="form-control"
            id="product"
            value={order.name}
            disabled
          />
        </div>
      </Col>
      <Col>
        <div className="form-group">
          <label htmlFor="quantity">Quantity</label>
          <input
            required
            type="text"
            className="form-control"
            id="quantity"
            value={order.quantity}
            disabled
          />
          <div className="invalid-feedback">Quantity is Required!</div>
        </div>
      </Col>
      <Col>
        <div className="form-group">
          <label htmlFor="vendor">Vendor</label>
          <select
            required
            type="text"
            className="form-control"
            id="vendor"
            value={vendor_id}
            onChange={(e) => {
              updateOrder(order.product_id, e.target.value);
            }}
          >
            <option key="0" value="">
              Select Vendor
            </option>
            {vendors.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <div className="invalid-feedback">Vendor is Required!</div>
        </div>
      </Col>
      <Col>
        <div className="form-group">
          <label htmlFor="vendor">Delivery Boy</label>
          <select
            required
            type="text"
            className="form-control"
            id="vendor"
            value={delivery_id}
            onChange={(e) => {
              updateOrder(order.product_id, e.target.value, true);
            }}
          >
            <option key="0" value="">
              Select Delivery Boy
            </option>
            {deliveryBoys.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <div className="invalid-feedback">Delivery Boy is Required!</div>
        </div>
      </Col>
    </Row>
  );
};
const AssignOrder = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [order, setOrder] = useState(null);
  const [vendorOrder, setVendorOrder] = useState([]);
  const [isSubmit, setIsSubmit] = useState(false);
  const { auth } = useAuth();
  useEffect(() => {
    if (!order) {
      return;
    }
    setVendorOrder(
      order.line_items.map((item) => {
        return {
          product_id: item.product_id,
          quantity: item.quantity,
          vendor_id: 0,
          delivery_id: 0,
        };
      })
    );
  }, [order]);
  const updateOrder = (product_id, vendor_id, is_delivery) => {
    setVendorOrder(
      vendorOrder.map((item) => {
        if (item.product_id === product_id) {
          if (is_delivery) {
            item.delivery_id = vendor_id;
          } else {
            item.vendor_id = vendor_id;
          }
        }
        return item;
      })
    );
  };
  const onSubmit = async () => {
    if (isSubmit) return;
    setIsSubmit(true);
    console.log("requesting", vendorOrder);
    if (
      !order?.number ||
      vendorOrder.filter(
        (item) => item.vendor_id === 0 || item.delivery_id === 0
      ).length
    ) {
      document.forms[0].classList.add("was-validated");
      setIsSubmit(false);
      return;
    }
    try {
      const toastId = toast.loading("Assigning Order");
      const response = await axios.post(
        "/admin/assignment/assign",
        {
          order_id: order?.number,
          orders: vendorOrder,
          date: order.date_created_gmt,
        },
        {
          headers: { authorization: "Bearer " + auth.token },
        }
      );
      toast.update(toastId, {
        render: response.data.message,
        type: response?.data?.success ? "success" : "error",
        isLoading: false,
        autoClose: true,
      });
      response?.data?.success && navigate("/orders/list");
    } catch (err) {
      console.log(err);
      toast.error("Something Went Wrong!");
    } finally {
      setIsSubmit(false);
    }
  };
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/admin/assignment/list-orders", {
          headers: { authorization: "Bearer " + auth.token },
        });
        console.log(response.data);
        response?.data?.success && setOrders(response.data.orders);
      } catch (err) {
        console.error(err);
      }
    };
    const fetchDelivery = async () => {
      try {
        const response = await axios.post(
          "/admin/assignment/list-vendors",
          { type: 2 },
          {
            headers: { authorization: "Bearer " + auth.token },
          }
        );
        console.log(response.data);
        response?.data?.success && setDeliveryBoys(response.data.vendors);
        response?.data?.success && fetchOrders();
      } catch (err) {
        console.error(err);
      }
    };
    fetchDelivery();
  }, []);

  return (
    <>
      <Header page="Assign Order" />
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
                    <label htmlFor="order">Order</label>
                    <select
                      required
                      type="text"
                      className="form-control"
                      id="order"
                      value={order?.number}
                      onChange={(e) => {
                        orders.forEach((item) => {
                          if (item.number === e.target.value) {
                            setOrder(item);
                          }
                        });
                      }}
                    >
                      <option value="" key="0">
                        Select Order
                      </option>
                      {orders.map((item) => (
                        <option key={item.number} value={item.number}>
                          {item.number}
                        </option>
                      ))}
                    </select>
                    <div className="invalid-feedback">Order is Required!</div>
                  </div>
                  {order &&
                    order.line_items.map((item, i) => {
                      return (
                        <OrderAssignment
                          key={i}
                          order={item}
                          updateOrder={updateOrder}
                          vendor_id={
                            vendorOrder?.filter((v) => {
                              return v.product_id === item.product_id;
                            })[0]?.vendor_id
                          }
                          delivery_id={
                            vendorOrder?.filter((v) => {
                              return v.product_id === item.product_id;
                            })[0]?.delivery_id
                          }
                          deliveryBoys={deliveryBoys}
                        />
                      );
                    })}
                </div>

                <div className="card-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={onSubmit}
                  >
                    Assign
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
export default AssignOrder;
