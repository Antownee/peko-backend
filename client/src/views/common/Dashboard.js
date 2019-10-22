import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col } from "shards-react";
import { connect } from "react-redux";
import PageTitle from "../../components/common/PageTitle";
import SmallStats from "../../components/common/SmallStats";
import DashboardGraph from "./DashboardGraph";
import DashboardOrderTable from "./DashboardOrderTable";
import { loadingActions } from "../../redux/actions"
import { orderService } from "../../redux/services/order.service";
import Loading from "../common/Loading";
import { injectIntl, defineMessages } from 'react-intl';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numberOfOrders: 0,
      pendingOrders: 0,
      priceOfTea: 0,
      smallStats: this.props.smallStats,
      recentOrders: [],
      historicalPrices: [],
    }
  }

  componentDidMount() {
    const { user } = this.props;
    this.props.dispatch(loadingActions.toggleLoad(true)); //show 
    orderService.populateDashboard(user)
      .then((res) => {
        this.props.dispatch(loadingActions.toggleLoad(false)); //hide
        const { smallStats } = this.state;
        //number of orders made
        smallStats[0].value = res.numberOfOrders;
        //pending orders
        smallStats[1].value = res.shippedOrders;
        //total weight of orders
        smallStats[2].value = res.totalOrderWeight;

        this.setState({
          smallStats,
          recentOrders: [...res.recentOrders],
          historicalPrices: [...res.historicalPrices]
        });

      })
      .catch((e) => {
        //Throw and error
      })
  }


  render() {
    const { smallStats, recentOrders, historicalPrices } = this.state;
    const { isLoading, intl } = this.props;
    const messages = defineMessages({
      header: { id: "dashboard.header" },
      card1: { id: "dashboard.card1-title" },
      card2: { id: "dashboard.card2-title" },
      card3: { id: "dashboard.card3-title" }
    })

    return (
      <div>
        {
          isLoading ? <Loading /> :
            <Container fluid className="main-content-container px-4">
              {/* Page Header */}
              <Row noGutters className="page-header py-4">
                <PageTitle title={intl.formatMessage(messages.header)} className="text-sm-left mb-3" />
              </Row>

              {/* Small Stats Blocks */}
              <Row>
                {smallStats.map((stats, idx) => (
                  <Col className="col-lg mb-4" key={idx} {...stats.attrs}>
                    <SmallStats
                      id={`small-stats-${idx}`}
                      variation="1"
                      chartData={stats.datasets}
                      chartLabels={stats.chartLabels}
                      label={intl.formatMessage(messages[`card${idx + 1}`])}
                      value={stats.value}
                      increase={stats.increase}
                      decrease={stats.decrease}
                    />
                  </Col>
                ))}
              </Row>

              <Row>
                {/* Users Overview */}
                <Col lg="12" md="12" sm="12" className="mb-4">
                  <DashboardGraph historicalPrices={historicalPrices} />
                </Col>
              </Row>

              <Row>
                <Col lg="12" md="12" sm="12" className="mb-4">
                  <DashboardOrderTable recentOrders={recentOrders} />
                </Col>
              </Row>
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

export default injectIntl(connect(mapStateToProps)(Dashboard));


Dashboard.propTypes = {
  /**
   * The small stats dataset.
   */
  smallStats: PropTypes.array
};

Dashboard.defaultProps = {
  smallStats: [
    {
      label: "No. of orders made",
      value: "0",
      increase: true,
      chartLabels: [null, null, null, null, null, null, null],
      attrs: { md: "6", sm: "6" },
      datasets: [
        {
          label: "Today",
          fill: "start",
          borderWidth: 1.5,
          backgroundColor: "rgba(0, 184, 216, 0.1)",
          borderColor: "rgb(0, 184, 216)",
          data: [1, 2, 1, 3, 5, 4, 7]
        }
      ]
    },
    {
      label: "Pending orders",
      value: "0",
      increase: true,
      chartLabels: [null, null, null, null, null, null, null],
      attrs: { md: "6", sm: "6" },
      datasets: [
        {
          label: "Today",
          fill: "start",
          borderWidth: 1.5,
          backgroundColor: "rgba(0, 184, 216, 0.1)",
          borderColor: "rgb(0, 184, 216)",
          data: [1, 2, 1, 3, 5, 4, 7]
        }
      ]
    },
    {
      label: "Average auction price of Kenyan tea ($ per kg)",
      value: "0",
      percentage: "3.8%",
      increase: false,
      decrease: true,
      chartLabels: [null, null, null, null, null, null, null],
      attrs: { md: "4", sm: "6" },
      datasets: [
        {
          label: "Today",
          fill: "start",
          borderWidth: 1.5,
          backgroundColor: "rgba(0, 184, 216, 0.1)",
          borderColor: "rgb(0, 184, 216)",
          data: [1, 2, 1, 3, 5, 4, 7]
        }
      ]
    }
  ]
};

