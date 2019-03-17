import React, { Component } from "react";
import "./Menu.css";
import { NavLink } from "react-router-dom";
import queryString from "query-string";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { categories } from "../../Data";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { loadCSS } from "fg-loadcss/src/loadCSS";
import Icon from "@material-ui/core/Icon";

const mapStateToProps = state => {
  return {
    showMenu: state.showMenu,
    checkedOutItems: state.checkedOutItems,
    loggedInUser: state.loggedInUser
  };
};

// Data needed for drawing menu.
const menuDataFromCategories = categories => {
  let menuData = [
    { type: "item", name: "Home page", url: "/", id: 0, icon: "fas fa-home" },
    { type: "title", name: "Product categories", id: 1 }
  ];

  let initialLength = menuData.length;

  menuData = menuData.concat(
    // Map categories to menu items.
    categories.map((x, i) => {
      return {
        name: x.name,
        url: "/search/?category=" + x.name,
        id: initialLength + i,
        type: "item",
        parentID: 1,
        icon: x.icon
      };
    })
  );

  return menuData;
};

class ConnectedMenu extends Component {
  constructor(props) {
    super(props);

    let menuItems = menuDataFromCategories(categories);

    this.state = {
      // This property keeps track of which title items are expanded, initially let's set all title items to expanded.
      expanded: menuItems.reduce((accum, current) => {
        if (current.type === "title") {
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
            if (y.parentID && !this.state.expanded[y.parentID]) return false;
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
                    let itemCategory = queryString.parse(
                      x.url.substring(x.url.indexOf("?"))
                    ).category;

                    // If there is a query string, we have some manual way to decide which menu item is active.
                    if (location.search && itemCategory !== undefined) {
                      let currectCategory = queryString.parse(location.search)
                        .category;
                      let directClick =
                        queryString.parse(location.search).term === undefined;
                      return directClick && itemCategory === currectCategory;
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
            } else if (x.type === "title") {
              return (
                <div
                  key={x.id}
                  className="menuTitle"
                  onClick={() => {
                    this.setState(ps => {
                      return {
                        expanded: {
                          ...ps.expanded,
                          [x.id]: !ps.expanded[x.id]
                        }
                      };
                    });
                  }}
                >
                  <span style={{ flex: 1 }}>{x.name}</span>
                  {this.state.expanded[x.id] ? <ExpandLess /> : <ExpandMore />}
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
