using System;

namespace Karhu.Backend.Models
{
    public class ProductData
    {
        public int id { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public string unit_price { get; set; }
        public string valid_to { get; set; }
        public int? category_id { get; set; }
    }
}