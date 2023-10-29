import React, { useState, useRef } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import { isEmail } from "validator";
import { Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

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
    if (value.length < 1) {
        return (
            <div className="alert alert-danger custom-alert" role="alert">
                Name must be at least 1 character long.
            </div>
        );
    }

    if (/[0-9]/.test(value)) {
        return (
            <div className="alert alert-danger custom-alert" role="alert">
                Name cannot contain numbers.
            </div>
        );
    }

    const specialCharacters = [
        "!",
        "@",
        "#",
        "$",
        "%",
        "^",
        "&",
        "*",
        "(", ")",
        ",",
        ".",
        "?",
        '"',
        ":",
        "{",
        "}",
        "|",
        "<",
        ">",
    ];

    for (const char of specialCharacters) {
        if (value.includes(char)) {
            return (
                <div className="alert alert-danger custom-alert" role="alert">
                    Name cannot contain special characters.
                </div>
            );
        }
    }
};

const validPhoneNumber = (value) => {
    if (value.length !== 12) {
        return (
            <div className="alert alert-danger custom-alert" role="alert">
                Invalid phone number. Phone number must be in the format XXX-XXX-XXXX, where 'X' represents a digit.
            </div>
        );
    }
};

const validEmail = (value) => {
    if (!isEmail(value)) {
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
                The password must be between 6 and 40 characters.
            </div>
        );
    }
};

const Register = () => {
    const form = useRef();
    const checkBtn = useRef();
    let navigate = useNavigate();

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

    const onChangeFirstName = (e) => {
        const firstName = e.target.value;
        setFirstName(firstName);
    };

    const onChangeLastName = (e) => {
        const lastName = e.target.value;
        setLastName(lastName);
    };

    const onChangePhoneNumber = (e) => {
        const phoneNumber = e.target.value;
        setPhoneNumber(phoneNumber);
    };

    const onChangeEmail = (e) => {
        const email = e.target.value;
        setEmail(email);
    };

    const onChangePassword = (e) => {
        const password = e.target.value.trim();
        setPassword(password);
    };

    const onChangeConfirmPassword = (e) => {
        const confirmPasswordValue = e.target.value.trim();
        setConfirmPassword(confirmPasswordValue);
        if (confirmPasswordValue !== password) {
            setPasswordMatch(false);
        } else {
            setPasswordMatch(true);
        }
    };

    const handleRegister = (e) => {
        e.preventDefault();
        setIsRegistering(true);
        setMessage("");
        setSuccessful(false);

        form.current.validateAll();

        if (form.current.getChildContext()._errors.length === 0) {
            setIsRegistering(true);
            AuthService.register(firstName, lastName, email, phoneNumber, password).then(
                (response) => {
                    setMessage(response.data.message);
                    setSuccessful(true);
                    navigate("/login");
                },
                (error) => {
                    const responseMessage =
                        (error.response && error.response.data && error.response.data.message) ||
                        error.message ||
                        error.toString();

                    setMessage(responseMessage);
                    setSuccessful(false);
                }
            ).finally(() => {
                setIsRegistering(false);
            });
        } else {
            setIsRegistering(false);
        }
    };

    return (
        <div className="register">
            <div className="responsive">
                <Container className="py-3">
                    <div className="card">
                        <img src="/images/RegisterLogo.png" alt="register-logo-img" width="40%" height="40%" />
                        <Form onSubmit={handleRegister} ref={form}>
                            <div className="row">
                                <div className="col-md-6 mb-2">
                                    <div className="form-outline">
                                        <label className="form-label" htmlFor="firstName">
                                            First Name
                                        </label>
                                        <Input
                                            type="text"
                                            id="firstName"
                                            value={firstName}
                                            onChange={onChangeFirstName}
                                            validations={[required, validName]}
                                            style={{ textAlign: "center" }}
                                            className="form-control form-control-lg"
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6 mb-2">
                                    <div className="form-outline">
                                        <label className="form-label" htmlFor="lastName">
                                            Last Name
                                        </label>
                                        <Input
                                            type="text"
                                            id="lastName"
                                            value={lastName}
                                            onChange={onChangeLastName}
                                            validations={[required, validName]}
                                            style={{ textAlign: "center" }}
                                            className="form-control form-control-lg"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-2 pb-2">
                                    <div className="form-outline">
                                        <label className="form-label" htmlFor="emailAddress">
                                            Email
                                        </label>
                                        <Input
                                            type="email"
                                            id="emailAddress"
                                            value={email}
                                            onChange={onChangeEmail}
                                            validations={[required, validEmail]}
                                            style={{ textAlign: "center" }}
                                            className="form-control form-control-lg"
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6 mb-2 pb-2">
                                    <div className="form-outline">
                                        <label className="form-label" htmlFor="phoneNumber">
                                            Phone Number
                                        </label>
                                        <Input
                                            type="tel"
                                            id="phoneNumber"
                                            placeholder="XXX-XXX-XXXX"
                                            value={phoneNumber}
                                            onChange={onChangePhoneNumber}
                                            validations={[required, validPhoneNumber]}
                                            style={{ textAlign: "center" }}
                                            className="form-control form-control-lg"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-4 ">
                                <div className="col-md-6 pb-2">
                                    <div className="form-outline">
                                        <label className="form-label" htmlFor="retype-password">
                                            Password
                                        </label>
                                        <Input
                                            type="password"
                                            id="password"
                                            className="form-control form-control-lg"
                                            value={password}
                                            onChange={onChangePassword}
                                            validations={[required, validPassword]}
                                            style={{ textAlign: "center" }}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6 pb-2">
                                    <div className="form-outline">
                                        <label className="form-label" htmlFor="retype-password">
                                            Confirm Password
                                        </label>
                                        <Input
                                            type="password"
                                            id="retype-password"
                                            className="form-control form-control-lg"
                                            value={confirmPassword}
                                            onChange={onChangeConfirmPassword}
                                            validations={[required]}
                                            style={{ textAlign: "center" }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="pt-10 mb-3">
                                <button className="btn btn-primary custom-button" type="submit">
                                    {isRegistering ? "Registering..." : "Submit"}
                                </button>
                            </div>
                        </Form>
                        {message && (
                            <div className="form-group">
                                <div className={successful ? "alert alert-success" : "alert alert-danger"} role="alert">
                                    {message}
                                </div>
                            </div>
                        )}
                        <span className="mt-2  mb-5">
              Already have an account? <Link className="link" to="/login">
                Login
              </Link>
            </span>
                    </div>
                </Container>
            </div>
        </div>
    );
};

export default Register;
