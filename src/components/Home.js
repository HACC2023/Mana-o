import AuthService from '../services/auth.service';
import { useNavigate } from 'react-router-dom';
import UserService from '../services/user.service';
import { Chart } from "react-google-charts";


import React, {useState, useEffect} from 'react';
import {
    MDBCol,
    MDBContainer,
    MDBRow,
    MDBCard,
    MDBCardText,
    MDBCardBody,
    MDBCardImage,
    MDBBtn,
    MDBBreadcrumb,
    MDBBreadcrumbItem,
    MDBProgress,
    MDBProgressBar,
    MDBIcon,
    MDBListGroup,
    MDBListGroupItem
} from 'mdb-react-ui-kit';

export default function Home() {
    const currentUser = AuthService.getCurrentUser();
    const navigate = useNavigate();
    const [detectionsData, setDetectionsData] = useState([]);
    const [error, setError] = useState(null);
    const [islandTypeCounts, setIslandTypeCounts] = useState(null);
    const [debrisCounts, setDebrisCounts] = useState();

    const islandTypeCountsToChartData = (islandTypeCounts) => {
        const chartData = [['Island', 'Debris Type Count']];

        for (const island in islandTypeCounts) {
            const total = Object.values(islandTypeCounts[island]).reduce((acc, count) => acc + count, 0);
            chartData.push([island, total]);
        }

        return chartData;
    };
    const getIslandData = (targetIsland) => {
        const chartData = [['Debris Type', 'Count']];

        if (islandTypeCounts && islandTypeCounts[targetIsland]) {
            const debrisCounts = islandTypeCounts[targetIsland];
            Object.entries(debrisCounts).forEach(([debrisType, count]) => {
                chartData.push([debrisType, count]);
            });
        }

        return chartData;
    };
    const getAllIslandData = () => {
        const allIslandCharts = [];

        for (const island in islandTypeCounts) {
            const islandData = getIslandData(island);

            allIslandCharts.push(
                <MDBCol>
                <Chart
                    key={island}
                    chartType="ColumnChart"
                    width="100%"
                    height="400px"
                    data={islandData}
                    options={{ title: `${island} Debris Distribution` }}
                />
                </MDBCol>
            );
        }

        return allIslandCharts;
    };
    const fetchData = async () => {
        try {
            const response = await UserService.getDetections();
            const detectionsData = response.data;
            setDetectionsData(detectionsData);
        } catch (err) {
            console.error('Error fetching detections data:', err);
            setError(err);
        }
    }


    useEffect(() => {
        fetchData();
    }, []);


    useEffect(() => {
        const allDebrisTypes = detectionsData.reduce((types, detection) => {
            return types.concat(detection.debris_type_detected);
        }, []);

        const uniqueDebrisTypes = [...new Set(allDebrisTypes)];
        const uniqueIslands = [...new Set(detectionsData.reduce((acc, detection) => {
            if (detection.island) {
                acc.push(detection.island);
            }
            return acc;
        }, []))];


        console.log('Unique Debris Types:', uniqueDebrisTypes);
        console.log('Unique island', uniqueIslands);
        const islandTypeCounts = {};

        detectionsData.forEach((detection) => {
            const { island, debris_type_detected } = detection;

            if (island && debris_type_detected) {
                if (!islandTypeCounts[island]) {
                    islandTypeCounts[island] = {};
                }

                if (!islandTypeCounts[island][debris_type_detected]) {
                    islandTypeCounts[island][debris_type_detected] = 1;
                } else {
                    islandTypeCounts[island][debris_type_detected]++;
                }
            }
        });

        console.log(islandTypeCounts);
        setIslandTypeCounts(islandTypeCounts);
    }, [detectionsData]);

    useEffect(() => {
        const debrisCounts = processData();
        console.log('Debris Counts:', debrisCounts);
    }, [detectionsData]);
    const processData = () => {
        const debrisCounts = {};
        detectionsData.forEach((detection) => {
            const debrisType = detection.debris_type_detected;
            if(!debrisCounts[debrisType]) {
                debrisCounts[debrisType] = 1;
            }
            else {
                debrisCounts[debrisType] ++;
            }
        });
        console.log("Debris Counts:", debrisCounts);
        setDebrisCounts(debrisCounts);
        return debrisCounts;
    }

    return (
        <section style={{ backgroundColor: '#eee' }}>
            <MDBContainer className="py-5">
                <MDBRow>
                    <MDBCol>
                        <MDBBreadcrumb className="bg-light rounded-3 p-3 mb-4">
                            <MDBBreadcrumbItem>
                                <a href='#'> <strong>{currentUser.first_name} {currentUser.last_name}'s</strong> Homepage</a>
                            </MDBBreadcrumbItem>
                            <MDBBreadcrumbItem>
                                <a href="#">User</a>
                            </MDBBreadcrumbItem>
                        </MDBBreadcrumb>
                    </MDBCol>
                </MDBRow>

                <MDBRow>
                    <MDBCol lg="4">
                        <MDBCard className="mb-4">
                            <MDBCardBody className="text-center">
                            <img
                                src="/images/ProfileIcon.png"
                                alt="malama-honua-nav"
                                width="100px"
                            />
                                <p className="text-muted mb-1">{currentUser.first_name} {currentUser.last_name}</p>
                                <p className="text-muted mb-4">{currentUser.company}</p>
                                <div className="d-flex justify-content-center mb-2">
                                    <MDBBtn outline className="ms-1" onClick={() => navigate('/message')}>Message</MDBBtn>
                                </div>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                    <MDBCol lg="8">
                        <MDBCard className="mb-4">
                            <MDBCardBody>
                                <MDBRow>
                                    <MDBCol sm="3">
                                        <MDBCardText>Full Name</MDBCardText>
                                    </MDBCol>
                                    <MDBCol sm="9">
                                        <MDBCardText className="text-muted">{currentUser.first_name} {currentUser.last_name}</MDBCardText>
                                    </MDBCol>
                                </MDBRow>
                                <hr />
                                <MDBRow>
                                    <MDBCol sm="3">
                                        <MDBCardText>Email</MDBCardText>
                                    </MDBCol>
                                    <MDBCol sm="9">
                                        <MDBCardText className="text-muted">{currentUser.email}</MDBCardText>
                                    </MDBCol>
                                </MDBRow>
                                <hr />
                                <MDBRow>
                                    <MDBCol sm="3">
                                        <MDBCardText>Phone</MDBCardText>
                                    </MDBCol>
                                    <MDBCol sm="9">
                                        <MDBCardText className="text-muted">{currentUser.phone_number}</MDBCardText>
                                    </MDBCol>
                                </MDBRow>
                                <hr />
                                <MDBRow>
                                    <MDBCol sm="3">
                                        <MDBCardText>Role</MDBCardText>
                                    </MDBCol>
                                    <MDBCol sm="9">
                                        <MDBCardText className="text-muted">{currentUser.roles.includes('admin')?"Admin":"User"}</MDBCardText>
                                    </MDBCol>
                                </MDBRow>

                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
                <MDBRow style={{ padding: '20px' }}>
                    <MDBCol>
                    <Chart
                        chartType="PieChart"
                        data={islandTypeCountsToChartData(islandTypeCounts)}
                        options={{ title: 'Island Debris Distribution' }}
                        width={'100%'}
                        height={'380px'}
                    />
                    </MDBCol>
                    <MDBCol>
                        {debrisCounts && (
                            <Chart
                                chartType="BarChart"
                                data={[
                                    ['Debris Type', 'Count'],
                                    ...Object.entries(debrisCounts).map(([type, count]) => [type, count]),
                                ]}
                                options={{ title: 'Debris Types' }}
                                width={'100%'}
                                height={'400px'}
                            />
                        )}
                    </MDBCol>

                </MDBRow>
                <MDBRow>
                    {getAllIslandData()}
                </MDBRow>

            </MDBContainer>
        </section>
    );
}
