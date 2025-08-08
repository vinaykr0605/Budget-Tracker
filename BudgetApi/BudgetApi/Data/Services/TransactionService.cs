using BudgetApi.Models;
using BudgetApi.Models.Dtos;
using BudgetApi.Models.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BudgetApi.Data.Services;

public class TransactionService(AppDbContext dbContext) : ITransaction
{
    public async Task<List<Transaction>> GetAllAsync(int userId)
    {
        // filtered by the authenticated user's ID.
        return await dbContext.Transactions
            .Where(t => t.UserId == userId)
            .AsNoTracking()
            .ToListAsync();
    }
    
    public async Task<Transaction?> GetByIdAsync(int id, int userId)
    {
        // Find the transaction ONLY if the ID and UserId match.
        return await dbContext.Transactions
            .AsNoTracking()
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
    }

    public async Task<Transaction> CreateAsync(PostTransaction transaction, int userId)
    {
        var newTransaction = new Transaction
        {
            UserId = userId, // Assign the transaction to the current user.
            Amount = transaction.Amount,
            Category = transaction.Category,
            Type = transaction.Type,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        };
        
        dbContext.Transactions.Add(newTransaction);
        await dbContext.SaveChangesAsync();
        return newTransaction;
    }

    public async Task<Transaction?> UpdateAsync(UpdateTransaction transaction, int id, int userId)
    {
        // Find the transaction to update, ensuring it belongs to the current user.
        var transactionToUpdate = await dbContext.Transactions
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
            
        if (transactionToUpdate != null)
        {
            transactionToUpdate.Amount = transaction.Amount;
            transactionToUpdate.Category = transaction.Category;
            transactionToUpdate.Type = transaction.Type;
            transactionToUpdate.UpdatedDate = DateTime.UtcNow;
            
            await dbContext.SaveChangesAsync();
        }
        return transactionToUpdate;
    }

    public async Task<bool> DeleteAsync(int id, int userId)
    {
        // Find the transaction to delete, ensuring it belongs to the current user.
        var transactionToDelete = await dbContext.Transactions
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

        if (transactionToDelete == null)
        {
            return false; // Not found for this user.
        }

        dbContext.Transactions.Remove(transactionToDelete);
        await dbContext.SaveChangesAsync();
        return true; 
    }
}
