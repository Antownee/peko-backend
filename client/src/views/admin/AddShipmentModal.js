import React from "react";
import {
    Container,
    Col,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter, FormInput, Row, CardBody
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
    }


    render() {
        let { user, intl, modalOpen, toggleAddShipmentModal, order, addShipmentToState } = this.props;
        return (
            <Container fluid className="main-content-container px-4">
                <ToastContainer />
                <Modal size="lg" open={modalOpen} toggle={toggleAddShipmentModal}>
                    <ModalHeader>Edit Order</ModalHeader>
                    <ModalBody>
                        <span>Create a shipment</span>

                        <Row>
                            <Formik
                                initialValues={{
                                    shipmentID: '',
                                    shipmentValue: 0,
                                    shipmentWeight: 0
                                }}
                                validationSchema={Yup.object().shape({
                                    shipmentID: Yup.string().required('Cannot be empty'),
                                    shipmentValue: Yup.number().required('Cannot be empty'),
                                    shipmentWeight: Yup.number().required('Cannot be empty'),
                                })}
                                onSubmit={({ shipmentID, shipmentValue, shipmentWeight }, { setStatus, setSubmitting, resetForm }) => {
                                    setStatus();
                                    orderService.addShipment({ shipmentID, shipmentValue, orderID: order.orderRequestID, shipmentWeight })
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
                                            <Row>
                                                <Col md="6" className="form-group">
                                                    <label htmlFor="shipmentID">Enter the Shipment ID</label>
                                                    <Field name="shipmentID" type="text" className={'form-control' + (errors.shipmentID && touched.shipmentID ? ' is-invalid' : '')} />
                                                    <ErrorMessage name="shipmentID" component="div" className="invalid-feedback" />
                                                </Col>
                                                <Col md="6" className="form-group">
                                                    <label htmlFor="shipmentValue">Shipment Value (USD)</label>
                                                    <Field name="shipmentValue" type="number" className={'form-control' + (errors.shipmentValue && touched.shipmentValue ? ' is-invalid' : '')} />
                                                    <ErrorMessage name="shipmentValue" component="div" className="invalid-feedback" />
                                                </Col>
                                                <Col md="6" className="form-group">
                                                    <label htmlFor="shipmentWeight">Shipment Weight (Kgs)</label>
                                                    <Field name="shipmentWeight" type="number" className={'form-control' + (errors.shipmentWeight && touched.shipmentWeight ? ' is-invalid' : '')} />
                                                    <ErrorMessage name="shipmentWeight" component="div" className="invalid-feedback" />
                                                </Col>
                                            </Row>
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
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                    </ModalFooter>
                </Modal>
            </Container>
        )

    }
}
export default injectIntl(AddShipmentModal);
