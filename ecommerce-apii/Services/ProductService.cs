using ecommerce_apii.Models;
using ecommerce_apii.Data;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Collections.Generic;

namespace ecommerce_apii.Services
{
    public class ProductService
    {
        private readonly IMongoCollection<Product> _products;

        public ProductService(IOptions<MongoDbSettings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            var database = client.GetDatabase(settings.Value.DatabaseName);
            _products = database.GetCollection<Product>("Products");
        }

        public List<Product> Get() =>
            _products.Find(product => true).ToList();

        public Product Get(string id) =>
            _products.Find(product => product.Id == id).FirstOrDefault();

        public Product Create(Product product)
        {
            _products.InsertOne(product);
            return product;
        }

        public void Update(string id, Product updatedProduct) =>
            _products.ReplaceOne(product => product.Id == id, updatedProduct);

        public void Remove(string id) =>
            _products.DeleteOne(product => product.Id == id);
    }
}