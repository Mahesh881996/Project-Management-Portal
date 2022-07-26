import * as React from 'react';
import { Container, Row, Form, Col, Button } from 'react-bootstrap';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { DateTimePicker, DateConvention, TimeConvention } from '@pnp/spfx-controls-react/lib/DateTimePicker';
import { FilePicker, IFilePickerResult } from '@pnp/spfx-controls-react/lib/FilePicker';
import { IProjectManagementProps } from '../IProjectManagementProps';
import { NewFormStates } from './States/NewFormState';
import styles from '../ProjectManagement.module.scss';
require("../sections/CSS/NewForm.css");
import  { createListItem,ensureUser } from '../../Services/SPOps';
import Swal from 'sweetalert2';
import withReactContent from "sweetalert2-react-content";
import { useParams } from 'react-router-dom';

const MySwal = withReactContent(Swal);
export default class NewForm extends React.Component<IProjectManagementProps, NewFormStates> {
    constructor(props) {
        super(props);
        const { FormType,Id } = props.match.params;
        this.state = {
            projectName: null,
            projectDescription: null,
            projectManager: null,
            projectBA: null,
            projectSME: null,
            projectDevelopers: null,
            expectedStartDate: null,
            expectedEndDate: null,
            fileUpload: null,
            filePickerResult: null
        };
        this.handleChange = this.handleChange.bind(this);
        this.createProject = this.createProject.bind(this);
    }

    private handleChange = (evt, type, field) => {
        if (type == "string") {
            const value = evt.target.value;
            this.setState({
                ...this.state,
                [field]: value
            });
        }
        else if (type == "Person") {
            console.log(field);
            let getSelectedUsers:any[] =[];
            evt.map((item) => {
                ensureUser(item.id).then((data) => {
                    getSelectedUsers.push(data.data.Id)
                });
            });
            this.setState({
                ...this.state,
                [field]: getSelectedUsers
            });
        }
        else if(type="file"){
            let resultFile = evt.target.files;
            let fileInfos = [];
            for(let element of resultFile){
                var fileName = element.name;
                var file = element;
                var reader = new FileReader();
                reader.onload = (function(file) {
                    return function(e) {
                          fileInfos.push({
                             "name": file.name,
                             "content": e.target.result
                             });
                           }
                    })(file);
                 reader.readAsArrayBuffer(file);
            };
            this.setState({
                ...this.state,
                [field]: fileInfos
            });
        }
        console.log(this.state);
    }

