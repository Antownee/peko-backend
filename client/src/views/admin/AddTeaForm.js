import React from "react";
import { Col } from "shards-react";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import { orderService } from "../../redux/services/order.service";


const AddTeaForm = () => (
  <div>
    <ToastContainer />
    <Formik
      initialValues={{
        teaName: '',
        teaDescription: ''
      }}
      validationSchema={Yup.object().shape({
        teaName: Yup.string().required('Cannot be empty'),
        teaDescription: Yup.string().required('Cannot be empty'),
      })}
      onSubmit={({ teaName, teaDescription }, { setStatus, setSubmitting, resetForm }) => {
        setStatus();
        orderService.addTeaAssets({teaName, teaDescription})
          .then((res) => {
            resetForm();
            setSubmitting(false);
            toast.success(res);
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
            <div className="form-group">
              <label htmlFor="teaName">Name</label>
              <Field name="teaName" type="text" className={'form-control' + (errors.teaName && touched.teaName ? ' is-invalid' : '')} />
              <ErrorMessage name="teaName" component="div" className="invalid-feedback" />
            </div>
            <div className="form-group">
              <label htmlFor="teaDescription">Description</label>
              <Field name="teaDescription" type="text" className={'form-control' + (errors.teaDescription && touched.teaDescription ? ' is-invalid' : '')} />
              <ErrorMessage name="teaDescription" component="div" className="invalid-feedback" />
            </div>
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

  </div>

);

export default AddTeaForm;
