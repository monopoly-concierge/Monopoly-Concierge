import { useState, useEffect } from 'react';

const useMultiStepForm = (formKey, steps) => {
    const savedData = JSON.parse(sessionStorage.getItem(formKey)) || {};
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState(savedData);

    useEffect(() => {
        sessionStorage.setItem(formKey, JSON.stringify(formData));
    }, [formData, formKey]);

    const nextStep = () => {
        if (step < steps.length - 1) setStep(step + 1);
    };

    const prevStep = () => {
        if (step > 0) setStep(step - 1);
    };

    const updateFormData = (field, value) => {
        setFormData((prevData) => ({ ...prevData, [field]: value }));
    };

    return { step, nextStep, prevStep, formData, updateFormData };
};

export default useMultiStepForm;
