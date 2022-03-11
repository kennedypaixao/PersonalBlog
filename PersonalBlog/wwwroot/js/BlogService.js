define(['./Template.js', '../lib/showdown/showdown.js', './ClienteStorage.js'], (template, showdown, clienteStorage) => {

	const blogPostsUrl = '/Home/LatestBlogPosts/';
	const blogPostUrl = '/Home/Post/?link=';
	const loadMorePostsUrl = '/Home/MoreBlogPosts/?oldestBlogPostId=';

	const loadData = async (url, link, isText) => {
		let connectionStatus = '';
		link = link || '';

		try {
			const response = await fetch(url + link);

			if (isText) {
				const text = await response.text();
				await clienteStorage.addPostText(link, text);
			} else {
				const json = await response.json();
				await clienteStorage.addPost(json);
			}
			
			connectionStatus = 'Conexão com a API ok';
		} catch (e) {
			console.error('Erro ao carregar o data', e);
			connectionStatus = 'Não foi possivel buscar dados da API, vamos seguir offline';
		}

		$("#connection-status").html(connectionStatus);
	}

	const loadBlogPost = async (link) => {
		await loadData(blogPostUrl, link, true);

		const text = await clienteStorage.getPostText(link);
		if (text) {
			const converter = new showdown.Converter();
			const html = converter.makeHtml(text);
			template.showBlogItem(html, link);
			window.location = '#' + link;
		} else {
			const emptyState = $("#blog-content-not-found").html().replace(/{{Link}}/g, link);;
			template.showBlogItem(emptyState, link);
			window.location = "#blog-content-not-found";
		}
	}

	const loadPostsData = async (url) => {
		await loadData(url);
		const posts = await clienteStorage.getPosts();
		if (posts && posts.length > 0) {
			const oldestBlogPostId = clienteStorage.getOldestBlogPostId();
			template.appendBlogList(posts, oldestBlogPostId);
		} else {
			$("#connection-status").html('Não há mais posts em cache para exibir');
			window.location = "#connection-status";
		}
	}

	const loadMoreBlogPost = async () => {
		await loadPostsData(loadMorePostsUrl + clienteStorage.getOldestBlogPostId());
	}

	const loadLatestBlogPosts = async () => {
		await loadPostsData(blogPostsUrl);
	}

	return {
		loadLatestBlogPosts: loadLatestBlogPosts,
		loadBlogPost: loadBlogPost,
		loadMoreBlogPost: loadMoreBlogPost
	}
});

