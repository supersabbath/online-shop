import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { connect } from "react-redux";
import { showCartDlg, setCheckedOutItems } from "../../Redux/Actions";
import { withRouter } from "react-router-dom";
import CartRow from "./CartRow";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCartOutlined";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";


class ConnectedCartDialog extends Component {
  render() {
    return (
      <div>
        <Dialog
          open={this.props.open}
          onClose={this.props.closeCartDialog}
        >
          <AppBar position="static" style={{ backgroundColor: "#3863aa" }}>
            <Toolbar>
              <ShoppingCartIcon
                fontSize="large"
                style={{ color: "white", marginRight: 20 }}
              />
              Shopping Cart
            </Toolbar>
          </AppBar>

          <div
            style={{
              maxHeight: 400,
              padding: 10,
              overflow: "auto"
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Item name</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.props.items.map((item, index) => {
                  return <CartRow item={item} key={item.id} {...this.props} />;
                })}
              </TableBody>
            </Table>
          </div>

          <div style={{ display: "flex", padding: 20, alignItems: "center" }}>
            <div
              style={{
                flex: 1
              }}
            >
              {" "}
              Total Price: {this.props.totalPrice} $
            </div>
            <Button
              variant="outlined"
              color="primary"
              disabled={this.props.totalPrice === 0}
              onClick={() => {
                this.props.onCheckOut(this.props.items)
                this.props.history.push("/order");
              }}
            >
              Checkout
            </Button>
          </div>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = state => (
  { 
    open: state.onlineShop.showCartDialog, 
    items: state.onlineShop.cartItems,
    totalPrice: state.onlineShop.cartItems.reduce((accumulator, item) => {
      return accumulator + item.price * item.quantity;
    }, 0),
  }
);

const mapDispatchToProps = (dispatch, state) => {
  return {
    // dispatching plain actions
    closeCartDialog: () => dispatch(showCartDlg(false)),
    onCheckOut: (items) => {
      dispatch(showCartDlg(false));
      dispatch(setCheckedOutItems(items));
    },
  }
}

const CartDialog = withRouter(connect(mapStateToProps, mapDispatchToProps)(ConnectedCartDialog));
export default CartDialog;
