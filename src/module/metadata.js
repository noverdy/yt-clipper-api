const youtubedl = require('youtube-dl-exec')

const getMetadata = (url) => {
	return new Promise((resolve, reject) => {
		youtubedl(url, {
			dumpJson: true,
		})
			.then((json) => {
				return {
					title: json.fulltitle,
					author: json.uploader,
					url: json.webpage_url,
					duration: json.duration,
					is_live: json.is_live,
				}
			})
			.then((data) => {
				resolve(data)
			})
			.catch((error) => {
				reject(error)
			})
	})
}

module.exports = getMetadata
