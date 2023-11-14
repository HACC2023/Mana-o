import React, {useState} from 'react';
import axios from 'axios';
import './ForgotPassword.css';
import {useNavigate} from "react-router-dom";

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // New state variable
    const [message, setMessage] = useState('');
    const [step, setStep] = useState(1);
    const [isSendButtonDisabled, setIsSendButtonDisabled] = useState(false);
    const [sendButtonText, setSendButtonText] = useState("Send Verification Code");
    let navigate = useNavigate();
    const handleLoginClick = () => {
        navigate('/login');
    };

    const sendVerificationCode = () => {
        setIsSendButtonDisabled(true);
        setSendButtonText("Sending...");
        axios
            .post('http://localhost:8080/reset', {
                email,
            })
            .then((response) => {
                setMessage(response.data.message);
                setStep(2);
            })
            .catch((error) => {
                setMessage(error.response.data.message);
            })
            .finally(() => {
                setIsSendButtonDisabled(false);
                setSendButtonText("Send Verification Code");
            });
    };

    const verifyCode = () => {
        axios
            .post('http://localhost:8080/verify', {
                email,
                code: verificationCode,
            })
            .then((response) => {
                setMessage(response.data.message);
                setStep(3);
            })
            .catch((error) => {
                setMessage(error.response.data.message);
            });
    };

    const resetPassword = () => {
        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        axios
            .post('http://localhost:8080/changepassword', {
                email,
                newPassword,
            })
            .then((response) => {
                setMessage(response.data.message);
                setStep(4);
            })
            .catch((error) => {
                setMessage(error.response.data.message);
            });
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-card">
                <img src="/images/ForgotPassword.jpeg" alt="forgot-password-img" width="50%" height="50%"/>
                <h2 className="forgot-password-title">Reset your password</h2>
                {step === 1 && (
                    <div>
                        <p>
                            Enter your user account's verified email address and we will send you verfication code.
                        </p>
                        <input
                            className="forgot-password-input"
                            type="email"
                            placeholder="Enter Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <br/>
                        <button className="btn btn-primary custom-button send-verification-button"
                                onClick={sendVerificationCode} disabled={isSendButtonDisabled}>  {sendButtonText}
                        </button>
                    </div>
                )}
                {step === 2 && (
                    <div>
                        <input
                            className="forgot-password-input"
                            type="text"
                            placeholder="Enter Verification Code"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                        />
                        <br/>
                        <button className="btn btn-primary custom-button" onClick={verifyCode}>Verify Code</button>
                    </div>
                )}
                {step === 3 && (
                    <div>
                        <p>Enter your new password</p>
                        <input
                            className="forgot-password-input"
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <br/>
                        <input
                            className="forgot-password-input"
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <br/>
                        <button className="forgot-password-custom-button" onClick={resetPassword}>Reset Password
                        </button>
                    </div>
                )}
                {step === 4 && (
                    <div>
                        <p>Now you can login with new passowrd</p>
                        <button className="forgot-password-custom-button" onClick={handleLoginClick}>
                            Login
                        </button>
                    </div>
                )}
                {message && <div>{message}</div>}
            </div>
        </div>
    );
}

export default ForgotPassword;
