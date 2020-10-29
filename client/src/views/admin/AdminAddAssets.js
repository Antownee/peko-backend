import React from "react";
import { Container, Row, Col, Card, CardHeader, CardBody, ListGroup, ListGroupItem, CardFooter } from "shards-react";
import { connect } from "react-redux";
import PageTitle from "../../components/common/PageTitle";
import { ToastContainer } from 'react-toastify';
import "react-tabs/style/react-tabs.css";
import AddTeaForm from "./AddTeaForm";
import AddEmailsForm from "./AddEmailsForm";
import { orderService } from "../../redux/services/order.service";


class AdminOrderDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            teaName: "",
            teaDescription: "",
            emailAddresses: "",
            teaTypes: [],
            emails: []
        }
    }

    componentDidMount() {
        orderService.populateAssetPage()
            .then((res) => {
                this.setState({
                    emails: res.emailList,
                    teaTypes: res.teaList
                })
            })
            .catch((e) => {
                //Throw an error
            })
    }


    render() {
        const { teaTypes, emails } = this.state;

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
                        <br></br>
                        {/* Types of tea from the DB */}
                        <Card small>
                            <CardHeader className="border-bottom">
                                <h6 className="m-0">Types of tea available</h6>
                                <div className="block-handle" />
                            </CardHeader>

                            <CardBody className="p-0">
                                <ListGroup small flush className="list-group-small">
                                    {teaTypes.map((item, idx) => (
                                            <ListGroupItem key={idx} className="d-flex px-3">
                                                <span className="text-semibold text-fiord-blue">{item.teaName}</span>
                                                <span className="ml-auto text-right text-semibold text-reagent-gray">
                                                    USD x.xx
                                                </span>
                                            </ListGroupItem>
                                        ))}
                                </ListGroup>
                            </CardBody>

                            <CardFooter className="border-top">
                                <Row>
                                </Row>
                            </CardFooter>
                        </Card>
                    </Col>
                    <Col lg="6">
                        <Card small>
                            <CardHeader className="border-bottom">
                                <h6 className="m-0">Restricted emails (Who to notify on order receipt)</h6>
                            </CardHeader>
                            <AddEmailsForm />

                        <br></br>
                        {/* Emails */}
                        <Card small>
                            <CardHeader className="border-bottom">
                                <h6 className="m-0">Emails</h6>
                                <div className="block-handle" />
                            </CardHeader>

                            <CardBody className="p-0">
                                <ListGroup small flush className="list-group-small">
                                    {emails.map((item, idx) => (
                                            <ListGroupItem key={idx} className="d-flex px-3">
                                                <span className="text-semibold text-fiord-blue">{item.email}</span>
                                                <span className="ml-auto text-right text-semibold text-reagent-gray">
                                                    -
                                                </span>
                                            </ListGroupItem>
                                        ))}
                                </ListGroup>
                            </CardBody>

                            <CardFooter className="border-top">
                                <Row>
                                </Row>
                            </CardFooter>
                        </Card>
                        </Card>
                    </Col>
                </Row>

            </Container>

        )
    }
}

const mapStateToProps = state => {
    const { user } = state.authentication;
    return { user };
}

export default connect(mapStateToProps)(AdminOrderDetails);
