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

///
//
// In this web application, we use query strings, so that someone could share a link
// and the other person could get the list of same products for example.
// Because of this much of the state of this component actually lives in the URL.
// This component is also responsible for retrieving the products it needs to show.
// Again it determines which components it needs to show, from query string.
// It checks the query string on first render, and on every props change.
//
class ProductList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      unfinishedTasks: 0,
      openPriceDialog: false,
      wholeDataLength: null,
      items: []
    };

    this.getValueFromQueryString = this.getValueFromQueryString.bind(this);
    this.updateQueryStringAndRedirect = this.updateQueryStringAndRedirect.bind(this);
  }

  convertObjectToQueryString(params) {
    var esc = encodeURIComponent;
    return Object.entries(params).map(([k, v]) => {
      return esc(k) + "=" + esc(v !== undefined ? v : "")
    }).join("&");
  }


  updateQueryStringAndRedirect(newValues, restartPaging) {
    let currentQs = queryString.parse(this.props.location.search);
    let newQS = { ...currentQs, ...newValues };

    if (restartPaging) {
      delete newQS["page"];
    }

    this.props.history.push("/search/?" + this.convertObjectToQueryString(newQS));
  }

  getValueFromQueryString(name, props = this.props) {
    let qs = queryString.parse(props.location.search);

    switch (name) {
      case "category":
        return qs.category || "popular";
      case "term":
        return qs.term || "";
      case "page":
        return qs.page || "1";
      case "minPrice":
        return qs.minPrice || "0";
      case "maxPrice":
        return qs.maxPrice || "1000";
      case "usePriceFilter":
        return qs.usePriceFilter === "true";
      case "sortValue":
        return qs.sortValue || "lh";
      case "itemsPerPage":
        return qs.itemsPerPage || "5";
      case "directCategoryClick":
        return qs.term === undefined;
      default:
        return undefined;
    }
  }

  async fetchData(props = this.props) {
    this.setState(ps => ({ unfinishedTasks: ps.unfinishedTasks + 1 }));

    // Make simulated request to server to get items
    let results = await Api.searchItems({
      category: this.getValueFromQueryString("category", props),
      term: this.getValueFromQueryString("term", props),
      page: this.getValueFromQueryString("page", props),
      itemsPerPage: this.getValueFromQueryString("itemsPerPage", props),
      minPrice: this.getValueFromQueryString("minPrice", props),
      maxPrice: this.getValueFromQueryString("maxPrice", props),
      sortValue: this.getValueFromQueryString("sortValue", props),
      usePriceFilter: this.getValueFromQueryString("usePriceFilter", props)
    });

    this.setState(ps => ({
      items: results.data,
      unfinishedTasks: ps.unfinishedTasks - 1,
      wholeDataLength: results.totalLength
    }));
  }

  componentDidMount() {
    this.fetchData();
  }

  componentWillReceiveProps(nextProps) {
    this.fetchData(nextProps);
  }

  handleSortChange = e => {
    this.updateQueryStringAndRedirect({ sortValue: e.value });
  };

  getPageTitle() {
    let pageTitle;
    if (this.getValueFromQueryString("category") === "popular") {
      pageTitle = "Popular products";
    } else if (this.getValueFromQueryString("directCategoryClick")) {
      pageTitle = this.getValueFromQueryString("category");
    } else {
      pageTitle = "Search results";
    }
    return pageTitle;
  }

  render() {
    return (
      <div
        style={{
          display: "flex",
          padding: 10,
          flexDirection: "column",
          height: "100%"
        }}
      >
        <div className="product-list-header">
          <div className="online-shop-title" style={{ flex: 1 }}>
            {this.getPageTitle()}
          </div>
          <div style={{ maxWidth: 500, marginTop: 5, display: "flex" }}>
            {/* Check box for price filter */}
            <FormControlLabel
              style={{ marginBottom: 5 }}
              control={
                <Checkbox
                  color="primary"
                  checked={this.getValueFromQueryString("usePriceFilter")}
                  onChange={e => {
                    this.updateQueryStringAndRedirect(
                      { usePriceFilter: e.target.checked },
                      true
                    );
                  }}
                />
              }
              label="Filter by price"
            />
            {/* Show price range button only if price filter is on */}
            {this.getValueFromQueryString("usePriceFilter") && (
              <Tooltip title="Click to change range" disableFocusListener>
                <Button
                  variant="outlined"
                  style={{ marginRight: 20 }}
                  onClick={() => {
                    this.setState({
                      openPriceDialog: true
                    });
                  }}
                >
                  {this.getValueFromQueryString("minPrice") +
                    "$ - " +
                    this.getValueFromQueryString("maxPrice") +
                    "$"}
                </Button>
              </Tooltip>
            )}
            {/* Combo for sorting products */}
            <Select
              style={{ maxWidth: 400, marginBottom: 10 }}
              value={this.getValueFromQueryString("sortValue")}
              MenuProps={{
                style: {
                  maxHeight: 500
                }
              }}
              onChange={e => {
                this.updateQueryStringAndRedirect({ sortValue: e.target.value });
              }}
            >
              {sortOptions}
            </Select>
          </div>
        </div>
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
        {this.state.unfinishedTasks === 0 && (
          <Paging
            getValueFromQueryString={this.getValueFromQueryString}
            updateQueryStringAndRedirect={this.updateQueryStringAndRedirect}
            wholeDataLength={this.state.wholeDataLength}
          />
        )}
        {/* This is dialog which opens up for setting price filter */}
        <PriceDialog
          open={this.state.openPriceDialog}
          min={this.getValueFromQueryString("minPrice")}
          max={this.getValueFromQueryString("maxPrice")}
          onSave={(min, max) => {
            this.setState({ openPriceDialog: false });
            this.updateQueryStringAndRedirect({ minPrice: min, maxPrice: max }, true);
          }}
          onClose={() =>
            this.setState({
              openPriceDialog: false
            })
          }
        />
      </div>
    );
  }
}

export default ProductList;
