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
import ViewContractModal from '../admin/ViewContractModal';


class OrderDetailsInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      addShipmentModalOpen: false,
      contractModalOpen: false
    }

    this.toggleAddShipmentModal = this.toggleAddShipmentModal.bind(this);
    this.toggleContractModal = this.toggleContractModal.bind(this);
  }

  toggleAddShipmentModal() {
    this.setState({
      addShipmentModalOpen: !this.state.addShipmentModalOpen,
    });
  }

  toggleContractModal() {
    this.setState({
      contractModalOpen: !this.state.contractModalOpen,
    });
  }


  render() {
    let { order, user, addShipmentToState } = this.props;
    let { addShipmentModalOpen, contractModalOpen } = this.state;

    return (
      <div>
        {
          user.role === "Admin" ?
            <AddShipmentmodal
              modalOpen={addShipmentModalOpen}
              toggleAddShipmentModal={this.toggleAddShipmentModal}
              order={order}
              addShipmentToState={addShipmentToState}
            /> : ""
        }

        <ViewContractModal
          modalOpen={contractModalOpen}
          toggleModal={this.toggleContractModal}
        />


        <Card small className="mb-4 pt-3">
          <CardHeader className="border-bottom text-center">
            <h4 className="mb-0">{order.orderRequestID}</h4>
            <span className="text-muted d-block mb-2">{format(order.requestDate, 'MMMM Do, YYYY')}</span>
            {
              user.role === "Admin" ?
                <Button pill outline size="sm" className="mb-2 mr-2" onClick={this.toggleAddShipmentModal}>
                  <i className="material-icons mr-1">person_add</i> Add shipment
                </Button> : ""
            }
            <Button pill outline size="sm" className="mb-2" onClick={this.toggleContractModal}>
              <i className="material-icons mr-1">person_add</i> View contract
          </Button>
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
                    {300000} USD
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
                      <ul>
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
