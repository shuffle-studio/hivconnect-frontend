import type { FormData } from '../PlanningCouncilForm';

interface Step3ServicesProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  errors: {[key: string]: string};
  serviceProviderOptions?: string[];
}

export default function Step3Services({ formData, updateFormData, errors, serviceProviderOptions: providerOptionsProp }: Step3ServicesProps) {
  // Curated provider list (CMS-managed via `service-provider-options`), falling
  // back to the current values if the API is unavailable.
  const DEFAULT_PROVIDERS = [
    'Central Jersey Legal Services',
    'Elijah\'s Promise Inc.',
    'Eric B. Chandler Health Center',
    'George J. Otlowski Sr. Center for Mental Health Care',
    'Hackensack Meridian Raritan Bay Medical Center',
    'Hyacinth AIDS Foundation',
    'New Brunswick Counseling Center',
    'Northwest Jersey Legal Services',
    'Robert Wood Johnson AIDS Program',
    'Robert Wood Johnson Hospital Dental Program',
    'Somerset Treatment Services',
    'Visiting Nurse Association of Central New Jersey',
    'Zufall Health Center - Somerset'
  ];
  // Fixed answer choices (not providers) — always appended after the provider list.
  const META_OPTIONS = [
    'No, I do not receive Ryan White Part A Services',
    'I don\'t know if I receive Ryan White Part A Services'
  ];
  const providers = providerOptionsProp && providerOptionsProp.length ? providerOptionsProp : DEFAULT_PROVIDERS;
  const serviceProviders = [...providers, ...META_OPTIONS];

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
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
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Services & Accommodations</h2>

      {/* Service Providers */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Have you received services related to HIV/AIDS from any of the following providers?
          <br />
          <span className="text-sm text-gray-600">Click all that apply.</span>
        </label>
        <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-4">
          {serviceProviders.map((provider) => (
            <label key={provider} className="flex items-start">
              <input
                type="checkbox"
                checked={formData.serviceProviders.includes(provider)}
                onChange={(e) => handleCheckboxChange('serviceProviders', provider, e.target.checked)}
                className="mt-1 mr-3 flex-shrink-0"
              />
              <span className="text-sm">{provider}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Accommodation Needs */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Is there any assistance/accommodation (such as transportation, access to a computer, translation, wheelchair accessibility, etc.) that we might provide that would help you to fully participate in the activities of the Planning Council?
        </label>
        <div className="space-y-3">
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="needsAssistance"
                checked={formData.needsAssistance === false}
                onChange={() => handleInputChange('needsAssistance', false)}
                className="mr-2"
              />
              No
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="needsAssistance"
                checked={formData.needsAssistance === true}
                onChange={() => handleInputChange('needsAssistance', true)}
                className="mr-2"
              />
              Yes, please specify below
            </label>
          </div>

          {formData.needsAssistance && (
            <div className="mt-3">
              <textarea
                value={formData.assistanceDescription}
                onChange={(e) => handleInputChange('assistanceDescription', e.target.value)}
                placeholder="Please describe the assistance or accommodations you would need..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
      </div>

      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="font-medium text-green-800 mb-2">About Accommodations</h3>
        <p className="text-sm text-green-700">
          We are committed to ensuring that all Planning Council activities are accessible to everyone. Common accommodations we can provide include:
        </p>
        <ul className="text-sm text-green-700 mt-2 ml-4 list-disc">
          <li>Transportation assistance or travel reimbursement</li>
          <li>Language interpretation services</li>
          <li>Sign language interpretation</li>
          <li>Wheelchair accessible meeting locations</li>
          <li>Large print or alternative format materials</li>
          <li>Technology support for virtual participation</li>
          <li>Child care assistance</li>
        </ul>
      </div>
    </div>
  );
}