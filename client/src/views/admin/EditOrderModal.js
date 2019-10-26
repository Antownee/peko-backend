import React from "react";
import { Container, Col, Row, ListGroup, ListGroupItem, FormInput } from "shards-react";
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
        this.state = {
            orderValue: 0,
            teaOrders: []
        }
        this.onTeaOrderWeightChange = this.onTeaOrderWeightChange.bind(this);
    }
    onTeaOrderWeightChange(e) {
        const { name, value } = e.target;
        let { teaOrders } = this.props.order;
        let newTeaOrders = teaOrders.map(to =>
            to.teaName === name ? { ...to, weight: value } : to
        );

        this.setState({ teaOrders: newTeaOrders });
    }

    render() {
        let { modalOpen, toggleEditOrderModal, order, updatePaymentProgress } = this.props;
        let { teaOrders } = this.state;
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
                                orderValue: this.state.orderValue || order.orderValue,
                            }}
                            validationSchema={Yup.object().shape({
                                orderValue: Yup.number().required('Cannot be empty')
                            })}
                            onSubmit={({ orderValue }, { setStatus, setSubmitting, resetForm }) => {
                                setStatus();
                                //Post to server. Update Order
                                if (teaOrders.length === 0) { setSubmitting(false); return toast.error("Kindly enter the weight of the tea") }
                                orderService.updateOrder({ orderID: order.orderRequestID, orderValue, teaOrders })
                                    .then((res) => {
                                        resetForm();
                                        setSubmitting(false);
                                        toast.success(res.msg);
                                        this.setState({ orderValue })
                                        updatePaymentProgress(res.order)
                                        toggleEditOrderModal();
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
                                            {/* <Col md="6" className="form-group">
                                                <label htmlFor="orderID">Order ID</label>
                                                <Field name="orderID" type="text" className={'form-control' + (errors.orderID && touched.orderID ? ' is-invalid' : '')} />
                                                <ErrorMessage name="orderID" component="div" className="invalid-feedback" />
                                            </Col> */}
                                            <Col md="6" className="form-group">
                                                <label htmlFor="orderValue">Order Value (USD)</label>
                                                <Field name="orderValue" type="number" className={'form-control' + (errors.orderValue && touched.orderValue ? ' is-invalid' : '')} />
                                                <ErrorMessage name="orderValue" component="div" className="invalid-feedback" />
                                            </Col>
                                            <Col md="6" className="form-group">
                                                <ListGroup flush className="list-group">
                                                    <label htmlFor="orderValue">List of Tea Orders</label>
                                                    {order.teaOrders.map((item, idx) => (
                                                        <ListGroupItem key={idx} className="d-flex px-3">
                                                            <Col md="6" className="form-group">
                                                                <span className="text-semibold text-fiord-blue">{item.teaName}</span>
                                                            </Col>
                                                            <Col md="6" className="form-group">
                                                                <FormInput type="number" placeholder={item.weight} name={item.teaName} className="mb-2" onChange={this.onTeaOrderWeightChange} />
                                                            </Col>
                                                        </ListGroupItem>
                                                    ))}
                                                </ListGroup>
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
