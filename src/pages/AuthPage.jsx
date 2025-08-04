import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Mail, Lock, User, Upload } from 'lucide-react';
import { storageService } from '../services/storageService';

function AuthPage() {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phoneNumber: '',
    role: 'user',
    plan: 'free',
    kycStatus: 'pending',
    isBlocked: false,
    twoFactorEnabled: false,
    status: 'active',
    kycDocuments: '',
    profileCompleted: false,
    kycRemarks: null,
    profilePhoto: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [kycFrontFile, setKycFrontFile] = useState(null);
  const [kycBackFile, setKycBackFile] = useState(null);
  const [kycFrontPreview, setKycFrontPreview] = useState(null);
  const [kycBackPreview, setKycBackPreview] = useState(null);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  // Check URL parameters to determine initial mode
  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'register') {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [searchParams]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleKycFrontFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setKycFrontFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setKycFrontPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleKycBackFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setKycBackFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setKycBackPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to check if profile is complete
  const checkProfileCompletion = (data, hasKycDocuments, hasProfilePhoto) => {
    // Required fields for profile completion
    const requiredFields = [
      data.name,
      data.email,
      data.phoneNumber,
      data.password
    ];
    
    // Check if all required fields are filled
    const allRequiredFieldsFilled = requiredFields.every(field => field && field.trim() !== '');
    
    // Profile is complete if all required fields are filled AND KYC documents are uploaded
    // Both front and back KYC documents are now required
    return allRequiredFieldsFilled && hasKycDocuments;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else {
        let updatedFormData = { ...formData };
        
        // Upload profile image if selected
        if (profileImageFile) {
          const uploadResult = await storageService.uploadFile(profileImageFile);
          if (uploadResult.success) {
            updatedFormData.profilePhoto = uploadResult.data.$id;
          } else {
            setError('Failed to upload profile image: ' + uploadResult.error);
            setLoading(false);
            return;
          }
        }

        // Upload KYC documents if selected
        const kycDocuments = {};
        
        if (kycFrontFile) {
          const frontUploadResult = await storageService.uploadFile(kycFrontFile);
          if (frontUploadResult.success) {
            kycDocuments.front = frontUploadResult.data.$id;
          } else {
            setError('Failed to upload KYC front document: ' + frontUploadResult.error);
            setLoading(false);
            return;
          }
        }
        
        if (kycBackFile) {
          const backUploadResult = await storageService.uploadFile(kycBackFile);
          if (backUploadResult.success) {
            kycDocuments.back = backUploadResult.data.$id;
          } else {
            setError('Failed to upload KYC back document: ' + backUploadResult.error);
            setLoading(false);
            return;
          }
        }
        
        // Store KYC documents as JSON string in front/back format
        if (Object.keys(kycDocuments).length > 0) {
          updatedFormData.kycDocuments = JSON.stringify(kycDocuments);
        }
        
        // Check if profile is complete based on filled fields
        const hasKycDocuments = Object.keys(kycDocuments).length > 0;
        const hasProfilePhoto = !!updatedFormData.profilePhoto;
        updatedFormData.profileCompleted = checkProfileCompletion(updatedFormData, hasKycDocuments, hasProfilePhoto);
        
        result = await register(formData.email, formData.password, updatedFormData);
      }

      if (result.success) {
        if (result.message) {
          // Show success message if provided
          console.log(result.message);
        }
        navigate('/');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Check current profile completion status for display
  const getCurrentProfileCompletion = () => {
    if (isLogin) return false;
    
    const requiredFields = [
      formData.name,
      formData.email,
      formData.phoneNumber,
      formData.password
    ];
    
    return requiredFields.every(field => field && field.trim() !== '');
  };

  const isCurrentProfileComplete = getCurrentProfileCompletion();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-makin-black mb-2">
              MAKIN
            </h1>
            <h2 className="text-xl font-semibold text-gray-900">
              {isLogin ? 'Sign in to your account' : 'Create your account'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {isLogin ? "Don't have an account?" : 'Already have an account? '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setFormData({
                    email: '',
                    password: '',
                    name: '',
                    phoneNumber: '',
                    role: 'user',
                    plan: 'free',
                    kycStatus: 'pending',
                    isBlocked: false,
                    twoFactorEnabled: false,
                    status: 'active',
                    kycDocuments: '',
                    profileCompleted: false,
                    kycRemarks: null,
                    profilePhoto: ''
                  });
                  setProfileImageFile(null);
                  setProfileImagePreview(null);
                  setKycFrontFile(null);
                  setKycBackFile(null);
                  setKycFrontPreview(null);
                  setKycBackPreview(null);
                }}
                className="font-medium text-makin-orange hover:text-makin-deep-orange"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {!isLogin && (
              <Input
                label="Full Name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                icon={<User />}
                required
              />
            )}

            {!isLogin && (
              <>
                {/* Personal Information Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <Input
                      label="Phone Number"
                      type="text"
                      placeholder="Enter your phone number"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      required
                    />
                  </div>
                </div>

               
                

                {/* KYC Information Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">KYC Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Identity Proof Front */}
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Identity Proof (Front)
                      </label>
                      
                      {/* Front Image Preview */}
                      {kycFrontPreview && (
                        <div className="flex justify-center">
                          <img
                            src={kycFrontPreview}
                            alt="Identity Front Preview"
                            className="w-32 h-20 object-cover border-2 border-gray-300 rounded"
                          />
                        </div>
                      )}
                      
                      {/* Front File Input */}
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pt-2 pb-2">
                            <Upload className="w-6 h-6 mb-2 text-gray-500" />
                            <p className="text-xs text-gray-500">Front Side</p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            onChange={handleKycFrontFileChange}
                            accept="image/*"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Identity Proof Back */}
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Identity Proof (Back)
                      </label>
                      
                      {/* Back Image Preview */}
                      {kycBackPreview && (
                        <div className="flex justify-center">
                          <img
                            src={kycBackPreview}
                            alt="Identity Back Preview"
                            className="w-32 h-20 object-cover border-2 border-gray-300 rounded"
                          />
                        </div>
                      )}
                      
                      {/* Back File Input */}
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pt-2 pb-2">
                            <Upload className="w-6 h-6 mb-2 text-gray-500" />
                            <p className="text-xs text-gray-500">Back Side</p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            onChange={handleKycBackFileChange}
                            accept="image/*"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Optional Fields Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Optional Information</h3>
                  
                  {/* Profile Image Upload */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Profile Photo
                    </label>
                    
                    {/* Image Preview */}
                    {profileImagePreview && (
                      <div className="flex justify-center">
                        <img
                          src={profileImagePreview}
                          alt="Profile preview"
                          className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                        />
                      </div>
                    )}
                    
                    {/* File Input */}
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-4 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 10MB)</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                          accept="image/*"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </>
            )}

            <Input
              label="Email address"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              icon={<Mail />}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              icon={<Lock />}
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Profile Completion Indicator for Signup */}
          {!isLogin && (
            <div className={`border rounded-lg p-3 ${
              isCurrentProfileComplete 
                ? 'bg-green-50 border-green-200' 
                : 'bg-yellow-50 border-yellow-200'
            }`}>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  isCurrentProfileComplete ? 'bg-green-500' : 'bg-yellow-500'
                }`}></div>
                <p className={`text-sm font-medium ${
                  isCurrentProfileComplete ? 'text-green-700' : 'text-yellow-700'
                }`}>
                  {isCurrentProfileComplete 
                    ? '✓ Profile Complete - All required fields filled' 
                    : '⚠ Please fill all required fields (Name, Email, Phone, Password)'
                  }
                </p>
              </div>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={loading}
            disabled={loading}
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default AuthPage;
