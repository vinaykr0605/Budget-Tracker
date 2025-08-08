using BudgetApi.Models.Base;

namespace BudgetApi.Models;

public class Transaction : BaseEntity
{
    public string Type { get; set; } = String.Empty;
    public string Category { get; set; } = String.Empty;
    public double Amount { get; set; }
    
    public int? UserId { get; set; }
    
    public virtual User? User { get; set; }
   
}