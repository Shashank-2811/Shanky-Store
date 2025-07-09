using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using ecommerce_apii.Models;
using ecommerce_apii.Services;
using ecommerce_apii.Data;

namespace ecommerce_apii.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;
        private readonly AppDbContext _context;

        public AuthController(AuthService authService, AppDbContext context)
        {
            _authService = authService;
            _context = context;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterDto dto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Password))
                    return BadRequest("Username and password are required.");

                if (_context.Users.Any(u => u.Username == dto.Username))
                    return BadRequest("Username already exists");

                var user = new User
                {
                    Username = dto.Username,
                    PasswordHash = HashPassword(dto.Password),
                    Role = "Customer"
                };
                _context.Users.Add(user);
                _context.SaveChanges();
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto login)
        {
            // Hardcoded admin access
            if (login.Username == "admin" && login.Password == "123")
            {
                var adminUser = new User
                {
                    Id = 0,
                    Username = "admin",
                    Role = "Admin"
                };
                var token = _authService.GenerateJwtToken(adminUser);
                return Ok(new { token, user = new { adminUser.Id, adminUser.Username, adminUser.Role } });
            }

            // Normal user login
            var user = _context.Users.SingleOrDefault(u => u.Username == login.Username);
            if (user == null || user.PasswordHash != HashPassword(login.Password))
                return Unauthorized();

            var userToken = _authService.GenerateJwtToken(user);
            return Ok(new { token = userToken, user = new { user.Id, user.Username, user.Role } });
        }

        private string HashPassword(string password)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                var passwordBytes = Encoding.UTF8.GetBytes(password);
                var hashBytes = sha256.ComputeHash(passwordBytes);
                return Convert.ToBase64String(hashBytes);
            }
        }
    }
}