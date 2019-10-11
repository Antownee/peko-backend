import React from "react";
import FileUpload from "./FileUpload";
import { connect } from "react-redux";
import { format } from 'date-fns';
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';
import { Col, Row, FormInput } from "shards-react";

class SentDocumentsTable extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { displayDocuments, intl, currentShipment, updateShipmentDocuments } = this.props;

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
        < Row >
            {
                displayDocuments ?
                    displayDocuments.map((document, idx) => (
                        <Col md="6" key={idx}>
                            <div className="blog-comments__item p-3">
                                <div className="blog-comments__content">
                                    <div className="blog-comments__meta text-mutes">
                                        <a className="text-secondary" >
                                            {intl.formatMessage(messages[document.documentCode])}
                                        </a>{" "}
                                        <div>
                                            {
                                                document.submitted ?
                                                    <span className="badge badge-success mr-2"><FormattedMessage id="userorderdetails.label-submitted" /></span> :
                                                    <span className="badge badge-danger mr-2"><FormattedMessage id="userorderdetails.label-not-submitted" /></span>
                                            }
                                            <span>{(document.dateAdded) ? format(document.dateAdded, 'DD/MM/YYYY') : ""}</span>
                                            <div className="mt-2">
                                                <FileUpload
                                                    document={document}
                                                    currentShipment={this.props.currentShipment}
                                                    updateShipmentDocuments={updateShipmentDocuments}
                                                    user={this.props.user} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    )) :
                    <h6 className="card-title">
                        <a className="text-fiord-blue" href="#">
                            You cannot view any documents yet because the order is yet to be confirmed by Cup Of Joe.
                                 </a>
                    </h6>
            }
        </Row >
        )
    }
}

const mapStateToProps = state => {
    const { user } = state.authentication;
    return { user };
}

export default injectIntl(connect(mapStateToProps)(SentDocumentsTable));