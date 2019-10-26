import React from 'react';
import { Container, Button } from "shards-react";
import { connect } from "react-redux";
import { format } from 'date-fns';
import ShipmentModal from './ShipmentModal';
import { documentHandler } from '../../utils/documentHandler';
import { userUploads, adminUploads } from "../../documents";
import EditShipmentModal from '../admin/EditShipmentModal';
import { orderService } from "../../redux/services/order.service";
import { ToastContainer, toast } from 'react-toastify';
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';
import { formatNumber } from "../../utils/numberFormatter";

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
            editShipmentModalOpen: false
        }
        this.toggleModal = this.toggleModal.bind(this);
        this.loadDocumentTables = this.loadDocumentTables.bind(this);
        this.deleteShipment = this.deleteShipment.bind(this);
        this.updateShipmentDocuments = this.updateShipmentDocuments.bind(this);
        this.toggleEditShipmentModal = this.toggleEditShipmentModal.bind(this);
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

    toggleEditShipmentModal(shipment) {
        this.setState({
            editShipmentModalOpen: !this.state.editShipmentModalOpen,
        });
        if (shipment) {
            this.setState({
                currentShipment: shipment
            });
        }
    }


    deleteShipment(shipmentID) {
        orderService.deleteShipment(shipmentID)
            .then((res) => {
                //Remove shipment from state
                this.props.removeShipmentfromState(shipmentID);
                toast.success(res.message);
            })
            .catch((e) => {
                toast.err("Try again later");
            })
    }

    updateShipmentDocuments(documentCode, fileName) {
        this.setState(state => {
            //update currentShipment
            let newDocuments = state.currentShipment.documents.concat({
                dateAdded: new Date().toLocaleDateString(),
                documentCode: documentCode,
                fileName,
                name: fileName,
                submitted: true
            })

            let { currentShipment } = state;
            currentShipment['documents'] = newDocuments;

            //update displayDocuments
            let docs = state.displaySentDocuments.map((doc) => {
                if (doc.documentCode === documentCode) {
                    return {
                        dateAdded: new Date().toLocaleDateString(),
                        documentCode: doc.documentCode,
                        fileName,
                        name: doc.name,
                        submitted: true
                    };
                } else {
                    return doc;
                }
            });
            return { displaySentDocuments: docs, currentShipment };
        })
    }


    render() {
        const { shipments, user, updateShipmentToState } = this.props;
        const { modalOpen, currentShipment, displaySentDocuments, displayReceivedDocuments, editShipmentModalOpen } = this.state
        return (
            <Container fluid className="main-content-container px-4">
                <ToastContainer />

                <ShipmentModal
                    currentShipment={currentShipment}
                    modalOpen={modalOpen}
                    toggleModal={this.toggleModal}
                    sentDocuments={displaySentDocuments}
                    receivedDocuments={displayReceivedDocuments}
                    updateShipmentDocuments={this.updateShipmentDocuments}
                />

                <EditShipmentModal
                    modalOpen={editShipmentModalOpen}
                    toggleEditShipmentModal={this.toggleEditShipmentModal}
                    currentShipment={currentShipment}
                    updateShipmentToState={updateShipmentToState}
                />


                {
                    shipments.length > 0 ? <table className="table mb-0">
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
                                    Weight
                                            </th>
                                <th scope="col" className="border-0"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                shipments.map((shipment, idx) => (
                                    <tr key={idx}>
                                        <td>{shipment.shipmentID}</td>
                                        <td>{format(shipment.shipmentDate, 'MMMM Do, YYYY')}</td>
                                        <td>USD {formatNumber(shipment.shipmentValue)}</td>
                                        <td>{formatNumber(shipment.shipmentWeight)} kgs</td>

                                        <td>
                                            <Button pill theme="success" className="mb-2 mr-2" onClick={() => this.toggleModal(shipment)} >
                                                <i className="material-icons mr-1">open_in_new</i> View Shipment
                                            </Button>
                                        </td>
                                        {
                                            user.role === "Admin" ?
                                                <div>
                                                    <td>
                                                        <Button pill theme="info" className="mb-2 mr-2" onClick={() => this.toggleEditShipmentModal(shipment)} >
                                                            <i className="material-icons mr-1">delete</i> Edit Shipment
                                                     </Button>
                                                    </td>
                                                    <td>
                                                        <Button pill className="mb-2 mr-2" theme="danger" onClick={() => this.deleteShipment(shipment.shipmentID)} >
                                                            <i className="material-icons mr-1">delete</i> Delete
                                                     </Button>
                                                    </td>
                                                </div>
                                                : ""
                                        }
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table> :
                        <div className="mb-3 text-center">
                            <img
                                src={require("./../../images/coj/box.png")}
                                width="110"
                            />
                            <span className="text-muted d-block mt-2">No shipment has been added.</span>
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

export default injectIntl(connect(mapStateToProps)(ShipmentsTable));