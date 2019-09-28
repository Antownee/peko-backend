import React from "react";
import { format } from 'date-fns';
import {
  Card,
  CardHeader,
  CardBody,
  Col
} from "shards-react";
import { FormattedMessage } from 'react-intl';


const DashboardOrderTable = ({ recentOrders }) => (
    <Card small className="mb-4">
      <CardHeader className="border-bottom">
        <h6 className="m-0"><FormattedMessage id="dashboard.lastfiveorders"/></h6>
      </CardHeader>
      <CardBody className="p-0 pb-3">
        <table className="table mb-0">
          <thead className="bg-light">
            <tr>
              <th scope="col" className="border-0"></th>
              <th scope="col" className="border-0"><FormattedMessage id="dashboard.last5orders-orderid"/></th>
              <th scope="col" className="border-0"><FormattedMessage id="dashboard.last5orders-date" /></th>
              <th scope="col" className="border-0"><FormattedMessage id="dashboard.last5orders-amount" /></th>
            </tr>
          </thead>
          <tbody>
            {
              recentOrders.map((ord, idx) =>
                (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{ord.orderRequestID}</td>
                    <td>{format(ord.requestDate, 'MMMM Do, YYYY')}</td>
                    <td>{ord.amount.toLocaleString()}</td>
                  </tr>
                )
              )
            }
          </tbody>
        </table>
      </CardBody>
    </Card>
);


export default DashboardOrderTable;
