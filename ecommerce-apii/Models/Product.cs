using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ecommerce_apii.Models
{
    public class Product
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }  // <-- string, not int

        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string ImageUrl { get; set; }
        public string Category { get; set; }
    }
}