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

// This component retrieves the products it needs to show.
// It determines the kind of products it needs to show from query string.
// It checks the query string on first render and on every props change.
class ProductList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      unfinishedTasks: 0,
      openPriceDialog: false,
      wholeDataLength: null,
      items: []
    };

    this.getParamFromQS = this.getParamFromQS.bind(this);
    this.updateURLAndRedirect = this.updateURLAndRedirect.bind(this);
  }

  // Convert object to query string
  objectToQueryString(params) {
    var esc = encodeURIComponent;
    var query = Object.keys(params)
      .map(k => esc(k) + "=" + esc(params[k] !== undefined ? params[k] : ""))
      .join("&");

    return query;
  }

  // This function is used to update the query string with new values
  // and redirect to new URL.
  updateURLAndRedirect(newValues, restartPaging) {
    let currentQs = queryString.parse(this.props.location.search);
    let newQS = { ...currentQs, ...newValues };

    if (restartPaging) {
      delete newQS["page"];
    }

    this.props.history.push("/search/?" + this.objectToQueryString(newQS));
  }

  // Extract value of certain parameter from query string.
  getParamFromQS(name, props = this.props) {
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
      category: this.getParamFromQS("category", props),
      term: this.getParamFromQS("term", props),
      page: this.getParamFromQS("page", props),
      itemsPerPage: this.getParamFromQS("itemsPerPage", props),
      minPrice: this.getParamFromQS("minPrice", props),
      maxPrice: this.getParamFromQS("maxPrice", props),
      sortValue: this.getParamFromQS("sortValue", props),
      usePriceFilter: this.getParamFromQS("usePriceFilter", props)
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
    this.updateURLAndRedirect({ sortValue: e.value });
  };

  getPageTitle() {
    let pageTitle;
    if (this.getParamFromQS("category") === "popular") {
      pageTitle = "Popular products";
    } else if (this.getParamFromQS("directCategoryClick")) {
      pageTitle = this.getParamFromQS("category");
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
          <div className="online-shop-title" style={{ flexGrow: 1 }}>
            {this.getPageTitle()}
          </div>
          <div style={{ maxWidth: 500, marginTop: 5, display: "flex" }}>
            <FormControlLabel
              style={{ marginBottom: 5 }}
              control={
                <Checkbox
                  color="primary"
                  checked={this.getParamFromQS("usePriceFilter")}
                  onChange={e => {
                    this.updateURLAndRedirect(
                      { usePriceFilter: e.target.checked },
                      true
                    );
                  }}
                />
              }
              label="Filter by price"
            />
            {this.getParamFromQS("usePriceFilter") && (
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
                  {this.getParamFromQS("minPrice") +
                    "$ - " +
                    this.getParamFromQS("maxPrice") +
                    "$"}
                </Button>
              </Tooltip>
            )}
            <Select
              style={{ maxWidth: 400, marginBottom: 10 }}
              value={this.getParamFromQS("sortValue")}
              MenuProps={{
                style: {
                  maxHeight: 500
                }
              }}
              onChange={e => {
                this.updateURLAndRedirect({ sortValue: e.target.value });
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
        {this.state.unfinishedTasks === 0 && (
          <Paging
            getParamFromQS={this.getParamFromQS}
            updateURLAndRedirect={this.updateURLAndRedirect}
            wholeDataLength={this.state.wholeDataLength}
          />
        )}
        <PriceDialog
          open={this.state.openPriceDialog}
          min={this.getParamFromQS("minPrice")}
          max={this.getParamFromQS("maxPrice")}
          onSave={(min, max) => {
            this.setState({ openPriceDialog: false });
            this.updateURLAndRedirect({ minPrice: min, maxPrice: max }, true);
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
