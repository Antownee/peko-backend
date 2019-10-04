import React from 'react';
import { Container, Button } from "shards-react";
import { connect } from "react-redux";
import { apiUrl, fileUrl } from "../../config";
import { format } from 'date-fns';
import ShipmentModal from './ShipmentModal';

import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';

class ShipmentsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false,
            currentShipment: {}
        }
        this.toggleModal = this.toggleModal.bind(this);

    }

    componentDidMount() {
        //get all shipments with the documents here
    }

    toggleModal(msg) {
        this.setState({
            modalOpen: !this.state.modalOpen,
            currentShipment: {
                shipmentID: msg,
                shipmentValue: 30000
            }
        });
    }

    render() {
        const { intl, sentDocuments, receivedDocuments, shipments } = this.props;
        const { modalOpen, currentShipment } = this.state
        return (
            <Container fluid className="main-content-container px-4">
                <ShipmentModal
                    // order={currentOrder}
                    //user={user}
                    currentShipment={currentShipment}
                    modalOpen={modalOpen}
                    toggleModal={this.toggleModal}
                    sentDocuments={sentDocuments}
                    receivedDocuments={receivedDocuments}
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
                                <tr>
                                    <td>{shipment.shipmentID}</td>
                                    <td>{shipment.shipmentDate}</td>
                                    <td>USD {shipment.shipmentValue}</td>
                                    <td>
                                        <Button size="sm" theme="success" className="mb-2 mr-1" onClick={() => this.toggleModal(shipment.shipmentID)}>View Shipment</Button>
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