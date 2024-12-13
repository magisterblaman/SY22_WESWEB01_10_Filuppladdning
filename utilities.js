export function getRequestBody(request) {
	return new Promise(function (resolve, reject) {
		let chunks = [];

		request.on('data', function(chunk) {
			chunks.push(chunk);
		});

		request.on('error', function(err) {
			reject(err);
		});

		request.on('end', function() {
			let data = Buffer.concat(chunks).toString();

			resolve(data);
		});
	});
}

export function getRequestFile(request) {
	return new Promise(function(resolve, reject) {
		let contentLength = parseInt(request.headers['content-length']);

		let data = Buffer.alloc(contentLength);
		let dataIndex = 0;

		request.on('data', function(chunk) {
			data.fill(chunk, dataIndex);
			dataIndex += chunk.length;
		});

		request.on('error', function(err) {
			reject(err);
		});

		request.on('end', function() {
			// console.log(data.toString());

			let contentTypeIndex = data.indexOf('Content-Type: ');
			let contentType = data.slice(contentTypeIndex + 'Content-Type: '.length);
			contentType = contentType.slice(0, contentType.indexOf('\r\n'));

			let contentIndex = data.indexOf('\r\n\r\n');
			let content = data.slice(contentIndex + '\r\n\r\n'.length);
			content = content.slice(0, content.indexOf('\r\n--'));

			// console.log(contentType.toString());
			// console.log(content.toString());

			resolve({
				'contentType': contentType.toString(),
				'content': content
			});
		});
	});
}

export function cleanupHTMLOutput(input) {
	input = input.replaceAll('&', '&amp;');
	input = input.replaceAll('<', '&lt;');
	input = input.replaceAll('>', '&gt;');
	input = input.replaceAll('"', '&quot;');
	input = input.replaceAll('\'', '&#39;');

	return input;
}