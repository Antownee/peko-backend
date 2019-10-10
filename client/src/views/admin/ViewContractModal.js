import React from "react";
import { Container, Row, Col, Card, CardHeader, CardBody, Button, ButtonGroup, ButtonToolbar, Modal, ModalHeader, ModalBody, ModalFooter } from "shards-react";
import { connect } from "react-redux";
import "react-tabs/style/react-tabs.css";
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';


class ViewContractModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }


    render() {
        const { user, intl, modalOpen, toggleModal } = this.props;
        return (
            <Container fluid className="main-content-container px-4">
                <Modal size="lg" open={modalOpen} toggle={toggleModal}>
                    <ModalHeader>View Contract</ModalHeader>
                    <ModalBody>

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

export default injectIntl(connect(mapStateToProps)(ViewContractModal));
