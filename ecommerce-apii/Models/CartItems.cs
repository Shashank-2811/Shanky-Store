namespace ecommerce_apii.Models
{
    public class CartItem
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string ProductId { get; set; }
        public int Quantity { get; set; }
    }
}