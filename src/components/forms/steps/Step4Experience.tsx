import type { FormData } from '../PlanningCouncilForm';

interface Step4ExperienceProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  errors: {[key: string]: string};
}

export default function Step4Experience({ formData, updateFormData, errors }: Step4ExperienceProps) {
  const membershipCategories = [
    'Health care providers, including federally qualified health centers',
    'Community based organizations serving HIV/AIDS populations',
    'AIDS service organizations',
    'Social service providers (housing & homeless)',
    'Other social service providers',
    'Mental health providers',
    'Substance use disorder treatment provider',
    'Local public health agencies',
    'Hospital or other health care planning agencies',
    'Affected communities, incl. people with HIV/AIDS and historically underserved populations',
    'Non-elected community leader',
    'State Medicaid agency',
    'State Ryan White Part B agency',
    'Ryan White Part C grantee',
    'Ryan White Part D grantee, or other org. addressing the needs of children/youth with HIV',
    'Grantees of other federal HIV programs, including HIV prevention programs',
    'Formerly incarcerated persons with HIV/AIDS, or their representative'
  ];

  const experienceInterests = [
    'Health care needs of men who have sex with men',
    'Physically/mentally disabled person',
    'Women\'s HIV/AIDS health needs',
    'Other non medical support services',
    'Children\'s HIV/AIDS health needs',
    'General public health care',
    'Youth HIV/AIDS health needs',
    'Outpatient primary medical care',
    'Health care needs of injecting drug users',
    'Antiretroviral therapies',
    'Rural health care needs',
    'Comprehensive planning',
    'Immigrants and refugees',
    'Evaluation and assessment',
    'Black/African American issues',
    'Mental health services',
    'Latino/Hispanic issues',
    'Substance use disorder treatment services',
    'Veteran/Military experience',
    'Other'
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    updateFormData({ [field]: value });
  };

  const handleCheckboxChange = (field: keyof FormData, value: string, checked: boolean) => {
    const currentArray = formData[field] as string[];
    if (checked) {
      updateFormData({ [field]: [...currentArray, value] });
    } else {
      updateFormData({ [field]: currentArray.filter(item => item !== value) });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Experience & Qualifications</h2>

      {/* Why Join Planning Council */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Please explain why you would like to become a member of the Planning Council <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.whyJoinPlanningCouncil}
          onChange={(e) => handleInputChange('whyJoinPlanningCouncil', e.target.value)}
          placeholder="Please share your motivation for joining the Planning Council..."
          rows={4}
          maxLength={500}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.whyJoinPlanningCouncil ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        <div className="flex justify-between text-sm text-gray-500 mt-1">
          <span>{errors.whyJoinPlanningCouncil && <span className="text-red-500">{errors.whyJoinPlanningCouncil}</span>}</span>
          <span>{formData.whyJoinPlanningCouncil.length} of 500 max characters</span>
        </div>
      </div>

      {/* HIV/AIDS Experience */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Please describe any work and/or volunteer experiences you have had in HIV/AIDS service provision and/or advocacy *
        </label>
        <textarea
          value={formData.hivAidsExperience}
          onChange={(e) => handleInputChange('hivAidsExperience', e.target.value)}
          placeholder="Describe your relevant work or volunteer experience..."
          rows={4}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.hivAidsExperience ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.hivAidsExperience && <p className="text-red-500 text-sm mt-1">{errors.hivAidsExperience}</p>}
      </div>

      {/* Background Experience */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Please explain how your background and past experiences would be useful in planning for a system of care for people with HIV/AIDS
        </label>
        <textarea
          value={formData.backgroundExperience}
          onChange={(e) => handleInputChange('backgroundExperience', e.target.value)}
          placeholder="Explain how your background would contribute to planning HIV/AIDS care..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Eligibility Information */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Is there anything about you that may help us determine your eligibility for Planning Council?
        </label>
        <textarea
          value={formData.eligibilityInfo}
          onChange={(e) => handleInputChange('eligibilityInfo', e.target.value)}
          placeholder="Please share any relevant information about your eligibility..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Membership Categories */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          The Planning Council, by mandate of the Ryan White Act HIV/AIDS Treatment Extension Act of 2009, must include persons representing specific membership categories. Please check all categories of which you are qualified to represent <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-4">
          {membershipCategories.map((category) => (
            <label key={category} className="flex items-start">
              <input
                type="checkbox"
                checked={formData.membershipCategories.includes(category)}
                onChange={(e) => handleCheckboxChange('membershipCategories', category, e.target.checked)}
                className="mt-1 mr-3 flex-shrink-0"
              />
              <span className="text-sm">{category}</span>
            </label>
          ))}
        </div>
        {errors.membershipCategories && <p className="text-red-500 text-sm mt-1">{errors.membershipCategories}</p>}
      </div>

      {/* Experience and Interests */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Do you have experience or interest in any of the following? (Please check all that apply)
        </label>
        <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-4">
          {experienceInterests.map((interest) => (
            <label key={interest} className="flex items-start">
              <input
                type="checkbox"
                checked={formData.experienceInterests.includes(interest)}
                onChange={(e) => handleCheckboxChange('experienceInterests', interest, e.target.checked)}
                className="mt-1 mr-3 flex-shrink-0"
              />
              <span className="text-sm">{interest}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">About Membership Categories</h3>
        <p className="text-sm text-blue-700">
          Federal regulations require that the Planning Council include representatives from specific categories. 
          Your selection helps us understand how you might contribute to the Council's mandated composition. 
          You may qualify for multiple categories based on your background and experience.
        </p>
      </div>
    </div>
  );
}