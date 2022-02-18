define(['./Template.js'], (template) => {

	const blogPostUrl = '/Home/LatestBlogPosts/';

	const loadLatestBlogPosts = () => {
		fetch(blogPostUrl)
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				console.log(data);
				template.appendBlogList(data);
			})
			.catch((error) => {
				console.error('Erro ao carregar blogs', error);
			});
	}

	return {
		loadLatestBlogPosts: loadLatestBlogPosts
	}
});

