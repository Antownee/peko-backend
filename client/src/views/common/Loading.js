import React from "react";
import { Container } from "shards-react";
import { GuardSpinner  } from "react-spinners-kit";

const Loading = () => (
  <Container fluid className="main-content-container px-4 pb-4">
    <div className="error">
      <div className="error__content">
        <GuardSpinner 
          size={50}
          frontColor="#4286f4"
          loading={true}
        />
      </div>
    </div>
  </Container>
);

export default Loading;
