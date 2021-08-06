const handler = require('./controllers.js');

module.exports = [
	{
		path: '/books',
		method: 'POST',
		handler: handler.addBook
	}, {
		path: '/books',
		method: 'GET',
		handler: handler.getBooks
	}, {
		path: '/books/{id}',
		method: 'GET',
		handler: handler.getSpecificBook
	}, {
		path: '/books/{id}',
		method: 'PUT',
		handler: handler.updateBook
	}, {
		path: '/books/{id}',
		method: 'DELETE',
		handler: handler.deleteBook
	}
]