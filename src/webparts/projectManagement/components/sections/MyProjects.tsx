import * as React from 'react';
import styles from '../ProjectManagement.module.scss';
import { IProjectManagementProps } from '../IProjectManagementProps';
import { MyProjectsState } from './States/MyProjectsState';
import { getListItems, getSP } from '../../Services/SPOps';
import { IColumn, DetailsList, SelectionMode, DetailsListLayoutMode, mergeStyles, Image, ImageFit } from '@fluentui/react'; import { IDocument } from './Interfaces/MyProjectsInterface';
import * as moment from 'moment';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search, CSVExport } from 'react-bootstrap-table2-toolkit';
import { Container, Row, Form, Col, Button } from 'react-bootstrap';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import { Link } from 'react-router-dom';


const Mcolumns = [{
    dataField: 'Id',
    text: 'Id',
    align: 'center',
    sort: true,
    headerStyle: (colum, colIndex) => {
        return { width: '20px', textAlign: 'center' };
      }
},
{
    dataField: 'Title',
    text: 'Product Name',
    headerStyle: (colum, colIndex) => {
        return { width: '80px', textAlign: 'center' };
      }
},
{
    dataField: 'ProjectManager',
    text: 'Project Manager',
    headerStyle: (colum, colIndex) => {
        return { width: '80px', textAlign: 'center' };
      }
},
{
    dataField: 'ProjectSME',
    text: 'Project SME',
    headerStyle: (colum, colIndex) => {
        return { width: '80px', textAlign: 'center' };
      }
},
{
    dataField: 'ProjectBA',
    text: 'Project BA',
    headerStyle: (colum, colIndex) => {
        return { width: '80px', textAlign: 'center' };
      }
},
{
    dataField: 'ProjectDevelopers',
    text: 'Project Developers',
    headerStyle: (colum, colIndex) => {
        return { width: '80px', textAlign: 'center' };
      }
},
{
    dataField: 'ExpectedStartDate',
    text: 'Start Date',
    headerStyle: (colum, colIndex) => {
        return { width: '80px', textAlign: 'center' };
      }
},
{
    dataField: 'ExpectedEndDate',
    text: 'End Date',
    headerStyle: (colum, colIndex) => {
        return { width: '80px', textAlign: 'center' };
      }
},
{
    dataField: 'ProjectStatus',
    text: 'Project Status',
    headerStyle: (colum, colIndex) => {
        return { width: '80px', textAlign: 'center' };
      }
},
{
    dataField:'Id',
    text: 'Action',
    align: 'center',
    formatter : (cell,row) => {
        return (<Link to={`/Project/Edit/${row.Id}`}><FontAwesomeIcon icon={faPenToSquare} size="1x" /></Link>);
    },
    headerStyle: (colum, colIndex) => {
        return { width: '30px', textAlign: 'center' };
      },
    events:{
        onClick: (e, column, columnIndex, row, rowIndex) => {
            console.log(row);
        }
    }
}];
const { SearchBar, ClearSearchButton } = Search;
const { ExportCSVButton } = CSVExport;

export default class MyProjects extends React.Component<IProjectManagementProps, MyProjectsState> {
    constructor(props) {
        super(props);
        const columns: IColumn[] = [
            {
                key: 'Id',
                name: 'ID',
                fieldName: 'Id',
                minWidth: 16,
                maxWidth: 16

            },
            {
                key: 'Title',
                name: 'Project Name',
                fieldName: 'Title',
                minWidth: 210,
                maxWidth: 350,
                isRowHeader: true,
                isResizable: true,
                data: 'string',
                isPadded: true,
            },
            {
                key: 'ProjectManager',
                name: 'Project Manager',
                fieldName: 'ProjectManager',
                minWidth: 210,
                maxWidth: 350,
                isRowHeader: true,
                isResizable: true,
                data: 'string',
                isPadded: true,
            },
            {
                key: 'ProjectSME',
                name: 'Project SME',
                fieldName: 'ProjectSME',
                minWidth: 210,
                maxWidth: 350,
                isRowHeader: true,
                isResizable: true,
                data: 'string',
                isPadded: true,
            },
            {
                key: 'ProjectBA',
                name: 'Project BA',
                fieldName: 'ProjectBA',
                minWidth: 210,
                maxWidth: 350,
                isRowHeader: true,
                isResizable: true,
                data: 'string',
                isPadded: true,
            },
            {
                key: 'ProjectDevelopers',
                name: 'Project Developers',
                fieldName: 'ProjectDevelopers',
                minWidth: 210,
                maxWidth: 350,
                isRowHeader: true,
                isResizable: true,
                data: 'string',
                isPadded: true,
            },
            {
                key: 'ExpectedStartDate',
                name: 'Start Date',
                fieldName: 'ExpectedStartDate',
                minWidth: 210,
                maxWidth: 350,
                isRowHeader: true,
                isResizable: true,
                data: 'string',
                isPadded: true,
            },
            {
                key: 'ExpectedEndDate',
                name: 'End Date',
                fieldName: 'ExpectedEndDate',
                minWidth: 210,
                maxWidth: 350,
                isRowHeader: true,
                isResizable: true,
                data: 'string',
                isPadded: true,
            },
            {
                key: 'ProjectStatus',
                name: 'Project Status',
                fieldName: 'ProjectStatus',
                minWidth: 210,
                maxWidth: 350,
                isRowHeader: true,
                isResizable: true,
                data: 'string',
                isPadded: true,
            }
        ];
        this.state = {
            projects: [],
            columns: columns
        };

    }

    async getProjectsData() {
        await getListItems("Projects", "*,ProjectManager/Title,ProjectManager/EMail,ProjectManager/Id,ProjectSME/Title,ProjectSME/EMail,ProjectSME/Id,ProjectDevelopers/Id,ProjectDevelopers/Title,ProjectDevelopers/EMail,ProjectBA/EMail,ProjectBA/Title,ProjectBA/Id", "ProjectManager,ProjectSME,ProjectDevelopers,ProjectBA").then(result => this.setState({ "projects": _generateTableData(result) }));
    }

    componentDidMount() {
        this.getProjectsData();
    }

    render(): React.ReactElement<IProjectManagementProps> {
        return (
            <Container fluid>
                <Row>
                        <Col md={12} className="mt-1">
                            <h2 className='fst-italic text-muted'>My Projects</h2>
                        </Col>
                    </Row>
                {/* <div style={{ overflow: 'auto', border: "1px solid black" }}>
                    <DetailsList
                    items={this.state.projects}
                    compact={false}
                    columns={this.state.columns}
                    selectionMode={SelectionMode.none}
                    setKey="set"
                    layoutMode={DetailsListLayoutMode.justified}
                    isHeaderVisible={true}
                />
                </div> */}
                <BootstrapTable keyField='Id' data={this.state.projects} columns={Mcolumns} bootstrap4={true} pagination={paginationFactory()} />

            </Container>
        );
    }
}

function _generateTableData(data: any): any {
    const items: IDocument[] = [];
    data.forEach(val => {
        items.push({
            "Id": val.Id,
            "Title": val.Title,
            "ProjectManager": val.ProjectManager.Title,
            "ProjectSME": val.ProjectSME.Title,
            "ProjectBA": val.ProjectBA.Title,
            "ProjectDevelopers": val.ProjectDevelopers.map(function (k) { return k.Title }).join(";"),
            "ExpectedStartDate": moment(val.ExpectedStartDate).format("MM-DD-YYYY"),
            "ExpectedEndDate": moment(val.ExpectedEndDate).format("MM-DD-YYYY"),
            "ProjectStatus": val.ProjectStatus
        });
    });

    return items;
}