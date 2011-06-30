using System;
using System.Collections.Generic;

namespace Karhu.Backend.Entities
{
	public class Category
	{
	    public Category()
		{
			this.Products = new List<Product>();
		}

		public int Id { get; set; }
		public string Name { get; set; }
		public string Description { get; set; }
		public virtual ICollection<Product> Products { get; set; }
	}
}

