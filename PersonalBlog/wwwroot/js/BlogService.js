define(['./Template.js', '../lib/showdown/showdown.js'], (template, showdown) => {

	const blogPostsUrl = '/Home/LatestBlogPosts/';
	const blogPostUrl = '/Home/Post/?link=';
	const loadMorePostsUrl = '/Home/MoreBlogPosts/?oldestBlogPostId=';

	let oldestBlogPostId = 0;

	const setOldestBlogPostId = (data) => {
		const ids = data.map((i) => i.postId);
		oldestBlogPostId = Math.min(...ids);
	}

	const loadData = async (url) => {
		try {
			const response = await fetch(url);
			const json = await response.json();

			setOldestBlogPostId(json);
			template.appendBlogList(json);
		} catch (e) {
			console.error('Erro ao carregar o data', e);
		}
	}

	const loadBlogPost = (link) => {
		fetch(blogPostUrl + link)
			.then((response) => {
				return response.text();
			})
			.then((data) => {
				const converter = new showdown.Converter();
				const html = converter.makeHtml(data);
				template.showBlogItem(html, link);
				window.location = '#' + link;
			})
			.catch((error) => {
				console.error(error);
			});
	}

	const loadMoreBlogPost = async () => {
		await loadData(loadMorePostsUrl + oldestBlogPostId);
	}

	const loadLatestBlogPosts = async () => {
		await loadData(blogPostsUrl);
	}

	return {
		loadLatestBlogPosts: loadLatestBlogPosts,
		loadBlogPost: loadBlogPost,
		loadMoreBlogPost: loadMoreBlogPost
	}
});

