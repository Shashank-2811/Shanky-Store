using System;
using System.Collections.Generic;

namespace ecommerce_apii.Models
{
    public class Order
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public DateTime OrderDate { get; set; }
        public List<OrderItem> Items { get; set; }
        public decimal Total { get; set; }
    }

    public class OrderItem
    {
        public int Id { get; set; }
        public string ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }
}