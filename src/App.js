import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import Layout from './components/Layout';
import { EditorRoute } from './components/ProtectedRoute';
import { Home, Services, ServiceDetail, AddService, Users, AddUser, News, About, Ministries, Regions, Login, AuthTest, AuthDebugDetailed, AuthFlowTest, RoleAccessTest, CategoryFilterDebug, CategoryFilterTest, LanguagePersistenceTest, ComprehensiveLanguageTest, LocalStorageDebugTest, NavigationDebugTest, NavigationIssueDebug, NavigationStressTest, NavigationSequenceTest, NavigationSequenceDebug, Chat } from './pages';

// Root layout component
const RootLayout = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

// Create router with React Router v7 syntax
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "auth-test",
        element: <AuthTest />,
      },
      {
        path: "auth-debug-detailed",
        element: <AuthDebugDetailed />,
      },
      {
        path: "auth-flow-test",
        element: <AuthFlowTest />,
      },
      {
        path: "role-access-test",
        element: <RoleAccessTest />,
      },
      {
        path: "category-filter-debug",
        element: <CategoryFilterDebug />,
      },
      {
        path: "category-filter-test",
        element: <CategoryFilterTest />,
      },
      {
        path: "language-persistence-test",
        element: <LanguagePersistenceTest />,
      },
      {
        path: "comprehensive-language-test",
        element: <ComprehensiveLanguageTest />,
      },
      {
        path: "localstorage-debug-test",
        element: <LocalStorageDebugTest />,
      },
      {
        path: "navigation-debug-test",
        element: <NavigationDebugTest />,
      },
      {
        path: "navigation-issue-debug",
        element: <NavigationIssueDebug />,
      },
      {
        path: "navigation-stress-test",
        element: <NavigationStressTest />,
      },
      {
        path: "navigation-sequence-test",
        element: <NavigationSequenceTest />,
      },
      {
        path: "navigation-sequence-debug",
        element: <NavigationSequenceDebug />,
      },
      {
        path: "services",
        element: <Services />,
      },
      {
        path: "services/:id",
        element: <ServiceDetail />,
      },
      {
        path: "services/add",
        element: (
          <EditorRoute>
            <AddService />
          </EditorRoute>
        ),
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "users/add",
        element: (
          <EditorRoute>
            <AddUser />
          </EditorRoute>
        ),
      },
      {
        path: "ministries",
        element: <Ministries />,
      },
      {
        path: "regions",
        element: <Regions />,
      },
      {
        path: "news",
        element: <News />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "chat",
        element: <Chat />,
      },
    ],
  },
]);

const EthiopianGovWebsite = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ChatProvider>
          <RouterProvider router={router} />
        </ChatProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default EthiopianGovWebsite;