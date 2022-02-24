import React from "react";

import { Container } from "reactstrap";

// layout for this page
import Admin from "layouts/Admin.js";
// core components
import CardsHeader from "components/Headers/CardsHeader.js";

function ContactUs() {
  return (
    <>
      <CardsHeader name="Contact Us" parentName="Pages" />
      <Container className="mt--6" fluid></Container>
    </>
  );
}

ContactUs.layout = Admin;

export default ContactUs;