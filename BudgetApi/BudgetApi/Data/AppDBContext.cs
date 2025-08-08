using BudgetApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BudgetApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
        
    }
    public DbSet<Transaction> Transactions { get; set; }
    
    public DbSet<User>Users { get; set; }
}