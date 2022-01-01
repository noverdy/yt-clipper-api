const getMetadata = require('./module/metadata')
const { processVideo, getStatus } = require('./module/process')
const { nanoid } = require('nanoid')

const getVideoMetadataHandler = (request, h) => {
	const { url } = request.query
	const data = getMetadata(url).then(
		(data) => {
			const response = h.response({
				status: 'success',
				data: data,
			})
			response.code(200)
			return response
		},
		(error) => {
			const response = h.response({
				status: 'fail',
				message: error,
			})
			response.code(404)
			return response
		}
	)
	return data
}

const processVideoHandler = (request, h) => {
	const { url, start, end } = request.payload

	if ([url, start, end].some((item) => item === undefined)) {
		const response = h.response({
			status: 'fail',
			message: 'bad request',
		})
		response.code(400)
		return response
	}

	const processId = nanoid(16)
	processVideo(url, start, end, processId)

	return h.response({
		status: 'success',
		message: 'your video is being processed',
		id: processId,
	})
}

const getVideoStatusHandler = (request, h) => {
	const { id } = request.query
	const status = getStatus(id)

	if (status === undefined) {
		const response = h.response({
			status: 'fail',
			message: 'invalid id',
		})
		response.code(400)
		return response
	}
	const ready = status.ready
	return h.response({
		status: 'success',
		message: ready
			? 'your video has been processed'
			: 'your video is still in process',
		ready: ready,
	})
}

const getVideoFileHandler = (request, h) => {
	const { id } = request.query
	const status = getStatus(id)
	if (status === undefined) {
		const response = h.response({
			status: 'fail',
			message: 'invalid id',
		})
		response.code(400)
		return response
	}
	const outputpath = status.path
	return h.file(outputpath, {
		mode: 'attachment',
	})
}

module.exports = {
	getVideoMetadataHandler,
	processVideoHandler,
	getVideoStatusHandler,
	getVideoFileHandler,
}
