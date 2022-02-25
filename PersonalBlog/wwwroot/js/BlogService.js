define(['./Template.js', '../lib/showdown/showdown.js', './ClienteStorage.js'], (template, showdown, clienteStorage) => {

	const blogPostsUrl = '/Home/LatestBlogPosts/';
	const blogPostUrl = '/Home/Post/?link=';
	const loadMorePostsUrl = '/Home/MoreBlogPosts/?oldestBlogPostId=';

	const loadData = async (url) => {
		let posts = [];
		let connectionStatus = '';

		try {
			const response = await fetch(url);
			const json = await response.json();
			clienteStorage.addPost(json);
			connectionStatus = 'Conexão com a API ok';
		} catch (e) {
			console.error('Erro ao carregar o data', e);
			connectionStatus = 'Não foi possivel buscar dados da API, vamos seguir offline';
		}

		posts = await clienteStorage.getPosts();
		template.appendBlogList(posts);
		$("#connection-status").html(connectionStatus);
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
		await loadData(loadMorePostsUrl + clienteStorage.getOldestBlogPostId());
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

