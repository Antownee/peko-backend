import React from "react";
import FileUpload from "./FileUpload";
import { connect } from "react-redux";
import { format } from 'date-fns';
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';

class SentDocumentsTable extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { displayDocuments, intl, currentShipment } = this.props;

        const messages = defineMessages({
            CNSGN: { id: "userorderdetails.consignee-details" },
            FWRDAGNT: { id: "userorderdetails.forward-agent-details" },
            DESTPRT: { id: "userorderdetails.destination-port" },
            SHPINSTR: { id: "userorderdetails.shipment-instructions" },
            SWFTCOP: { id: "userorderdetails.swift-copies" },
            PFINV: { id: "userorderdetails.proforma-invoice" },
            CMINV: { id: "userorderdetails.commercial-invoice" },
            ORCNF: { id: "userorderdetails.order-confirmation" },
            CRTORG: { id: "userorderdetails.certificate-origin" },
            EXPENT: { id: "userorderdetails.export-entry" },
            CRTINS: { id: "userorderdetails.certificate-of-inspection" },
            PCKLST: { id: "userorderdetails.packing-list" },
            ALSYSCRT: { id: "userorderdetails.analysis-certificate" },
            BOL: { id: "userorderdetails.bill-of-lading" },
            CRTPHY: { id: "userorderdetails.phytosanitary-certificate" }
        })

        return (
            <table className="table mb-0">
                <thead className="bg-light">
                    <tr>
                        <th scope="col" className="border-0">
                            Name
                                            </th>
                        <th scope="col" className="border-0">
                            Link
                                            </th>
                        <th scope="col" className="border-0">
                            Date
                                            </th>
                        <th scope="col" className="border-0">
                            Upload document
                                            </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        displayDocuments ?
                            displayDocuments.map((document, idx) => (
                                <tr key={idx}>
                                    <td>{intl.formatMessage(messages[document.documentCode])}</td>
                                    <td>
                                        {
                                            document.submitted ?
                                                <span className="badge badge-success"><FormattedMessage id="userorderdetails.label-submitted" /></span> :
                                                <span className="badge badge-danger"><FormattedMessage id="userorderdetails.label-not-submitted" /></span>
                                        }
                                    </td>
                                    <td>{(document.dateAdded) ? format(document.dateAdded, 'DD/MM/YYYY') : "N/A"}</td>
                                    <td>
                                        <FileUpload
                                            onSubmit={this.onSubmit}
                                            document={document}
                                            currentShipment={this.props.currentShipment} />
                                    </td>
                                </tr>
                            )) :
                            <h6 className="card-title">
                                <i className="material-icons">search</i>
                                <a className="text-fiord-blue" href="#">
                                    You cannot view any documents yet because the order is yet to be confirmed.
                                </a>
                            </h6>
                    }
                </tbody>
            </table>
        )

    }
}

const mapStateToProps = state => {
    const { user } = state.authentication;
    return { user };
}

export default injectIntl(connect(mapStateToProps)(SentDocumentsTable));