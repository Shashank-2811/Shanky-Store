using ecommerce_apii.Data;
using ecommerce_apii.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ecommerce_apii.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OrderController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrderController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetOrders()
        {
            var userId = int.Parse(User.Claims.First(c => c.Type == System.Security.Claims.ClaimTypes.NameIdentifier).Value);
            var orders = _context.Orders.Where(o => o.UserId == userId).ToList();
            return Ok(orders);
        }

        [HttpPost]
        public IActionResult PlaceOrder()
        {
            var userId = int.Parse(User.Claims.First(c => c.Type == System.Security.Claims.ClaimTypes.NameIdentifier).Value);
            var cartItems = _context.CartItems.Where(c => c.UserId == userId).ToList();
            if (!cartItems.Any()) return BadRequest("Cart is empty.");

            var order = new Order
            {
                UserId = userId,
                OrderDate = DateTime.UtcNow,
                Items = cartItems.Select(c => new OrderItem
                {
                    ProductId = c.ProductId,
                    Quantity = c.Quantity,
                    Price = _context.Products.FirstOrDefault(p => p.Id == c.ProductId)?.Price ?? 0
                }).ToList(),
                Total = cartItems.Sum(c => (_context.Products.FirstOrDefault(p => p.Id == c.ProductId)?.Price ?? 0) * c.Quantity)
            };

            _context.Orders.Add(order);
            _context.CartItems.RemoveRange(cartItems);
            _context.SaveChanges();
            return Ok(order);
        }
    }
}