import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import PriceDialog from "../PriceDialog/PriceDialog";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

class ProductsHeader extends Component {
    state = {
        openPriceDialog: false,
    };

    render() {
        let { loading, totalItemsCount, pageTitle } = this.props;
        let usePriceFilter = this.props.queryString.usePriceFilter === "true";
        let minPrice = this.props.queryString.minPrice || 0;
        let maxPrice = this.props.queryString.maxPrice || 1000;
        let sortValue = this.props.queryString.sortValue || "lh";

        return (
            <div>
                <div style={{ padding: 10, display: "flex", alignItems: "center" }}>
                    <div style={{ flex: 1, fontSize: 24 }}>
                        <div>{pageTitle}</div>
                        {!loading && (
                            <div style={{ fontSize: 12, color: "gray", marginTop: 5 }}>
                                Total results found: {totalItemsCount}
                            </div>)}
                    </div>

                    <FormControlLabel
                        control={
                            <Checkbox
                                color="primary"
                                checked={usePriceFilter}
                                onChange={e => {
                                    this.props.updateQueryString(
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
                            this.props.updateQueryString({ sortValue: e.target.value });
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
                        this.props.updateQueryString({ minPrice: min, maxPrice: max, page: 1 });
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

export default ProductsHeader;
