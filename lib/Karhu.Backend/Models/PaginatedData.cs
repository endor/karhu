using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Karhu.Backend.Models
{
    public class PaginatedData<T> where T: class
    {
        public int current_page { get; set; }
        public string per_page { get; set; }
        public int total_entries { get; set; }
        public int total_pages { get; set; }
        public List<T> values { get; set; }
    }
}