using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Karhu.Backend.Models;
using Karhu.Backend.Entities;

namespace Karhu.Backend.Controllers
{
    public class CategoriesController : KarhuBaseController
    {
        private karhuContext db = new karhuContext();

        public ActionResult Index(int? id, int? page, int? per_page)
        {
            if ((!page.HasValue || !per_page.HasValue) && !id.HasValue)
            {
                var completeQuery = from category in db.Categories
                            select new CategoryData
                            {
                                id = category.Id,
                                name = category.Name,
                                description = category.Description
                            };
                return Json(completeQuery.ToList(), JsonRequestBehavior.AllowGet);
            }


            var total = db.Categories.Count();
            var total_pages = Math.Ceiling(Convert.ToDouble(total) / Convert.ToDouble(per_page));

            var query = from category in db.Categories
                        select category;

            if (id != null)
            {
                query = query.Where(c => c.Id == id);
            }
            else
            {
                query = query.OrderBy(c => c.Id);
                query = query.Skip((page.Value - 1) * per_page.Value).Take(per_page.Value);
            }

            List<CategoryData> categoriesList = new List<CategoryData>();
            foreach (var category in query)
            {
                var categoryData = new CategoryData();
                categoryData.id = category.Id;
                categoryData.name = category.Name;
                categoryData.description = category.Description;
                categoriesList.Add(categoryData);
            }

            if (!id.HasValue)
            {
                var paginated = new PaginatedData<CategoryData>
                {
                    current_page = page.Value,
                    per_page = per_page.ToString(),
                    total_pages = Convert.ToInt32(total_pages),
                    total_entries = total,
                    values = categoriesList
                };
                return Json(paginated, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(categoriesList[0], JsonRequestBehavior.AllowGet);
            }
        }


        [HttpPut]
        [ActionName("Index")]
        public ActionResult IndexPut(CategoryData category)
        {
            var modifyCategory = db.Categories.Single(c => c.Id == category.id);
            modifyCategory.Name = category.name;
            modifyCategory.Description = category.description;
            db.SaveChanges();
            return Json(category);
        }

        [HttpPost]
        public ActionResult Index(CategoryData category)
        {
            Category newCategory = new Category();
            newCategory.Name = category.name;
            newCategory.Description = category.description;
            db.Categories.Add(newCategory);
            db.SaveChanges();
            category.id = newCategory.Id;
            return Json(category);
        }

        [HttpDelete]
        public ActionResult Index(int id)
        {
            var deleteCategory = db.Categories.Single(c => c.Id == id);
            db.Categories.Remove(deleteCategory);
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
