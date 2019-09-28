import React from "react";
import { connect } from 'react-redux';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Badge,
  Button,
  Form
} from "shards-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PageTitle from "../../components/common/PageTitle";
import OrderInputDetails from "./OrderInputDetails";
import { orderService } from '../../redux/services/order.service';
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';


class UserPlaceOrder extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      amount: '',
      description: '',
      teaID: '',
      userID: '',
      selectedTeaItem: {},
      submitted: false,
      teaList: [],
    }
  }

  componentDidMount() {
    orderService.getTeaAssets()
      .then((res) => {
        this.setState({ teaList: res });
      })
      .catch((e) => {

      })
  }

  teaListItemClickable(index) {
    const teaID = this.state.teaList[index].teaID;
    this.setState({
      teaID: teaID,
      selectedTeaItem: this.state.teaList[index]
    })
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit(e) {
    e.preventDefault();

    this.setState({ submitted: true, selectedTeaItem: {} });
    const { amount, description, teaID } = this.state;
    const { user } = this.props;
    const order = {
      amount,
      description,
      teaID,
      userID: user.userID
    }
    if (amount && description && teaID) {
      orderService.addOrder(order, user)
        .then(
          msg => {
            toast.success(msg);
            this.clearState();
          },
          error => {
            toast.error(error);
          }
        );
    } else {
      toast.error("Fill in all required fields before placing the order")
    }
  }

  clearState() {
    this.setState({
      amount: '',
      description: '',
      teaID: '',
    })
  }

  render() {
    const { amount, description } = this.state;
    const { intl } = this.props;
    const messages = defineMessages({
      header: { id: "placeorder.title" },
    })

    return (
      <Container fluid className="main-content-container px-4">
        <ToastContainer />
        <Form name="form" onSubmit={this.handleSubmit}>
          <Row noGutters className="page-header py-4">
            <PageTitle title={intl.formatMessage(messages.header)} md="12" className="ml-sm-auto mr-sm-auto" />
          </Row>


          <Row>
            <Col lg="12">
              <span style={{ fontSize: "16px" }} className="d-block mb-2 text-muted">
                <strong><FormattedMessage id="placeorder.title2" /></strong>
              </span>
            </Col>
          </Row>
          <Row>
            {this.state.teaList.map((tea, idx) => (
              <Col lg="2" md="4" sm="6" className="mb-2" key={idx}>
                <a style={{ cursor: 'pointer' }} onClick={this.teaListItemClickable.bind(this, idx)}>
                  <Card small className="card-post card-post--1">
                    <div
                      className="card-post__image"
                      style={{ backgroundImage: `url(${require("../../images/coj/tea.jpg")})` }}
                    >
                      {
                        this.state.selectedTeaItem.teaID === tea.teaID ?
                          <Badge pill className={`card-post__category bg-warning`}>SELECTED</Badge> : ""
                      }
                    </div>
                    <CardBody>
                      <h5 className="card-title">
                        <a href="#" className="text-fiord-blue">
                          {tea.teaName}
                        </a>
                      </h5>
                      <p className="card-text d-inline-block mb-3">{tea.teaDescription}</p>
                      {/* <span className="text-muted">{tea.teaID}</span> */}
                    </CardBody>
                  </Card>
                </a>
              </Col>
            ))}
          </Row>

          <Row>
            <Col lg="12">
              <OrderInputDetails
                handleChange={this.handleChange}
                amount={amount}
                description={description} />
            </Col>
          </Row>
          <Button theme="accent" type="submit"><FormattedMessage id="placeorder.button-place-order"/></Button>
        </Form>
      </Container>
    )
  }

}

function mapStateToProps(state) {
  const { user } = state.authentication;
  return { user };
}


export default injectIntl(connect(mapStateToProps)(UserPlaceOrder))
