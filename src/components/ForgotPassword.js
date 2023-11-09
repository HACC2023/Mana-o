import React, { useState } from 'react';
import axios from 'axios';
import './ForgotPassword.css';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // New state variable
    const [message, setMessage] = useState('');
    const [step, setStep] = useState(1);

    const sendVerificationCode = () => {
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
        <div className="centered-card centered">
            <div className="card">
                <h2 className= "title">Reset your password</h2>
                {step === 1 && (
                    <div>
                        <p>
                            Enter your user account's verified email address and we will send you verfication code.
                        </p>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <br/>
                        <button className="btn btn-primary custom-button"  onClick={sendVerificationCode}>Send Verification Code</button>
                    </div>
                )}
                {step === 2 && (
                    <div>
                        <input
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
                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <br/>
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <br/>
                        <button className="btn btn-primary custom-button" onClick={resetPassword}>Reset Password</button>
                    </div>
                )}
                {step === 4 && (
                    <div>
                        <p>Password reset successful!</p>
                    </div>
                )}
                {message && <div>{message}</div>}
            </div>
        </div>
    );
}

export default ForgotPassword;
