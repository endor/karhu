using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Security.Cryptography;
using System.Text;
using Extensions;
using System.Globalization;

namespace Karhu.Backend.Controllers
{
    public class KarhuBaseController : Controller
    {
        protected override void Execute(System.Web.Routing.RequestContext requestContext)
        {
            var response = requestContext.HttpContext.Response;
            var request = requestContext.HttpContext.Request;

            var token = request.Headers["X-Karhu-Authentication"];
            var mytoken = GetToken("demo", "geheim");

            if (string.Compare(token, mytoken, false) != 0)
            {
                response.StatusCode = 403;
                response.Write("Not Authorized");
                return;
            }
            else
            {
                base.Execute(requestContext);
            }
        }

        private string GetToken(string username, string password)
        {
            var secret = username + password;
            var sha = new SHA256CryptoServiceProvider();
            byte[] hash = sha.ComputeHash(Encoding.UTF8.GetBytes(secret));

            return string.Format("user=\"{0}\", token=\"{1}\"", username, hash.ToString("x2"));
        }
    }
}
