import React from "react";
import { Container } from "shards-react";
import FileUpload from "./FileUpload";
import { connect } from "react-redux";
import { format } from 'date-fns';
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';

class PaymentsTable extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { displayDocuments, intl } = this.props;

        return (
            <Container fluid className="main-content-container px-4">
                <table className="table mb-0">
                <thead className="bg-light">
                    <tr>
                        <th scope="col" className="border-0">
                            SWIFT Document
                                            </th>
                        <th scope="col" className="border-0">
                            Date
                                            </th>
                    </tr>
                </thead>
                <tbody>
                <tr>
                  <td>SWFT-788-HJYU-67</td>
                  <td>12/6/2019</td>
                </tr>
                <tr>
                  <td>SWFT-9768-HKHG-67</td>
                  <td>14/6/2019</td>
                </tr>
                <tr>
                  <td>SWFT-7453-HJYU-67</td>
                  <td>18/6/2019</td>
                </tr>
                <tr>
                  <td>SWFT-788-HJYU-67</td>
                  <td>20/6/2019</td>
                </tr>
                </tbody>
            </table>
            </Container>
        )
    }
}

const mapStateToProps = state => {
    const { user } = state.authentication;
    return { user };
}

export default injectIntl(connect(mapStateToProps)(PaymentsTable));