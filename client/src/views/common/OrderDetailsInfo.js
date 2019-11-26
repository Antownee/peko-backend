import React from "react";
import {
  Card,
  CardHeader,
  Button,
  ListGroup,
  ListGroupItem,
  Progress
} from "shards-react";
import { format } from 'date-fns';
import AddShipmentmodal from '../admin/AddShipmentModal';
import EditorderModal from '../admin/EditOrderModal';
import { formatNumber } from "../../utils/numberFormatter";
import { orderService } from "../../redux/services/order.service";
import { ToastContainer, toast } from 'react-toastify';
import { injectIntl, defineMessages } from 'react-intl';


class OrderDetailsInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      addShipmentModalOpen: false,
      orderEditModalOpen: false,
    }

    this.deleteOrder = this.deleteOrder.bind(this);
    this.toggleAddShipmentModal = this.toggleAddShipmentModal.bind(this);
    this.toggleEditOrderModal = this.toggleEditOrderModal.bind(this);
    this.getTotalOrderWeight = this.getTotalOrderWeight.bind(this);
  }

  toggleAddShipmentModal() {
    this.setState({
      addShipmentModalOpen: !this.state.addShipmentModalOpen,
    });
  }

  toggleEditOrderModal() {
    this.setState({
      orderEditModalOpen: !this.state.orderEditModalOpen,
    });
  }

  deleteOrder() {
    let { orderRequestID } = this.props.order;
    orderService.deleteOrder(orderRequestID)
      .then((res) => {
        toast.success(res.msg);
        return this.props.handleSearchState(false);//go back
      })
      .catch((e) => {
        toast.error(e.message);
      })
  }

  getTotalOrderWeight(order) {
    return order.teaOrders
      .map(item => item.weight)
      .reduce((prev, curr) => formatNumber( parseInt(prev) + parseInt(curr)), 0)
    }


  render() {
    let { order, user, addShipmentToState, updatePaymentProgress, paymentProgress, orderValue, intl } = this.props;
    let { addShipmentModalOpen, orderEditModalOpen } = this.state;
    const messages = defineMessages({
      add_shipment: { id: "userorderdetails.add_shipment" },
      edit_order: { id: "userorderdetails.edit_order" },
      delete_order: { id: "userorderdetails.delete_order" },
      payment_progress: { id: "userorderdetails.payment_progress" },
      particulars: { id: "userorderdetails.particulars" }
  })

    return (
      <div>
        <ToastContainer />

        <EditorderModal
          modalOpen={orderEditModalOpen}
          toggleEditOrderModal={this.toggleEditOrderModal}
          order={order}
          updatePaymentProgress={updatePaymentProgress}
        />

        <AddShipmentmodal
          modalOpen={addShipmentModalOpen}
          toggleAddShipmentModal={this.toggleAddShipmentModal}
          order={order}
          addShipmentToState={addShipmentToState}
        />



        <Card small className="mb-4 pt-3">
          <CardHeader className="border-bottom text-center">
            <h4 className="mb-0">{order.orderRequestID}</h4>
            <span className="text-muted d-block mb-1">{format(order.requestDate, 'MMMM Do, YYYY')}</span>
            <span className="text-muted d-block mb-1">
              {Object.keys(order).length > 0 ? `${this.getTotalOrderWeight(order)} kgs - ${formatNumber(order.orderValue || orderValue)} USD` : "0 kgs - 0 USD"}
            </span>
            {
              user.role === "Admin" ?
                <div>
                  <Button pill theme="primary" className="mb-2 mr-2" onClick={this.toggleAddShipmentModal}>
                    <i className="material-icons mr-1">note_add</i> {intl.formatMessage(messages.add_shipment)}
                </Button>
                  <Button pill theme="info" className="mb-2 mr-2" onClick={this.toggleEditOrderModal} >
                    <i className="material-icons mr-1">insert_drive_file</i> {intl.formatMessage(messages.edit_order)}
                </Button>
                  <Button pill theme="danger" className="mb-2" theme="danger" onClick={this.deleteOrder}>
                    <i className="material-icons mr-1">delete</i> {intl.formatMessage(messages.delete_order)}
          </Button>
                </div>

                : ""
            }

          </CardHeader>
          <ListGroup flush>
            <ListGroupItem className="px-4">
              <div className="progress-wrapper">
                <strong className="text-muted d-block mb-2">
                {intl.formatMessage(messages.payment_progress)}
               </strong>
                <Progress
                  className="progress-sm"
                  value={paymentProgress}
                >
                  <span className="progress-value">
                    {paymentProgress} %
            </span>
                </Progress>
              </div>
            </ListGroupItem>
            <ListGroupItem className="p-4">
              <strong className="text-muted d-block mb-2">
                <span>
                {intl.formatMessage(messages.particulars)}

                </span>
              </strong>
              <div>
                {
                  Object.keys(order).length > 0 ?
                    order.teaOrders.map((teaOrder, idx) => (
                      <ul className="mb-2" key={idx}>
                        <li >
                          <strong> {teaOrder.teaName} - {`${teaOrder.weight} kgs`}</strong>
                        </li>
                      </ul>
                    )) : ""
                }
              </div>
            </ListGroupItem>
          </ListGroup>
        </Card>
      </div >

    )
  }
}



export default injectIntl(OrderDetailsInfo);
