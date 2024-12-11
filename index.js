import 'dotenv/config';
import http from 'http';
import { handleStaticFileRequest } from './static-file-handler.js';


/**
 * 
 * @param {http.IncomingMessage} request 
 * @param {http.ServerResponse} response 
 */
async function handleRequest(request, response) {
	let url = new URL(request.url, 'http://' + request.headers.host);
	let path = url.pathname;
	let pathSegments = path.split('/').filter(function (segment) {
		if (segment === '' || segment === '..') {
			return false;
		} else {
			return true;
		}
	});

	let nextSegment = pathSegments.shift();

	if (nextSegment === 'static') {
		await handleStaticFileRequest(pathSegments, request, response);
		return;
	}

	if (nextSegment === 'pictures') {
		if (request.method === 'POST') {
			// ta emot en bild


			return;
		}

		response.writeHead(405, { 'Content-Type': 'text/plain' });
		response.write('405 Method Not Allowed');
		response.end();
		return;
	}

	response.writeHead(404, { 'Content-Type': 'text/plain' });
	response.write('404 Not Found');
	response.end();
	return;
}

let server = http.createServer(handleRequest);

server.listen(process.env.PORT);