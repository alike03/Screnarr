export async function toggleMonitored(url, seasonNumber = null) {
	const loadData = await fetch(url, {
		method: 'GET',
		headers: {
			'accept': 'application/json',
			'Content-Type': 'application/json'
		}
	})

	const loadDataJson = await loadData.json()
	if (seasonNumber) {
		loadDataJson.seasons.filter(s => s.seasonNumber === seasonNumber)[0].monitored = !loadDataJson.seasons.filter(s => s.seasonNumber === seasonNumber)[0].monitored
	} else {
		loadDataJson.monitored = !loadDataJson.monitored
	}

	const putData = await fetch(url, {
		method: 'PUT',
		headers: {
			'accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(loadDataJson)
	})

	const putDataJson = await putData.json()

	if (seasonNumber) {
		return putDataJson.seasons.filter(s => s.seasonNumber === seasonNumber)[0].monitored
	}
	return putDataJson.monitored
}

export function getFileSize(bytes) {
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
	if (bytes == 0) return '0 Byte'
	const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
	return Math.round(bytes / Math.pow(1024, i), 0) + ' ' + sizes[i]
}