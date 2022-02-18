﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PersonalBlog.Models;
using PersonalBlog.Services;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace PersonalBlog.Controllers
{
	public class HomeController : Controller
	{
		private readonly ILogger<HomeController> _logger;
		private readonly IBlogService _blogService;

		public HomeController(ILogger<HomeController> logger, IBlogService blogService)
		{
			_logger = logger;
			_blogService = blogService;
		}

		public IActionResult Index()
		{
			return View();
		}

		public IActionResult Privacy()
		{
			return View();
		}

		[ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
		public IActionResult Error()
		{
			return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
		}

		[HttpGet]
		public JsonResult LatestBlogPosts()
		{
			var posts = _blogService.GetLatestPosts();

			return Json(posts);
		}
	}
}
