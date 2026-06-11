import type { FormData } from '../PlanningCouncilForm';

interface Step1PersonalInfoProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  errors: {[key: string]: string};
  mailingListOptions?: string[];
}

export default function Step1PersonalInfo({ formData, updateFormData, errors, mailingListOptions: mailingListOptionsProp }: Step1PersonalInfoProps) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  // Committee mailing-list options (CMS-managed via the `committees` collection),
  // falling back to the current values if the API is unavailable.
  const DEFAULT_MAILING_LISTS = [
    'Planning Council (usually 1st Tuesday of each month 6-8pm)',
    'Quality Improvement and Strategic Planning (every other month-3rd Tuesday 2-4pm)',
    'Membership & Bylaws Committee (3rd Wednesday of each month 1-2pm)',
    'Mentorship & Outreach (every other month- 2nd Wednesday 6-8pm)'
  ];
  const mailingListOptions = mailingListOptionsProp && mailingListOptionsProp.length ? mailingListOptionsProp : DEFAULT_MAILING_LISTS;

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
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
      
      {/* Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            id="firstName"
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.firstName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
        </div>
        
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            id="lastName"
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.lastName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
        </div>
      </div>

      {/* Birthday */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Birthday</label>
        <div className="grid grid-cols-3 gap-2">
          <select
            value={formData.birthMonth}
            onChange={(e) => handleInputChange('birthMonth', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Birth month"
          >
            <option value="">Month</option>
            {months.map((month, index) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
          
          <select
            value={formData.birthDay}
            onChange={(e) => handleInputChange('birthDay', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Birth day"
          >
            <option value="">Day</option>
            {days.map(day => (
              <option key={day} value={day.toString()}>{day}</option>
            ))}
          </select>
          
          <select
            value={formData.birthYear}
            onChange={(e) => handleInputChange('birthYear', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Birth year"
          >
            <option value="">Year</option>
            {years.map(year => (
              <option key={year} value={year.toString()}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Address */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">Address</label>
        
        <div>
          <input
            type="text"
            placeholder="Street Address"
            value={formData.streetAddress}
            onChange={(e) => handleInputChange('streetAddress', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.streetAddress ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.streetAddress && <p className="text-red-500 text-sm mt-1">{errors.streetAddress}</p>}
        </div>
        
        <div>
          <input
            type="text"
            placeholder="Address Line 2"
            value={formData.addressLine2}
            onChange={(e) => handleInputChange('addressLine2', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="City"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.city ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
          </div>
          
          <div>
            <select
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.state ? 'border-red-500' : 'border-gray-300'
              }`}
              aria-label="State"
            >
              <option value="">State</option>
              {states.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
          </div>
          
          <div>
            <input
              type="text"
              placeholder="ZIP Code"
              value={formData.zipCode}
              onChange={(e) => handleInputChange('zipCode', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.zipCode ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
          </div>
        </div>
        
        <div>
          <input
            type="text"
            placeholder="Country"
            value={formData.country}
            onChange={(e) => handleInputChange('country', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        
        <div>
          <label htmlFor="confirmEmail" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Email <span className="text-red-500">*</span>
          </label>
          <input
            id="confirmEmail"
            type="email"
            value={formData.confirmEmail}
            onChange={(e) => handleInputChange('confirmEmail', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.confirmEmail ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.confirmEmail && <p className="text-red-500 text-sm mt-1">{errors.confirmEmail}</p>}
        </div>
      </div>

      {/* Phone Numbers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="homePhone" className="block text-sm font-medium text-gray-700 mb-1">Home Phone</label>
          <input
            id="homePhone"
            type="tel"
            value={formData.homePhone}
            onChange={(e) => handleInputChange('homePhone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="cellPhone" className="block text-sm font-medium text-gray-700 mb-1">Cell Phone</label>
          <input
            id="cellPhone"
            type="tel"
            value={formData.cellPhone}
            onChange={(e) => handleInputChange('cellPhone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="bestTimeToCall" className="block text-sm font-medium text-gray-700 mb-1">Best Time to Call</label>
          <input
            id="bestTimeToCall"
            type="text"
            value={formData.bestTimeToCall}
            onChange={(e) => handleInputChange('bestTimeToCall', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Employment */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Are you currently employed?
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="employed"
                checked={formData.isEmployed === true}
                onChange={() => handleInputChange('isEmployed', true)}
                className="mr-2"
                aria-label="Yes, I am currently employed"
              />
              Yes
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="employed"
                checked={formData.isEmployed === false}
                onChange={() => handleInputChange('isEmployed', false)}
                className="mr-2"
                aria-label="No, I am not currently employed"
              />
              No
            </label>
          </div>
        </div>

        {formData.isEmployed && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label htmlFor="employers" className="block text-sm font-medium text-gray-700 mb-1">Employer(s)</label>
              <input
                id="employers"
                type="text"
                value={formData.employers}
                onChange={(e) => handleInputChange('employers', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
              <input
                id="jobTitle"
                type="text"
                value={formData.jobTitle}
                onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Company Address</label>
              <input
                type="text"
                placeholder="Street Address"
                value={formData.companyAddress}
                onChange={(e) => handleInputChange('companyAddress', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Address Line 2"
                value={formData.companyAddressLine2}
                onChange={(e) => handleInputChange('companyAddressLine2', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="City"
                  value={formData.companyCity}
                  onChange={(e) => handleInputChange('companyCity', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={formData.companyState}
                  onChange={(e) => handleInputChange('companyState', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Company state"
                >
                  <option value="">State</option>
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="ZIP Code"
                  value={formData.companyZipCode}
                  onChange={(e) => handleInputChange('companyZipCode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mailing Lists */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          On which of the following mailing lists (via email) would you like to be included?
        </label>
        <div className="space-y-2">
          {mailingListOptions.map((option) => (
            <label key={option} className="flex items-start">
              <input
                type="checkbox"
                checked={formData.mailingLists.includes(option)}
                onChange={(e) => handleCheckboxChange('mailingLists', option, e.target.checked)}
                className="mt-1 mr-3"
              />
              <span className="text-sm">{option}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}