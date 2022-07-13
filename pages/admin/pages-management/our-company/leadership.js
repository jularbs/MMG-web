import React from "react";

import { useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";

// layout for this page
import Admin from "layouts/Admin.js";
// core components
import AlternativeHeader from "components/Headers/AlternativeHeader.js";
import SimpleHeroComponentForm from "components/Forms/SimpleHeroComponentForm";
import PortraitCardForm from "components/Forms/PortraitCardForm";
import SideBySideComponentForm from "components/Forms/SideBySideComponentForm";
import { readHeroByTypeLocation } from "actions/hero";

import { HERO_LEADERSHIP, HERO_TYPE_SIMPLE } from "constants.js";

function Leadership() {
  const [heroData, setHeroData] = useState({
    heroLocation: HERO_LEADERSHIP,
    heroType: HERO_TYPE_SIMPLE,
    title: "",
    content: "",
    background: "",
  });

  useEffect(() => {
    const data = { type: heroData.heroType, location: heroData.heroLocation };
    readHeroByTypeLocation(data).then((data) => {
      if (data.data) setHeroData(data.data);
    });
  }, []);

  return (
    <>
      <AlternativeHeader name="Leadership" parentName="Pages" />
      <Container className="mt--6" fluid>
        <Row className="justify-content-center">
          <Col className="card-wrapper" lg="9">
            <SimpleHeroComponentForm
              formValues={heroData}
              setFormValues={setHeroData}
            />
            <PortraitCardForm
              label="Board of Directors Management"
              location={"LEADERSHIP_PAGE"}
              group={"BOARD_OF_DIRECTORS"}
            />
            <PortraitCardForm
              label="Key Officers Management"
              location={"LEADERSHIP_PAGE"}
              group={"KEY_OFFICERS"}
            />
            <SideBySideComponentForm
              label="Leadership Posts"
              location={"LEADERSHIP_PAGE"}
              group={"BOARD_OF_DIRECTORS"}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
}

Leadership.layout = Admin;

export default Leadership;
