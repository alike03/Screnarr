export async function toggleMonitored(url, seasonNumber = null) {
	await fetch(url, {
		method: 'GET',
		headers: {
			'accept': 'application/json',
			'Content-Type': 'application/json'
		}
	}).then(response => response.json()).then(data => {
		if (seasonNumber) {
			data.seasons.filter(s => s.seasonNumber === seasonNumber)[0].monitored = !data.seasons.filter(s => s.seasonNumber === seasonNumber)[0].monitored
		} else {
			data.monitored = !data.monitored
		}
		fetch(url, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
	})
}

export function getFileSize(bytes) {
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
	if (bytes == 0) return '0 Byte'
	const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
	return Math.round(bytes / Math.pow(1024, i), 0) + ' ' + sizes[i]
}