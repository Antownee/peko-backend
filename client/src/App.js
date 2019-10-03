import React from "react";
import { Router, Route } from "react-router-dom";
import { PrivateRoute } from "./views/common/PrivateRoute";
import { history } from './redux/helpers/history'
import LoginPage from './views/common/LoginPage';
import RegisterPage from "./views/common/RegisterPage";
import routes from "./routes";
import withTracker from "./withTracker";
import { connect } from "react-redux";
import { IntlProvider } from "react-intl";
import { ToastContainer } from "react-toastify";
import messages_fa from "./translations/fa.json";
import messages_en from "./translations/en.json";
import "bootstrap/dist/css/bootstrap.min.css";
import "./shards-dashboard/styles/shards-dashboards.1.1.0.min.css";

let i18nConfig = {
  locale: 'en',
  messages: messages_en
};

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { currentLanguage } = this.props;
    switch (currentLanguage) {
      case 'FA': i18nConfig.messages = messages_fa; break;
      case 'EN': i18nConfig.messages = messages_en; break;
      default: i18nConfig.messages = messages_en; break;
    }

    return (
      <IntlProvider key={i18nConfig.locale} locale={i18nConfig.locale} messages={i18nConfig.messages}>
        <ToastContainer />

        <Router basename={process.env.REACT_APP_BASENAME || ""} history={history}>
          <div>
            <Route path="/login" component={LoginPage} />
            <Route path="/register" component={RegisterPage} />

            {routes.map((route, index) => {
              return (
                <PrivateRoute
                  key={index}
                  path={route.path}
                  exact={route.exact}
                  component={withTracker(props => {
                    return (
                      <route.layout {...props}>
                        <route.component {...props} />
                      </route.layout>
                    );
                  })}
                />
              );
            })}
          </div>
        </Router>
      </IntlProvider>
    )
  }
}

const mapStateToProps = state => {
  const { currentLanguage } = state.currentLanguage;
  return { currentLanguage }
}

export default connect(mapStateToProps)(App);