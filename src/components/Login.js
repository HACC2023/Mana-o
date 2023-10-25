import React, { useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import {Link} from 'react-router-dom';
import {Container} from 'react-bootstrap'
import "./Login.css"

import AuthService from "../services/auth.service";

const required = (value) => {
    if (!value) {
      return (
        <div className="alert alert-danger" role="alert">
          This field is required!
        </div>
      );
    }
};
const Login = () => {
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
                      placeholder = "Email"
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
                      placeholder = "Password"
                    />
                    <br/>
                    <button className = "btn btn-primary btn block" disabled={loading}>
                      {loading && (
                        <span className = "spinner-border spinner-border-sm"></span>
                      )}
                      <span>Login</span>
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
              </Container>
            </div>      
        </div>
    );
};
export default Login;
