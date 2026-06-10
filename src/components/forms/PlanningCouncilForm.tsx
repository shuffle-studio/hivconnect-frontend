import { useState, useEffect, useRef } from 'react';

declare global {
  interface Window {
    turnstile: {
      render: (container: HTMLElement, options: { sitekey: string; callback: (token: string) => void }) => string;
      remove: (widgetId: string) => void;
    };
  }
}
import Step1PersonalInfo from './steps/Step1PersonalInfo';
import Step2Demographics from './steps/Step2Demographics';
import Step3Services from './steps/Step3Services';
import Step4Experience from './steps/Step4Experience';
import Step5Commitment from './steps/Step5Commitment';
import ProgressBar from './ProgressBar';

export interface FormData {
  // Personal Info
  firstName: string;
  lastName: string;
  birthMonth: string;
  birthDay: string;
  birthYear: string;
  streetAddress: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  email: string;
  confirmEmail: string;
  homePhone: string;
  cellPhone: string;
  bestTimeToCall: string;
  
  // Employment
  isEmployed: boolean;
  employers: string;
  jobTitle: string;
  companyAddress: string;
  companyAddressLine2: string;
  companyCity: string;
  companyState: string;
  companyZipCode: string;
  
  // Mailing Lists
  mailingLists: string[];
  
  // Demographics
  receivedRyanWhiteServices: boolean;
  gender: string;
  age: string;
  raceEthnicity: string;
  languages: string[];
  diverseExperience: string[];
  
  // Services
  serviceProviders: string[];
  needsAssistance: boolean;
  assistanceDescription: string;
  
  // Experience
  whyJoinPlanningCouncil: string;
  hivAidsExperience: string;
  backgroundExperience: string;
  eligibilityInfo: string;
  membershipCategories: string[];
  experienceInterests: string[];
  
  // Commitment
  agreedToCommitments: boolean;
  consentGiven: boolean;
}

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  birthMonth: '',
  birthDay: '',
  birthYear: '',
  streetAddress: '',
  addressLine2: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'United States',
  email: '',
  confirmEmail: '',
  homePhone: '',
  cellPhone: '',
  bestTimeToCall: '',
  isEmployed: false,
  employers: '',
  jobTitle: '',
  companyAddress: '',
  companyAddressLine2: '',
  companyCity: '',
  companyState: '',
  companyZipCode: '',
  mailingLists: [],
  receivedRyanWhiteServices: false,
  gender: '',
  age: '',
  raceEthnicity: '',
  languages: [],
  diverseExperience: [],
  serviceProviders: [],
  needsAssistance: false,
  assistanceDescription: '',
  whyJoinPlanningCouncil: '',
  hivAidsExperience: '',
  backgroundExperience: '',
  eligibilityInfo: '',
  membershipCategories: [],
  experienceInterests: [],
  agreedToCommitments: false,
  consentGiven: false,
};

