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


const OrderDetailsInfo = ({ order }) => (
  <Card small className="mb-4 pt-3">
    <CardHeader className="border-bottom text-center">
      <h4 className="mb-0">{order.orderRequestID}</h4>
      <span className="text-muted d-block mb-2">{format(order.requestDate, 'MMMM Do, YYYY')}</span>
      <Button pill outline size="sm" className="mb-2 mr-2">
        <i className="material-icons mr-1">person_add</i> Add shipment
      </Button>
      <Button pill outline size="sm" className="mb-2">
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
              {74}%
            </span>
          </Progress>
        </div>
      </ListGroupItem>
      <ListGroupItem className="p-4">
        <strong className="text-muted d-block mb-2">
          Description
        </strong>
        <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio eaque, quidem, commodi soluta qui quae minima obcaecati quod dolorum sint alias, possimus illum assumenda eligendi cumque?</span>
      </ListGroupItem>
    </ListGroup>
  </Card>
);

export default OrderDetailsInfo;
