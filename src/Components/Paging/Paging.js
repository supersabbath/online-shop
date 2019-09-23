import React from "react";
import Left from "@material-ui/icons/ChevronLeft";
import Right from "@material-ui/icons/ChevronRight";
import First from "@material-ui/icons/FirstPage";
import Last from "@material-ui/icons/LastPage";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  input: {
    textAlign: 'center'
  }
});




const Paging = props => {
  let itemsPerPage = props.itemsPerPage;
  let page = props.page;

  // Compute total number of pages.
  let totalPages = Math.ceil(props.totalItemsCount / parseInt(itemsPerPage));

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <IconButton
        size="small"
        color="primary"
        disabled={page === "1"}
        onClick={() => {
          props.updateQueryString({ page: 1 });
        }}
        style={{ marginRight: 10 }}
      >
        <First />
      </IconButton>
      <IconButton
        size="small"
        color="primary"
        disabled={page === "1"}
        onClick={() => {
          let val = parseInt(page, 0) - 1;
          props.updateQueryString({ page: val });
        }}
        style={{ marginRight: 10 }}
      >
        <Left />
      </IconButton>
      <Typography variant="body1">Page {page} of {totalPages}</Typography>
      <IconButton
        size="small"
        color="primary"
        disabled={page >= totalPages.toString()}
        onClick={() => {
          let val = parseInt(page, 0) + 1;
          props.updateQueryString({ page: val });
        }}
        style={{ marginLeft: 10, marginRight: 10 }}
      >
        <Right />
      </IconButton>
      <IconButton
        size="small"
        color="primary"
        disabled={page >= totalPages.toString()}
        onClick={() => {
          props.updateQueryString({ page: totalPages });
        }}
        style={{ marginRight: 10 }}
      >
        <Last />
      </IconButton>

    </div>
  );
};

export default withStyles(styles)(Paging);
