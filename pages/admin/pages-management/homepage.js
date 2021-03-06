import React from "react";
import { Container, Row, Col, Card, CardHeader, CardBody } from "reactstrap";

// layout for this page
import Admin from "layouts/Admin.js";
// core components
import AlternativeHeader from "components/Headers/AlternativeHeader.js";

import { useState, useEffect } from "react";
import { HERO_HOMEPAGE, HERO_TYPE_BRANDING } from "constants.js";

import BrandingHeroComponentForm from "components/Forms/BrandingHeroComponentForm";
import OurBusinessComponentForm from "components/Forms/OurBusinessComponentForm";
import MetricsComponentForm from "components/Forms/MetricsComponentForm";
import LogoShowcaseComponentForm from "components/Forms/LogoShowcaseComponentForm";
import { readHeroByTypeLocation } from "actions/hero";

function Homepage() {
  const [heroData, setHeroData] = useState({
    heroLocation: HERO_HOMEPAGE,
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
      <AlternativeHeader name="Homepage" parentName="Pages" />
      <Container className="mt--6" fluid>
        <Row className="justify-content-center">
          <Col className="card-wrapper" lg="9">
            <BrandingHeroComponentForm
              formValues={heroData}
              setFormValues={setHeroData}
            />
            <OurBusinessComponentForm />
            <MetricsComponentForm />
            <Card>
              <CardHeader>
                <h3 className="mb-0">CTA Component</h3>
              </CardHeader>
              <CardBody></CardBody>
            </Card>
            <LogoShowcaseComponentForm />
          </Col>
        </Row>
      </Container>
    </>
  );
}

Homepage.layout = Admin;

export default Homepage;
