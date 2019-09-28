import React from "react";
import { Card, CardHeader, CardBody } from "shards-react";
import { VictoryLine, VictoryChart, VictoryAxis, VictoryTheme } from 'victory';
import { FormattedMessage } from 'react-intl';


export default class DashboardGraph extends React.Component {
  render() {
    const { historicalPrices } = this.props;
    return (
      <Card small >
        <CardHeader className="border-bottom">
          <h6 className="m-0">
            <FormattedMessage
              id="dashboard.graphheader"
              defaultMessage="Price of tea over the past 5 months"
              description="Dashboard graph header"
            />
          </h6>

        </CardHeader>
        <CardBody className="pt-0">
          <VictoryChart
            height={300}
            width={900}
            // scale={{ x: "month" }}
            theme={VictoryTheme.material}
          >
            <VictoryAxis
              tickValues={[1, 2, 3, 4, 5]}
            />
            <VictoryAxis
              dependentAxis />
            <VictoryLine
              style={{
                data: { stroke: "#00b8d8" },
                parent: { border: "1px solid #ccc" }
              }}
              data={historicalPrices.reverse()}
              x="month"
              y="price"
              animate={{
                duration: 2000,
                onLoad: { duration: 1500 }
              }}
            />
          </VictoryChart>
        </CardBody>
      </Card>
    );
  }
}

