import Header from "../components/header/Header";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import filterFactory from "react-bootstrap-table2-filter";
import paginationFactory from "react-bootstrap-table2-paginator";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import { useEffect, useState } from "react";
import axios, { CancelToken } from "../api/axios";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import StatusToast from "../components/StatusToast";
import { toast } from "react-toastify";

const StatusModal = ({ data, handleClose, show, loadData }) => {
  const { auth } = useAuth();
  const [status, setStatus] = useState(data.status);
  const [isSubmit, setIsSubmit] = useState(false);
  const updateStatus = async () => {
    if (isSubmit) return;
    setIsSubmit(true);
    try {
      let response = await axios.post(
        "/admin/orders/update-status",
        {
          id: data?.id,
          status: status,
        },
        {
          headers: { authorization: "Bearer " + auth.token },
        }
      );
      response = await toast.promise(response, {
        pending: "Updating Order Status",
        success: "Order Status Updated Successfully!",
        error: "Something went Wrong!",
      });
      handleClose();
      const cancelToken = CancelToken.source();
      loadData(cancelToken);
    } catch (err) {
      console.log(err);
    } finally {
      setIsSubmit(false);
    }
  };
  const arr = [
    "pending",
    "processing",
    "on-hold",
    "completed",
    "cancelled",
    "refunded",
    "failed",
    "trash",
  ];
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Change Status (#{data.number})</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            type="text"
            className="form-control"
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {arr.map((item, i) => (
              <option id={item} key={i} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={updateStatus}>
          Save Changes
        </Button>
        <StatusToast />
      </Modal.Footer>
    </Modal>
  );
};

const ActionDropdown = ({ data, loadData }) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { auth } = useAuth();
  const navigate = useNavigate();
  const deleteProduct = async () => {
    try {
      let response = await axios.post(
        "/admin/orders/delete",
        { id: data.id },
        { headers: { authorization: "Bearer " + auth.token } }
      );
      response = await toast.promise(response, {
        pending: "Deleting Order",
        success: "Order Deleted Successfully!",
        error: "Something went Wrong!",
      });
      console.log(response.data);

      const cancelToken = CancelToken.source();
      loadData();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <DropdownButton id="dropdown-basic-button" title="Action">
        <Dropdown.Item onClick={handleShow}>Change Status</Dropdown.Item>
        <Dropdown.Item onClick={deleteProduct}>Delete</Dropdown.Item>
      </DropdownButton>
      <StatusToast />
      <StatusModal
        show={show}
        handleClose={handleClose}
        data={data}
        loadData={loadData}
      />
    </>
  );
};

const OrdersList = () => {
  const { SearchBar } = Search;
  const [data, setData] = useState([]);
  const { auth } = useAuth();
  const loadData = async (cancelToken) => {
    try {
      const response = await axios.get("/admin/orders/list", {
        headers: { authorization: "Bearer " + auth.token },
        cancelToken: cancelToken.token,
      });
      console.log(response.data);
      response?.data?.success && setData(response.data.orders);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    const cancelToken = CancelToken.source();
    loadData(cancelToken);
  }, []);
  const columns = [
    {
      dataField: "action",
      isDummyField: true,
      text: "Action",
      sort: true,
      formatExtraData: loadData,
      formatter: (c, row, i, extra) => {
        return <ActionDropdown data={row} loadData={extra} />;
      },
    },
    {
      dataField: "number",
      text: "Order Number",
      sort: true,
    },
    {
      dataField: "total",
      text: "Order Total",
      sort: true,
      formatter: (c, row) => `₹${c} (Shipping: ₹${row.shipping_total})`,
    },
    {
      dataField: "date_created_gmt",
      text: "Date",
    },
    {
      dataField: "status",
      text: "Status",
      formatter: (c) => {
        return (
          <mark className={"order-status status-" + c}>
            <span>{c}</span>
          </mark>
        );
      },
    },
  ];
  const customTotal = (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total">
      Showing {from} to {to} of {size} Results
    </span>
  );

  const options = {
    paginationSize: 4,
    pageStartIndex: 1,
    // alwaysShowAllBtns: true, // Always show next and previous button
    // withFirstAndLast: false, // Hide the going to First and Last page button
    // hideSizePerPage: true, // Hide the sizePerPage dropdown always
    // hidePageListOnlyOnePage: true, // Hide the pagination list when only one page
    firstPageText: "First",
    prePageText: "Back",
    nextPageText: "Next",
    lastPageText: "Last",
    nextPageTitle: "First page",
    prePageTitle: "Pre page",
    firstPageTitle: "Next page",
    lastPageTitle: "Last page",
    showTotal: true,
    paginationTotalRenderer: customTotal,
    disablePageTitle: true,
    sizePerPageList: [
      {
        text: "5",
        value: 5,
      },
      {
        text: "10",
        value: 10,
      },
      {
        text: "All",
        value: data.length,
      },
    ], // A numeric array is also available. the purpose of above example is custom the text
  };
  return (
    <>
      <Header page="Orders List" />
      <section className="content">
        <div className="row">
          <div className="col">
            <div className="card card-primary">
              <div className="card-header">
                {/* <h3 className="card-title">Quick Example</h3> */}
              </div>
              <div className="card-body">
                <ToolkitProvider
                  keyField="id"
                  data={data}
                  columns={columns}
                  search
                >
                  {(props) => (
                    <div>
                      <div
                        className="d-flex justify-content-end"
                        id="search_box"
                      >
                        {/* <h5>Input something at below input field:</h5> */}
                        <SearchBar {...props.searchProps} />
                      </div>
                      <hr />
                      <BootstrapTable
                        noDataIndication="Table is Empty"
                        striped
                        {...props.baseProps}
                        pagination={paginationFactory(options)}
                        filter={filterFactory()}
                      />
                    </div>
                  )}
                </ToolkitProvider>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default OrdersList;
