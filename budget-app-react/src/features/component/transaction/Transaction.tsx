import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TransactionInterface } from './models/TransactionInterface';

const API_URL = process.env.REACT_APP_API_URL || 'https://localhost:7290/api';

export const Transaction = () => {
  const [transactions, setTransactions] = useState<TransactionInterface[]>([]);
  const navigate = useNavigate();

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`${API_URL}/Transaction`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(response.data);
    } catch (error) {
      console.error('Failed to fetch transactions', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const deleteTransaction = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        const token = localStorage.getItem('auth_token');
        await axios.delete(`${API_URL}/Transaction/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchTransactions();
      } catch (error) {
        console.error('Failed to delete transaction', error);
      }
    }
  };

  const totalIncome = transactions
    .filter(t => t.type === 'Income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'Expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpenses;

  return (
    <div className="container-fluid px-4 mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Dashboard</h2>
        <button className="btn btn-primary" onClick={() => navigate('/add-transaction')}>
          <i className="bi bi-plus-lg"></i> Add Transaction
        </button>
      </div>
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className={`card h-100 text-white bg-opacity-75 ${totalIncome > 0 ? 'bg-success' : 'bg-secondary'}`}>
            <div className="card-body">
              <h5 className="card-title">Total Income</h5>
              <h3 className="card-text">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalIncome)}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className={`card h-100 text-white bg-opacity-75 ${totalExpenses > 0 ? 'bg-danger' : 'bg-secondary'}`}>
            <div className="card-body">
              <h5 className="card-title">Total Expenses</h5>
              <h3 className="card-text fw-bold">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalExpenses)}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className={`card h-100 text-white bg-opacity-75 ${netBalance >= 0 ? 'bg-primary' : 'bg-danger'}`}>
            <div className="card-body">
              <h5 className="card-title">Net Balance</h5>
              <h3 className="card-text">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(netBalance)}</h3>
            </div>
          </div>
        </div>
      </div>

      <h3 className="mt-4">Transactions</h3>
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th style={{ width: '30%' }}>Date</th>
              <th style={{ width: '15%' }}>Type</th>
              <th style={{ width: '15%' }}>Category</th>
              <th style={{ width: '15%' }}>Amount</th>
              <th style={{ width: '10%' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(transaction => (
              <tr key={transaction.id}>
                <td>{new Date(transaction.createdDate).toLocaleString('en-IN')}</td>
                <td>
                  <span className={`badge ${transaction.type === 'Income' ? 'bg-success-subtle text-success-emphasis' : 'bg-danger-subtle text-danger-emphasis'}`}>
                    {transaction.type}
                  </span>
                </td>
                <td>{transaction.category}</td>
                <td className={transaction.type === 'Income' ? 'text-success' : 'text-danger'}>
                  {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(transaction.amount)}
                </td>
                <td>
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => navigate(`/edit-transaction/${transaction.id}`)} title="Edit">
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => deleteTransaction(transaction.id)} title="Delete">
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {transactions.length === 0 && (
          <div className="text-center mt-3">
            <p>No transactions found. Click "Add Transaction" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};