    private createProject = () => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "To create this Project",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            backdrop: false,
            allowOutsideClick: false
          }).then((result) => {
            if (result.isConfirmed) {
                this.newProject();
            }
            else{
                Swal.fire({
                    icon: 'warning',
                    title: 'Cancelled!',
                    text: 'Your project is not created!',
                    backdrop: false,
                    allowOutsideClick: false
                })
            }
          })
    }

    private newProject = () => {
        createListItem("Projects",{
            Title: this.state.projectName,
            ProjectDescription: this.state.projectDescription,
            ExpectedStartDate: this.state.expectedStartDate,
            ExpectedEndDate: this.state.expectedEndDate,
            ProjectManagerId: this.state.projectManager == null ? -1 : this.state.projectManager[0],
            ProjectBAId:this.state.projectBA == null ? -1 : this.state.projectBA[0],
            ProjectSMEId: this.state.projectSME == null ? -1 : this.state.projectSME[0],
            ProjectDevelopersId: this.state.projectDevelopers == null ? [0] : this.state.projectDevelopers
          },this.state.fileUpload).then((data) => {
            Swal.fire({
                icon: 'success',
                title: 'Created',
                text: 'Your project was created successfully!',
                backdrop: false,
                allowOutsideClick: false
              }).then((result) => {
                  window.location.reload();
              })
          }).catch((err) => {
            console.error(err);
            throw err;
          });
    }

    public render(): React.ReactElement<IProjectManagementProps> {
        return (
            <section className='formSection'>
                <Container fluid className="form-container">
                    <Row>
                        <Col md={12} className="mt-1">
                            <h2 className='fst-italic text-muted'>New Project</h2>
                        </Col>
                    </Row>
                    <Row className="mt-1">
                        <Col md={6}>
                            <Form.Group controlId="projectName">
                                <Row>
                                    <Col md={4} className="text-center mt-2">
                                        <Form.Label>Project Name</Form.Label>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Control size="sm" type="string" placeholder="Enter Project Name" value={this.state.projectName} onChange={(e) => this.handleChange(e, "string","projectName")} />
                                    </Col>
                                </Row>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="projectDescription">
                                <Row>
                                    <Col md={4} className="text-center mt-2">
                                        <Form.Label>Project Description</Form.Label>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Control size="sm" as="textarea" rows={3} value={this.state.projectDescription} onChange={(e) => this.handleChange(e, "string","projectDescription")} />
                                    </Col>
                                </Row>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="projectManager">
                                <Row>
                                    <Col md={4} className="text-center mt-2">
                                        <Form.Label>Project Manager</Form.Label>
                                    </Col>
                                    <Col md={6}>
                                        <PeoplePicker
                                            context={this.props.context as any}
                                            personSelectionLimit={1}
                                            groupName={""}
                                            showtooltip={false} 
                                            required={false}
                                            // defaultSelectedUsers={this.state.projectManager}
                                            principalTypes={[PrincipalType.User]}
                                            onChange={(e) => this.handleChange(e, "Person", "projectManager")}
                                        />
                                    </Col>
                                </Row>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="projectBA">
                                <Row>
                                    <Col md={4} className="text-center mt-2">
                                        <Form.Label>Project BA</Form.Label>
                                    </Col>
                                    <Col md={6}>
                                        <PeoplePicker
                                            context={this.props.context as any}
                                            personSelectionLimit={1}
                                            groupName={""}
                                            required={false}
                                            showHiddenInUI={false}
                                            principalTypes={[PrincipalType.User]}
                                            onChange={(e) => this.handleChange(e, "Person", "projectBA")} />
                                    </Col>
                                </Row>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="projectSME">
                                <Row>
                                    <Col md={4} className="text-center mt-2">
                                        <Form.Label>Project SME</Form.Label>
                                    </Col>
                                    <Col md={6}>
                                        <PeoplePicker
                                            context={this.props.context as any}
                                            personSelectionLimit={1}
                                            required={false}
                                            showHiddenInUI={false}
                                            principalTypes={[PrincipalType.User]}
                                            groupName={""}
                                            onChange={(e) => this.handleChange(e, "Person", "projectSME")} />
                                    </Col>
                                </Row>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="projectDevelopers">
                                <Row>
                                    <Col md={4} className="text-center mt-2">
                                        <Form.Label>Project Developers</Form.Label>
                                    </Col>
                                    <Col md={6}>
                                        <PeoplePicker
                                            context={this.props.context as any}
                                            personSelectionLimit={10}
                                            required={false}
                                            showHiddenInUI={false}
                                            principalTypes={[PrincipalType.User]}
                                            groupName={""}
                                            onChange={(e) => this.handleChange(e, "Person", "projectDevelopers")} />
                                    </Col>
                                </Row>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="expectedStartDate">
                                <Row>
                                    <Col md={4} className="text-center mt-2">
                                        <Form.Label>Expected Start Date</Form.Label>
                                    </Col>
                                    <Col md={6}>
                                        <DateTimePicker dateConvention={DateConvention.Date} showLabels={false} key="expectedStartDate" value={this.state.expectedStartDate} onChange={(date: Date) => this.setState({ expectedStartDate: date })} />
                                    </Col>
                                </Row>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="expectedEndDate">
                                <Row>
                                    <Col md={4} className="text-center mt-2">
                                        <Form.Label>Expected End Date</Form.Label>
                                    </Col>
                                    <Col md={6}>
                                        <DateTimePicker dateConvention={DateConvention.Date} showLabels={false} key="expectedEndDate" value={this.state.expectedEndDate} onChange={(date: Date) => this.setState({ expectedEndDate: date })} />
                                    </Col>
                                </Row>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="fileUpload">
                                <Row>
                                    <Col md={4} className="text-center mt-2">
                                        <Form.Label>Upload Documents</Form.Label>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Control type="file" multiple onChange={(e) => this.handleChange(e, "file", "fileUpload")}/>
                                    </Col>
                                </Row>
                            </Form.Group>
                        </Col>
                        <Row className="ButtonContent m-3">
                            <Button variant="primary" className="mr-2" size="sm" onClick={this.createProject}>Create Project</Button>
                            <Button variant="danger" size="sm" onClick={() => window.location.reload()}>Cancel</Button>
                        </Row>
                    </Row>
                </Container>
            </section>
        );
    }
}

