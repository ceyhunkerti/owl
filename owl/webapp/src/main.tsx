import { ThemeProvider } from "@emotion/react";
import ErrorPage from "@pages/error/ErrorPage";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import theme from "./theme";

import Editor from "@components/Editor";
import { AlertDialogProvider } from "@contexts/AlertDialogContext";
import "@css/index.css";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import App from "@pages/App";
import { default as Auth } from "@pages/auth/Auth";
import LoginPage from "@pages/auth/LoginPage";

import { UserStorage } from "@lib/storage";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import HandleGoogleCallbackPage from "@pages/auth/HandleGoogleCallbackPage";
import AccountSettings from "@pages/settings/AccountSettings";

import "rc-tree/assets/index.css";

const isAuthenticated = () => {
  return Boolean(UserStorage.get()?.access_token);
};

const ProtectedRoute = ({ element }: any) => {
  return isAuthenticated() ? element : <Navigate to="/ui/auth/login" replace />;
};

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Navigate to="/ui" replace />,
    },
    {
      path: "/ui/auth",
      element: <Auth />,
      children: [
        {
          path: "login",
          element: <LoginPage />,
        },
        {
          path: "handle-google-callback",
          element: <HandleGoogleCallbackPage />,
        },
      ],
    },
    {
      path: "/ui",
      element: <ProtectedRoute element={<App />} />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "",
          element: <Editor />,
        },
        {
          path: "settings",
          children: [
            {
              path: "",
              element: <Navigate to="account" replace />,
            },
            {
              path: "account",
              element: <AccountSettings />,
            },
          ],
        },
      ],
    },
  ]
  // {
  //   basename: "/ui",
  // }
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <MantineProvider defaultColorScheme="light" forceColorScheme="light">
        <Notifications position="top-right" />
        <AlertDialogProvider>
          <RouterProvider router={router} />
        </AlertDialogProvider>
      </MantineProvider>
    </ThemeProvider>
  </React.StrictMode>
);
