using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BudgetApi.Data;
using BudgetApi.Models;
using BudgetApi.Models.Dtos;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace BudgetApi.Controllers;

[Route("api/[controller]")]
[ApiController]
[EnableCors("AllowAll")]
// Use ControllerBase for API controllers without view support.
public class AuthController : ControllerBase
{
    private readonly AppDbContext _dbContext;
    private readonly PasswordHasher<User> _passwordHasher;
    private readonly IConfiguration _configuration;

    // Inject IConfiguration to access app settings for JWT configuration.
    public AuthController(AppDbContext dbContext, PasswordHasher<User> passwordHasher, IConfiguration configuration)
    {
        _dbContext = dbContext;
        _passwordHasher = passwordHasher;
        _configuration = configuration;
    }

    /// <summary>
    /// Generates a JSON Web Token for a given user.
    /// </summary>
    /// <param name="user">The user to create the token for.</param>
    /// <returns>A JWT string.</returns>
    private string GenerateJwtToken(User user)
    {
        // --- Security Improvement: Retrieve JWT settings from configuration ---

        var jwtKey = _configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key is not configured.");
        var jwtIssuer = _configuration["Jwt:Issuer"] ?? throw new InvalidOperationException("JWT Issuer is not configured.");
        var jwtAudience = _configuration["Jwt:Audience"] ?? throw new InvalidOperationException("JWT Audience is not configured.");

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email!),
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: jwtIssuer,
            audience: jwtAudience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    /// <summary>
    /// Registers a new user and returns a JWT.
    /// </summary>
    [HttpPost("Register")]
    public async Task<IActionResult> Register([FromBody] PostUser payload)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        // Use async method to check for user existence without blocking a thread.
        if (await _dbContext.Users.AnyAsync(u => u.Email == payload.Email))
        {
            return BadRequest("This email address already exists.");
        }

        var newUser = new User
        {
            Email = payload.Email,
            CreatedDate = DateTime.UtcNow,
            UpdatedDate = DateTime.UtcNow
        };
        
        // Hash the password for the new user.
        var hashedPassword = _passwordHasher.HashPassword(newUser, payload.Password);
        newUser.Password = hashedPassword;

        // Use async methods for database operations.
        await _dbContext.Users.AddAsync(newUser);
        await _dbContext.SaveChangesAsync();

        var token = GenerateJwtToken(newUser);

        return Ok(new { Token = token });
    }

    /// <summary>
    /// Authenticates a user and returns a JWT.
    /// </summary>
    [HttpPost("Login")]
    public async Task<IActionResult> Login([FromBody] LoginUser payload)
    {
        // Use async method to find the user.
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == payload.Email);
        
        if (user == null)
        {
            // Use a generic message to prevent leaking information about which emails are registered.
            return Unauthorized("Invalid credentials.");
        }

        // VerifyHashedPassword is a CPU-bound operation and does not have an async version.
        // It runs quickly enough not to require special handling.
        var result = _passwordHasher.VerifyHashedPassword(user, user.Password, payload.Password);
        
        if (result == PasswordVerificationResult.Failed)
        {
            return Unauthorized("Invalid credentials.");
        }

        var token = GenerateJwtToken(user);
        return Ok(new { Token = token });
    }
}
