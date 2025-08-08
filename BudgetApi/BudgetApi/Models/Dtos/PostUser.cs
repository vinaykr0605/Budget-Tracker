using System.ComponentModel.DataAnnotations;

namespace BudgetApi.Models.Dtos;

public class PostUser
{
    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    [MinLength(6)]
    public string Password { get; set; }
}