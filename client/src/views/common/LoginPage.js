import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Alert } from "shards-react";
import { connect } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import { userActions } from '../../redux/actions';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

class LoginPage extends React.Component {
    constructor(props) {
        super(props);

        // reset login status
        this.props.dispatch(userActions.logout());

        this.state = {
            submitted: false
        };
    }

    render() {
        const { dispatch } = this.props;
        return (
            <div>
                <ToastContainer/>

                <div className="row d-flex justify-content-center pt-5">
                    <div className="col-md-3">
                        <Formik
                            initialValues={{
                                username: '',
                                password: ''
                            }}
                            validationSchema={Yup.object().shape({
                                username: Yup.string().required('Cannot be empty'),
                                password: Yup.string().required('Cannot be empty'),
                            })}
                            onSubmit={({ username, password }, { setSubmitting, setErrors }) => {
                                this.setState({ submitted: true });
                                if (username && password) {
                                    setSubmitting(false);
                                    dispatch(userActions.login(username, password))
                                }
                            }}
                            render={({ errors, status, touched, isSubmitting }) => (
                                <Col>
                                    <h2>Login</h2>
                                    <Form>
                                        <div className="form-group">
                                            <label htmlFor="username">Username</label>
                                            <Field name="username" type="text" className={'form-control' + (errors.username && touched.username ? ' is-invalid' : '')} />
                                            <ErrorMessage name="username" component="div" className="invalid-feedback" />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="password">Password</label>
                                            <Field name="password" type="text" className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
                                            <ErrorMessage name="password" component="div" className="invalid-feedback" />
                                        </div>
                                        <div className="form-group">
                                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Login</button>
                                            {isSubmitting &&
                                                <img alr="" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                                            }
                                            {/* <Link to="/register" className="btn btn-link">Register</Link> */}
                                        </div>
                                    </Form>
                                </Col>
                            )}
                        />
                    </div>
                </div>
            </div>

        );
    }
}


export default connect()(LoginPage);
