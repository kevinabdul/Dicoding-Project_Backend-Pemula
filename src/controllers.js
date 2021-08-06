const {nanoid} = require('nanoid');

const books = require('./books');

module.exports = {
	addBook, getBooks, getSpecificBook, updateBook, deleteBook
}

function addBook(request, h) {
	const payload = {
		...{
			name: undefined, 
			year: undefined,
			author: undefined, 
			summary: undefined, 
			publisher: undefined,
			pageCount: undefined, 
			readPage: undefined, 
			reading: undefined
		}, ...request.payload
	}

	if (payload.name === undefined) {
		return h.response({
			"status": "fail",
    		"message": "Gagal menambahkan buku. Mohon isi nama buku"
    	}).code(400).type('application/json');
	}

	if (payload.readPage > payload.pageCount) {
		return h.response({
    		"status": "fail",
    		"message": "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
		}).code(400).type('application/json');
	}

	let id = nanoid(16);

	payload.id = id;
	payload.finished = payload.readPage < payload.pageCount ? false: true;
	payload.insertedAt = new Date().toISOString();
    payload.updatedAt = payload.insertedAt;

    let currentLen = books.length;

	books.push(payload);

	let afterAddLen = books.length;

	if (afterAddLen > currentLen) {
		return h.response({
	    	status: "success",
	    	message: "Buku berhasil ditambahkan",
	    	data: {
	        	bookId: id
	    	}
		}).code(201).type('application/json');
	} else {
		return h.response({
			status: 'fail',
			message: 'Buku gagal ditambahkan'
		})
	}
}

function getBooks(request, h) {
	let { name, reading, finished} = request.query;

	let res = books;

	if (name !== undefined) {
		name = name.toLowerCase();

		res = res.filter((book) => {
			return book.name.toLowerCase().indexOf(name) !== -1
		});
	}

	if (reading !== undefined) {
		reading = +reading === 0 ? false : true;

		res = res.filter((book) => {
			return book.reading === reading
		});
	}

	if (finished !== undefined) {
		finished = +finished === 0 ? false : true;

		res = res.filter((book) => {
			return book.finished === finished;
		});
	}

	 res = res.map((el)=> { 
		return {
			id: el.id, 
			name: el.name,
			publisher: el.publisher
		}
	});

	return h.response({
		status: 'success',
		data: {
			books: res
		}
	}).code(200).type('application/json');

}

function getSpecificBook(request, h) {
	const { id } = request.params;

	let index = -1;

	for (let i in books) {
		if (books[i].id === id) {
			index = i;
			break;
		}
	}

	if (index === -1) {
		return h.response({
			status: 'fail',
			message: 'Buku tidak ditemukan'
		}).code(404).type('application/json');
	}

	return h.response({
		status: 'success',
		data: {
			book: books[index]
		}
	})
}

function updateBook(request, h) {
	const { id } = request.params;

	if (request.payload.name === undefined) {
		return h.response({
			status: 'fail',
			message: 'Gagal memperbarui buku. Mohon isi nama buku'
		}).code(400).type('application/json');
	}

	if (request.payload.readPage > request.payload.pageCount) {
		return h.response({
			status: 'fail',
			message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
		}).code(400).type('application/json');
	}

	let index = -1;

	for (let i in books) {
		if (books[i].id === id) {
			index = i;
			break;
		}
	}

	if (index === -1) {
		return h.response({
			status: 'fail',
			message: 'Gagal memperbarui buku. Id tidak ditemukan'
		}).code(404).type('application/json')
	}

	Object.assign(books[index],request.payload);

	return h.response({
		status: 'success',
		message: 'Buku berhasil diperbarui'
	}).code(200).type('application/json');
}

function deleteBook(request, h) {
	const { id } = request.params;

	let index = -1;

	for (let i in books) {
		if (books[i].id === id) {
			index = i;
			break;
		}
	}

	if (index === -1) {
		return h.response({
			status: 'fail',
			message: 'Buku gagal dihapus. Id tidak ditemukan'
		}).code(404).type('application/json')
	}

	books.splice(index, 1);

	return h.response({
		status: 'success',
		message: 'Buku berhasil dihapus'
	}).code(200).type('application/json');
}