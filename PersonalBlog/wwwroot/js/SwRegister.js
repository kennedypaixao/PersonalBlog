if ('serviceWorker' in navigator) {

	navigator.serviceWorker.register('sw.js')
		.then((registration) => {
			console.log('ServiceWorker registrado com sucesso no escopo', registration.scope)
		}, (error) => {
			console.error('Falha ao registrar o ServiceWorker', error);
		});
}