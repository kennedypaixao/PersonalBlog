const blogService = require('./BlogService.js');
const serviceWorker = require('./SwRegister.js');

blogService.loadLatestBlogPosts();

window.pageEvents = {
	loadBlogPost: (link) => {
		blogService.loadBlogPost(link);
	},
	loadMoreBlogPosts: () => {
		blogService.loadMoreBlogPost();
	}
}