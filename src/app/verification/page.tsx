"use client";

import { useState } from "react";
import { Step1CheckEmail } from "@/components/shared-assets/email-verification/step-1-check-email";
import { Step2EnterCodeManually } from "@/components/shared-assets/email-verification/step-2-enter-code-manually";
import { Step3Success } from "@/components/shared-assets/email-verification/step-3-success";

type VerificationStep = 1 | 2 | 3;

const VerificationPage = () => {
    const [currentStep, setCurrentStep] = useState<VerificationStep>(1);

    const handleGoToStep2 = () => {
        setCurrentStep(2);
    };

    const handleGoToStep3 = () => {
        setCurrentStep(3);
    };

    const handleBackToLogin = () => {
        window.location.href = "/login";
    };

    const handleContinue = () => {
        window.location.href = "/dashboard";
    };

    return (
        <>
            {currentStep === 1 && <Step1CheckEmail onEnterCodeManually={handleGoToStep2} onBackToLogin={handleBackToLogin} />}
            {currentStep === 2 && <Step2EnterCodeManually onVerifyEmail={handleGoToStep3} onBackToLogin={handleBackToLogin} />}
            {currentStep === 3 && <Step3Success onContinue={handleContinue} onBackToLogin={handleBackToLogin} />}
        </>
    );
};

export default VerificationPage;
