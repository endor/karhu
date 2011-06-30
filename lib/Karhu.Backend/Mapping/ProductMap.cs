using System;
using System.Data.Entity.ModelConfiguration;
using System.Data.Common;
using System.Data.Entity;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Karhu.Backend.Entities;

namespace Karhu.Backend.Mapping
{
	public class ProductMap : EntityTypeConfiguration<Product>
	{
		public ProductMap()
		{
			// Primary Key
			this.HasKey(t => t.Id);

			// Properties
			this.Property(t => t.Name)
				.IsRequired()
				.HasMaxLength(100);
				
			this.Property(t => t.Description)
				.IsRequired();
				
			// Table & Column Mappings
			this.ToTable("Products");
			this.Property(t => t.Id).HasColumnName("Id");
			this.Property(t => t.Name).HasColumnName("Name");
			this.Property(t => t.Description).HasColumnName("Description");
			this.Property(t => t.UnitPrice).HasColumnName("UnitPrice");
			this.Property(t => t.ValidTo).HasColumnName("ValidTo");
			this.Property(t => t.Category_Id).HasColumnName("Category_Id");

			// Relationships
			this.HasOptional(t => t.Category)
				.WithMany(t => t.Products)
				.HasForeignKey(d => d.Category_Id);
				
		}
	}
}

