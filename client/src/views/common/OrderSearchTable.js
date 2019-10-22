import React from "react";
import { Container, Row, Button, Card } from "shards-react";
import { connect } from "react-redux";
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import { format } from 'date-fns';
import PageTitle from "../../components/common/PageTitle";
import { orderService } from "../../redux/services/order.service";
import Loading from "../common/Loading";
import { loadingActions } from "../../redux/actions"
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';
import { formatNumber } from "../../utils/numberFormatter";

const { SearchBar } = Search;

var selectRow;

class OrderSearchTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            columns: [{
                dataField: 'confirmed',
                text: 'Status ',
                formatter: this.statusFormatter
            }, {
                dataField: 'orderRequestID',
                text: 'Order ID'
            }, {
                dataField: 'amount',
                text: 'Weight (kg)',
                formatter: this.weightFormatter
            }, {
                dataField: 'requestDate',
                text: 'Date ',
                formatter: this.dateFormatter
            }
            ],
            orders: []
        }


        selectRow = {
            mode: 'radio',
            clickToSelect: true,
            onSelect: (row, isSelect, rowIndex, e) => {
                this.props.handleSearchState(isSelect, this.state.orders[rowIndex]);
            }
        };
    }

    statusFormatter(cell, row) {
        if (row.orderStatus === "ORDER_INIT") {
            return (<Button size="sm" theme="warning" className="mb-2 mr-1"><FormattedMessage id="userorderslist.label-orderPlaced" /></Button>)
        }
        return (<Button size="sm" theme="success" className="mb-2 mr-1"><FormattedMessage id="userorderslist.label-shipmentAdded" /></Button>)
    }

    dateFormatter(cell, row) {
        if (row.requestDate) {
            return format(row.requestDate, 'MMMM Do, YYYY')
        }
    }

    weightFormatter(cell, row) {
        if (row.teaOrders.length > 0) {
            return row.teaOrders
                .map(item => item.weight)
                .reduce((prev, curr) => formatNumber(prev + curr), 0)
        }
    }

    componentDidMount() {
        //Fetch orders
        const user = this.props.user;
        this.props.dispatch(loadingActions.toggleLoad(true)); //show 
        this.getAllOrders(user);
    }

    getAllOrders(user) {
        orderService.getAllOrders(user)
            .then((orders) => {
                this.props.dispatch(loadingActions.toggleLoad(false)); //hide
                this.setState({ orders })
            })
    }

    render() {
        const { isLoading, intl } = this.props;
        const messages = defineMessages({
            header: { id: "userorderslist.searchorders" }
        })

        return (
            <div>
                {
                    isLoading ? <Loading /> :
                        <Container fluid className="main-content-container px-4">
                            <Row noGutters className="page-header py-4">
                                <PageTitle sm="4" title={intl.formatMessage(messages.header)} className="text-sm-left" />
                            </Row>
                            <Card>
                                <ToolkitProvider
                                    keyField="id"
                                    data={this.state.orders}
                                    columns={this.state.columns}
                                    search
                                >
                                    {
                                        props => (
                                            <div>
                                                <SearchBar {...props.searchProps} className="mt-4 ml-4" />
                                                <hr />
                                                <BootstrapTable
                                                    {...props.baseProps}

                                                    selectRow={selectRow}
                                                />
                                            </div>
                                        )
                                    }
                                </ToolkitProvider>
                            </Card>
                        </Container>
                }
            </div>
        )
    }
}



const mapStateToProps = state => {
    const { user } = state.authentication;
    const { isLoading } = state.loadState;
    return { user, isLoading };
}

export default injectIntl(connect(mapStateToProps)(OrderSearchTable));
