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
import ShipmentsTable from './ShipmentsTable'
import OrderDetailsInfo from "./OrderDetailsInfo";
import OrderDetailsProgress from "./OrderDetailsProgress";


class OrderDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            backgroundImage: require("../../images/content-management/17.jpg"),
            currentOrder: this.props.order,
            stepNumber: 0,
            shipments: []
        }
        this.goBack = this.goBack.bind(this);
        this.deleteOrder = this.deleteOrder.bind(this);
        this.getShipments = this.getShipments.bind(this);
        this.addShipmentToState = this.addShipmentToState.bind(this);
        this.removeShipmentfromState = this.removeShipmentfromState.bind(this);
    }

    componentDidMount() {
        //get shipments
        this.getShipments();
    }


    getShipments() {
        let { currentOrder } = this.state;
        let { user } = this.props;
        return Object.keys(currentOrder).length > 0 ?
            orderService.getShipmentsByOrderID(currentOrder.orderRequestID, user.role)
                .then((res) => {
                    this.setState({ shipments: res });
                })
            : ""
    }

    addShipmentToState(shipment) {
        this.setState(state => {
            let shipments = state.shipments.concat(shipment);
            return { shipments };
        });
    }

    removeShipmentfromState(shipmentID) {
        this.setState(state => {
            let shipments = state.shipments.filter((shipment) => shipment.shipmentID !== shipmentID);
            return { shipments };
        });
    }


    deleteOrder() {
        orderService.deleteOrder(this.state.currentOrder)
            .then((res) => {
                toast.success(res.msg);
                this.setState({ currentOrder: {} });
                return this.goBack();
            })
            .catch((e) => {
                toast.error(e.message);
            })
    }

    goBack() {
        //Change state
        this.props.handleSearchState(false);
        this.setState({});
    }

    render() {
        const { order, user, intl, handleSearchState } = this.props;
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
                <ToastContainer />

                <Button className="mt-4" pill onClick={this.goBack}>&larr; Go Back</Button>
                <Row noGutters className="page-header py-4">
                    <PageTitle sm="4" title={intl.formatMessage(messages.header)} className="text-sm-left" />
                </Row>
                {
                    order.orderStatus !== "ORDER_CONF" ?
                        <div>
                            <Row>
                                <Col lg="4">
                                    <OrderDetailsInfo order={order} user={user} addShipmentToState={this.addShipmentToState}  deleteOrder={this.deleteOrder} handleSearchState={handleSearchState} />
                                </Col>
                                <Col lg="8">
                                    <OrderDetailsProgress order={order}/>
                                </Col>
                            </Row>
                            <Row noGutters className="page-header py-4">
                                <Col lg="12">
                                    <Card small className="mb-4">
                                        <CardHeader className="border-bottom">
                                            <h6 className="m-0">Shipments</h6>
                                        </CardHeader>
                                        <CardBody>
                                            <ShipmentsTable shipments={shipments} removeShipmentfromState={this.removeShipmentfromState} />
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </div> :
                        <div>
                        </div>
                }

            </Container>
        )

    }
}

const mapStateToProps = state => {
    const { user } = state.authentication;
    return { user }
}

export default injectIntl(connect(mapStateToProps)(OrderDetails));
