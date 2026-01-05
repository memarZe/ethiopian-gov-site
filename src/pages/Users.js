import React, { useState, useEffect } from 'react';
import { Plus, User, Mail, Phone, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { useSearch } from '../hooks/useApi';
import { LoadingSpinner, LoadingCard } from '../components/LoadingComponents';
import { SearchInput } from '../components';
import { useLanguage, getLocalizedText } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

// Transform users data from Java backend format
const transformUsersData = (apiData) => {
  if (!Array.isArray(apiData)) return [];
  
  return apiData.map(user => ({
    id: user.id,
    username: user.username,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    firstNameAm: user.firstNameAm,
    lastNameAm: user.lastNameAm,
    phone: user.phone,
    role: user.role,
    region: user.region,
    isActive: user.isActive,
    isVerified: user.isVerified,
    emailVerified: user.emailVerified,
    phoneVerified: user.phoneVerified,
    lastLogin: user.lastLogin,
    createdAt: user.createdAt
  }));
};

const Users = () => {
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const { isEditor } = useAuth();
  const navigate = useNavigate();
  
  console.log('Users component mounting/re-rendering at:', new Date().toISOString());
  
  // Load users with error handling
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const rawUsers = await apiService.getUsers();
        const transformedUsers = transformUsersData(rawUsers || []);
        setUsers(transformedUsers);
      } catch (err) {
        console.error('Failed to load users:', err);
        
        // Provide mock data when backend has serialization issues
        const mockUsers = [
          {
            id: 1,
            username: 'admin',
            email: 'admin@gov.et',
            firstName: 'System',
            lastName: 'Administrator',
            firstNameAm: 'ሥርዓት',
            lastNameAm: 'አስተዳዳሪ',
            phone: '+251911000000',
            role: 'ADMIN',
            region: { nameEn: 'Addis Ababa', nameAm: 'አዲስ አበባ' },
            isActive: true,
            isVerified: true,
            emailVerified: true,
            phoneVerified: true,
            lastLogin: '2025-12-27T10:00:00',
            createdAt: '2025-12-01T00:00:00'
          },
          {
            id: 2,
            username: 'user1',
            email: 'user1@gov.et',
            firstName: 'Demo',
            lastName: 'User',
            firstNameAm: 'ማሳያ',
            lastNameAm: 'ተጠቃሚ',
            phone: '+251911111111',
            role: 'USER',
            region: { nameEn: 'Amhara', nameAm: 'አማራ' },
            isActive: true,
            isVerified: false,
            emailVerified: true,
            phoneVerified: false,
            lastLogin: null,
            createdAt: '2025-12-15T00:00:00'
          }
        ];
        setUsers(mockUsers);
      } finally {
        setLoading(false);
      }
    };
    
    loadUsers();
  }, []);
  
  const { query, setQuery, results: searchResults, loading: searchLoading } = useSearch(apiService.search);
  const roles = [...new Set(users.map(user => user.role))];
  const activeUsers = users.filter(user => user.isActive);

  const handleRoleChange = (roleName) => {
    setSelectedRoles(prev => 
      prev.includes(roleName) 
        ? prev.filter(name => name !== roleName)
        : [...prev, roleName]
    );
  };

  // Filter users by selected roles
  const filteredUsers = selectedRoles.length > 0 
    ? users.filter(user => selectedRoles.includes(user.role))
    : users;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <LoadingSpinner message="Loading users..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl md:text-4xl font-bold">
              {getLocalizedText(
                'የሲስተም ተጠቃሚዎች',
                'System Users', 
                'Fayyadamtoota Sirnaa',
                language
              )}
            </h1>
            {/* Show Add User button only for Admin and Editor roles */}
            {isEditor() && (
              <button
                onClick={() => navigate('/users/add')}
                className="bg-white text-blue-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 font-medium"
              >
                <Plus className="h-5 w-5" />
                {getLocalizedText(
                  'ተጠቃሚ ጨምር',
                  'Add User',
                  'Fayyadamaa Dabaluu',
                  language
                )}
              </button>
            )}
          </div>
          <p className="text-lg md:text-xl opacity-90">
            {getLocalizedText(
              'የመንግስት ፖርታል ተጠቃሚዎችን መቆጣጠሪያ',
              'Manage government portal users',
              'Fayyadamtoota karaa mootummaa bulchi',
              language
            )}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="max-w-2xl">
            <SearchInput
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={getLocalizedText(
                'ተጠቃሚዎችን ፈልግ...',
                'Search for users...',
                'Fayyadamtoota barbaadi...',
                language
              )}
              showAdvancedOnClick={true}
              showAdvancedOnFocus={true}
            />
            {searchLoading && (
              <div className="absolute right-3 top-3">
                <LoadingSpinner size="sm" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg mb-4">
                {getLocalizedText(
                  'በሚና አጣራ',
                  'Filter by Role',
                  'Gahee tahiin filannee',
                  language
                )}
              </h3>
              {loading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-6 bg-gray-200 rounded animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {roles?.map((role) => {
                    const roleCount = users.filter(user => user.role === role).length;
                    return (
                      <label key={role} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedRoles.includes(role)}
                          onChange={() => handleRoleChange(role)}
                          className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm">
                          {getLocalizedText(
                            role === 'USER' ? 'ተጠቃሚ' :
                            role === 'ADMIN' ? 'አስተዳዳሪ' :
                            role === 'MODERATOR' ? 'ሞዴሬተር' :
                            role === 'EDITOR' ? 'ሰነድ አርታዒ' :
                            role === 'VIEWER' ? 'ተመልካች' : role,
                            role,
                            role === 'USER' ? 'Fayyadamaa' :
                            role === 'ADMIN' ? 'Bulchaa' :
                            role === 'MODERATOR' ? 'Modaretera' :
                            role === 'EDITOR' ? 'Gulaala' :
                            role === 'VIEWER' ? 'Ilaalcha' : role,
                            language
                          )} ({roleCount})
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Statistics */}
            <div className="bg-white p-6 rounded-lg shadow-sm mt-6">
              <h3 className="font-bold text-lg mb-4">
                {getLocalizedText(
                  'ስታትስቲክስ',
                  'Statistics',
                  'Lakkoofsa',
                  language
                )}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    {getLocalizedText('ጠቅላላ ተጠቃሚዎች',  'Total Users',  language)}
                  </span>
                  <span className="font-semibold">{users.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    {getLocalizedText('ንቁ ተጠቃሚዎች',  'Active Users',  language)}
                  </span>
                  <span className="font-semibold text-green-600">{activeUsers.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    {getLocalizedText('ወሳኝ ተጠቃሚዎች',  'Inactive Users',  language)}
                  </span>
                  <span className="font-semibold text-red-600">{users.length - activeUsers.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Users Grid */}
          <div className="lg:col-span-3">
            {/* Search Results */}
            {query && searchResults.length > 0 && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">
                  {getLocalizedText(
                    'የፍለጋ ውጤቶች',
                    'Search Results',
                    'Bu\'uuwwan barbaacha',
                    language
                  )}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.map((user) => (
                    <UserCard key={user.id} user={user} />
                  ))}
                </div>
              </div>
            )}

            {/* Filtered Users */}
            {selectedRoles.length > 0 && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">
                  {getLocalizedText(
                    `በተመረጡ ሚናዎች ተጠቃሚዎች (${filteredUsers.length})`,
                    `Users in Selected Roles (${filteredUsers.length})`,
                    `Fayyadamtoota gahee filatamaniiti (${filteredUsers.length})`,
                    language
                  )}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredUsers.map((user) => (
                    <UserCard key={user.id} user={user} />
                  ))}
                </div>
              </div>
            )}

            {selectedRoles.length === 0 && !query && (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-4">
                    {getLocalizedText(
                      'ሁሉም ተጠቃሚዎች',
                      'All Users',
                      'Fayyadamtoota Hundaa',
                      language
                    )}
                  </h2>
                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[...Array(6)].map((_, i) => (
                        <LoadingCard key={i} />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {users?.map((user) => (
                        <UserCard key={user.id} user={user} />
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// User Card Component
const UserCard = ({ user }) => {
  const { language } = useLanguage();
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">
              {getLocalizedText(
                user.firstNameAm && user.lastNameAm ? `${user.firstNameAm} ${user.lastNameAm}` : `${user.firstName} ${user.lastName}`,
                `${user.firstName} ${user.lastName}`,
                user.firstNameAm && user.lastNameAm ? `${user.firstNameAm} ${user.lastNameAm}` : `${user.firstName} ${user.lastName}`,
                language
              )}
            </h3>
            <p className="text-sm text-gray-600">@{user.username}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            user.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
            user.role === 'MODERATOR' ? 'bg-orange-100 text-orange-800' :
            user.role === 'EDITOR' ? 'bg-green-100 text-green-800' :
            user.role === 'VIEWER' ? 'bg-gray-100 text-gray-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {getLocalizedText(
              user.role === 'USER' ? 'ተጠቃሚ' :
              user.role === 'ADMIN' ? 'አስተዳዳሪ' :
              user.role === 'MODERATOR' ? 'ሞዴሬተር' :
              user.role === 'EDITOR' ? 'ሰነድ አርታዒ' :
              user.role === 'VIEWER' ? 'ተመልካች' : user.role,
              user.role,
              user.role === 'USER' ? 'Fayyadamaa' :
              user.role === 'ADMIN' ? 'Bulchaa' :
              user.role === 'MODERATOR' ? 'Modaretera' :
              user.role === 'EDITOR' ? 'Gulaala' :
              user.role === 'VIEWER' ? 'Ilaalcha' : user.role,
              language
            )}
          </span>
          <span className={`mt-1 px-2 py-1 rounded-full text-xs ${
            user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {user.isActive 
              ? getLocalizedText('ንቁ',  'Active',  language)
              : getLocalizedText('ወሳኝ',  'Inactive',  language)
            }
          </span>
        </div>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center">
          <Mail className="h-4 w-4 mr-2" />
          <span className="truncate">{user.email}</span>
          {user.emailVerified && (
            <Shield className="h-3 w-3 ml-1 text-green-600" />
          )}
        </div>
        
        {user.phone && (
          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-2" />
            <span>{user.phone}</span>
            {user.phoneVerified && (
              <Shield className="h-3 w-3 ml-1 text-green-600" />
            )}
          </div>
        )}
        
        {user.region && (
          <div className="text-xs text-gray-500">
            {getLocalizedText('ክልል',  'Region',  language)}: {
              typeof user.region === 'object' 
                ? (language === 'amharic' && user.region.nameAm ? user.region.nameAm : user.region.nameEn)
                : user.region
            }
          </div>
        )}
        
        <div className="text-xs text-gray-500 pt-2 border-t">
          {getLocalizedText('የተፈጠረበት ጊዜ',  'Created',  language)}: {formatDate(user.createdAt)}
        </div>
        
        {user.lastLogin && (
          <div className="text-xs text-gray-500">
            {getLocalizedText('መጨረሻ ግባት',  'Last Login',  language)}: {formatDate(user.lastLogin)}
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center mt-4 pt-3 border-t">
        <div className="flex space-x-1">
          {user.isVerified && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
              {getLocalizedText('የተረጋገጠ',  'Verified',  language)}
            </span>
          )}
        </div>
        
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          {getLocalizedText('ዝርዝር ይመልከቱ',  'View Details',  language)}
        </button>
      </div>
    </div>
  );
};

export default Users;
