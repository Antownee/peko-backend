import React from "react";
import { Container, Row, Col, Card, CardHeader} from "shards-react";
import { connect } from "react-redux";
import PageTitle from "../../components/common/PageTitle";
import { ToastContainer } from 'react-toastify';
import "react-tabs/style/react-tabs.css";
import AddTeaForm from "./AddTeaForm";
import AddEmailsForm from "./AddEmailsForm";



class AdminOrderDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            teaName: "",
            teaDescription: "",
            emailAddresses: ""
        }
    }

    render() {
        return (
            <Container fluid className="main-content-container">
                <ToastContainer />
                <Row noGutters className="page-header py-4">
                    <PageTitle sm="4" title="Manage assets" subtitle="Assets" className="text-sm-left" />
                </Row>
                <Row>
                    <Col lg="6">
                        <Card small>
                            <CardHeader className="border-bottom">
                                <h6 className="m-0">Tea types</h6>
                            </CardHeader>
                            <AddTeaForm />
                        </Card>
                    </Col>
                    <Col lg="6">
                        <Card small>
                            <CardHeader className="border-bottom">
                                <h6 className="m-0">Restricted emails (Who to notify on order receipt)</h6>
                            </CardHeader>
                            <AddEmailsForm />
                        </Card>
                    </Col>
                </Row>

            </Container>

        )
    }
}

const mapStateToProps = state => {
    const { user } = state.authentication;
    return {user};
}

export default connect(mapStateToProps)(AdminOrderDetails);
