import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Eye, EyeOff, User, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage, getLocalizedText } from '../context/LanguageContext';
import { LoadingSpinner } from '../components/LoadingComponents';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the intended destination from location state, default to home
  const from = location.state?.from?.pathname || '/';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData);
      
      if (result.success) {
        // Redirect to intended destination or home
        navigate(from, { replace: true });
      } else {
        setError(result.error || getLocalizedText(
          'የእርስዎ መለያ ስም ወይም መክፈቻ ቃል የተሳሳተ ነው።',
          'Invalid username or password.',
          'Maqaan keessan ykn jecha icciitiin keessan sirrii miti.',
          language
        ));
      }
    } catch (err) {
      setError(err.message || getLocalizedText(
        'ግንኙነት ችግር ተፈጥሯል። እባክዎ ደግመው ይሞክሩ።',
        'Connection error. Please try again.',
        'Rakkoon wal-qunnamtii uumameera. Mee irra deebi\'aa yaali.',
        language
      ));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <LogIn className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {getLocalizedText(
              'መለያ መክፈቻ',
              'Sign In',
              'Seensaa',
              language
            )}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {getLocalizedText(
              'የመንግስት ፖርታል መለያዎን ይጠቀሙ',
              'Access your government portal account',
              'Akkaawuntii karaa mootummaa keessanii fayyadamaa',
              language
            )}
          </p>
        </div>

        {/* Demo Credentials Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-blue-800 mb-2">
                {getLocalizedText(
                  'የመሞከሪያ መለያዎች',
                  'Demo Accounts',
                  'Akkaawuntii Agarsiisaa',
                  language
                )}
              </p>
              <div className="space-y-1 text-blue-700">
                <p><strong>Admin:</strong> admin / admin123</p>
                <p><strong>Editor:</strong> editor / editor123</p>
                <p><strong>User:</strong> user / user123</p>
              </div>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-md" onSubmit={handleSubmit}>
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
              <span className="text-red-800 text-sm">{error}</span>
            </div>
          )}

          <div className="space-y-4">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                {getLocalizedText(
                  'የተጠቃሚ ስም',
                  'Username',
                  'Maqaa Fayyadamaa',
                  language
                )}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={getLocalizedText(
                    'የተጠቃሚ ስምዎን ያስገቡ',
                    'Enter your username',
                    'Maqaa fayyadamaa keessanii galchaa',
                    language
                  )}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                {getLocalizedText(
                  'መክፈቻ ቃል',
                  'Password',
                  'Jecha Icciitii',
                  language
                )}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={getLocalizedText(
                    'መክፈቻ ቃልዎን ያስገቡ',
                    'Enter your password',
                    'Jecha icciitii keessanii galchaa',
                    language
                  )}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !formData.username || !formData.password}
            className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" />
                <span className="ml-2">
                  {getLocalizedText(
                    'እየገባ ነው...',
                    'Signing in...',
                    'Seensisuudhaa jira...',
                    language
                  )}
                </span>
              </>
            ) : (
              <>
                <LogIn className="h-5 w-5 mr-2" />
                {getLocalizedText(
                  'ግባ',
                  'Sign In',
                  'Seensa',
                  language
                )}
              </>
            )}
          </button>

          {/* Additional Links */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              {getLocalizedText(
                '← ወደ ቤት ገጽ ተመለስ',
                '← Back to Home',
                '← Gara fuula jalqabaatti deebi\'i',
                language
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
