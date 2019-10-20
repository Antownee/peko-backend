import React from "react";
import { Card, CardHeader, CardBody } from "shards-react";
import Steps from 'rc-steps';
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';
const { Step } = Steps;

class OrderDetailsProgress extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPosition: 0
    }

  }

  componentDidMount() {
    let { order } = this.props;
    let status = order.orderStatus;
    if (status === "ORDER_INIT") return this.setState({ currentPosition: 0 })
    if (status === "ORDER_SHIPMENT_ADDED") return this.setState({ currentPosition: 1 })
    return this.setState({ currentPosition: 2 })

  }

  render() {
    const { intl } = this.props;
    const messages = defineMessages({
      header: { id: "userorderdetails.header" },
      progress1: { id: "userorderdetails.progress-1" },
      progress1_text: { id: "userorderdetails.progress-1-text" },
      progress2: { id: "userorderdetails.progress-2" },
      progress2_text: { id: "userorderdetails.progress-2-text" },
      progress3: { id: "userorderdetails.progress-3" },
      progress3_text: { id: "userorderdetails.progress-3-text" },
      progress4: { id: "userorderdetails.progress-4" },
      progress4_text: { id: "userorderdetails.progress-4-text" }
    })

    return (
      <Card small className="mb-4">
        <CardHeader className="border-bottom">
          <h6 className="m-0">Order Progress</h6>
        </CardHeader>
        <CardBody>
          <Steps current={this.state.currentPosition} style={{ marginTop: 10 }}>
            <Step title={intl.formatMessage(messages.progress1)} description={intl.formatMessage(messages.progress1_text)} />
            <Step title={intl.formatMessage(messages.progress2)} description={intl.formatMessage(messages.progress2_text)} />
            <Step title={intl.formatMessage(messages.progress4)} description={intl.formatMessage(messages.progress4_text)} />
          </Steps>
          <div className="mb-3 mx-auto text-center">
            <img
              src={require("./../../images/coj/ship.png")}
              width="110"
            />
          </div>
        </CardBody>
      </Card>
    )
  }
}

export default injectIntl(OrderDetailsProgress);
