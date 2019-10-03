import React from "react";
import { Container, Row, Col, Card, CardHeader, CardBody, Button, ButtonGroup, ButtonToolbar, Modal, ModalHeader, ModalBody, ModalFooter } from "shards-react";
import { connect } from "react-redux";
import { format, parse } from 'date-fns';
import PageTitle from "../../components/common/PageTitle";
import { orderService } from "../../redux/services/order.service";
import { ToastContainer, toast } from 'react-toastify';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import SentDocumentsTable from "./SentDocumentsTable";
import { documentHandler } from '../../utils/documentHandler';
import { userUploads, adminUploads } from "../../documents";
import ReceivedDocumentsTable from "./ReceivedDocumentsTable";
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';


class ContractModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        const { order, user, intl, modalOpen, toggleModal, sentDocuments, receivedDocuments } = this.props;
        return (
            <Container fluid className="main-content-container px-4">
                <Modal size="lg" open={modalOpen} toggle={toggleModal}>
                    <ModalHeader>SHIPMENT ID: THGD-675-HJJ</ModalHeader>
                    <ModalBody>

                        <Tabs>
                            <TabList>
                                <Tab><FormattedMessage id="userorderdetails.sent-documents-title" /></Tab>
                                <Tab><FormattedMessage id="userorderdetails.received-documents-title" /></Tab>
                            </TabList>

                            <TabPanel>
                                <SentDocumentsTable
                                    currentOrder={order}
                                    displayDocuments={sentDocuments}
                                />
                            </TabPanel>
                            <TabPanel>
                                <ReceivedDocumentsTable
                                    currentOrder={order}
                                    displayDocuments={receivedDocuments} />
                            </TabPanel>
                        </Tabs>
                    </ModalBody>
                    <ModalFooter>
                    </ModalFooter>
                </Modal>
            </Container>
        )

    }
}

const mapStateToProps = state => {
    const { user } = state.authentication;
    return { user }
}

export default injectIntl(connect(mapStateToProps)(ContractModal));
