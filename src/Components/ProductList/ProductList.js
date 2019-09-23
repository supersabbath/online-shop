import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Item from "../Item/Item";
import CircularProgress from "@material-ui/core/CircularProgress";
import "./ProductList.css";
import queryString from "query-string";
import Api from "../../Api";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Tooltip from "@material-ui/core/Tooltip";
import PriceDialog from "../PriceDialog/PriceDialog";
import Paging from "../Paging/Paging";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

const sortOptions = [
  <MenuItem key={"lh"} value={"lh"}>
    Sort by price: low to high
  </MenuItem>,
  <MenuItem key={"hl"} value={"hl"}>
    Sort by price: high to low
  </MenuItem>
];

// This component is responsible for searching products.
// It performs the search based on parameters in the query string
// (because of this much state of this component actually lives in the URL).
// The URL is checked on first mount and when URL changes.
// We use query strings so that user could share a link to his/her search results for example.
class ProductList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      unfinishedTasks: 0,
      openPriceDialog: false,
      totalItemsCount: null,
      items: []
    };

    this.updateQueryString = this.updateQueryString.bind(this);
  }

  convertObjectToQueryString(params) {
    return Object.entries(params).map(([k, v]) => {
      return encodeURIComponent(k) + "=" + encodeURIComponent(v !== undefined ? v : "")
    }).join("&");
  }


  updateQueryString(newValues) {
    let currentQs = queryString.parse(this.props.location.search);
    let newQS = { ...currentQs, ...newValues };
    this.props.history.push("/search/?" + this.convertObjectToQueryString(newQS));
  }

  async fetchData() {

    this.setState(ps => ({ unfinishedTasks: ps.unfinishedTasks + 1 }));

    // Make simulated request to server to get items
    let qsAsObject = queryString.parse(this.props.location.search);
    let results = await Api.searchItems({ ...qsAsObject, usePriceFilter: qsAsObject.usePriceFilter === "true" });

    this.setState(ps => ({
      items: results.data,
      unfinishedTasks: ps.unfinishedTasks - 1,
      totalItemsCount: results.totalLength
    }));
  }

  componentDidMount() {
    this.fetchData();
  }


  componentDidUpdate(prevProps, prevState, snapshot) {

    let currentQS = queryString.parse(this.props.location.search);
    let oldQS = queryString.parse(prevProps.location.search)

    // Check if the query strings changed.
    let check1 = Object.entries(currentQS).some(([k, v]) => v !== oldQS[k]);
    let check2 = Object.entries(oldQS).some(([k, v]) => v !== currentQS[k]);
    let isDifferent = check1 || check2;

    // We will refetch products only when query string changes.
    if (isDifferent) {
      this.fetchData();
    }
  }

  handleSortChange = e => {
    this.updateQueryString({ sortValue: e.value });
  };

  // Determine page title.
  pageTitle() {
    let pageTitle = "Search results";
    let category = queryString.parse(this.props.location.search).category;
    let directClick = queryString.parse(this.props.location.search).directClick === "true";

    if (category === undefined) {
      pageTitle = "Popular products";
    } else if (directClick) {
      pageTitle = category;
    }
    return pageTitle;
  }

  render() {
    let qs = queryString.parse(this.props.location.search);
    let usePriceFilter = qs.usePriceFilter === "true";
    let minPrice = qs.minPrice || "0";
    let maxPrice = qs.maxPrice || "1000";
    let itemsPerPage = qs.itemsPerPage || "10";
    let page = qs.page || "1";
    let sortValue = qs.sortValue || "lh";
    let pageTitle = this.pageTitle();

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%"
        }}
      >
        {/* Header */}
        <div style={{ padding: 10, display: "flex", alignItems: "center" }}>
          <div style={{ flex: 1, fontSize: 24 }}>
            <div>{pageTitle}</div>
            {this.state.unfinishedTasks === 0 && (
              <div style={{ fontSize: 12, color: "gray", marginTop: 5 }}>
                Total results found: {this.state.totalItemsCount}
              </div>)}
          </div>

          <FormControlLabel
            style={{ marginBottom: 5 }}
            control={
              <Checkbox
                color="primary"
                checked={usePriceFilter}
                onChange={e => {
                  this.updateQueryString(
                    { usePriceFilter: e.target.checked, page: "1" }
                  );
                }}
              />
            }
            label="Filter by price"
          />
          {usePriceFilter && (
            < Tooltip title="Click to change range" disableFocusListener>
              <Button
                variant="outlined"
                style={{ marginRight: 20 }}
                onClick={() => {
                  this.setState({
                    openPriceDialog: true
                  });
                }}
              >
                {minPrice +
                  "$ - " +
                  maxPrice +
                  "$"}
              </Button>
            </Tooltip>
          )}
          <Select
            style={{ maxWidth: 400, marginBottom: 10 }}
            value={sortValue}
            MenuProps={{
              style: {
                maxHeight: 500
              }
            }}
            onChange={e => {
              this.updateQueryString({ sortValue: e.target.value });
            }}
          >
            {sortOptions}
          </Select>
        </div>
        {/* Here go the items */}
        <div style={{ flex: 1 }}>
          {this.state.unfinishedTasks !== 0 ? (
            <CircularProgress className="circular" />
          ) : (
              this.state.items.map(item => {
                return <Item key={item.id} item={item} />;
              })
            )}
        </div>
        {/* Paging component */}
        {
          this.state.unfinishedTasks === 0 && (
            <Paging
              itemsPerPage={itemsPerPage}
              page={page}
              updateQueryString={this.updateQueryString}
              totalItemsCount={this.state.totalItemsCount}
            />
          )
        }
        {/* This is dialog which opens up for setting price filter */}
        <PriceDialog
          open={this.state.openPriceDialog}
          min={minPrice}
          max={maxPrice}
          onSave={(min, max) => {
            this.setState({ openPriceDialog: false });
            this.updateQueryString({ minPrice: min, maxPrice: max, page: "1" });
          }}
          onClose={() =>
            this.setState({
              openPriceDialog: false
            })
          }
        />
      </div >
    );
  }
}

export default ProductList;
