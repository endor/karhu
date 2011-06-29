using System;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using Karhu.Backend.Entities;
using Karhu.Backend.Mapping;

namespace Karhu.Backend
{
	public class karhuContext : DbContext
	{
		static karhuContext()
		{ 
			Database.SetInitializer<karhuContext>(null);
		}

		public DbSet<Category> Categories { get; set; }
		public DbSet<Product> Products { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
		{
            modelBuilder.Conventions.Remove<IncludeMetadataConvention>();
			modelBuilder.Configurations.Add(new CategoryMap());
			modelBuilder.Configurations.Add(new ProductMap());
		}
	}
}

