import 'dotenv/config';
import http from 'http';
import { handleStaticFileRequest } from './static-file-handler.js';
import { getRequestFile } from './utilities.js';
import fs from 'fs/promises';
import crypto from 'crypto';

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

			let body = await getRequestFile(request);

			let ext;
			if (body.contentType === 'image/png') {
				ext = 'png';
			} else if (body.contentType === 'image/jpeg') {
				ext = 'jpg';
			} else if (body.contentType === 'image/svg+xml') {
				ext = 'svg';
			} else if (body.contentType === 'image/webp') {
				ext = 'webp';
			} else {
				response.writeHead(400, { 'Content-Type': 'text/plain' });
				response.write('400 Bad Request');
				response.end();
				return;
			}

			let fileName = crypto.randomUUID().toString() + '.' + ext;

			await fs.writeFile('public/uploads/' + fileName, body.content);

			response.writeHead(303, { 'Location': '/static/uploads/' + fileName });
			response.end();
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