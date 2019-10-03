import React from 'react';
import { Container, Button } from "shards-react";
import { connect } from "react-redux";
import { apiUrl, fileUrl } from "../../config";
import { format } from 'date-fns';
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';

class ShipmentsTable extends React.Component {

    render() {
        const { intl, toggleModal } = this.props;
        return (
            <Container fluid className="main-content-container px-4">
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
                        <tr>
                            <td>THGD-675-HJJ</td>
                            <td>20/08/1019</td>
                            <td>USD 30,000</td>
                            <td>
                                <Button size="sm" theme="success" className="mb-2 mr-1" onClick={toggleModal}>View Shipment</Button>
                            </td>
                        </tr>
                        <tr>
                            <td>THGD-536-KFT</td>
                            <td>28/08/2019</td>
                            <td>USD 70,000</td>
                            <td>
                                <Button size="sm" theme="success" className="mb-2 mr-1" onClick={toggleModal}>View Shipment</Button>
                            </td>
                        </tr>
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