define([], () => {

	let oldestBlogPostId = 0;
	const limit = 3;

	const blogInstance = localforage.createInstance({ name: 'blog' });

	const addPost = async (post) => {
		try {
			const keyValuePair = post.map(function (p) { return { key: p.postId, value: p } });
			await blogInstance.setItems(keyValuePair);

		} catch (e) {
			console.error(e);
		}
	}

	const getPosts = async () => {
		try {
			const keys = await blogInstance.keys();
			let index = keys.indexOf(oldestBlogPostId);

			if (index === -1) {
				index = keys.length;
			} else if(index === 0) {
				return [];
			}

			const start = index - limit;
			const limitAdjusted = start < 0 ? index : limit;
			const keysSpliced = keys.splice(Math.max(0, start), limitAdjusted);

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

	const getOldestBlogPostId = () => {
		return oldestBlogPostId;
	}

	return {
		addPost: addPost,
		getPosts: getPosts,
		getOldestBlogPostId: getOldestBlogPostId
	}

});