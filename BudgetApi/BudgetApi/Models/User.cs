﻿using BudgetApi.Models.Base;

namespace BudgetApi.Models;

public class User : BaseEntity
{
    public string Email { get; set; } 
    
    public string Password { get; set; } 
    
    public List<Transaction> Transactions { get; set; } 
}