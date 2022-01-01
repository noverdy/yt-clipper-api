const Hapi = require('@hapi/hapi')
const routes = require('./routes')

const init = async () => {
	const server = Hapi.server({
		port: 5000,
		host: process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost',
		routes: {
			cors: {
				origin:
					process.env.NODE_ENV === 'production'
						? ['https://noverdy.github.io/']
						: ['*'],
			},
		},
	})

	await server.register(require('@hapi/inert'))

	server.route(routes)

	await server.start()
	console.log(`Server berjalan pada ${server.info.uri}`)
}

init()