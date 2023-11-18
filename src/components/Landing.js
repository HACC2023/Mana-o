import React from "react";
import {Container} from "react-bootstrap";
import {Nav, NavItem} from "reactstrap";
import {NavLink} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMapLocationDot, faDroplet, faFile, faRightToBracket} from "@fortawesome/free-solid-svg-icons";
import "./Landing.css";

const Landing = () => {
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
    return(
        <div className = "landing" style={{height: '100%'}}>
            <Container>
                {/*Landing page content*/}
                <div className = "landing-content" width="100%" height="100%">
                    <h1>Documented Locations of Significant Marine Debris</h1>
                    <iframe frameborder='0' locate={1} add={1} style={{width: '100%', height:'700px'}}
                        x={-157.88} y={22.426}
                        src='//www.zeemaps.com/pub?group=4844737'> </iframe>
                </div>
            </Container>
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
        </div>
    );
};
export default Landing;