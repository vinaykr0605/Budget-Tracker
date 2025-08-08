namespace BudgetApi.Models.Dtos;

public class UpdateTransaction
{
    public string Type { get; set; } =  String.Empty;
    public string Category { get; set; } = String.Empty;
    public double Amount { get; set; }
}
