import axios from 'axios';

export const fetchProPublicaCongressAPI = async (url) => {
	const response = await axios.get(
		url, {
			headers: {
				"Content-Type": "application/json",
				"X-API-Key": "xED9QexJSbpKYzAVOvgOvEnUpJHn6V1BfSpAPwJ"
			}
		}
	);
	return response.data.results[0].bills;
}

export const fetchBillText = async (url) => {
	const response = await axios.get(url)
	return response.data
}