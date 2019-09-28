import React from "react";
import PropTypes from "prop-types";
import { NavLink as RouteNavLink } from "react-router-dom";
import { NavItem, NavLink } from "shards-react";
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';

class SidebarNavItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { item, intl } = this.props;

    const messages = defineMessages({
      dashboard: { id: "user_sidebar.dashboard" },
      place_order: { id: "user_sidebar.place_order" },
      orders: { id: "user_sidebar.orders" },
      assets: {id: "user_sidebar.assets"}
    })

    return (
      <NavItem>
        <NavLink tag={RouteNavLink} to={item.to}>
          {item.htmlBefore && (
            <div
              className="d-inline-block item-icon-wrapper"
              dangerouslySetInnerHTML={{ __html: item.htmlBefore }}
            />
          )}
          {/* {item.title && <span>{item.title}</span>} */}
          {item.title && <span>{intl.formatMessage(messages[item.id]) || item.title}</span>}
          {item.htmlAfter && (
            <div
              className="d-inline-block item-icon-wrapper"
              dangerouslySetInnerHTML={{ __html: item.htmlAfter }}
            />
          )}
        </NavLink>
      </NavItem>
    )
  }
}



export default injectIntl(SidebarNavItem);
