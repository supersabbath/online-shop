import React from "react";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Left from "@material-ui/icons/ChevronLeft";
import Right from "@material-ui/icons/ChevronRight";
import First from "@material-ui/icons/FirstPage";
import Last from "@material-ui/icons/LastPage";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  input: {
      textAlign: 'center'
  }
});

const itemsPerPageOptions = [
  <MenuItem key={"5"} value={"5"}>
    5
  </MenuItem>,
  <MenuItem key={"10"} value={"10"}>
    10
  </MenuItem>,
  <MenuItem key={"50"} value={"50"}>
    50
  </MenuItem>
];


const Paging = props => {
  let itemsPerPage = props.getParamFromQS("itemsPerPage");

  // Compute total number of pages.
  let totalPages = Math.ceil(props.wholeDataLength / parseInt(itemsPerPage));

  return (
    <div
      style={{
        display: "flex",
        marginBottom: 10,
        marginTop: 15,
        height: 60,
        fontSize: 13,
        color: "gray",
        alignItems: "center"
      }}
    >
      <IconButton
        size="small"
        color="primary"
        disabled={props.getParamFromQS("page") === "1"}
        onClick={() => {
          props.updateURLAndRedirect({ page: 1 });
        }}
        style={{ marginRight: 10 }}
      >
        <First />
      </IconButton>
      <IconButton
        size="small"
        color="primary"
        disabled={props.getParamFromQS("page") === "1"}
        onClick={() => {
          let val = parseInt(props.getParamFromQS("page"), 0) - 1;
          props.updateURLAndRedirect({ page: val });
        }}
        style={{ marginRight: 10 }}
      >
        <Left />
      </IconButton>
      Page:
      <TextField
        type="number"
        style={{ marginLeft: 5, width: 50,  marginRight: 10 }}
        inputProps={{
          className:props.classes.input
        }}
        value={props.getParamFromQS("page")}
        onChange={e => {
          let val = e.target.value;
          if (parseInt(val, 0) > totalPages || parseInt(val, 0) < 1) return;
          props.updateURLAndRedirect({ page: val });
        }}
      />
      of {totalPages}
      <IconButton
        size="small"
        color="primary"
        disabled={props.getParamFromQS("page") === totalPages.toString()}
        onClick={() => {
          let val = parseInt(props.getParamFromQS("page"), 0) + 1;
          props.updateURLAndRedirect({ page: val });
        }}
        style={{ marginLeft: 10, marginRight: 10 }}
      >
        <Right />
      </IconButton>
      <IconButton
        size="small"
        color="primary"
        disabled={props.getParamFromQS("page") === totalPages.toString()}
        onClick={() => {
          props.updateURLAndRedirect({ page: totalPages });
        }}
        style={{ marginRight: 10 }}
      >
        <Last />
      </IconButton>
      <span style={{ marginRight: 10 }}> Items per page: </span>
      <Select
        value={itemsPerPage}
        onChange={e => {
          props.updateURLAndRedirect({ itemsPerPage: e.target.value }, true);
        }}
      >
        {itemsPerPageOptions}
      </Select>
      <span style={{ marginLeft: 10 }}>
        {" "}
        Total items: {props.wholeDataLength}{" "}
      </span>
    </div>
  );
};

export default withStyles(styles)(Paging);
