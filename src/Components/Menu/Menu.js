import React, { Component } from "react";
import "./Menu.css";
import { NavLink } from "react-router-dom";
import queryString from "query-string";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { menuItems } from "../../Data";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { loadCSS } from "fg-loadcss/src/loadCSS";
import Icon from "@material-ui/core/Icon";

const mapStateToProps = state => {
  return {
    showMenu: state.showMenu,
    loggedInUser: state.loggedInUser
  };
};

class ConnectedMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // Keep track of expanded parent items in the menu. By default expand them.
      expandedMenuItems: menuItems.reduce((accum, current) => {
        if (current.type === "parent") {
          accum[current.id] = true;
        }
        return accum;
      }, {}),
      menuItems
    };
  }

  componentDidMount() {
    loadCSS("https://use.fontawesome.com/releases/v5.1.0/css/all.css");
  }

  render() {
    if (!this.props.showMenu) return null;
    return (
      <div className="menu">
        {this.state.menuItems
          .filter(y => {
            if (y.parentID && !this.state.expandedMenuItems[y.parentID])
              return false;
            if (y.protected && !this.props.loggedInUser) return false;
            return true;
          })
          .map((x, i) => {
            if (x.type === "item") {
              return (
                <NavLink
                  to={x.url}
                  exact
                  isActive={(_, location) => {

                    // Check if there is a query string.
                    if (location.search) {
                      let categoryFromQueryString = queryString.parse(
                        location.search
                      ).category;

                      // If "term" is undefined, we assume user didn't click Search button.
                      let isDirectClick =
                        queryString.parse(location.search).term === undefined;

                      // If user didn't click Search and name of this item is same
                      // as category from query string, highlight this item
                      return (
                        isDirectClick && x.name === categoryFromQueryString
                      );
                    }

                    return x.url === location.pathname;
                  }}
                  style={{
                    textDecoration: "none",
                    color: "rgb(32, 32, 34)",
                    marginLeft: 10
                  }}
                  key={x.id}
                  activeStyle={{
                    color: "#4282ad"
                  }}
                >
                  <div className="menuItem">
                    <Icon
                      className={x.icon}
                      style={{ fontSize: 22, width: 25, marginRight: 10 }}
                    />
                    {x.name}
                  </div>
                </NavLink>
              );
            } else if (x.type === "parent") {
              return (
                <div
                  key={x.id}
                  className="menuTitle"
                  onClick={() => {
                    this.setState(ps => {
                      return {
                        expandedMenuItems: {
                          ...ps.expandedMenuItems,
                          [x.id]: !ps.expandedMenuItems[x.id]
                        }
                      };
                    });
                  }}
                >
                  <span style={{ flex: 1 }}>{x.name}</span>
                  {this.state.expandedMenuItems[x.id] ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  )}
                </div>
              );
            }

            return null;
          })}
      </div>
    );
  }
}
const Menu = withRouter(connect(mapStateToProps)(ConnectedMenu));
export default Menu;
