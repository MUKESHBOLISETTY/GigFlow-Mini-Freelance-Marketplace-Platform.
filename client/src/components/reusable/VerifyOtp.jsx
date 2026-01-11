import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { setEmail, setToken } from '../../redux/slices/authSlice';
const RESEND_SECONDS = 20;

const VerifyOtp = ({ setShowOtpPopup, email }) => {
    const [otp, setOtp] = useState('');
    const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
    const canResend = secondsLeft === 0;
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { verifyOtp, resendOtp } = useAuth();
    const { loading, navigation } = useSelector((state) => state.auth);

    useEffect(() => {
        if (secondsLeft === 0) return;

        const id = setInterval(() => {
            setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
        }, 1000);

        return () => clearInterval(id);
    }, [secondsLeft]);

    const handleResentOtp = async (e) => {
        e.preventDefault();
        if (!canResend) return;

        let type = "verifysignup"
        await resendOtp(email, type);
        setSecondsLeft(RESEND_SECONDS);
    }

    const handleOtpVerification = async (e) => {
        e.preventDefault();
        const response = await verifyOtp(email, otp);
        console.log(response)
        if (response.data.message === "otpverified") {
            toast.success('Otp Verified Successfully', {
                duration: 2000,
                position: 'bottom-right',
            });
            localStorage.setItem("token", response.data.data.token);
            localStorage.setItem("email", response.data.data.email);
            dispatch(setToken(response.data.data.token));
            dispatch(setEmail(response.data.data.email));
            if (navigation) {
                navigate(navigation)
            } else {
                navigate('/')
            }
            setShowOtpPopup(false);
            setOtp('');
        }
    };

    const closeOtpPopup = () => {
        setShowOtpPopup(false);
        setOtp('');
    };
    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                onClick={closeOtpPopup}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-serif font-bold text-gray-900">
                            Verify Your Email
                        </h2>
                        <button
                            onClick={closeOtpPopup}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <p className="text-gray-600 font-sans mb-6 text-center">
                        We've sent a verification code to your email address. Please enter it below to complete your registration.
                    </p>

                    <form onSubmit={handleOtpVerification} className="space-y-4">
                        <div>
                            <label className="block text-sm font-sans font-medium text-gray-700 mb-2">
                                Enter OTP
                            </label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-sans text-center text-lg tracking-widest"
                                placeholder="000000"
                                maxLength={6}
                                required
                            />
                        </div>

                        <p className="text-sm text-gray-600 text-center">
                            Didn't receive the code?{' '}
                            <button onClick={handleResentOtp} disabled={!canResend} type="button" className={`text-cyan-600 hover:text-cyan-700 font-medium ${canResend ? "text-cyan-600 hover:text-cyan-500" : "text-gray-400 cursor-not-allowed"}`}>
                                {canResend ? "Resend OTP" : `Resend in ${secondsLeft}s`}
                            </button>
                        </p>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full bg-cyan-600 text-white py-3 px-4 rounded-lg font-sans font-semibold hover:bg-cyan-700 transition-all duration-200 mt-6"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                            ) :
                                <>
                                    Verify & Complete Registration
                                </>}
                        </motion.button>
                    </form>
                </motion.div>
            </motion.div>
        </>
    )
}

export default VerifyOtp