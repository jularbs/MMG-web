import React from "react";
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  FormGroup,
  Input,
  Spinner,
  UncontrolledAlert,
} from "reactstrap";

import { useState } from "react";
import { createHero } from "actions/hero";
import { getLink } from "actions/media";
import _ from "lodash";

const BrandingHeroComponentForm = ({ formValues, setFormValues }) => {
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState({
    error: "",
    success: "",
  });
  const [previewImage, setPreviewImage] = useState({
    image: "",
    background: "",
  });

  const showSuccessMessage = () =>
    responseMessage.success && (
      <UncontrolledAlert
        color="primary"
        onClick={() => {
          setResponseMessage({ success: "", error: "" });
        }}
      >
        <span className="alert-icon">
          <i className="ni ni-like-2" />
        </span>
        <span className="alert-text ml-1"> {responseMessage.success}</span>
      </UncontrolledAlert>
    );

  const showErrorMessage = () =>
    responseMessage.error && (
      <UncontrolledAlert
        color="danger"
        onClick={() => {
          setResponseMessage({ success: "", error: "" });
        }}
      >
        <span className="alert-icon">
          <i className="ni ni-like-2" />
        </span>
        <span className="alert-text ml-1">{responseMessage.error}</span>
      </UncontrolledAlert>
    );

  const handleTextChange = (name) => (e) => {
    const value = e.target.value;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleFileChange = (name) => (e) => {
    if (e.target.files[0]) {
      let reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage({ ...previewImage, [name]: reader.result });
        setFormValues({
          ...formValues,
          [name]: e.target.files[0],
        });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    const {
      title,
      content,
      ctaText,
      ctaLink,
      videoURL,
      heroLocation,
      heroType,
      image,
      background,
    } = formValues;
    
    //init FormValues to form data;
    const data = new FormData();

    //set form fields
    data.set("title", title);
    data.set("content", content);
    data.set("ctaText", ctaText);
    data.set("ctaLink", ctaLink);
    data.set("videoURL", videoURL);
    data.set("heroLocation", heroLocation);
    data.set("heroType", heroType);

    //set form files
    if (image) data.set("image", image);
    if (background) data.set("background", background);

    createHero("", data)
      .then((data) => {
        setLoading(false);
        setResponseMessage({ success: data.message, error: "" });
      })
      .catch((e) => {
        setLoading(false);
        setResponseMessage({ success: "", error: e.response.data.message });
      });
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="mb-0">Hero Component</h2>
      </CardHeader>
      <CardBody>
        <Row>
          <Col lg="6">
            <h3>Hero Contents</h3>
            <FormGroup>
              <label className="form-control-label" htmlFor="title">
                Title
              </label>
              <Input
                placeholder="Title..."
                value={formValues.title}
                onChange={handleTextChange("title")}
                type="text"
              />
            </FormGroup>
            <FormGroup>
              <label className="form-control-label" htmlFor="title">
                Content
              </label>
              <Input
                placeholder=""
                type="textarea"
                rows="5"
                value={formValues.content}
                onChange={handleTextChange("content")}
              />
            </FormGroup>
            <h3>Call To Action Button</h3>
            <FormGroup>
              <label className="form-control-label" htmlFor="title">
                Button Label
              </label>
              <Input
                placeholder=""
                type="text"
                value={formValues.ctaText}
                onChange={handleTextChange("ctaText")}
              />
            </FormGroup>
            <FormGroup>
              <label className="form-control-label" htmlFor="title">
                Destination
              </label>
              <Input
                placeholder=""
                type="text"
                value={formValues.ctaLink}
                onChange={handleTextChange("ctaLink")}
              />
            </FormGroup>
            <FormGroup>
              <label className="form-control-label" htmlFor="title">
                Preview
              </label>
              <div className="cta-preview">
                <a href={formValues.ctaLink} target="_blank">
                  <button className="cta-button btn btn-block">
                    <span>{formValues.ctaText}</span>
                    <img src="/common/arrow-white.svg" />
                  </button>
                </a>
              </div>
            </FormGroup>
            <h3>Media Player</h3>
            <FormGroup>
              <label className="form-control-label" htmlFor="title">
                Video URL Source
              </label>
              <Input
                placeholder=""
                type="text"
                value={formValues.videoURL}
                onChange={handleTextChange("videoURL")}
              />
            </FormGroup>
          </Col>
          <Col lg="6">
            <div className="d-flex flex-column align-items-center">
              <div className="d-flex justify-content-between w-100">
                <h3 className="d-inline ">Image Placement</h3>
                <label className="btn btn-default btn-sm">
                  Choose file...
                  <Input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange("image")}
                  />
                </label>
              </div>
              <img
                src={
                  previewImage.image
                    ? previewImage.image
                    : formValues.image
                    ? getLink(formValues.image)
                    : ""
                }
                style={{
                  maxWidth: "200px",
                  width: "100%",
                  margin: "2rem 0",
                  backgroundColor: "#ECECEC",
                }}
              />
              <div className="d-flex justify-content-between w-100">
                <h3 className="d-inline ">Background Image</h3>
                <label className="btn btn-default btn-sm">
                  Choose file...
                  <Input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange("background")}
                  />
                </label>
              </div>
              <img
                src={
                  previewImage.background
                    ? previewImage.background
                    : formValues.background
                    ? getLink(formValues.background)
                    : ""
                }
                style={{
                  maxWidth: "200px",
                  width: "100%",
                  margin: "2rem 0",
                  backgroundColor: "#ECECEC",
                }}
              />
            </div>
          </Col>
        </Row>
      </CardBody>
      <CardFooter>
        {showErrorMessage()}
        {showSuccessMessage()}
        <div className="d-flex align-items-center justify-content-between">
          <span>
            Last Updated: {formValues.updatedAt && formValues.updatedAt}
          </span>
          <div>
            <Button>Preview</Button>
            <Button color="primary" onClick={handleSubmit}>
              {loading && <Spinner color="white" size="sm" className="mr-2" />}
              Save Changes
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BrandingHeroComponentForm;
