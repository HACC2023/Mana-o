import React from "react";
import {Container} from "react-bootstrap";
import {Nav, NavItem} from "reactstrap";
import {NavLink} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMapLocationDot, faDroplet, faFile, faRightToBracket} from "@fortawesome/free-solid-svg-icons";
import './About.css';

const About = () => {
    const tabs = [
        {
            route : "/",
            icon: faMapLocationDot,
            label: "Map"
        },
        {
            route : "/about",
            icon: faDroplet,
            label: "About"
        },
        {
            route: "/dobor",
            icon: faFile,
            label: "DOBOR"
        },
        {
            route : "/login",
            icon: faRightToBracket,
            label: "Login"
        },

    ]
    return (
        <div className = "about">
            <div className = "responsive">
                <Container classNme = "py-3">
                    <div className = "card">
                        <div className = "landing-content">
                            <img src="/images/MalamaHonua_Piko.png" alt="malama-honua-logo-img" width="40%" height="40%"/>
                            <h1>About Mālama Honua</h1>
                            <p>
                                <b>Mālama Honua</b> means to "take care of the Earth" and
                                represents our commitment to a clean ocean and a healthy ecosystem.
                                This app is used for tracking large marine debris from detection to
                                its disposal or repurposing into recycled products.
                            </p>
                            <img src="/images/Manao_TeamLogo.png" alt="manao-team-logo" width="38%" height="38%"/>
                            <h1>About Manaʻo</h1>
                            <p>
                                Our team name <b>Manaʻo</b> means "thought" or "idea", as our goal is to gain
                                insight in solving complex real-world problems through software engineering.
                                Our mascot, also named Manaʻo, is a humpback whale. Humpback whales are symbols
                                of wisdom. The swirl behind Manaʻo and on his belly, represents his "piko"
                                or belly button. We use "piko" in our logo to represent the "purity" of clean water
                                and "new beginnings" in the collaborative efforts in pursuit of a cleaner future.
        
                            </p>
                            <img src="/images/CMDRLogo.png" alt="cmdr-logo" width="38%" height="38%"/>
                            <h1>About CMDR</h1>
                            <p>
                                The <b>Center for Marine Debris Research</b> at Hawai‘i Pacific University consists of commited
                                educators, scholars, and scientists who have devoted their careers to a trash-free ocean.
                                This app prototype is sponsored by CMDR for the HACC 2023 Challenge.
                            </p>
                        </div>
                    </div>
                    {/*Bottom Navigation Bar*/}
                    <nav className = "navbar fixed-bottom navbar-light bottom-tab-nav" role="navigation">
                        <Nav className = "w-100">
                            <div className = "d-flex flex-row justify-content-around w-100">
                                {
                                    tabs.map((tab, index) => (
                                        <NavItem key={`tab-${index}`}>
                                            <NavLink to={tab.route} className="nav-link bottom-nav-link" activeClassName="active">
                                                <div className="row d-flex flex-column justify-content-center align-items-center">
                                                    <FontAwesomeIcon size="lg" icon={tab.icon}/>
                                                    <div>{tab.label}</div>
                                                </div>
                                            </NavLink>
                                        </NavItem>
                                    ))
                                }
                            </div>
                        </Nav>
                    </nav>
                </Container>
            </div>
            
        </div>
    );

};
export default About;