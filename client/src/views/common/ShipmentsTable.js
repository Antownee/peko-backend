import React from 'react';
import { Container, Button } from "shards-react";
import { connect } from "react-redux";
import { apiUrl, fileUrl } from "../../config";
import { format } from 'date-fns';
import ShipmentModal from './ShipmentModal';
import { documentHandler } from '../../utils/documentHandler';
import { userUploads, adminUploads } from "../../documents";


import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';

class ShipmentsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false,
            currentShipment: {},
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
        }
        this.toggleModal = this.toggleModal.bind(this);
        this.loadDocumentTables = this.loadDocumentTables.bind(this);
    }

    async loadDocumentTables(currentShipment) {
        //if admin, set your sent and received. if user, set their sent and received
        let received_source = this.props.user.role === "User" ? this.state.userUploads.sendDocs : this.state.adminUploads.sendDocs;
        let sent_source = this.props.user.role === "User" ? this.state.userUploads.receivedDocs : this.state.adminUploads.receivedDocs;

        let received = await documentHandler(received_source, currentShipment);
        let sent = await documentHandler(sent_source, currentShipment)

        this.setState({
            displaySentDocuments: this.props.user.role === "Admin" ? sent : received,
            displayReceivedDocuments: this.props.user.role === "Admin" ? received : sent
        });
    }


    toggleModal(shipment) {
        this.setState({
            modalOpen: !this.state.modalOpen,
        });
        if (shipment) {
            this.loadDocumentTables(shipment);
            this.setState({
                currentShipment: shipment
            });
        }
    }

    render() {
        const { intl, sentDocuments, receivedDocuments, shipments } = this.props;
        const { modalOpen, currentShipment, displaySentDocuments, displayReceivedDocuments } = this.state
        return (
            <Container fluid className="main-content-container px-4">
                <ShipmentModal
                    // order={currentOrder}
                    //user={user}
                    currentShipment={currentShipment}
                    modalOpen={modalOpen}
                    toggleModal={this.toggleModal}
                    sentDocuments={displaySentDocuments}
                    receivedDocuments={displayReceivedDocuments}
                />

                <table className="table mb-0">
                    <thead className="bg-light">
                        <tr>
                            <th scope="col" className="border-0">
                                Shipment ID
                            </th>
                            <th scope="col" className="border-0">
                                Date
                                            </th>
                            <th scope="col" className="border-0">
                                Value
                                            </th>
                            <th scope="col" className="border-0">

                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            shipments.map((shipment, idx) => (
                                <tr key={idx}>
                                    <td>{shipment.shipmentID}</td>
                                    <td>{shipment.shipmentDate}</td>
                                    <td>USD {shipment.shipmentValue}</td>
                                    <td>
                                        <Button size="sm" theme="success" className="mb-2 mr-1" onClick={() => this.toggleModal(shipment)}>View Shipment</Button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </Container>


        )
    }
}

const mapStateToProps = state => {
    const { user } = state.authentication;
    return { user }
}

export default injectIntl(connect(mapStateToProps)(ShipmentsTable));