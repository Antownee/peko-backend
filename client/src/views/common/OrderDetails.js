import React from "react";
import { Container, Row, Col, Card, CardHeader, CardBody, Button, ButtonGroup, ButtonToolbar, Modal, ModalHeader, ModalBody, ModalFooter } from "shards-react";
import { connect } from "react-redux";
import Steps, { Step } from "rc-steps"
import { format, parse } from 'date-fns';
import PageTitle from "../../components/common/PageTitle";
import { orderService } from "../../redux/services/order.service";
import { ToastContainer, toast } from 'react-toastify';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import SentDocumentsTable from "../common/SentDocumentsTable";
import { documentHandler } from '../../utils/documentHandler';
import { userUploads, adminUploads } from "../../documents";
import ReceivedDocumentsTable from "../common/ReceivedDocumentsTable";
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';
import PaymentsTable from './PaymentsTable';
import ShipmentsTable from './ShipmentsTable'


class OrderDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            backgroundImage: require("../../images/content-management/17.jpg"),
            currentOrder: this.props.order,
            displaySentDocuments: [],
            displayReceivedDocuments: [],
            userUploads: {
                sendDocs: userUploads, //what he is sending
                receivedDocs: adminUploads //what he receives
            },
            adminUploads: {
                sendDocs: userUploads, //what he is sending
                receivedDocs: adminUploads //what he receives
            },
            stepNumber: 0,
            shipments: []
        }
        this.confirmOrder = this.confirmOrder.bind(this);
        this.goBack = this.goBack.bind(this);
        this.loadDocumentTables = this.loadDocumentTables.bind(this);
        this.shipOrder = this.shipOrder.bind(this);
        this.deleteOrder = this.deleteOrder.bind(this);
        this.getShipments = this.getShipments.bind(this);
    }

    componentDidMount() {
        this.loadDocumentTables();
        //get shipments
        this.getShipments();
    }

    async loadDocumentTables() {
        //if admin, set your sent and received. if user, set their sent and received
        let received_source = this.props.user.role === "User" ? this.state.userUploads.sendDocs : this.state.adminUploads.sendDocs;
        let sent_source = this.props.user.role === "User" ? this.state.userUploads.receivedDocs : this.state.adminUploads.receivedDocs;

        let received = await documentHandler(received_source, this.state.currentOrder);
        let sent = await documentHandler(sent_source, this.state.currentOrder)

        this.setState({
            displaySentDocuments: this.props.user.role === "Admin" ? sent : received,
            displayReceivedDocuments: this.props.user.role === "Admin" ? received : sent
        });
    }

    getShipments() {
        let orderID = this.state.currentOrder.orderRequestID;
        orderService.getShipmentsByOrderID({ orderID })
            .then((res) => {
                this.setState({ shipments: res });
            })
    }


    deleteOrder() {
        orderService.deleteOrder(this.state.currentOrder)
            .then((res) => {
                toast.success(res.msg);
                this.setState({ currentOrder: {} });
                return this.props.handleSearchState(false);//go back
            })
            .catch((e) => {
                toast.error(e.message);
            })
    }

    confirmOrder() {
        orderService.confirmOrder(this.state.currentOrder, this.props.user)
            .then((res) => {
                toast.success(res.msg);
                let order = Object.assign({}, this.state.currentOrder);
                order["confirmed"] = true;
                order["orderPosition"] = 1;
                return this.setState({ currentOrder: order });
            })
            .catch((e) => {
                toast.error(e.message);
            })
    }

    shipOrder() {
        orderService.shipOrder(this.state.currentOrder, this.props.user)
            .then((res) => {
                toast.success(res.msg);
                let order = Object.assign({}, this.state.currentOrder);
                order["orderShipped"] = true;
                order["orderPosition"] = 3;
                return this.setState({ currentOrder: order });
            })
            .catch((e) => {
                toast.error(e.message);
            })
    }

    goBack() {
        //Change state
        this.props.handleSearchState(false);
        this.setState({
            userUploads: {
                sendDocs: [], //what he is sending
                receivedDocs: [] //what he receives
            },
            adminUploads: {
                sendDocs: [], //what he is sending
                receivedDocs: [] //what he receives
            }
        })
    }


    render() {
        const { order, user, intl } = this.props;
        const { currentOrder, shipments } = this.state;
        const messages = defineMessages({
            header: { id: "userorderdetails.header" },
            progress1: { id: "userorderdetails.progress-1" },
            progress1_text: { id: "userorderdetails.progress-1-text" },
            progress2: { id: "userorderdetails.progress-2" },
            progress2_text: { id: "userorderdetails.progress-2-text" },
            progress3: { id: "userorderdetails.progress-3" },
            progress3_text: { id: "userorderdetails.progress-3-text" },
            progress4: { id: "userorderdetails.progress-4" },
            progress4_text: { id: "userorderdetails.progress-4-text" },
        })

        return (
            <Container fluid className="main-content-container">
                {/* Page Header */}
                <ToastContainer />


                <Button className="mt-4" pill onClick={this.goBack}>&larr; Go Back</Button>
                <Row noGutters className="page-header py-4">
                    <PageTitle sm="4" title={intl.formatMessage(messages.header)} className="text-sm-left" />
                </Row>

                {/* Confirmed tab */}
                <Col>
                    <CardBody>
                        <Col lg="12" sm="12" className="mb-4" >
                            <Card small className="card-post card-post--aside card-post--1">
                                <div
                                    className="card-post__image"
                                    style={{ backgroundImage: `url(${this.state.backgroundImage})` }}
                                >
                                </div>
                                <CardBody>
                                    <h5 className="card-title">
                                        <a className="text-fiord-blue" href="#">
                                            {order.orderRequestID}
                                        </a>
                                    </h5>
                                    <p className="card-text d-inline-block mb-3">{order.teaID}</p><br />
                                    <p className="card-text d-inline-block mb-3">{order.notes}</p><br />
                                    <span className="text-muted">{format(order.requestDate, 'MMMM Do, YYYY')}</span>
                                    <div className="mt-4">
                                        {currentOrder.confirmed && user.role === "User" ?
                                            (<Button className="" size="sm" theme="success">
                                                <FormattedMessage id="userorderdetails.label-order-confirmed" />
                                            </Button>) : ""}
                                        {user.role === "Admin" ?
                                            (<Row>
                                                <Col className="mb-4">
                                                    <ButtonToolbar>
                                                        <ButtonGroup>
                                                            {!currentOrder.confirmed ? (
                                                                <Button className="m-2" size="sm" onClick={this.confirmOrder}>Confirm order</Button>
                                                            ) : <Button className="m-2" size="sm" theme="success">ORDER CONFIRMED</Button>}
                                                            <br />
                                                            {!currentOrder.orderShipped ? (
                                                                <Button className="m-2" size="sm" onClick={this.shipOrder}>Ship order</Button>
                                                            ) : <Button className="m-2" size="sm" theme="success">ORDER SHIPPED</Button>}
                                                            <br />
                                                            {/* <Button className="m-2" size="sm" theme="danger " onClick={this.toggleModal}>Delete order</Button> */}
                                                        </ButtonGroup>
                                                    </ButtonToolbar>
                                                </Col>
                                            </Row>)
                                            : ""
                                        }
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </CardBody>


                    <Card small className="mb-4">
                        <CardHeader className="border-bottom">
                            <h6 className="m-0"> <FormattedMessage id="userorderdetails.progressheader" /></h6>
                        </CardHeader>
                        <CardBody>
                            <Steps current={currentOrder.orderPosition} style={{ marginTop: 10 }}>
                                <Step title={intl.formatMessage(messages.progress1)} description={intl.formatMessage(messages.progress1_text)} />
                                <Step title={intl.formatMessage(messages.progress2)} description={intl.formatMessage(messages.progress2_text)} />
                                <Step title={intl.formatMessage(messages.progress3)} description={intl.formatMessage(messages.progress3_text)} />
                                <Step title={intl.formatMessage(messages.progress4)} description={intl.formatMessage(messages.progress4_text)} />
                            </Steps>
                        </CardBody>
                    </Card>

                    {
                        user.role === "User" && !currentOrder.confirmed ?
                            <p><FormattedMessage id="userorderdetails.document-unavailable-warning" /></p> :
                            <Card small className="mb-4">
                                <Tabs>
                                    <TabList>
                                        <Tab>Shipments</Tab>
                                    </TabList>

                                    <TabPanel>
                                        <ShipmentsTable
                                            shipments={shipments}
                                            sentDocuments={this.state.displaySentDocuments}
                                            receivedDocuments={this.state.displayReceivedDocuments} />
                                    </TabPanel>
                                </Tabs>
                            </Card>
                    }

                </Col>
            </Container>
        )

    }
}

const mapStateToProps = state => {
    const { user } = state.authentication;
    return { user }
}

export default injectIntl(connect(mapStateToProps)(OrderDetails));
