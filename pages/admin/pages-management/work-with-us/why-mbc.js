import React from "react";

import { Container, Row, Col } from "reactstrap";
// layout for this page
import Admin from "layouts/Admin.js";
// core components
import AlternativeHeader from "components/Headers/AlternativeHeader.js";

import { WORK_WITH_US_FAQ } from "constants.js";

import FaqComponentForm from "components/Forms/FaqComponentForm";
import TestimonialComponentForm from "components/Forms/TestimonialComponentForm";
function WhyMBCPage() {
  return (
    <>
      <AlternativeHeader name="Careers" parentName="Work with us" />
      <Container className="mt--6" fluid>
        <Row className="justify-content-center">
          <Col className="card-wrapper" lg="12" md="12">
            <FaqComponentForm location={WORK_WITH_US_FAQ} />
            <TestimonialComponentForm location={WORK_WITH_US_FAQ} />
          </Col>
        </Row>
      </Container>
    </>
  );
}

WhyMBCPage.layout = Admin;

export default WhyMBCPage;
