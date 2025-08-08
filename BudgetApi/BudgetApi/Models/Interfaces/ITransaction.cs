using BudgetApi.Models;
using BudgetApi.Models.Dtos;

namespace BudgetApi.Models.Interfaces;

public interface ITransaction
{
    Task<List<Transaction>> GetAllAsync(int userId);
    Task<Transaction?> GetByIdAsync(int id, int userId);
    Task<Transaction> CreateAsync(PostTransaction postTransaction, int userId);
    Task<Transaction?> UpdateAsync(UpdateTransaction updateTransaction, int id, int userId);
    Task<bool> DeleteAsync(int id, int userId);
}