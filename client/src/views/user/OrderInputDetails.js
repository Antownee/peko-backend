import React from "react";
import {
  Card,
  CardHeader,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  FormTextarea,
  FormInput
} from "shards-react";
import { FormattedMessage } from 'react-intl';


class OrderInputDetails extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { handleChange, amount, description } = this.props;

    return (
      <Card small className="mb-4">
        <CardHeader className="border-bottom">
          <h6 className="m-0"></h6>
        </CardHeader>
        <ListGroup flush>
          <ListGroupItem className="p-3">
            <Row>
              <Col>
                <Row form>
                  {/* Amount (Kilogrammes) */}
                  <Col md="12" className="form-group">
                    <label htmlFor="feAmount"><FormattedMessage id="placeorder.amount"/></label>
                    <FormInput
                      id="feAmount"
                      name="amount"
                      value={amount}
                      placeholder="Amount"
                      type="number"
                      onChange={handleChange}
                    />
                  </Col>
                </Row>

                <Row form>
                  {/* Notes */}
                  <Col md="12" className="form-group">
                    <label htmlFor="feNotes"><FormattedMessage id="placeorder.notes" /></label>
                    <FormTextarea id="feNotes" name="description" value={description} rows="5" onChange={handleChange} />
                  </Col>
                </Row>
              </Col>
            </Row>
          </ListGroupItem>
        </ListGroup>
      </Card>
    )
  }

}

export default OrderInputDetails;
