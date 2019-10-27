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
  Form,
  FormInput
} from "shards-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PageTitle from "../../components/common/PageTitle";
import { orderService } from '../../redux/services/order.service';
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';


class UserPlaceOrder extends React.Component {
  constructor(props) {
    super(props);

    this.handleAmountFieldChange = this.handleAmountFieldChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOrderRequestIDInput = this.handleOrderRequestIDInput.bind(this);
    this.addteaToState = this.addteaToState.bind(this);
    this.updateteaToState = this.updateteaToState.bind(this);


    this.state = {
      userID: '',
      selectedTeaItems: [],
      submitted: false,
      teaList: [],
      orderRequestID: ''
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

  addteaToState(tea) {
    this.setState(state => {
      let list = state.selectedTeaItems.concat(tea);
      return { selectedTeaItems: list };
    });
  }

  updateteaToState(tea) {
    this.setState(state => {
      let list = state.selectedTeaItems.map((el) => {
        if (el.teaName === tea.teaName) { return tea; } else { return el }
      });
      return { selectedTeaItems: list };
    });

  }

  handleAmountFieldChange(e) {
    let { selectedTeaItems } = this.state;
    let { name, value } = e.target;
    let tea = { teaName: name, weight: value };

    let g = selectedTeaItems.find((el) => el.teaName === name);
    return g === undefined ? this.addteaToState(tea) : this.updateteaToState(tea);
  }

  handleOrderRequestIDInput(e) {
    const { name, value } = e.target;
    this.setState({ orderRequestID: value });
  }

  handleSubmit(e) {
    e.preventDefault();

    this.setState({ submitted: true });

    const {  selectedTeaItems, orderRequestID } = this.state;
    const { userID } = this.props.user;

    if (selectedTeaItems.length > 0 && orderRequestID) {
      orderService.addOrder(orderRequestID, userID, selectedTeaItems)
        .then(
          msg => {
            toast.success(msg.message);
            this.clearState();
            window.location.reload(false);
          },
          error => {
            toast.error(error);
          }
        );
    } else {
      toast.error("Fill in all required fields before placing the order.");
    }
  }

  clearState() {
    let teas = Object.assign({}, this.state.selectedTeaItems);
    teas = [];
    this.setState({
      orderRequestID: '',
      selectedTeaItems: teas
    })
  }

  render() {
    const { orderRequestID, selectedTeaItems } = this.state;
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
              <FormInput placeholder="ENTER REFERENCE NUMBER" type="text" className="mb-2" value={orderRequestID} onChange={this.handleOrderRequestIDInput} name="orderRequestID" />
            </Col>
          </Row>
          <Row>
            {this.state.teaList.map((tea, idx) => (
              <Col lg="2" md="4" sm="7" className="mb-2" key={idx} >
                <a style={{ cursor: 'pointer' }} >
                  <Card small className="card-post card-post--1" outline="success">
                    <div
                      className="card-post__image"
                      style={{ backgroundImage: `url(${require("../../images/coj/tea.jpg")})` }}
                    >
                    </div>
                    <CardBody>
                      <h5 className="card-title">
                        <a href="#" className="text-fiord-blue">
                          {tea.teaName}
                        </a>
                      </h5>
                      <FormInput placeholder="Enter weight (kilograms)" type="Number" className="mb-2" onChange={this.handleAmountFieldChange} name={tea.teaName} />
                    </CardBody>
                  </Card>
                </a>
              </Col>
            ))}
          </Row>

          <Row>
            <Col lg="12">
            </Col>
          </Row>
          <Button theme="accent" type="submit"><FormattedMessage id="placeorder.button-place-order" /></Button>
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
