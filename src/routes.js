const {
	getVideoMetadataHandler,
	processVideoHandler,
	getVideoStatusHandler,
	getVideoFileHandler,
} = require('./handler')

const routes = [
	{
		method: 'GET',
		path: '/metadata',
		handler: getVideoMetadataHandler,
	},
	{
		method: 'POST',
		path: '/process',
		handler: processVideoHandler,
	},
	{
		method: 'GET',
		path: '/status',
		handler: getVideoStatusHandler,
	},
	{
		method: 'GET',
		path: '/download',
		handler: getVideoFileHandler,
	},
]

module.exports = routes
