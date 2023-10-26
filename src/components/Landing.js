import React from "react";
import {Container} from "react-bootstrap";
import {Nav, NavItem} from "reactstrap";
import {NavLink} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMapLocationDot, faDroplet, faRightToBracket} from "@fortawesome/free-solid-svg-icons";
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
            route : "/login",
            icon: faRightToBracket,
            label: "Login"
        },

    ]
    return(
        <div className = "landing">
            <Container>
                {/*Landing page content*/}
                <div className = "landing-content">
                    <h1>Documented Locations of Significant Marine Debris</h1>
                <img src="/images/TemporaryMap.png" alt="placeholder-map-img" width="90%" height="90%"/>
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