import React from "react";
import { Container, Row, Col } from "shards-react";
import { connect } from 'react-redux';
import MainNavbar from "../components/layout/MainNavbar/MainNavbar";
import MainSidebar from "../components/layout/MainSidebar/MainSidebar";
import MainFooter from "../components/layout/MainFooter";

import "../assets/steps.css"


export class AdminLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      noNavbar: false,
      noFooter: false,
    }
  }

  render() {
    const { children } = this.props;
    const { noNavbar, noFooter } = this.state;
    return (
      <Container fluid>
        <Row>
          <MainSidebar />
          <Col
            className="main-content p-0"
            lg={{ size: 10, offset: 2 }}
            md={{ size: 9, offset: 3 }}
            sm="12"
            tag="main"
          >
            {!noNavbar && <MainNavbar />}
            {children}
            {!noFooter && <MainFooter />}
          </Col>
        </Row>
      </Container>
    )
  }
}


function mapStateToProps(state) {
  const { user } = state.authentication;
  const { isLoading } = state.loadState

  return user ? { currentUser: user, isLoading } : {};

}

export default connect(mapStateToProps)(AdminLayout);

