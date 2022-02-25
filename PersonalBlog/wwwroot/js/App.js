var blogService = require('./BlogService.js');

blogService.loadLatestBlogPosts();

window.pageEvents = {
	loadBlogPost: (link) => {
		blogService.loadBlogPost(link);
	},
	loadMoreBlogPosts: () => {
		blogService.loadMoreBlogPost();
	}
}