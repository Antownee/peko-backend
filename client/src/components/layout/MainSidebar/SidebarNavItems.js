import React from "react";
import { Nav } from "shards-react";
import { connect } from 'react-redux';

import SidebarNavItem from "./SidebarNavItem";
import getSidebarNavItems from "../../../data/sidebar-nav-items";

class SidebarNavItems extends React.Component {
  constructor(props) {
    super(props)

    const {currentUser} = this.props;
    const navbarItems = getSidebarNavItems(currentUser.role);

    this.state = {
      navItems: navbarItems
    };
  }


  render() {
    const { navItems: items } = this.state;
    return (
      <div className="nav-wrapper">
        <Nav className="nav--no-borders flex-column">
          {items.map((item, idx) => (
            <SidebarNavItem key={idx} item={item} />
          ))}
        </Nav>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { user } = state.authentication;
  return user ? { currentUser: user } : {};
}

export default connect(mapStateToProps)(SidebarNavItems);

