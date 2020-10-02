import React from "react";
import { Container, Row, Col, Card, CardHeader, CardBody, Button, ButtonGroup, ButtonToolbar, Modal, ModalHeader, ModalBody, ModalFooter } from "shards-react";
import { connect } from "react-redux";
import PageTitle from "../../components/common/PageTitle";
import { orderService } from "../../redux/services/order.service";
import { ToastContainer, toast } from 'react-toastify';
import "react-tabs/style/react-tabs.css";
import { injectIntl, defineMessages } from 'react-intl';
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
            shipments: [],
            orderValue: 0
        }
        this.goBack = this.goBack.bind(this);
        this.getShipments = this.getShipments.bind(this);
        this.addShipmentToState = this.addShipmentToState.bind(this);
        this.getPaymentProgress = this.getPaymentProgress.bind(this);
        this.updateShipmentToState = this.updateShipmentToState.bind(this);
        this.updatePaymentProgress = this.updatePaymentProgress.bind(this);
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

    updateShipmentToState(shipment) {
        this.setState(state => {
            let shipments = state.shipments.map((shp)=>{
                if(shp.shipmentID === shipment.shipmentID){ return shipment}
                return shp
            });
            return { shipments };
        });
    }

    removeShipmentfromState(shipmentID) {
        this.setState(state => {
            let shipments = state.shipments.filter((shipment) => shipment.shipmentID !== shipmentID);
            return { shipments };
        });
    }

    updatePaymentProgress(currentOrder) {
        this.setState({ orderValue: currentOrder.orderValue, currentOrder })
    }

    getPaymentProgress(orderValue) {
        //get total order value, get total of all shipments value
        const { shipments, currentOrder } = this.state;

        let totalShipmentValue = shipments
            .map(item => item.shipmentValue)
            .reduce((prev, curr) => prev + curr, 0);

        let totalOrderValue = currentOrder.orderValue || (orderValue|| 200000);

        return Math.floor((totalShipmentValue / totalOrderValue * 100));
    }

    //Going back to the orderSearch component
    goBack() {
        //Change state
        this.props.handleSearchState(false);
        this.setState({}); //Clear the state as we move to a new component
    }

    render() {
        const { order, user, intl, handleSearchState } = this.props;
        const { shipments, orderValue, currentOrder } = this.state;
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

        let paymentProgress = this.getPaymentProgress(orderValue);

        return (
            <Container fluid className="main-content-container">
                <ToastContainer />

                <Button className="mt-4" pill onClick={this.goBack}>&larr; Go Back</Button>
                <Row noGutters className="page-header py-4">
                    <PageTitle sm="4" title={intl.formatMessage(messages.header)} className="text-sm-left" />
                </Row>
                {
                    currentOrder.orderStatus !== "ORDER_CONF" ?
                        <div>
                            <Row>
                                <Col lg="4">
                                    <OrderDetailsInfo
                                        order={currentOrder}
                                        user={user}
                                        addShipmentToState={this.addShipmentToState}
                                        handleSearchState={handleSearchState}
                                        updatePaymentProgress={this.updatePaymentProgress}
                                        paymentProgress={Object.keys(currentOrder).length > 0 ? paymentProgress : 0}
                                        orderValue={orderValue} />
                                </Col>
                                <Col lg="8">
                                    <OrderDetailsProgress order={currentOrder} />
                                </Col>
                            </Row>
                            <Row noGutters className="page-header py-4">
                                <Col lg="12">
                                    <Card small className="mb-4">
                                        <CardHeader className="border-bottom">
                                            <h6 className="m-0">Shipments</h6>
                                        </CardHeader>
                                        <CardBody>
                                            <ShipmentsTable 
                                            shipments={shipments} 
                                            removeShipmentfromState={this.removeShipmentfromState}
                                            updateShipmentToState={this.updateShipmentToState} />
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
