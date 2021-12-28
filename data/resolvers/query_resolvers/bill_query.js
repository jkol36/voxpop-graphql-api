import {fetchProPublicaCongressAPI, fetchBillText} from "../utils/bill_utils";

export const searchBill = (pubsub) => {
	return async (_, args) => {
		try {
			const query = args.query
			const url = `https://api.propublica.org/congress/v1/bills/search.json?query="${query}"`;
			return await fetchProPublicaCongressAPI(url, "GET");
		} catch (err) {
			throw new Error(err);
		}
	}
}

export const billText = pubsub => {
	return async (_, args) => {
		try {
			// e.g. "s2689-115"
			const id = args.bill_id
			const slug = id.split('-')[0]
			const constitution = id.split('-')[1]
			const type = id.match(/^(\D*)/)[0]
			// e.g. https://www.govtrack.us/data/congress/115/bills/hr/hr2322/text-versions/ih/document.txt
			const textUrl = `https://www.govtrack.us/data/congress/${constitution}/bills/${type}/${slug}/text-versions/i${type[0]}/document.txt`
			return await fetchBillText(textUrl)
		} catch(err) {
			throw new Error(err)
		}
	}
}