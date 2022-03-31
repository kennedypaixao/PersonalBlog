define([], () => {

	const GOOGLE_MAP_KEY = '<YOURGOOGLEAPIKEY>';

	const ipLookUp = async () => {
		try {
			const response = await $.ajax('http://ip-api.com/json');
			if (response) {
				console.log('Localizado o IP do usuário é:', response);
			}
		} catch (e) {
			console.error(e);
		}
	}

	const getAddress = async (latitude, longitude) => {
		try {
			const url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='
				+ latitude + ',' + longitude + '&key=' + GOOGLE_MAP_KEY;

			const response = await fetch(url);
			const json = await response.json();

			if (json) {
				const { results } = json;
				const firstAddress = results[0];
				$('#address-found').val(firstAddress.formatted_address);
				$('#address-found-input').show();
			}
		} catch (e) {
			console.log('Erro ao capturar endereco', e);
		}
	}

	const getGeolocation = () => {
		if ('geolocation' in navigator) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					console.log('latitude: ' + position.coords.latitude + ', longitude: ' + position.coords.longitude);
					getAddress(position.coords.latitude, position.coords.longitude)
				},
				(error) => {
					console.error(error);
				}
			)
		} else {
			console.log('geolocation não está habilitada nesse navegador');
			ipLookUp();
		}
	}

	return {
		getGeolocation
	}
});