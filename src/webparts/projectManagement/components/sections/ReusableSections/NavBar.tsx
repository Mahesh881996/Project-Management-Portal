import * as React from "react";
import { Navbar,Container } from "react-bootstrap";
import styles from '../../ProjectManagement.module.scss';

export default class Navigation extends React.Component {
    render() {
        return (
            <section>
                <Navbar bg="light" expand="lg">
                    <Container fluid>
                        <Navbar.Brand href="#" className={styles.NavHeader}>
                            <img
                                alt="Logo"
                                src={require('../../../assets/BTLogo.svg')}
                                width="50"
                                height="30"
                                className="d-inline-block align-top"
                            />{' '}
                            Project Management Portal
                        </Navbar.Brand>
                    </Container>
                </Navbar>
            </section>
        )
    }
}