import { Routes, Route, Navigate } from 'react-router-dom';
import { SignupLogin } from './features/component/signup-login/SignupLogin';
import { Transaction } from './features/component/transaction/Transaction';
import { TransactionForm } from './features/component/transaction/transaction-form/TransactionForm';
import { useAuth } from './core/hooks/useAuth';

export const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <SignupLogin isLoginMode={true} /> : <Navigate to="/transactions" />} />
      <Route path="/signup" element={!isAuthenticated ? <SignupLogin isLoginMode={false} /> : <Navigate to="/transactions" />} />
      <Route path="/transactions" element={isAuthenticated ? <Transaction /> : <Navigate to="/login" />} />
      <Route path="/add-transaction" element={isAuthenticated ? <TransactionForm /> : <Navigate to="/login" />} />
      <Route path="/edit-transaction/:id" element={isAuthenticated ? <TransactionForm /> : <Navigate to="/login" />} />
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};