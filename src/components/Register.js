import React, { useState, useRef } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";
import {Container} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Register.css';

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

const validName = (value) => {
    // Checks that the name contains at least 1 character
    if (value.length < 1) {
    return (
        <div className = "alert alert-danger custom-alert" role="alert">
            Name must be at least 1 character long.
        </div>
    );

    }
    // Checks that the name does not contain numbers
    if (/[0-9]/.test(value)) {
        return (
            <div className = "alert alert-danger custom-alert" role="alert">
                Name cannot contain numbers.
            </div>
        );
    }
    // Special characters that do not belong in an English name
    const specialCharacters = ['!','@','#','$','%','^','&','*','(', ')', ',','.','?','"',":","{",'}','|','<','>'];

    for (const char of specialCharacters) {
        if(value.includes(char)) {
            return (
                <div className = "alert alert-danger custom-alert" role="alert">
                    Name cannot contain special characters.
                </div>
            );
        }
    }

};
const validPhoneNumber = (value) => {
        
    if (value.length !== 12) {
        return (
            <div className = "alert alert-danger custom-alert" role="alert">
                Invalid phone number. Phone number must be in the format XXX-XXX-XXXX, where 'X' repesents a digit.
            </div>
        );
    } 
    else {
        return null;
    }

}
const validEmail = (value) => {
    if (!isEmail(value)){
        return (
            <div className="alert alert-danger custom-alert" role="alert">
                Not a valid email.
            </div>
        );
    }
};
const validPassword = (value) => {
    if (value.length < 6 || value.length > 40) {
        return (
            <div className="alert alert-danger custom-alert" role="alert">
                The password must be between 6 and 40 characters
            </div>
        );
    }
};

const Register = () => {
    const form = useRef();
    const checkBtn = useRef();
    let navigate = useNavigate;

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [message, setMessage] = useState("");
    const [successful, setSuccessful] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);

    const onChangeFirstName = (e) =>
    {
        const firstName = e.target.value;
        setFirstName(firstName);
    }
    const onChangeLastName = (e) =>
    {
        const lastName = e.target.value;
        setLastName(lastName);
    }
    const onChangePhoneNumber = (e) => {
        const phoneNumber = e.target.value;
        setPhoneNumber(phoneNumber);
    }
    const onChangeEmail = (e) => {
        const email = e.target.value;
        setEmail(email);
    }
    const onChangePassword = (e) => {
        const password = e.target.value.trim();
        setPassword(password);
    }
    const onChangeConfirmPassword = (e) => {
        const confirmPasswordValue = e.target.value.trim();
        setConfirmPassword(confirmPasswordValue);
        if (confirmPasswordValue !== password) {
            setPasswordMatch(false);
        }
        else {
            setPasswordMatch(true);
        }
    }
    const handleRegister = (e) => {
        e.preventDefault();
        setIsRegistering(true);
        setMessage("");
        setSuccessful(false);

        form.current.validateAll();

        if (form.current.getChildContext()._errors.length === 0){
            setIsRegistering(true);
            AuthService.register(firstName, lastName).then(
                (response) => {
                    setMessage(response.data.message);
                    setSuccessful(true);
                    navigate("/login");
                },
                (error) => {
                    const responseMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();

                        setMessage(responseMessage);
                        setSuccessful(false);
                }
            ).finally(() => {
                setIsRegistering(false);
            });
        }
        else {
            setIsRegistering(false);
        }
    };
    
    return(
        <div className = "register">
            <div className = "responsive">
                <Container className = "py-3">
                    <div className = "card">
                    <img src="/images/RegisterLogo.png" alt="register-logo-img" width="40%" height="40%"/>
                        <Form onSubmit={handleRegister} ref={form}>
                            <h3>First Name</h3>
                            <Input
                                type = "text"
                                value = {firstName}
                                onChange = {onChangeFirstName}
                                validations = {[required,validName]}
                                style={{textAlign:"center"}}
                            />
                            <br/>
                            <h3>Last Name</h3>
                            <Input
                                type = "text"
                                value = {lastName}
                                onChange = {onChangeLastName}
                                validations = {[required,validName]}
                                style={{textAlign:"center"}}
                            />
                            <br/>
                            <h3>Phone Number</h3>
                            <Input
                                type = "text"
                                placeholder = "XXX-XXX-XXXX"
                                value = {phoneNumber}
                                onChange = {onChangePhoneNumber}
                                validations = {[required, validPhoneNumber]}
                                style={{textAlign:"center"}}
                            />
                            <br/>
                            <h3>Email</h3>
                            <Input
                                type = "text"
                                value = {email}
                                onChange = {onChangeEmail}
                                validations = {[required, validEmail]}
                                style={{textAlign:"center"}}
                            />
                            <br/>
                            <h3>Password</h3>
                            <Input
                                type = "password"
                                value = {password}
                                onChange={onChangePassword}
                                validations = {[required, validPassword]}
                                style={{textAlign:"center"}}
                            />
                            <br/>
                            <h3>Confirm Password</h3>
                            <Input
                                type = "password"
                                value = {confirmPassword}
                                onChange = {onChangeConfirmPassword}
                                validations = {[required]}
                                style={{textAlign:"center"}}
                            />
                            <br/>
                            {!passwordMatch && (
                                <div className = "alert alert-danger custom-alert" role="alert">
                                    Passwords do not match.
                                </div>
                            )}
                            <button
                                className = "btn btn-primary btn block"
                                onClick={handleRegister}
                                disabled={isRegistering}
                                >
                                    {isRegistering && (
                                        <span className = "spinner-border spinner-border-sm"></span>
                                    )}
                                <span className="button-text-h3">{isRegistering ? "Registering":"Register"}</span>
                            </button>
                            {message && (
                                    <div className = {successful ? "alert alert-success":"alert alert-danger"} role="alert">
                                        {message}
                                    </div>
                                )}
                            <CheckButton style={{display:"none"}}ref={checkBtn}/>
                            <br/>
                        </Form>
                        <span>Already have an account?</span>
                        <Link className = "link" to="/login">Login</Link>
                    </div>
                </Container>
            </div>
        </div>
    );
};
export default Register;