using ecommerce_apii.Data;
using ecommerce_apii.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace ecommerce_apii.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    //[Authorize] // Temporarily remove for debugging
    public class CartController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CartController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetCart()
        {
            //var userId = int.Parse(User.Claims.First(c => c.Type == System.Security.Claims.ClaimTypes.NameIdentifier).Value);
            var userId = 1; // Hardcoded for debugging
            var cart = _context.CartItems.Where(c => c.UserId == userId).ToList();
            System.Console.WriteLine($"[GetCart] UserId: {userId}, Cart count: {cart.Count}");
            return Ok(cart);
        }

        [HttpPost]
        public IActionResult AddToCart([FromBody] CartItem item)
        {
            //var userId = int.Parse(User.Claims.First(c => c.Type == System.Security.Claims.ClaimTypes.NameIdentifier).Value);
            var userId = 1; // Hardcoded for debugging
            var existing = _context.CartItems.FirstOrDefault(c => c.UserId == userId && c.ProductId == item.ProductId);
            if (existing != null)
            {
                existing.Quantity += item.Quantity;
                System.Console.WriteLine($"[AddToCart] Updated quantity for UserId: {userId}, ProductId: {item.ProductId}, New Quantity: {existing.Quantity}");
            }
            else
            {
                item.UserId = userId;
                _context.CartItems.Add(item);
                System.Console.WriteLine($"[AddToCart] Added new item for UserId: {userId}, ProductId: {item.ProductId}, Quantity: {item.Quantity}");
            }
            _context.SaveChanges();
            return Ok();
        }

        [HttpDelete("{productId}")]
public IActionResult RemoveFromCart(string productId)
{
    var userId = int.Parse(User.Claims.First(c => c.Type == System.Security.Claims.ClaimTypes.NameIdentifier).Value);
    var item = _context.CartItems.FirstOrDefault(c => c.UserId == userId && c.ProductId == productId);
    if (item == null) return NotFound();
    _context.CartItems.Remove(item);
    _context.SaveChanges();
    return Ok();
}
    }
}