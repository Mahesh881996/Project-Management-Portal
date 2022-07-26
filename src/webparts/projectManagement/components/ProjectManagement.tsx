import * as React from 'react';
import styles from './ProjectManagement.module.scss';
import { IProjectManagementProps } from './IProjectManagementProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { getSP } from '../Services/SPOps';
import Home from './sections/Home';
import { Nav, INavStyles, INavLinkGroup } from 'office-ui-fabric-react/lib/Nav'
import { HashRouter, Route, Link } from "react-router-dom";
import NewForm from '../components/sections/NewForm';
import MyProjects from './sections/MyProjects';
import Navigation from '../components/sections/ReusableSections/NavBar';
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import { Stack, IStackTokens } from 'office-ui-fabric-react/lib/Stack';
import { SPFI, spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/profiles";


const navStyles: Partial<INavStyles> = { root: { width: 200 } };
const stackTokens: IStackTokens = { childrenGap: 40 };
const navLinkGroups: INavLinkGroup[] = [
  {
    links: [
      {
        key: 'Home',
        name: 'Home',
        url: '#/',
      },
      {
        key: 'Project',
        name: 'New Project',
        url: '#/Project/New',
      },
      {
        key: 'MyProjects',
        name: 'My Projects',
        url: '#/MyProjects',
      },
    ],
  }
];

export default class ProjectManagement extends React.Component<IProjectManagementProps, any> {
  private _sp: SPFI;

  constructor(props) {
    super(props);

    this.state = {
      accountName: null,
      pictureUrl: null
    };
    this._sp = getSP();
  }

  public componentDidMount(): void {
    // read all file sizes from Documents library
    this._getMyDetails();
  }

  public render(): React.ReactElement<IProjectManagementProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      context,
      userDisplayName
    } = this.props;

    return (
      <section className={`${styles.projectManagement} ${hasTeamsContext ? styles.teams : ''}`}>

        <div className={styles.header}>
          <Container fluid>
            <Row>
              <Col md={3} className="d-flex">
                <a href='/'>
                  <img className={styles.headerImage} src="https://maheshofficelab.sharepoint.com/sites/ProjectManagementPortal/Resources/Images/BTLogo.svg" />
                </a>
              </Col>
              <Col md={6} className="justify-content-center">
                <h3>Project Management Portal</h3>
              </Col>
              <Col md={3}>
                <div className={styles.userDetails}>
                  <p className={styles.userTitle}>{this.state.accountName}</p>
                  <img src={this.state.pictureUrl} className={styles.userImage} />
                </div>
              </Col>
            </Row>
          </Container>
        </div>
        <Stack horizontal tokens={stackTokens}>
          <Nav styles={navStyles} ariaLabel="Nav example similiar to one found in this demo page" groups={navLinkGroups} />
          <HashRouter>
            <Route path="/" exact render={(props) => <Home {...props} context={this.props.context}/>}></Route>
            <Route path="/Project/:FormType/:Id?" render={(props) => <NewForm {...props} context={this.props.context}/>}></Route>
            <Route path="/MyProjects" render={(props) => <MyProjects {...props} context={this.props.context}/>}></Route>
          </HashRouter>
        </Stack>
      </section>
    );
  }

  private _getMyDetails = async (): Promise<void> => {
    const profile = await this._sp.profiles.myProperties();
    var props = {};
    profile.UserProfileProperties.forEach((prop) => {
      props[prop.Key] = prop.Value;
    });
    this.setState(
      {
        "accountName": props["PreferredName"],
        "pictureUrl": props["PictureURL"]
      }
    );
    console.log(this.state);
  }

}
