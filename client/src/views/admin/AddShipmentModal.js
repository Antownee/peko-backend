import React from "react";
import {
    Container,
    Col,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from "shards-react";
import { connect } from "react-redux";
import "react-tabs/style/react-tabs.css";
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import { orderService } from "../../redux/services/order.service";



class AddShipmentModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }


    render() {
        let { user, intl, modalOpen, toggleAddShipmentModal, order, addShipmentToState } = this.props;
        return (
            <Container fluid className="main-content-container px-4">
                <ToastContainer />
                <Modal size="lg" open={modalOpen} toggle={toggleAddShipmentModal}>
                    <ModalHeader>Add Shipment</ModalHeader>
                    <ModalBody>
                        <Formik
                            initialValues={{
                                shipmentID: '',
                                shipmentValue: 0
                            }}
                            validationSchema={Yup.object().shape({
                                shipmentID: Yup.string().required('Cannot be empty'),
                                shipmentValue: Yup.string().required('Cannot be empty'),
                            })}
                            onSubmit={({ shipmentID, shipmentValue }, { setStatus, setSubmitting, resetForm }) => {
                                setStatus();
                                orderService.addShipment({ shipmentID, shipmentValue, orderID: order.orderRequestID })
                                    .then((res) => {
                                        resetForm();
                                        setSubmitting(false);
                                        toast.success(res.message);
                                        addShipmentToState(res.shipment)
                                        toggleAddShipmentModal();
                                    })
                                    .catch((e) => {
                                        setSubmitting(false);
                                        setStatus(e);
                                        toast.error("Try again later");
                                    })
                            }}
                            render={({ errors, status, touched, isSubmitting }) => (
                                <Col>
                                    <Form>
                                        <Col className="form-group">
                                            <label htmlFor="shipmentID">Shipment ID</label>
                                            <Field name="shipmentID" type="text" className={'form-control' + (errors.shipmentID && touched.shipmentID ? ' is-invalid' : '')} />
                                            <ErrorMessage name="shipmentID" component="div" className="invalid-feedback" />
                                        </Col>
                                        <Col className="form-group">
                                            <label htmlFor="shipmentValue">Value Of Shipment</label>
                                            <Field name="shipmentValue" type="number" className={'form-control' + (errors.shipmentValue && touched.shipmentValue ? ' is-invalid' : '')} />
                                            <ErrorMessage name="shipmentValue" component="div" className="invalid-feedback" />
                                        </Col>
                                        <div className="form-group">
                                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Add</button>
                                            {isSubmitting &&
                                                <img alt="" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                                            }
                                        </div>
                                    </Form>
                                </Col>
                            )}
                        />
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

export default injectIntl(connect(mapStateToProps)(AddShipmentModal));
