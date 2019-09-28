import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Container, Navbar } from "shards-react";

import NavbarSearch from "./NavbarSearch";
import NavbarNav from "./NavbarNav/NavbarNav";
import NavbarToggle from "./NavbarToggle";
import { connect } from "react-redux";


import ReactFlagsSelect from 'react-flags-select';
import 'react-flags-select/css/react-flags-select.css';
import { switchLanguageActions } from "../../../redux/actions"

class MainNavbar extends React.Component {
  constructor(props) {
    super(props);
    this.onSelectFlag = this.onSelectFlag.bind(this);
  }

  onSelectFlag(countryCode) {
    //set language to the selected one
    let code = countryCode === "IR" ? "FA" : "EN";
    this.props.dispatch(switchLanguageActions.setLanguage(code));
    this.refs.userFlag.updateSelected(countryCode)
  }

  render() {
    const { currentLanguage } = this.props;
    const countryCode = currentLanguage === "FA" ? "IR" : "GB";

    const classes = classNames(
      "main-navbar",
      "bg-white",
      true && "sticky-top"
    );

    return (
      <div className={classes}>
        <Container className="p-0">
          <Navbar type="light" className="align-items-stretch flex-md-nowrap p-0">
            <ReactFlagsSelect
              className=" w-100 d-none d-md-flex d-lg-flex main-navbar__search"
              defaultCountry={countryCode}
              countries={["GB", "IR"]}
              showSelectedLabel={false}
              selectedSize={18}
              optionsSize={18}
              showOptionLabel={false}
              onSelect={this.onSelectFlag}
              ref="userFlag" />
            <NavbarSearch />
            <NavbarNav />
            {/* <NavbarToggle/> */}
          </Navbar>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { currentLanguage } = state.currentLanguage;
  return { currentLanguage }
}


export default connect(mapStateToProps)(MainNavbar);
