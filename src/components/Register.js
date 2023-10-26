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
        <div className="alert alert-danger" role="alert">
          Required field!
        </div>
      );
    }
  };

const validName = (value) => {
    // Checks that the name contains at least 1 character
    if (value.length < 1) {
    return (
        <div className = "alert alert-danger" role="alert">
            Name must be at least 1 character long.
        </div>
    );

    }
    // Checks that the name does not contain numbers
    if (/[0-9]/.test(value)) {
        return (
            <div className = "alert alert-danger" role="alert">
                Name cannot contain numbers.
            </div>
        );
    }
    // Special characters that do not belong in an English name
    const specialCharacters = ['!','@','#','$','%','^','&','*','(', ')', ',','.','?','"',":","{",'}','|','<','>'];

    for (const char of specialCharacters) {
        if(value.includes(char)) {
            return (
                <div className = "alert alert-danger" role="alert">
                    Name cannot contain special characters.
                </div>
            );
        }
    }

};

const Register = () => {
    const form = useRef();
    const checkBtn = useRef();
    let navigate = useNavigate;

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [message, setMessage] = useState("");
    const [successful, setSuccessful] = useState(false);

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

    const handleRegister = (e) => {
        e.preventDefault();
        setMessage("");
        setSuccessful(false);

        if (checkBtn.current.context._errors.length === 0){
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
            );
        }
    };
    return(
        <div className = "register">
            <div className = "responsive">
                <Container className = "py-3">
                    <div className = "card">
                        <h1>Register</h1>
                        <Form onSumbit={handleRegister} ref={form}>
                            <h3>First Name</h3>
                            <Input
                                type = "text"
                                value = {firstName}
                                onChange = {onChangeFirstName}
                                validations = {[required,validName]}
                            />
                            <h3>Last Name</h3>
                            <Input
                                type = "text"
                                value = {lastName}
                                onChange = {onChangeLastName}
                                validations = {[required,validName]}
                            />
                        </Form>
                    </div>
                </Container>
            </div>
        </div>
    );
};
export default Register;