import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import {Link} from "react-router-dom";
import {Container} from "react-bootstrap";
import {Nav, NavItem} from "reactstrap";
import {NavLink} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMapLocationDot, faDroplet, faRightToBracket} from "@fortawesome/free-solid-svg-icons";
import "./Login.css";

import AuthService from "../services/auth.service";

const required = (value) => {
    if (!value) {
      return (
        <div className="alert alert-danger custom-alert" role="alert">
          Required field!
        </div>
      );
    }
};
const Login = () => {
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
    let navigate = useNavigate();
  
    const form = useRef();      // form persists between rerenders
    const checkBtn = useRef();  // checkBtn persists between rerenders
  
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
  
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
  
      form.current.validateAll();
  
      if (checkBtn.current.context._errors.length === 0) {
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
      } else {
        setLoading(false);
      }
    };
    return (
        <div className = "login">
            <div className = "responsive">
              <Container className = "py-3">
                <div className = "card">
                  <img src="/images/MalamaHonua_Piko.png" alt="malama-honua-logo-img" width="40%" height="40%"/>
                  <Form onSubmit = {handleLogin} ref = {form}>
                    <h3>Email</h3>
                    <Input
                      type = "text"
                      className = "form-control"
                      name = "email"
                      value = {email}
                      onChange = {onChangeEmail}
                      validations = {[required]}
                      placeholder = "Your email"
                      style={{textAlign:"center"}}
                    />
                    <br/>
                    <h3>Password</h3>
                    <Input
                      type = "password"
                      className = "form-control"
                      name = "password"
                      value = {password}
                      onChange = {onChangePassword}
                      validations = {[required]}
                      placeholder = "Your password"
                      style={{textAlign:"center"}}
                    />
                    <br/>
                    <button className = "btn btn-primary btn block" disabled={loading}>
                      {loading && (
                        <span className = "spinner-border spinner-border-sm"></span>
                      )}
                      <span className = "button-text-h3">Login</span>
                    </button>
                    {message && (
                      <div className = "form-group">
                        <div className = "alert alert-danger" role = "alert">
                          {message}
                        </div>
                      </div>
                    )}
                    <span> Don't have an acount?</span>
                    <Link to = "/register">Register</Link>
                    <CheckButton style={{display:"none"}}ref={checkBtn}/>
                  </Form>

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
export default Login;
