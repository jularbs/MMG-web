import React from "react";

import { Container, Row, Col } from "reactstrap";
// layout for this page
import Admin from "layouts/Admin.js";
// core components
import AlternativeHeader from "components/Headers/AlternativeHeader.js";

import { useState, useEffect } from "react";
import { HERO_DIGITAL, HERO_TYPE_BRANDING } from "constants.js";

import BrandingHeroComponentForm from "components/Forms/BrandingHeroComponentForm";

import { readHeroByTypeLocation } from "actions/hero";

function Digital() {
  const [heroData, setHeroData] = useState({
    heroLocation: HERO_DIGITAL,
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
          </Col>
        </Row>
      </Container>
    </>
  );
}

Digital.layout = Admin;

export default Digital;
