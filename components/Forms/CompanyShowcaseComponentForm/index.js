//TODOS: Convert to SideBySide

import React from "react";
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Button,
  FormGroup,
  Input,
  Spinner,
  UncontrolledAlert,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Table,
} from "reactstrap";

import { useState, useEffect } from "react";

import {
  createCompanyShowcase,
  updateCompanyShowcase,
  getCompanyShowcaseByLocation,
  removeCompanyShowcase,
} from "actions/companyShowcase";

import { getLink } from "actions/media";
import _ from "lodash";

const CompanyShowcaseComponentForm = ({ label, location, fields }) => {
  //Component States
  const [loading, setLoading] = useState({
    fetch: false,
    create: false,
    update: false,
    delete: false,
    update: false,
  });

  const [responseMessage, setResponseMessage] = useState({
    error: "",
    success: "",
    deleteError: "",
    deleteSuccess: "",
    updateError: "",
    updateSuccess: "",
  });

  const [previewImage, setPreviewImage] = useState({
    logo: "",
  });

  const [formValues, setFormValues] = useState({
    location: location,
    order: "",
    name: "",
    content: "",
    ctaText: "",
    ctaLink: "",
  });

  const [addFormModalOpen, setAddFormModalOpen] = useState(false);

  const [companyShowcaseList, setCompanyShowcaseList] = useState([]);

  //Component Lifecycles
  useEffect(() => {
    setLoading({ ...loading, fetch: true });
    getCompanyShowcaseByLocation(location).then((data) => {
      console.log(data.data);
      setLoading({ ...loading, fetch: false });
      setCompanyShowcaseList(data.data);
    });
  }, []);

  //Input Handlers
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

  //Create Handlers
  const handleSubmit = () => {
    setLoading({
      ...loading,
      create: true,
    });

    //destructure input
    const { location, order, name, content, ctaText, ctaLink, logo } =
      formValues;

    const data = new FormData();
    //set form fields

    //required fields
    data.set("location", location);
    data.set("order", order);
    data.set("name", name);
    data.set("content", content);
    if (ctaText) data.set("ctaText", ctaText);
    if (ctaLink) data.set("ctaLink", ctaLink);
    if (logo) data.set("logo", logo);

    createCompanyShowcase("", data)
      .then((data) => {
        setLoading({
          ...loading,
          create: false,
        });
        setAddFormModalOpen(false);
        setResponseMessage({ success: data.message, error: "" });
        setFormValues({});
        setPreviewImage({});
        setCompanyShowcaseList([...companyShowcaseList, data.data]);
      })
      .catch((e) => {
        setLoading({
          ...loading,
          create: false,
        });
        setResponseMessage({ success: "", error: e.response.data.message });
      });
  };

  const showAddForm = () => {
    return (
      <Modal
        toggle={() => setAddFormModalOpen(!addFormModalOpen)}
        isOpen={addFormModalOpen}
        className="add-portrait-modal"
      >
        <ModalHeader>Add Data</ModalHeader>
        <ModalBody className="py-4">
          {showErrorMessage()}
          <Row>
            <Col lg="6">
              <h3>Details</h3>
              <FormGroup>
                <label className="form-control-label" htmlFor="title">
                  Order
                </label>
                <Input
                  value={formValues.order}
                  onChange={handleTextChange("order")}
                  type="text"
                />
              </FormGroup>
              <FormGroup>
                <label className="form-control-label" htmlFor="title">
                  Name
                </label>
                <Input
                  value={formValues.name}
                  onChange={handleTextChange("name")}
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
            </Col>
            <Col lg="6">
              <div className="d-flex flex-column align-items-center">
                <div className="d-flex justify-content-between w-100">
                  <h3 className="d-inline ">Logo Placement</h3>
                  <label className="btn btn-default btn-sm">
                    Choose file...
                    <Input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleFileChange("logo")}
                    />
                  </label>
                </div>
                <img
                  src={
                    previewImage.logo
                      ? previewImage.logo
                      : formValues.logo
                      ? getLink(formValues.logo)
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
              <h3>Call To Action Button</h3>
              <Row>
                <Col lg="4">
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
                </Col>
                <Col lg="8">
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
                </Col>
              </Row>
              <FormGroup>
                <label className="form-control-label" htmlFor="title">
                  Preview
                </label>
                <div className="cta-preview cta-company-showcase">
                  <a href={formValues.ctaLink} target="_blank">
                    <button className="cta-button btn btn-block">
                      <span>{formValues.ctaText}</span>
                      <img src="/common/arrow-black.svg" />
                    </button>
                  </a>
                </div>
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter className="d-flex justify-content-between">
          <Button
            color="dark"
            className="px-5"
            onClick={() => {
              setAddFormModalOpen(false);
            }}
          >
            Preview
          </Button>
          <div>
            <Button
              outline
              className="px-5"
              onClick={() => {
                setAddFormModalOpen(false);
              }}
            >
              Cancel
            </Button>

            <Button color="primary" onClick={handleSubmit} className="px-5">
              {loading.create && (
                <Spinner color="white" size="sm" className="mr-2" />
              )}
              Add Data
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    );
  };

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

  //UpdateHandlers
  const [updateFormModalOpen, setUpdateFormModalOpen] = useState(false);

  const [updateValues, setUpdateValues] = useState({});

  const [updatePreviewImage, setUpdatePreviewImage] = useState({
    background: "",
    logo: "",
  });

  const handleUpdate = () => {
    setLoading({ ...loading, update: true });

    const { slug, order, name, content, ctaText, ctaLink, logo } = updateValues;

    const data = new FormData();
    //set form fields

    //required fields
    data.set("slug", slug);
    data.set("order", order);
    data.set("name", name);
    data.set("content", content);
    if (ctaText) data.set("ctaText", ctaText);
    if (ctaLink) data.set("ctaLink", ctaLink);
    if (updatePreviewImage.logo) data.set("logo", logo);

    updateCompanyShowcase("", data)
      .then((data) => {
        setLoading({ ...loading, update: false });
        setResponseMessage({
          ...responseMessage,
          updateSuccess: data.message,
        });
        setUpdateFormModalOpen(false);

        //reset form
        setUpdatePreviewImage({});
        setUpdateValues({});

        //remove old
        let newList = companyShowcaseList.filter(
          (item) => item.slug !== data.data.slug
        );
        //Add new
        setCompanyShowcaseList([data.data, ...newList]);
      })
      .catch((e) => {
        setLoading({
          ...loading,
          update: false,
        });
        setResponseMessage({
          ...responseMessage,
          updateError: e.response.data.message,
        });
      });
  };

  const handleUpdateTextChange = (name) => (e) => {
    const value = e.target.value;
    setUpdateValues({ ...updateValues, [name]: value });
  };

  const handleUpdateFileChange = (name) => (e) => {
    if (e.target.files[0]) {
      let reader = new FileReader();
      reader.onloadend = () => {
        setUpdatePreviewImage({
          ...updatePreviewImage,
          [name]: reader.result,
        });
        setUpdateValues({
          ...updateValues,
          [name]: e.target.files[0],
        });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const showUpdateForm = () => {
    return (
      <Modal
        toggle={() => {
          setUpdateFormModalOpen(!updateFormModalOpen);
          setUpdateValues({});
          setUpdatePreviewImage({ background: "", logo: "" });
        }}
        isOpen={updateFormModalOpen}
        className="add-portrait-modal"
      >
        <ModalHeader>Update Data</ModalHeader>
        <ModalBody className="py-4">
          {showUpdateErrorMessage()}
          <Row>
            <Col lg="6">
              <h3>Details</h3>
              <FormGroup>
                <label className="form-control-label" htmlFor="title">
                  Order
                </label>
                <Input
                  value={updateValues.order}
                  onChange={handleUpdateTextChange("order")}
                  type="text"
                />
              </FormGroup>
              <FormGroup>
                <label className="form-control-label" htmlFor="title">
                  name
                </label>
                <Input
                  value={updateValues.name}
                  onChange={handleUpdateTextChange("name")}
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
                  value={updateValues.content}
                  onChange={handleUpdateTextChange("content")}
                />
              </FormGroup>
            </Col>
            <Col lg="6">
              <div className="d-flex flex-column align-items-center">
                <div className="d-flex justify-content-between w-100">
                  <h3 className="d-inline ">Logo Placement</h3>
                  <label className="btn btn-default btn-sm">
                    Choose file...
                    <Input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleUpdateFileChange("logo")}
                    />
                  </label>
                </div>
                <img
                  src={
                    updatePreviewImage.logo
                      ? updatePreviewImage.logo
                      : updateValues.logo
                      ? getLink(updateValues.logo)
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
              <h3>Call To Action Button</h3>
              <FormGroup>
                <label className="form-control-label" htmlFor="title">
                  Button Label
                </label>
                <Input
                  placeholder=""
                  type="text"
                  value={updateValues.ctaText}
                  onChange={handleUpdateTextChange("ctaText")}
                />
              </FormGroup>
              <FormGroup>
                <label className="form-control-label" htmlFor="title">
                  Destination
                </label>
                <Input
                  placeholder=""
                  type="text"
                  value={updateValues.ctaLink}
                  onChange={handleUpdateTextChange("ctaLink")}
                />
              </FormGroup>
              <FormGroup>
                <label className="form-control-label" htmlFor="title">
                  Preview
                </label>
                <div className="cta-preview cta-company-showcase">
                  <a href={updateValues.ctaLink} target="_blank">
                    <button className="cta-button btn btn-block">
                      <span>{updateValues.ctaText}</span>
                      <img src="/common/arrow-black.svg" />
                    </button>
                  </a>
                </div>
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button
            outline
            className="px-5"
            onClick={() => {
              setUpdateFormModalOpen(false);
              setUpdatePreviewImage({});
              setUpdateValues({});
            }}
          >
            Cancel
          </Button>
          <Button color="primary" onClick={handleUpdate}>
            {loading.update && (
              <Spinner color="white" size="sm" className="mr-2" />
            )}
            Update Data
          </Button>
        </ModalFooter>
      </Modal>
    );
  };

  const showUpdateSuccessMessage = () =>
    responseMessage.updateSuccess && (
      <UncontrolledAlert
        color="primary"
        onClick={() => {
          setResponseMessage({ ...responseMessage, updateSuccess: "" });
        }}
      >
        <span className="alert-icon">
          <i className="ni ni-like-2" />
        </span>
        <span className="alert-text ml-1">{responseMessage.updateSuccess}</span>
      </UncontrolledAlert>
    );

  const showUpdateErrorMessage = () =>
    responseMessage.updateError && (
      <UncontrolledAlert
        color="danger"
        onClick={() => {
          setResponseMessage({ ...responseMessage, updateError: "" });
        }}
      >
        <span className="alert-icon">
          <i className="ni ni-like-2" />
        </span>
        <span className="alert-text ml-1">{responseMessage.updateError}</span>
      </UncontrolledAlert>
    );

  //Delete Handlers
  const [deleteHandler, setDeleteHandler] = useState({
    key: "",
    input: "",
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const showDeleteConfirmation = () => {
    return (
      <Modal
        toggle={() => setDeleteModalOpen(!deleteModalOpen)}
        isOpen={deleteModalOpen}
      >
        {showDeleteErrorMessage()}
        <div className=" modal-header">
          <h5 className="modal-title">Delete Portrait</h5>
          <button
            aria-label="Close"
            className=" close"
            type="button"
            onClick={() => setDeleteModalOpen(!deleteModalOpen)}
          >
            <span aria-hidden={true}>??</span>
          </button>
        </div>
        <ModalBody className="py-0">
          <FormGroup className="mb-0">
            <span className="text-sm">
              Type "DANGER" to permanently delete portrait card.
            </span>
            <Input
              placeholder=""
              type="text"
              onChange={(e) => {
                setDeleteHandler({ ...deleteHandler, input: e.target.value });
              }}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            disabled={deleteHandler.input == "DANGER" ? false : true}
            onClick={handleRemove(deleteHandler.key)}
          >
            {loading.delete && (
              <Spinner color="white" size="sm" className="mr-2" />
            )}
            Permanently Delete
          </Button>
          <Button
            color="secondary"
            onClick={() => {
              setDeleteModalOpen(false);
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  };

  const handleRemove = (key) => (e) => {
    e.preventDefault();
    setLoading({
      ...loading,
      delete: true,
    });

    removeCompanyShowcase("", key)
      .then((data) => {
        setLoading({ ...loading, delete: false });
        if (data.status && data.status == "200") {
          //portrait is deleted
          setResponseMessage({
            ...responseMessage,
            deleteSuccess: data.message,
          });
          const newList = companyShowcaseList.filter(
            (item) => item.slug !== deleteHandler.key
          );
          setCompanyShowcaseList(newList);
          setDeleteHandler({
            key: "",
            input: "",
          });
          setDeleteModalOpen(false);
        }
      })
      .catch((e) => {
        setLoading({
          ...loading,
          delete: false,
        });
        setResponseMessage({
          deleteError: e.response.data.message,
        });
      });
  };

  const showDeleteSuccessMessage = () =>
    responseMessage.deleteSuccess && (
      <UncontrolledAlert
        color="primary"
        onClick={() => {
          setResponseMessage({ ...responseMessage, deleteSuccess: "" });
        }}
      >
        <span className="alert-icon">
          <i className="ni ni-like-2" />
        </span>
        <span className="alert-text ml-1">{responseMessage.deleteSuccess}</span>
      </UncontrolledAlert>
    );

  const showDeleteErrorMessage = () =>
    responseMessage.deleteError && (
      <UncontrolledAlert
        color="danger"
        onClick={() => {
          setResponseMessage({ ...responseMessage, deleteError: "" });
        }}
      >
        <span className="alert-icon">
          <i className="ni ni-like-2" />
        </span>
        <span className="alert-text ml-1">{responseMessage.deleteError}</span>
      </UncontrolledAlert>
    );

  //Component Views
  const showCompanyShowcaseTable = () => {
    return (
      <Table className="align-items-center table-flush" responsive>
        <thead className="thead-light">
          <tr>
            <th scope="col">Order</th>
            <th scope="col">Name</th>
            <th scope="col">Content</th>
            <th scope="col">Destination</th>
            <th></th>
          </tr>
        </thead>
        <tbody className="list">{showCompanyShowcaseListData()}</tbody>
      </Table>
    );
  };

  const showCompanyShowcaseListData = () => {
    const sorted = companyShowcaseList.sort((a, b) => {
      return a.order - b.order;
    });
    return sorted.map((item, index) => (
      <tr key={index}>
        <td>{item.order}</td>
        <td>{item.name}</td>
        <td
          style={{
            textOverflow: "ellipsis",
            maxWidth: "250px",
            overflow: "hidden",
          }}
        >
          {item.content}
        </td>
        <td>{item.ctaLink}</td>
        <td className="d-flex justify-content-end">
          <Button
            size="sm"
            color="danger"
            outline
            onClick={() => {
              //TODOS: change key to slug for delete handler
              setDeleteHandler({ key: item.slug, input: "" });
              setDeleteModalOpen(true);
            }}
          >
            Delete
          </Button>
          <Button
            size="sm"
            color="primary"
            className="px-3"
            onClick={() => {
              setUpdateFormModalOpen(true);
              const toUpdate = _.merge(updateValues, item);
              setUpdateValues(toUpdate);
            }}
          >
            Edit
          </Button>
        </td>
      </tr>
    ));
  };

  return (
    <>
      {showAddForm()}
      {showUpdateForm()}
      {showDeleteConfirmation()}
      <Card>
        <CardHeader className="d-flex align-items-center justify-content-between">
          <h2 className="mb-0 d-inline-block">{label}</h2>
          <Button
            size="sm"
            color="primary"
            onClick={() => {
              setAddFormModalOpen(true);
            }}
          >
            + Add Data
          </Button>
        </CardHeader>
        <CardBody>
          {showSuccessMessage()}
          {showDeleteSuccessMessage()}
          {showUpdateSuccessMessage()}
          {companyShowcaseList.length > 0 ? (
            showCompanyShowcaseTable()
          ) : (
            <div className="mx-auto text-center">No data found</div>
          )}
        </CardBody>
      </Card>
    </>
  );
};

export default CompanyShowcaseComponentForm;
