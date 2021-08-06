const Hapi = require('@hapi/hapi');

const routes = require('./routes');

const init = ()=> {
	const server = Hapi.server({
		host: 'localhost',
		port: 5000,
		routes: {
			cors: {
				origin: ['*']
			}
		}
	});

	server.route(routes);

	server.start()
	.then(()=>{
		console.log(`Starting server..`)
	})
}

init();