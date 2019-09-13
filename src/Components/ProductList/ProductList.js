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
// When doing product search, we use query strings, so that someone could share a link.
// Because of this much of the state of this component actually lives in the URL.
// This component is also responsible for retrieving the products it needs to show.
// Again it determines which products it needs to show, from query string.
// The query string is checked on initial mount and and when URL changes.
//
class ProductList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      unfinishedTasks: 0,
      openPriceDialog: false,
      totalItemsCount: null,
      items: []
    };

    this.getValueFromQueryString = this.getValueFromQueryString.bind(this);
    this.setNewValuesOnQueryString = this.setNewValuesOnQueryString.bind(this);
  }

  convertObjectToQueryString(params) {
    var esc = encodeURIComponent;
    return Object.entries(params).map(([k, v]) => {
      return esc(k) + "=" + esc(v !== undefined ? v : "")
    }).join("&");
  }


  setNewValuesOnQueryString(newValues, deletePagingParameter) {
    let currentQs = queryString.parse(this.props.location.search);

    // Merge old and new query string objects.
    let newQS = { ...currentQs, ...newValues };

    if (deletePagingParameter) {
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
        return qs.itemsPerPage || "10";
      case "directCategoryClick":
        return qs.term === undefined;
      default:
        return undefined;
    }
  }

  async fetchData(props = this.props) {

    this.setState(ps => ({ unfinishedTasks: ps.unfinishedTasks + 1 }));

    // Make simulated request to server to get items
    let qsAsObject = queryString.parse(props.location.search);
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
      this.fetchData(this.props);
    }
  }

  handleSortChange = e => {
    this.setNewValuesOnQueryString({ sortValue: e.value });
  };

  getPageTitle() {
    let pageTitle = "Search results";
    if (this.getValueFromQueryString("category") === "popular") {
      pageTitle = "Popular products";
    } else if (this.getValueFromQueryString("directCategoryClick")) {
      pageTitle = this.getValueFromQueryString("category");
    }  
    return pageTitle;
  }

  render() {
    let pageTitle=this.getPageTitle();
    
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
                checked={this.getValueFromQueryString("usePriceFilter")}
                onChange={e => {
                  this.setNewValuesOnQueryString(
                    { usePriceFilter: e.target.checked },
                    true
                  );
                }}
              />
            }
            label="Filter by price"
          />
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
          <Select
            style={{ maxWidth: 400, marginBottom: 10 }}
            value={this.getValueFromQueryString("sortValue")}
            MenuProps={{
              style: {
                maxHeight: 500
              }
            }}
            onChange={e => {
              this.setNewValuesOnQueryString({ sortValue: e.target.value });
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
              getValueFromQueryString={this.getValueFromQueryString}
              setNewValuesOnQueryString={this.setNewValuesOnQueryString}
              totalItemsCount={this.state.totalItemsCount}
            />
          )
        }
        {/* This is dialog which opens up for setting price filter */}
        <PriceDialog
          open={this.state.openPriceDialog}
          min={this.getValueFromQueryString("minPrice")}
          max={this.getValueFromQueryString("maxPrice")}
          onSave={(min, max) => {
            this.setState({ openPriceDialog: false });
            this.setNewValuesOnQueryString({ minPrice: min, maxPrice: max }, true);
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