export default function PlanningCouncilForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [turnstileToken, setTurnstileToken] = useState('');
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetId = useRef<string | null>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, []);

  useEffect(() => {
    if (currentStep !== 5 || !turnstileContainerRef.current) return;
    const siteKey = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY as string | undefined;
    if (!siteKey) return;

    const renderWidget = () => {
      if (!window.turnstile || !turnstileContainerRef.current) return;
      if (turnstileWidgetId.current) {
        window.turnstile.remove(turnstileWidgetId.current);
      }
      turnstileWidgetId.current = window.turnstile.render(turnstileContainerRef.current, {
        sitekey: siteKey,
        callback: (token: string) => setTurnstileToken(token),
      });
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      const interval = setInterval(() => {
        if (window.turnstile) {
          clearInterval(interval);
          renderWidget();
        }
      }, 100);
      return () => clearInterval(interval);
    }

    return () => {
      if (turnstileWidgetId.current && window.turnstile) {
        window.turnstile.remove(turnstileWidgetId.current);
        turnstileWidgetId.current = null;
      }
    };
  }, [currentStep]);

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: {[key: string]: string} = {};

    switch (step) {
      case 1:
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (formData.email !== formData.confirmEmail) newErrors.confirmEmail = 'Emails do not match';
        if (!formData.streetAddress.trim()) newErrors.streetAddress = 'Street address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
        break;
      case 2:
        if (!formData.gender) newErrors.gender = 'Gender is required';
        if (!formData.age) newErrors.age = 'Age is required';
        if (!formData.raceEthnicity) newErrors.raceEthnicity = 'Race/Ethnicity is required';
        if (formData.languages.length === 0) newErrors.languages = 'At least one language is required';
        break;
      case 4:
        if (!formData.whyJoinPlanningCouncil.trim()) newErrors.whyJoinPlanningCouncil = 'Please explain why you want to join';
        if (!formData.hivAidsExperience.trim()) newErrors.hivAidsExperience = 'Please describe your HIV/AIDS experience';
        if (formData.membershipCategories.length === 0) newErrors.membershipCategories = 'Please select at least one membership category';
        break;
      case 5:
        if (!formData.agreedToCommitments) newErrors.agreedToCommitments = 'You must agree to the commitments';
        if (!formData.consentGiven) newErrors.consentGiven = 'You must provide consent';
        if (!turnstileToken) newErrors.turnstile = 'Please complete the security check below';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (validateStep(currentStep)) {
      try {
        // Get API base URL from environment
        const PAYLOAD_URL = import.meta.env.PUBLIC_PAYLOAD_URL || 'https://login.hivconnectcentralnj.com';
        const API_BASE_URL = `${PAYLOAD_URL}/api`;

        // Map form data to the backend's flat membership-applications schema.
        // Field names match the backend collection exactly. Multi-select values
        // are sent as Payload array rows ({ subfield: value }).
        const payloadData = {
          status: 'pending',
          fullName: `${formData.firstName} ${formData.lastName}`.trim(),
          // Personal
          firstName: formData.firstName,
          lastName: formData.lastName,
          birthMonth: formData.birthMonth,
          birthDay: formData.birthDay,
          birthYear: formData.birthYear,
          email: formData.email,
          confirmEmail: formData.confirmEmail,
          phone: formData.cellPhone || formData.homePhone || '',
          homePhone: formData.homePhone,
          cellPhone: formData.cellPhone,
          bestTimeToCall: formData.bestTimeToCall,
          streetAddress: formData.streetAddress,
          addressLine2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
          // Employment
          isEmployed: formData.isEmployed,
          employers: formData.employers,
          jobTitle: formData.jobTitle,
          companyAddress: formData.companyAddress,
          companyAddressLine2: formData.companyAddressLine2,
          companyCity: formData.companyCity,
          companyState: formData.companyState,
          companyZipCode: formData.companyZipCode,
          // Demographics
          receivedRyanWhiteServices: formData.receivedRyanWhiteServices,
          gender: formData.gender,
          age: formData.age,
          raceEthnicity: formData.raceEthnicity,
          mailingLists: formData.mailingLists.map(list => ({ list })),
          languages: formData.languages.map(language => ({ language })),
          diverseExperience: formData.diverseExperience.map(experience => ({ experience })),
          serviceProviders: formData.serviceProviders.map(provider => ({ provider })),
          needsAssistance: formData.needsAssistance,
          assistanceDescription: formData.assistanceDescription,
          // Experience
          whyJoin: formData.whyJoinPlanningCouncil,
          hivExperience: formData.hivAidsExperience,
          backgroundExperience: formData.backgroundExperience,
          eligibilityInfo: formData.eligibilityInfo,
          membershipCategories: formData.membershipCategories.map(category => ({ category })),
          experienceInterests: formData.experienceInterests.map(interest => ({ interest })),
          // Commitment
          agreedToCommitments: formData.agreedToCommitments,
          consentGiven: formData.consentGiven,
        };

        // Submit to PayloadCMS API
        const response = await fetch(`${API_BASE_URL}/membership-applications`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...payloadData, turnstileToken })
        });

        if (response.ok) {
          // Redirect to success page
          window.location.href = '/success';
        } else {
          const errorData = await response.json();
          console.error('API Error:', errorData);
          throw new Error(`Server responded with status ${response.status}`);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('Error submitting application. Please try again or contact support.');
      }
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1PersonalInfo
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
          />
        );
      case 2:
        return (
          <Step2Demographics
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
          />
        );
      case 3:
        return (
          <Step3Services
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
          />
        );
      case 4:
        return (
          <Step4Experience
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
          />
        );
      case 5:
        return (
          <Step5Commitment
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Application for Planning Council Membership
        </h1>
        <p className="text-gray-600 mb-6">
          The Middlesex-Somerset-Hunterdon Transitional Grant Area Ryan White Part A HIV/AIDS Health Services Planning Council is a federally mandated community group appointed by the Board of Commissioners of Middlesex County, New Jersey, to plan the organization and delivery of Ryan White Part A HIV/AIDS services.
        </p>
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} progress={progress} />
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="mb-6">
          <p className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
            To the greatest extent possible, all information that is provided in this application will be kept confidential. It will be viewed by the Recipient, Ryan White Program Staff, and the Membership & Bylaws Committee of the Planning Council as needed during the nomination/selection process. Directions: Please read this form carefully and complete all information with the best of your knowledge.
          </p>
        </div>

        {renderStep()}

        {currentStep === 5 && (
          <div className="mt-6">
            <div ref={turnstileContainerRef}></div>
            {errors.turnstile && (
              <p className="text-red-500 text-sm mt-1">{errors.turnstile}</p>
            )}
          </div>
        )}

        <div className="flex justify-between mt-8 pt-6 border-t">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`px-6 py-2 rounded-md text-sm font-medium ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Previous
          </button>

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
            >
              Submit Application
            </button>
          )}
        </div>
      </div>
    </div>
  );
}