define([], () => {

	let oldestBlogPostId = 0;
	const limit = 3;

	const blogInstance = localforage.createInstance({ name: 'blog' });

	const addPost = async (posts) => {
		try {
			const keyValuePair = posts.map(function (p) { return { key: p.postId, value: p } });
			await blogInstance.setItems(keyValuePair);

		} catch (e) {
			console.error(e);
		}
	}

	const addPostText = async (link, text) => {
		try {
			return await blogInstance.setItem('#' + link, text);
		} catch (e) {
			console.error(e);
		}
	}

	const getPosts = async () => {
		try {
			const keys = await blogInstance.keys();
			const keysWithoutLinks = keys.filter((e) => {
				return !e.toString().includes('#');
			})

			let index = keysWithoutLinks.indexOf(oldestBlogPostId);

			if (index === -1) {
				index = keysWithoutLinks.length;
			} else if(index === 0) {
				return [];
			}

			const start = index - limit;
			const limitAdjusted = start < 0 ? index : limit;
			const keysSpliced = keysWithoutLinks.splice(Math.max(0, start), limitAdjusted);

			const items = await blogInstance.getItems(keysSpliced);
			if (items) {
				const post = Object.keys(items).map(function (k) {
					return items[k];
				}).reverse();

				oldestBlogPostId = post[post.length - 1].postId;

				return post;
			}

		} catch (e) {
			console.error(e);
		}
	}

	const getPostText = async (link) => {
		try {
			return await blogInstance.getItem('#' + link);
		} catch (e) {
			console.error(e);
		}
	}

	const getOldestBlogPostId = () => {
		return oldestBlogPostId;
	}

	return {
		addPost: addPost,
		addPostText: addPostText,
		getPosts: getPosts,
		getPostText: getPostText,
		getOldestBlogPostId: getOldestBlogPostId
	}

});