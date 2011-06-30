using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Karhu.Backend.Models;
using System.Globalization;
using Extensions;
using Karhu.Backend.Entities;

namespace Karhu.Backend.Controllers
{
    public class ProductsController : KarhuBaseController
    {
        private karhuContext db = new karhuContext();

        public ActionResult Index(int? id, int? page, int? per_page)
        {
            if ((!page.HasValue || !per_page.HasValue) && !id.HasValue)
            {
                var completeQuery = from product in db.Products
                                    select product;
                List<ProductData> allProducts = new List<ProductData>();
                foreach (var item in completeQuery)
                {
                    var product = new ProductData
                    {
                        id = item.Id,
                        name = item.Name,
                        description = item.Description,
                        unit_price = item.UnitPrice.ToString(),
                        valid_to = item.ValidTo.ToShortDateString(),
                        category_id = item.Category_Id
                    };
                    allProducts.Add(product);
                }

                return Json(allProducts, JsonRequestBehavior.AllowGet);
            }


            var total = db.Products.Count();
            var total_pages = Math.Ceiling(Convert.ToDouble(total) / Convert.ToDouble(per_page));


            var query = from product in db.Products
                        select product;

            if (id != null)
            {
                query = query.Where(p => p.Id == id);
            }
            else
            {
                query = query.OrderBy(p => p.Id);
                query = query.Skip((page.Value - 1) * per_page.Value).Take(per_page.Value);
            }

            List<ProductData> productsList = new List<ProductData>();
            foreach (var product in query)
            {
                var productData = new ProductData();
                productData.id = product.Id;
                productData.name = product.Name;
                productData.description = product.Description;
                productData.unit_price = product.UnitPrice.ToString();
                productData.valid_to = product.ValidTo.ToShortDateString();
                productData.category_id = product.Category_Id;
                productsList.Add(productData);
            }

            if (!id.HasValue)
            {
                var paginated = new PaginatedData<ProductData>
                {
                    current_page = page.Value,
                    per_page = per_page.ToString(),
                    total_pages = Convert.ToInt32(total_pages),
                    total_entries = total,
                    values = productsList
                };
                return Json(paginated, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(productsList[0], JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPut]
        [ActionName("Index")]
        public ActionResult IndexPut(ProductData product)
        {
            var modifyProduct = db.Products.Single(p => p.Id == product.id);
            modifyProduct.Name = product.name;
            modifyProduct.Description = product.description;
            modifyProduct.UnitPrice = decimal.Parse(product.unit_price, NumberStyles.Currency);
            modifyProduct.ValidTo = product.valid_to.ToDateTime();
            modifyProduct.Category_Id = product.category_id;
            db.SaveChanges();
            return Json(product);
        }

        [HttpPost]
        public ActionResult Index(ProductData product)
        {
            Product newProduct = new Product();
            newProduct.Name = product.name;
            newProduct.Description = product.description;
            newProduct.UnitPrice = decimal.Parse(product.unit_price, NumberStyles.Currency);
            newProduct.ValidTo = product.valid_to.ToDateTime();
            newProduct.Category_Id = product.category_id;
            db.Products.Add(newProduct);
            db.SaveChanges();
            product.id = newProduct.Id;
            return Json(product);
        }

        [HttpDelete]
        public ActionResult Index(int id)
        {
            var deleteProduct = db.Products.Single(p => p.Id == id);
            db.Products.Remove(deleteProduct);
            db.SaveChanges();
            return Json(null);
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }

    }
}
