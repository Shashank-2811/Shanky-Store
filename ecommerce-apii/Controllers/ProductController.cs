using ecommerce_apii.Data;
using ecommerce_apii.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using ecommerce_apii.Services;

namespace ecommerce_apii.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly ProductService _productService;

        public ProductController(ProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Product>> GetProducts()
        {
            return Ok(_productService.Get());
        }

        [HttpGet("{id}")]
        public ActionResult<Product> GetProduct(string id)
        {
            var product = _productService.Get(id);
            if (product == null) return NotFound();
            return Ok(product);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public IActionResult AddProduct([FromBody] ProductCreateDto dto)
        {
            var product = new Product
            {
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                ImageUrl = dto.ImageUrl,
                Category = dto.Category
            };
            var created = _productService.Create(product);
            return Ok(created);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public IActionResult UpdateProduct(string id, [FromBody] Product updated)
        {
            var product = _productService.Get(id);
            if (product == null) return NotFound();
            updated.Id = id;
            _productService.Update(id, updated);
            return Ok(updated);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public IActionResult DeleteProduct(string id)
        {
            var product = _productService.Get(id);
            if (product == null) return NotFound();
            _productService.Remove(id);
            return Ok();
        }
    }
}