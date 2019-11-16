import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import PriceDialog from "../PriceDialog/PriceDialog";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { withRouter } from "react-router-dom";
import queryString from "query-string";

class ProductsHeader extends Component {
    state = {
        openPriceDialog: false,
    };


    getPageTitle() {
        let pageTitle = "Search results";
        let category = queryString.parse(this.props.location.search).category;
        let directClick = queryString.parse(this.props.location.search).directClick === "true";

        if (!category) {
            pageTitle = "Popular products";
        } else if (directClick) {
            pageTitle = category;
        }
        return pageTitle;
    }

    render() {
        let { updateQueryString, totalItemsCount } = this.props;
        let qs = queryString.parse(this.props.location.search);
        
        let usePriceFilter = qs.usePriceFilter === "true";
        let minPrice = qs.minPrice || 0;
        let maxPrice = qs.maxPrice || 1000;
        let sortValue = qs.sortValue || "lh";

        return (
            <div>
                <div style={{ padding: 10, display: "flex", alignItems: "center" }}>
                    <div style={{ flex: 1, fontSize: 24 }}>
                        <div>{this.getPageTitle()}</div>
                        <div style={{ fontSize: 12, color: "gray", marginTop: 5 }}>
                           Total results found: {totalItemsCount}
                        </div>
                    </div>

                    <FormControlLabel
                        control={
                            <Checkbox
                                color="primary"
                                checked={usePriceFilter}
                                onChange={e => {
                                    updateQueryString(
                                        { usePriceFilter: e.target.checked, page: 1 }
                                    );
                                }}
                            />
                        }
                        label="Filter by price"
                    />
                    {usePriceFilter && (
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
                                {minPrice +
                                    "$ - " +
                                    maxPrice +
                                    "$"}
                            </Button>
                        </Tooltip>
                    )}
                    <Select
                        value={sortValue}
                        onChange={e => {
                            updateQueryString({ sortValue: e.target.value });
                        }}
                    >
                        <MenuItem value={"lh"}>
                            Sort by price: low to high
                        </MenuItem>
                        <MenuItem value={"hl"}>
                            Sort by price: high to low
                        </MenuItem>

                    </Select>
                </div>

                {/* This is dialog which opens up for setting price filter */}
                <PriceDialog
                    open={this.state.openPriceDialog}
                    min={minPrice}
                    max={maxPrice}
                    onSave={(min, max) => {
                        this.setState({ openPriceDialog: false });
                        updateQueryString({ minPrice: min, maxPrice: max, page: 1 });
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


export default withRouter(ProductsHeader);
