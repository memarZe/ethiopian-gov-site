import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import Layout from './components/Layout';
import { EditorRoute } from './components/ProtectedRoute';
import { Home, Services, AddService, Users, AddUser, News, About, Ministries, Regions, Login, AuthTest, AuthDebugDetailed, AuthFlowTest, RoleAccessTest, CategoryFilterDebug, CategoryFilterTest, LanguagePersistenceTest, ComprehensiveLanguageTest, LocalStorageDebugTest, NavigationDebugTest, NavigationIssueDebug, NavigationStressTest, Chat } from './pages';

const EthiopianGovWebsiteV6 = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ChatProvider>
          <Router>
            <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/auth-test" element={<AuthTest />} />
              <Route path="/auth-debug-detailed" element={<AuthDebugDetailed />} />
              <Route path="/auth-flow-test" element={<AuthFlowTest />} />
              <Route path="/role-access-test" element={<RoleAccessTest />} />
              <Route path="/category-filter-debug" element={<CategoryFilterDebug />} />
              <Route path="/category-filter-test" element={<CategoryFilterTest />} />
              <Route path="/language-persistence-test" element={<LanguagePersistenceTest />} />
              <Route path="/comprehensive-language-test" element={<ComprehensiveLanguageTest />} />
              <Route path="/localstorage-debug-test" element={<LocalStorageDebugTest />} />
              <Route path="/navigation-debug-test" element={<NavigationDebugTest />} />
              <Route path="/navigation-issue-debug" element={<NavigationIssueDebug />} />
              <Route path="/navigation-stress-test" element={<NavigationStressTest />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/add" element={
                <EditorRoute>
                  <AddService />
                </EditorRoute>
              } />
              <Route path="/users" element={<Users />} />
              <Route path="/users/add" element={
                <EditorRoute>
                  <AddUser />
                </EditorRoute>
              } />
              <Route path="/ministries" element={<Ministries />} />
              <Route path="/regions" element={<Regions />} />
              <Route path="/news" element={<News />} />
              <Route path="/about" element={<About />} />
              <Route path="/chat" element={<Chat />} />
            </Routes>
          </Layout>
        </Router>
        </ChatProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default EthiopianGovWebsiteV6;
