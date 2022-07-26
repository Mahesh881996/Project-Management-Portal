import * as React from 'react';
import styles from '../ProjectManagement.module.scss';
import { IProjectManagementProps } from '../IProjectManagementProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Card, Container, Row, Col,Button } from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faCirclePlus,faListDots } from '@fortawesome/free-solid-svg-icons'

export default class Home extends React.Component<any, any> {
    public render(): React.ReactElement<IProjectManagementProps> {
        const {
            description,
            isDarkTheme,
            environmentMessage,
            hasTeamsContext,
            userDisplayName
        } = this.props;

        return (
            <section className="w-100">
                <Container className='mt-5'>
                    <Row>
                        <Col md={2}>
                            <Card>
                            <FontAwesomeIcon icon={faCirclePlus} size="6x" className='mt-2'/>
                                <Card.Body className=" d-flex justify-content-center">
                                    <Button variant="primary">New Project</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={2}>
                            <Card>
                            <FontAwesomeIcon icon={faListDots} size="6x" className='mt-2'/>
                                <Card.Body className=" d-flex justify-content-center">
                                    <Button variant="primary">My Projects</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>
        );
    }
}
