const blogService = require('./BlogService.js');
const serviceWorker = require('./SwRegister.js');

let defferedPrompt;

window.addEventListener("beforeinstallprompt", (event) => {
	event.preventDefault();
	defferedPrompt = event;

	$('#install-container').show();
});

window.addEventListener("appinstalled", (event) => {
	event.preventDefault();

	console.log('app foi adicionado no home do SO');
});

if (!"BackgroundFetchManager" in self) {
	alert('Brackground fetch não está disponivel nesse site');
	return;
}

blogService.loadLatestBlogPosts();

window.pageEvents = {
	loadBlogPost: (link) => {
		blogService.loadBlogPost(link);
	},
	loadMoreBlogPosts: () => {
		blogService.loadMoreBlogPost();
	},
	tryAddHomeScreen: () => {
		defferedPrompt.prompt();
		defferedPrompt.userChoice.then((choiceResult) => {
			if (choiceResult.outcome === 'accepted') {
				console.log('Usuário aceitou o prompt');
				$('#install-container').hide();
			}
		});
	},
	setBackgroundFetch: async (link) => {
		const swRegister = await navigator.serviceWorker.ready;
		const bgFetch = await swRegister.backgroundFetch.fetch(
			link,
			['Home/Post/?link=' + link],
			{
				title: link,
				icons: [{
					sizes: '192x192',
					src: 'images/icon-192x192.png',
					type: 'image/png'
				}],
				downloadTotal: 15000
			}
		);

		bgFetch.addEventListener('progress', (event) => {
			if (!bgFetch.downloadTotal) return;

			const percent = Math.round(bgFetch.downloaded / bgFetch.downloadTotal * 100);
			console.log('Download progress: ' + percent + '%');
			console.log('Download status: ' + bgFetch.result);

			$(".download-start").hide();
			$("#status-download").show();

			$('#status-download > .progress > .progress-bar').css('width', percent + '%');

			if (bgFetch.result === 'success') {
				$('#status-download > .text-success').show();
				$('#status-download > .progress > .progress-bar').css('width', '100%');
			}
		});
	}
}