import Header from "../components/header/Header";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, {
  Search, CSVExport
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import paginationFactory from "react-bootstrap-table2-paginator";

import { useEffect, useState } from "react";
import axios, { CancelToken } from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import StatusToast from "../components/StatusToast";
import { Button, Dropdown, DropdownButton } from "react-bootstrap";
import { toast } from "react-toastify";
import swal from "sweetalert";
import { useRef } from "react";
import generatePDF from "react-to-pdf";

const ActionDropdown = ({ data, loadData }) => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const handleDelete = async () => {
    const willDelete = await swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this imaginary file!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });
    if (!willDelete) return;
    try {
      let response = axios.delete("/admin/user/delete/" + data?.id, {
        headers: { authorization: "Bearer " + auth.token },
      });
      response = await toast.promise(response, {
        pending: "Deleting Entry",
        success: "Entry Deleted Successfully!",
        error: "Something went Wrong!",
      });
      console.log(response.data);

      const cancelToken = CancelToken.source();
      loadData(cancelToken);
    } catch (err) {
      console.log(err);
    }
  };
  const handleEdit = () => {
    console.log(data, 1);
    navigate("/user/add", { state: data });
  };

  return (
    <>
      <DropdownButton id="dropdown-basic-button" title="Action">
        <Dropdown.Item onClick={handleEdit}>Edit</Dropdown.Item>
        <Dropdown.Item onClick={handleDelete}>Delete</Dropdown.Item>
      </DropdownButton>
    </>
  );
};

const UsersList = () => {
  const { SearchBar } = Search;
  const [data, setData] = useState([]);
  const { auth } = useAuth();
  const { ExportCSVButton } = CSVExport;
  const targetRef = useRef();
  
  const loadData = async (cancelToken) => {
    try {
      const response = await axios.post("/admin/user/list",{}, {
        headers: { authorization: "Bearer " + auth.token },
        cancelToken: cancelToken.token,
      });
      console.log(response?.data?.status == "SUCCESS");
      if (response?.data?.status == "SUCCESS") {
        setData(response?.data?.data?.data);
      }
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
      dataField: "name",
      text: "Name",
    },

    {
      dataField: "mobileNo",
      text: "Mobile Number",
    },
    {
      dataField: "email",
      text: "Email Address",
    },
    {
      dataField: "userType",
      text: "Role",
    }
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
        value: data?.length,
      },
    ], // A numeric array is also available. the purpose of above example is custom the text
  };
  return (
    <>
      <Header page="User List" />
      <section className="content">
        <div className="row">
          <div className="col">
            <div className="card card-primary">
              <div className="card-header">
                <h3 className="card-title">User List</h3>
              </div>
              <div className="card-body">
                <Link to="/user/add">
                  <button
                    style={{
                      float: "right",
                      width: 118,
                      backgroundColor: "#00c0ef",
                      color: "white",
                      height: 41,
                    }}
                  >
                    <i className="fa fa-plus"></i>
                    {"New User"}
                  </button>
                </Link>
                <ToolkitProvider
                  keyField="id"
                  data={data}
                  columns={columns}
                  search
                  exportCSV={{
                    fileName: "Userlist.csv",
                  }}
                >
                  {(props) => (
                    <div>
                      <div className="d-flex">
                      <div id="search_box" >
                        {/* <h5>Input something at below input field:</h5> */}
                        <SearchBar {...props.searchProps} />
                      </div>
                        <ExportCSVButton className="mx-2 mb-2" { ...props.csvProps }>Export CSV!!</ExportCSVButton>
                        <button className="bg-light rounded mb-2"  onClick={() => generatePDF(targetRef, {filename: 'Onbordlist.pdf'})}>Download PDF</button>
                      </div>
                      
                     
                      <div ref={targetRef}>
                      <BootstrapTable
                        wrapperClasses="table-responsive"
                        noDataIndication="Table is Empty"
                        striped
                        {...props.baseProps}
                        pagination={paginationFactory(options)}
                        filter={filterFactory()}
                      />
                      </div>
                    </div>
                  )}
                </ToolkitProvider>
              </div>
            </div>
          </div>
        </div>

        <StatusToast />
      </section>
    </>
  );
};
export default UsersList;
