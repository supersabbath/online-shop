import React, { Component } from 'react';
import "./Menu.css";
import { NavLink } from 'react-router-dom'
import queryString from 'query-string'
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom'
import { categoryNames } from "../../Data"
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
 

const mapStateToProps = state => {
    return { showMenu: state.showMenu, checkedOutItems: state.checkedOutItems, loggedInUser: state.loggedInUser };
};

// The menu UI is created from some data.
// This function creates such data.
// Should be noted both data and menu are pretty ad hoc.
const generateMenuModel = (categories) => {
    let menuModel = [
        { type: "title", name: "Main", id: 0 },
        { type: "item", name: "Home page", url: "/", parentID: 0, id: 1 },
        { type: "title", name: "Product categories", id: 2 },
    ];

    menuModel = menuModel.concat(categories.map((x, i) => {
        return {
            name: x, url: "/search/?category=" + x, id: 4 + i, type: "item", parentID: 2
        }
    }))

    return menuModel;
}


class ConnectedMenu extends Component {

    constructor(props) {
        super(props);

        let menuItems = generateMenuModel(categoryNames);

        // Title items in menu are expandable. Initially, they are all set to expanded.
        let initialExpandedState = {};
        menuItems.forEach(y => {
            if (y.type === "title") initialExpandedState[y.id] = true;
        })

        this.state = {
            expanded: initialExpandedState,
            menuItems
        }

    }
    render() {
        if (!this.props.showMenu) return null;
        return (
            <div className="menu">
                {

                    this.state.menuItems.filter(y => {

                        // For a menu item to be visible, it must either be a title,
                        // or its parent must be in expanded state and plus user must be allowed to see it.     
                        return (y.parentID === undefined || (this.state.expanded[y.parentID] && (!y.protected || this.props.loggedInUser)));
                    
                    }).map((x, i) => {

                        if (x.type === "item") {

                            return (<div key={x.id} style={{ margin: 5 }}>
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
                                        textDecoration: "underline"
                                    }}
                                >
                                    <div className="menuItem">{x.name}</div>

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

                                    <div style={{ padding: 10, height: 20, fontSize:14, display: "flex", alignItems: "center", cursor: "pointer" }}>
                                        <span style={{ flex: 1 }}>{x.name}</span>
                                        {this.state.expanded[x.id] ? <ExpandLess   /> : <ExpandMore   />}
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
