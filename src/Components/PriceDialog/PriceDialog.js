import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";

class PriceDialog extends Component {
  state = {};

  componentWillReceiveProps(np) {
    // Whenever this dialog is opened, copy the value of min and max to state.
    if (this.props.open === false && np.open === true) {
      this.setState({
        min: np.min,
        max: np.max
      });
    }
  }

  render() {
    let { min, max } = this.state;

    return (
      <div>
        <Dialog
          open={this.props.open}
          onClose={() => {
            this.props.onClose();
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            <DialogTitle>Enter price range</DialogTitle>

            <div style={{ display: "flex", padding: 20 }}>
              <TextField
                value={min}
                type="number"
                style={{ width: 70 }}
                placeholder="Min"
                label="Min"
                onChange={e => {
                  let val = e.target.value;
                  if (
                    val.length === 0 ||
                    parseInt(val, 10) < 0 ||
                    parseInt(val, 10) > 100000
                  )
                    return;
                  this.setState({
                    min: val
                  });
                }}
              />
              <TextField
                value={max}
                type="number"
                style={{ width: 70, marginLeft: 20 }}
                placeholder="Max"
                label="Max"
                onChange={e => {
                  let val = e.target.value;
                  if (
                    val.length === 0 ||
                    parseInt(val, 10) < 0 ||
                    parseInt(val, 10) > 100000
                  )
                    return;
                  this.setState({
                    max: val
                  });
                }}
              />
            </div>
            <div style={{ display: "flex", padding: 20 }}>
              <Button
                variant="outlined"
                color="primary"
                style={{ width: 50 }}
                onClick={() => {
                  this.props.onSave(min, max);
                }}
              >
                OK
              </Button>
              <Button
                color="primary"
                variant="outlined"
                style={{ width: 50, marginLeft: 5 }}
                onClick={() => {
                  this.props.onClose();
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Dialog>
      </div>
    );
  }
}

export default PriceDialog;
