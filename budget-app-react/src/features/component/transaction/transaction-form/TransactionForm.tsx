import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { TransactionInterface } from '../models/TransactionInterface';

const API_URL = process.env.REACT_APP_API_URL || 'https://localhost:7290/api';

const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Bonus'];
const expenseCategories = ['Groceries', 'Entertainment', 'Health', 'Food', 'Shopping', 'Utilities'];

export const TransactionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<TransactionInterface>();
  const type = watch('type');

  useEffect(() => {
    if (isEditMode) {
      const fetchTransaction = async () => {
        try {
          const token = localStorage.getItem('auth_token');
          const response = await axios.get(`${API_URL}/Transaction/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const transaction = response.data;
          setValue('type', transaction.type);
          setValue('category', transaction.category);
          setValue('amount', transaction.amount);
          setValue('createdDate', new Date(transaction.createdDate).toISOString().split('T')[0]);
        } catch (error) {
          console.error('Failed to fetch transaction', error);
        }
      };
      fetchTransaction();
    } else {
      setValue('createdDate', new Date().toISOString().split('T')[0]);
    }
  }, [id, isEditMode, setValue]);


  const onSubmit = async (data: TransactionInterface) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (isEditMode) {
        await axios.put(`${API_URL}/Transaction/${id}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_URL}/Transaction`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      navigate('/transactions');
    } catch (error) {
      console.error('Failed to save transaction', error);
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-header bg-light py-3">
              <h3 className="card-title mb-0 fw-semibold">{isEditMode ? 'Edit Transaction' : 'Add Transaction'}</h3>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                  <label htmlFor="type" className="form-label fw-medium">Type</label>
                  <select className="form-select form-select-lg" id="type" {...register('type')}>
                    <option value="Expense">Expense</option>
                    <option value="Income">Income</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="category" className="form-label fw-medium">Category</label>
                  <select className={`form-select form-select-lg ${errors.category ? 'is-invalid' : ''}`} id="category" {...register('category', { required: 'Category is required' })}>
                    <option value="">Select a category</option>
                    {(type === 'Income' ? incomeCategories : expenseCategories).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {errors.category && <div className="invalid-feedback">{errors.category.message}</div>}
                </div>
                <div className="mb-4">
                  <label htmlFor="amount" className="form-label fw-medium">Amount</label>
                  <div className="input-group">
                    <span className="input-group-text">INR</span>
                    <input
                      type="number"
                      className={`form-control form-control-lg ${errors.amount ? 'is-invalid' : ''}`}
                      id="amount"
                      {...register('amount', { required: 'Amount is required', valueAsNumber: true, min: { value: 0.01, message: 'Amount must be a positive number' } })}
                    />
                  </div>
                  {errors.amount && <div className="invalid-feedback d-block">{errors.amount.message}</div>}
                </div>
                <div className="mb-4">
                  <label htmlFor="date" className="form-label fw-medium">Date</label>
                  <input type="date" className={`form-control form-control-lg ${errors.createdDate ? 'is-invalid' : ''}`} id="date" {...register('createdDate', { required: 'Date is required' })} />
                  {errors.createdDate && <div className="invalid-feedback">{errors.createdDate.message}</div>}
                </div>
                <div className="d-flex justify-content-end gap-4">
                  <button type="button" className="btn btn-secondary btn-lg" onClick={() => navigate('/transactions')}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-lg">
                    {isEditMode ? 'Save Changes' : 'Add Transaction'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};