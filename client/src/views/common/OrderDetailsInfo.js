import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardHeader,
  Button,
  ListGroup,
  ListGroupItem,
  Progress
} from "shards-react";
import { format, parse } from 'date-fns';
import AddShipmentmodal from '../admin/AddShipmentModal';

import { orderService } from "../../redux/services/order.service";
import { ToastContainer, toast } from 'react-toastify';

class OrderDetailsInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      addShipmentModalOpen: false,
      orderEditModalOpen: false
    }

    this.deleteOrder = this.deleteOrder.bind(this);

    this.toggleAddShipmentModal = this.toggleAddShipmentModal.bind(this);
  }

  toggleAddShipmentModal() {
    this.setState({
      addShipmentModalOpen: !this.state.addShipmentModalOpen,
    });
  }

  deleteOrder() {
    orderService.deleteOrder(this.props.order)
      .then((res) => {
        toast.success(res.msg);
        return this.props.handleSearchState(false);//go back
      })
      .catch((e) => {
        toast.error(e.message);
      })
  }


  render() {
    let { order, user, addShipmentToState } = this.props;
    let { addShipmentModalOpen } = this.state;

    return (
      <div>
        <ToastContainer />

        <AddShipmentmodal
          modalOpen={addShipmentModalOpen}
          toggleAddShipmentModal={this.toggleAddShipmentModal}
          order={order}
          addShipmentToState={addShipmentToState}
        />

        <Card small className="mb-4 pt-3">
          <CardHeader className="border-bottom text-center">
            <h4 className="mb-0">{order.orderRequestID}</h4>
            <span className="text-muted d-block mb-2">{format(order.requestDate, 'MMMM Do, YYYY')}</span>
            {
              user.role === "Admin" ?
                <div>
                  <Button pill outline size="sm" className="mb-2 mr-2" onClick={this.toggleAddShipmentModal}>
                    <i className="material-icons mr-1">person_add</i> Add shipment
                </Button>
                  <Button pill outline size="sm" className="mb-2" theme="danger" onClick={this.deleteOrder}>
                    <i className="material-icons mr-1">delete</i> Delete Order
          </Button>
                </div>

                : ""
            }

          </CardHeader>
          <ListGroup flush>
            <ListGroupItem className="px-4">
              <div className="progress-wrapper">
                <strong className="text-muted d-block mb-2">
                  Payment Progress
               </strong>
                <Progress
                  className="progress-sm"
                  value={74}
                >
                  <span className="progress-value">
                    {order.orderValue} USD
            </span>
                </Progress>
              </div>
            </ListGroupItem>
            <ListGroupItem className="p-4">
              <strong className="text-muted d-block mb-2">
                Particulars
              </strong>
              <div>
                {
                  Object.keys(order).length > 0 ?
                    order.teaOrders.map((teaOrder, idx) => (
                      <ul key={idx}>
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



export default OrderDetailsInfo;
