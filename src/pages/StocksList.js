import Header from "../components/header/Header";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import paginationFactory from "react-bootstrap-table2-paginator";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import { useEffect, useState } from "react";
import axios, { CancelToken } from "../api/axios";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ActionDropdown = ({ data, loadData }) => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const deleteProduct = async () => {
    try {
      const response = await axios.post(
        "/admin/stocks/delete",
        { id: data.id },
        { headers: { authorization: "Bearer " + auth.token } }
      );
      console.log(response.data);
      loadData();
    } catch (err) {
      console.log(err);
    }
  };
  const editProduct = () => {
    navigate(`/stocks/add`, { state: data });
  };
  return (
    <DropdownButton id="dropdown-basic-button" title="Action">
      <Dropdown.Item onClick={editProduct}>Edit</Dropdown.Item>
      <Dropdown.Item onClick={deleteProduct}>Delete</Dropdown.Item>
    </DropdownButton>
  );
};

const StocksList = () => {
  const { SearchBar } = Search;
  const { auth } = useAuth();
  const [data, setData] = useState([]);
  const [products, setProducts] = useState([]);

  const loadProducts = async (cancelToken) => {
    try {
      const response = await axios.get("/admin/products/list", {
        cancelToken: cancelToken.token,
        headers: { authorization: "Bearer " + auth.token },
      });
      console.log(response.data);
      response?.data?.success && setProducts(response.data.products);
      response?.data?.success && loadData(cancelToken);
    } catch (err) {
      console.error(err);
    }
  };
  const loadData = async (cancelToken) => {
    try {
      const response = await axios.get("/admin/stocks/list", {
        cancelToken: cancelToken.token,
        headers: { authorization: "Bearer " + auth.token },
      });
      console.log(response.data.stocks);
      response?.data?.success && setData(response.data.stocks);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    const cancelToken = CancelToken.source();
    loadProducts(cancelToken);
  }, []);
  const columns = [
    {
      dataField: "action",
      isDummyField: true,
      text: "Action",
      sort: true,
      formatExtraData: [loadData],
      formatter: (c, row, i, ed) => {
        return <ActionDropdown data={row} loadData={ed[0]} />;
      },
    },
    {
      dataField: "product_id",
      text: "Product Name",
      sort: true,
      formatExtraData: products,
      formatter: (c, r, i, products) => {
        let product = {};
        for (var i = 0; i < products.length; i++) {
          if (products[i].id == Number(c)) {
            console.log("found", products[i]);
            product = products[i];
          }
        }
        return product.name;
      },
    },
    {
      dataField: "stock",
      text: "Stock",
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
      <Header page="Stocks List" />
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
export default StocksList;
