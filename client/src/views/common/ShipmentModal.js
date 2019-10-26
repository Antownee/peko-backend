import React from "react";
import { Container } from "shards-react";
import Modal from 'react-bootstrap/modal';
import { connect } from "react-redux";
import Steps, { Step } from "rc-steps"
import { format, parse } from 'date-fns';
import PageTitle from "../../components/common/PageTitle";
import { orderService } from "../../redux/services/order.service";
import { ToastContainer, toast } from 'react-toastify';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import SentDocumentsTable from "./SentDocumentsTable";
import ReceivedDocumentsTable from "./ReceivedDocumentsTable";
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';


class ShipmentModal extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        const { user, intl, modalOpen, toggleModal, sentDocuments, receivedDocuments, currentShipment, updateShipmentDocuments } = this.props;
        return (
            <Container fluid className="main-content-container px-4">
                {
                    currentShipment ?
                        <Modal size="lg" show={modalOpen} onHide={toggleModal}>
                            <Modal.Header closeButton>
                                <div>
                                    <Modal.Title>{currentShipment.shipmentID || ""}</Modal.Title>
                                    <span className="text-muted d-block mb-2">{`USD ${currentShipment.shipmentValue}` || ""}</span>
                                </div>
                            </Modal.Header>
                            <Modal.Body>
                                <Tabs>
                                    <TabList>
                                        <Tab><FormattedMessage id="userorderdetails.sent-documents-title" /></Tab>
                                        <Tab><FormattedMessage id="userorderdetails.received-documents-title" /></Tab>
                                    </TabList>
                                    <TabPanel>
                                        <SentDocumentsTable
                                            currentShipment={currentShipment}
                                            displayDocuments={sentDocuments}
                                            updateShipmentDocuments={updateShipmentDocuments}
                                        />
                                    </TabPanel>
                                    <TabPanel>
                                        <ReceivedDocumentsTable
                                            currentShipment={currentShipment}
                                            displayDocuments={receivedDocuments} />
                                    </TabPanel>
                                </Tabs>
                            </Modal.Body>
                        </Modal> : ""
                }
            </Container>
        )
    }
}

const mapStateToProps = state => {
    const { user } = state.authentication;
    return { user }
}

export default injectIntl(connect(mapStateToProps)(ShipmentModal));
