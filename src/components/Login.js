import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { Nav, NavItem } from "reactstrap";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapLocationDot, faDroplet, faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope, faLock, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import "./Login.css";

import AuthService from "../services/auth.service";

const Login = () => {
    const tabs = [
        {
            route: "/",
            icon: faMapLocationDot,
            label: "Map",
        },
        {
            route: "/about",
            icon: faDroplet,
            label: "About",
        },
        {
            route: "/login",
            icon: faRightToBracket,
            label: "Login",
        },
    ];

    let navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const onChangeEmail = (e) => {
        const email = e.target.value;
        setEmail(email);
    };

    const onChangePassword = (e) => {
        const password = e.target.value;
        setPassword(password);
    };

    const handleLogin = (e) => {
        e.preventDefault();

        setMessage("");
        setLoading(true);

        if (!email || !password) {
            setMessage("Please fill out required fields!");
            setLoading(false);
        } else {
            AuthService.login(email, password).then(
                () => {
                    navigate("/home");
                    window.location.reload();
                    setEmail("");
                    setPassword("");
                },
                (error) => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();

                    setLoading(false);
                    setMessage(resMessage);
                }
            );
        }
    };

    return (
        <div className="login">
            <div className="responsive">
                <Container className="py-3">
                    <div className="card">
                        <Row>
                            <Col md={4} className="d-flex align-items-center">
                                <img
                                    src="/images/MalamaHonua_Piko.png"
                                    alt="malama-honua-logo-img"
                                    width="100%"
                                    height="auto"
                                />
                            </Col>
                            <Col md={8}>
                                <h3 className="mt-4 mb-4">Member Login</h3>
                                <form onSubmit={handleLogin}>
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            className="form-control mb-4"
                                            name="email"
                                            value={email}
                                            onChange={onChangeEmail}
                                            placeholder="Your email"
                                            style={{ textAlign: "center" }}
                                        />
                                    </div>
                                    <div className="form-group password-input-group">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            className="form-control mb-4"
                                            name="password"
                                            value={password}
                                            onChange={onChangePassword}
                                            placeholder="Your password"
                                            style={{ textAlign: "center" }}
                                        />
                                        <div className="password-toggle">
                                            <FontAwesomeIcon
                                                icon={showPassword ? faEyeSlash : faEye}
                                                onClick={togglePasswordVisibility}
                                            />
                                        </div>
                                    </div>
                                    <button className="btn btn-primary btn block mb-2" disabled={loading}>
                                        {loading && (
                                            <span className="spinner-border spinner-border-sm"></span>
                                        )}
                                        <span className="button-text-h3">Login</span>
                                    </button>
                                    {message && (
                                        <div className="form-group">
                                            <div className="alert alert-danger" role="alert">
                                                {message}
                                            </div>
                                        </div>
                                    )}
                                    <span className="mt-2 mb-2"  style={{ color: "black" }}>
                                        Don't have an account? <Link to="/register">Register</Link>
                                    </span>

                                    <Link to="/forgotpassword" className="mb-4" style={{ color: "red" }}>
                                        Forgot Password?
                                    </Link>
                                </form>
                            </Col>
                        </Row>
                    </div>
                    <nav className="navbar fixed-bottom navbar-light bottom-tab-nav" role="navigation">
                        <Nav className="w-100">
                            <div className="d-flex flex-row justify-content-around w-100">
                                {tabs.map((tab, index) => (
                                    <NavItem key={`tab-${index}`}>
                                        <NavLink to={tab.route} className="nav-link bottom-nav-link" activeClassName="active">
                                            <div className="row d-flex flex-column justify-content-center align-items-center">
                                                <FontAwesomeIcon size="lg" icon={tab.icon} />
                                                <div>{tab.label}</div>
                                            </div>
                                        </NavLink>
                                    </NavItem>
                                ))}
                            </div>
                        </Nav>
                    </nav>
                </Container>
            </div>
        </div>
    );
};

export default Login;
