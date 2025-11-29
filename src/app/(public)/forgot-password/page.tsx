"use client";

import { useState } from "react";
import { Step1ForgotPassword } from "@/app/(public)/forgot-password/step-1-forgot-password";
import { Step2CheckEmail } from "@/app/(public)/forgot-password/step-2-check-email";
import { Step3SetNewPassword } from "@/app/(public)/forgot-password/step-3-set-new-password";
import { Step4Success } from "@/app/(public)/forgot-password/step-4-success";

type ForgotPasswordStep = 1 | 2 | 3 | 4;

const ForgotPasswordPage = () => {
    const [currentStep, setCurrentStep] = useState<ForgotPasswordStep>(1);
    const [email, setEmail] = useState<string>("");

    const handleGoToStep2 = (userEmail: string) => {
        setEmail(userEmail);
        setCurrentStep(2);
    };

    const handleGoToStep3 = () => {
        setCurrentStep(3);
    };

    const handleGoToStep4 = () => {
        setCurrentStep(4);
    };

    const handleBackToLogin = () => {
        window.location.href = "/login";
    };

    const handleContinue = () => {
        window.location.href = "/login";
    };

    return (
        <>
            {currentStep === 1 && <Step1ForgotPassword onResetPassword={handleGoToStep2} onBackToLogin={handleBackToLogin} />}
            {currentStep === 2 && <Step2CheckEmail email={email} onContinue={handleGoToStep3} onBackToLogin={handleBackToLogin} />}
            {currentStep === 3 && <Step3SetNewPassword onResetSuccess={handleGoToStep4} onBackToLogin={handleBackToLogin} />}
            {currentStep === 4 && <Step4Success onContinue={handleContinue} onBackToLogin={handleBackToLogin} />}
        </>
    );
};

export default ForgotPasswordPage;
