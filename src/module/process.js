const ffmpeg = require('fluent-ffmpeg')
const fs = require('fs')
const getVideoId = require('youtube-video-id')
const { nanoid } = require('nanoid')
const path = require('path')
const { create: createYoutubeDl } = require('youtube-dl-exec')

const youtubedl = createYoutubeDl(path.resolve('bin/yt-dlp'))
const status = {}

const processVideo = (url, start, end, processId) => {
	const videoId = getVideoId(url)
	const tempname = path.resolve(`temp/${processId}.mp4`)
	const outputname = path.resolve(
		`temp/ytclipper-${videoId}-${nanoid(3)}.mp4`
	)

	status[processId] = {
		path: outputname,
		ready: false,
	}

	youtubedl(url, {
		output: tempname,
		restrictFilenames: true,
		format: 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/bestvideo+bestaudio',
		mergeOutputFormat: 'mp4',
	}).then(() => {
		ffmpeg(tempname)
			.setStartTime(start)
			.duration(end - start)
			.output(outputname)
			.on('end', () => {
				status[processId].ready = true
				fs.unlink(tempname, (err) => {
					console.log(err)
				})
				setTimeout(() => {
					fs.unlink(outputname, (err) => {
						console.log(err)
					})
					delete status[processId]
				}, 10 * 60 * 1000)
			})
			.on('error', (err) => {
				console.log(err)
			})
			.run()
	})
}

const getStatus = (id) => {
	return status[id]
}

module.exports = {
	processVideo,
	getStatus,
}
