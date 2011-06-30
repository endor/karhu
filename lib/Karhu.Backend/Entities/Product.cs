using System;
using System.Collections.Generic;

namespace Karhu.Backend.Entities
{
	public class Product
	{
		public int Id { get; set; }
		public string Name { get; set; }
		public string Description { get; set; }
		public decimal UnitPrice { get; set; }
		public System.DateTime ValidTo { get; set; }
		public Nullable<int> Category_Id { get; set; }
		public virtual Category Category { get; set; }
	}
}

