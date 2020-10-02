import React from "react";
import { Container, Col, Row } from "shards-react";
import Modal from 'react-bootstrap/modal';
import { Button } from "shards-react";
import "react-tabs/style/react-tabs.css";
import { injectIntl } from 'react-intl';
import { ToastContainer, toast } from 'react-toastify';
import { orderService } from "../../redux/services/order.service";



class AskDeleteModal extends React.Component {
    constructor(props) {
        super(props);

        this.deleteOrder = this.deleteOrder.bind(this);
    }



    deleteOrder() {
        let { order, handleSearchState } = this.props;
        orderService.deleteOrder(order.orderRequestID)
            .then((res) => {
                toast.success(res.msg);
                //Add a small delay here
                // return this.props.handleSearchState(false);//go back
                return handleSearchState(false);
            })
            .catch((e) => {
                toast.error(e.message);
            })
    }

    render() {
        let { user, message, modalOpen, toggleAskDeleteModal } = this.props;
        return (
            <Container fluid className="main-content-container px-4">
                <ToastContainer />
                <Modal size="lg" show={modalOpen} onHide={toggleAskDeleteModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Order?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <strong className="text-muted d-block mb-2">
                                {message}
                            </strong>
                        </Row>
                        <Row>
                            <Button pill theme="info" className="mb-2 mr-2" onClick={toggleAskDeleteModal} >
                                <i className="material-icons mr-1">insert_drive_file</i> Cancel
                            </Button>
                            <Button pill theme="danger" className="mb-2" theme="danger" onClick={this.deleteOrder}>
                                <i className="material-icons mr-1">delete</i> Yes
                            </Button>
                        </Row>
                    </Modal.Body>
                </Modal>
            </Container>
        )
    }
}
export default injectIntl(AskDeleteModal);
