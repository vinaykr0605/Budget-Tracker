using System.ComponentModel.DataAnnotations;

namespace BudgetApi.Models.Dtos;

public class PostTransaction
{
    [Required]
    public string Type { get; set; } =  String.Empty;

    [Required]
    public string Category { get; set; } = String.Empty;

    [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0.")]
    public double Amount { get; set; }
}