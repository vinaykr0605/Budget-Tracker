using System.Security.Claims;
using BudgetApi.Models.Dtos;
using BudgetApi.Models.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace BudgetApi.Controllers;

[Route("api/[controller]")]
[ApiController]
[EnableCors("AllowAll")]
[Authorize] // IMPORTANT: Ensures only authenticated users can access this controller.
public class TransactionController : ControllerBase
{
    private readonly ITransaction _transactionService;

    public TransactionController(ITransaction transactionService)
    {
        _transactionService = transactionService;
    }

    // A helper property to get the current user's ID from the JWT claims.
    private int CurrentUserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) 
                                           ?? throw new InvalidOperationException("User ID not found in token."));

    /// <summary>
    /// Gets all transactions for the currently authenticated user.
    /// </summary>
    [HttpGet] // GET /api/Transaction
    public async Task<IActionResult> GetAllTransactions()
    {
        var allTransactions = await _transactionService.GetAllAsync(CurrentUserId);
        return Ok(allTransactions);
    }

    /// <summary>
    /// Gets a specific transaction by its ID, ensuring it belongs to the current user.
    /// </summary>
    [HttpGet("{id}")] // GET /api/Transaction/5
    public async Task<IActionResult> GetTransactionById(int id)
    {
        // The service layer will now also check for user ownership.
        var transaction = await _transactionService.GetByIdAsync(id, CurrentUserId);
        if (transaction == null)
        {
            return NotFound($"Transaction with ID {id} not found for the current user.");
        }
        return Ok(transaction);
    }

    /// <summary>
    /// Creates a new transaction for the current user.
    /// </summary>
    [HttpPost] // POST /api/Transaction
    public async Task<IActionResult> CreateTransaction([FromBody] PostTransaction payload)
    {
        var newTransaction = await _transactionService.CreateAsync(payload, CurrentUserId);
        
        // Return 201 Created with a link to the new resource.
        return CreatedAtAction(nameof(GetTransactionById), new { id = newTransaction.Id }, newTransaction);
    }

    /// <summary>
    /// Updates a transaction, ensuring it belongs to the current user.
    /// </summary>
    [HttpPut("{id}")] // PUT /api/Transaction/5
    public async Task<IActionResult> UpdateTransaction(int id, [FromBody] UpdateTransaction payload)
    {
        var updatedTransaction = await _transactionService.UpdateAsync(payload, id, CurrentUserId);
        if (updatedTransaction == null)
        {
            return NotFound($"Transaction with ID {id} not found for the current user.");
        }
        
        // Return 204 No Content for a successful update.
        return NoContent();
    }

    /// <summary>
    /// Deletes a transaction, ensuring it belongs to the current user.
    /// </summary>
    [HttpDelete("{id}")] // DELETE /api/Transaction/5
    public async Task<IActionResult> DeleteTransaction(int id)
    {
        var success = await _transactionService.DeleteAsync(id, CurrentUserId);
        if (!success)
        {
            return NotFound($"Transaction with ID {id} not found for the current user.");
        }
        
        // Return 204 No Content for a successful deletion.
        return NoContent();
    }
}
