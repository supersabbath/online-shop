import React, { Component } from 'react';
import "./Menu.css";
import { NavLink } from 'react-router-dom'
import queryString from 'query-string'
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom'
import { categories } from "../../Data"
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { loadCSS } from 'fg-loadcss/src/loadCSS';
import Icon from '@material-ui/core/Icon';


const mapStateToProps = state => {
    return { showMenu: state.showMenu, checkedOutItems: state.checkedOutItems, loggedInUser: state.loggedInUser };
};

// This function takes list of categories, and generates data which is needed for rendering menu.
const menuDataFromCategories = (categories) => {
    let menuData = [
        { type: "item", name: "Home page", url: "/", id: 0, icon: "fas fa-home" },
        { type: "title", name: "Product categories", id: 1 },
    ];

    let initialLength = menuData.length;

    menuData = menuData.concat(categories.map((x, i) => {
        return {
            name: x.name, url: "/search/?category=" + x.name, id: initialLength + i, type: "item", parentID: 1, icon: x.icon
        }
    }))

    return menuData;
}


class ConnectedMenu extends Component {

    constructor(props) {
        super(props);

        let menuItems = menuDataFromCategories(categories);
 
        this.state = {
            // This property keeps track of expanded items, initially let's set all title items to expanded.
            expanded: menuItems.reduce((accum, current) => {
                if (current.type === "title") {
                    accum[current.id] = true;
                }
                return accum;
            }, {}),
            menuItems
        }

    }

    componentDidMount() {
        loadCSS('https://use.fontawesome.com/releases/v5.1.0/css/all.css');
    }


    render() {
        if (!this.props.showMenu) return null;
        return (
            <div className="menu">
                {

                    this.state.menuItems.filter(y => {
                        // Filter some menu items before showing them.
                        return (y.type === "title" || ((!y.parentID || this.state.expanded[y.parentID]) && (!y.protected || this.props.loggedInUser)));
                    }).map((x, i) => {

                        if (x.type === "item") {

                            return (<div key={x.id} style={{ margin: 5, marginLeft: 10 }}>
                                <NavLink
                                    to={x.url}
                                    exact
                                    isActive={(_, location) => {

                                        let itemCategory = queryString.parse(x.url.substring(x.url.indexOf("?"))).category;

                                        // In case current URL contains a query string we do some manual
                                        // checks to determine if the navlink should be in active style or not.
                                        if (location.search && itemCategory !== undefined) {
                                            let currectCategory = queryString.parse(location.search).category;
                                            let directClick = queryString.parse(location.search).term === undefined;
                                            return directClick && itemCategory === currectCategory;
                                        }

                                        return x.url === location.pathname;
                                    }}
                                    style={{
                                        textDecoration: 'none',
                                        color: "rgb(32, 32, 34)"

                                    }}
                                    activeStyle={{
                                        color: "#4282ad",
                                    }}
                                >
                                    <div className="menuItem">
                                        <Icon className={x.icon} style={{ fontSize: 22, width: 25, marginRight: 10 }} />
                                        {x.name}
                                    </div>

                                </NavLink></div>);
                        } else if (x.type === "title") {
                            return (
                                <div
                                    key={x.id}
                                    onClick={() => {

                                        // Either expand or collapse this title item 
                                        this.setState(ps => {
                                            return {
                                                expanded: {
                                                    ...ps.expanded,
                                                    [x.id]: !ps.expanded[x.id]
                                                }
                                            }
                                        })
                                    }}
                                >

                                    <div style={{ padding: 10, height: 20, fontSize: 14, display: "flex", alignItems: "center", cursor: "pointer" }}>
                                        <span style={{ flex: 1 }}>{x.name}</span>
                                        {this.state.expanded[x.id] ? <ExpandLess /> : <ExpandMore />}
                                    </div>

                                </div>);
                        }

                        return null;

                    })}

            </div>


        );
    }
}
const Menu = withRouter(connect(mapStateToProps)(ConnectedMenu));
export default Menu;
