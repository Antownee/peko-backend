import React from "react";
import { Container, Col, Row } from "shards-react";
import "react-tabs/style/react-tabs.css";
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';
import Modal from 'react-bootstrap/modal';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import { orderService } from "../../redux/services/order.service";



class EditOrderModal extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        let { modalOpen, toggleEditOrderModal, order } = this.props;
        return (
            <Container fluid className="main-content-container px-4">
                <ToastContainer />
                <Modal size="lg" show={modalOpen} onHide={toggleEditOrderModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Order</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                            initialValues={{
                                orderID: order.orderRequestID,
                                orderValue: 0,
                            }}
                            validationSchema={Yup.object().shape({
                                orderID: Yup.string().required('Cannot be empty'),
                                orderValue: Yup.number().required('Cannot be empty')
                            })}
                            onSubmit={({ orderID, orderValue }, { setStatus, setSubmitting, resetForm }) => {
                                setStatus();

                            }}
                            render={({ errors, status, touched, isSubmitting }) => (
                                <Col>
                                    <Form>
                                        <Row>
                                            <Col md="6" className="form-group">
                                                <label htmlFor="orderID">Order ID</label>
                                                <Field name="orderID" type="text" className={'form-control' + (errors.orderID && touched.orderID ? ' is-invalid' : '')} />
                                                <ErrorMessage name="orderID" component="div" className="invalid-feedback" />
                                            </Col>
                                            <Col md="6" className="form-group">
                                                <label htmlFor="orderValue">Order Value (USD)</label>
                                                <Field name="orderValue" type="number" className={'form-control' + (errors.orderValue && touched.orderValue ? ' is-invalid' : '')} />
                                                <ErrorMessage name="orderValue" component="div" className="invalid-feedback" />
                                            </Col>
                                        </Row>
                                        <div className="form-group">
                                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Save</button>
                                            {isSubmitting &&
                                                <img alt="" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                                            }
                                        </div>
                                    </Form>
                                </Col>
                            )}
                        />
                    </Modal.Body>

                </Modal>
            </Container>
        )

    }
}
export default injectIntl(EditOrderModal);
