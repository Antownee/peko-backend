import React from "react";
import { Link } from "react-router-dom";
import { userActions } from '../../../../redux/actions';
import { connect } from 'react-redux';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Collapse,
  NavItem,
  NavLink
} from "shards-react";
import { FormattedMessage } from 'react-intl';

class UserActions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false
    };

    this.toggleUserActions = this.toggleUserActions.bind(this);
    this.logout = this.logout.bind(this);
  }

  toggleUserActions() {
    this.setState({
      visible: !this.state.visible
    });
  }

  logout() {
    //Clear the local storage
    const { dispatch } = this.props;
    dispatch(userActions.logout());
  }

  render() {
    const { currentUser } = this.props;
    return (
      <NavItem tag={Dropdown} caret toggle={this.toggleUserActions}>
        <DropdownToggle caret tag={NavLink} className="text-nowrap px-3">
          <img
            className="user-avatar rounded-circle mr-2"
            src={require("./../../../../images/coj/user.png")}
            alt="User Avatar"
          />{" "}
          <span className="d-none d-md-inline-block">{`${currentUser.firstName} ${currentUser.lastName}`}</span>
        </DropdownToggle>
        <Collapse tag={DropdownMenu} right small open={this.state.visible}>
          {/* <DropdownItem tag={Link} to="user-profile">
            <i className="material-icons">&#xE7FD;</i> Profile
          </DropdownItem>
          <DropdownItem divider /> */}
          <DropdownItem tag={Link} to="/" className="text-danger">
            <i className="material-icons text-danger">&#xE879;</i> <FormattedMessage id="navbar.logout"/>
          </DropdownItem>
        </Collapse>
      </NavItem>
    );
  }
}

function mapStateToProps(state) {
  const { user } = state.authentication;
  return user ? { currentUser: user } : {};
}

export default connect(mapStateToProps)(UserActions);
