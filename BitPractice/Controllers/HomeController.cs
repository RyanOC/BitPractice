using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BitPractice.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Title = "PitPractice - Home";

            return View();
        }

        public ActionResult Help()
        {
            ViewBag.Title = "BitPractice - Help";

            return View();
        }
    }
}
