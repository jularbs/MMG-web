import React from "react";

import { Container, Row, Col } from "reactstrap";
// layout for this page
import Admin from "layouts/Admin.js";
// core components
import AlternativeHeader from "components/Headers/AlternativeHeader.js";

import { useState, useEffect } from "react";
import {
  HERO_PROMOS,
  HERO_TYPE_BRANDING,
  NETWORK_INITIATED_PROMOS,
  CLIENT_INITIATED_PROMOS,
} from "constants.js";

import BrandingHeroComponentForm from "components/Forms/BrandingHeroComponentForm";
import BasicPostComponentForm from "components/Forms/BasicPostComponentForm";

import { readHeroByTypeLocation } from "actions/hero";

function Promos() {
  const [heroData, setHeroData] = useState({
    heroLocation: HERO_PROMOS,
    heroType: HERO_TYPE_BRANDING,
    title: "",
    content: "",
    ctaText: "",
    ctaLink: "",
    image: "",
    background: "",
    videoURL: "",
  });

  useEffect(() => {
    const data = { type: heroData.heroType, location: heroData.heroLocation };
    readHeroByTypeLocation(data).then((data) => {
      if (data.data) setHeroData(data.data);
    });
  }, []);
  return (
    <>
      <AlternativeHeader name="Digital" parentName="Pages" />
      <Container className="mt--6" fluid>
        <Row className="justify-content-center">
          <Col className="card-wrapper" lg="9">
            <BrandingHeroComponentForm
              formValues={heroData}
              setFormValues={setHeroData}
            />
            <BasicPostComponentForm
              label="Network Initiated Promos Posts"
              location={NETWORK_INITIATED_PROMOS}
            />
            <BasicPostComponentForm
              label="Client Initiated Promos Posts"
              location={CLIENT_INITIATED_PROMOS}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
}

Promos.layout = Admin;

export default Promos;
