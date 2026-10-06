import React from 'react';
import { ToastProvider } from './components/Common/Toast';
import { AuthProvider } from './components/Auth/AuthContext';
import { MainApp } from './components/MainApp';

export const App = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ToastProvider>
  );
};