import { api_url } from './../config';

const send = async ({ method, path, params, data, token, headers, origin }: any) => {
	if (
		path.includes('.png') ||
		path.includes('.jpg') ||
		path.includes('.svg') ||
		path.includes('.json') ||
		path.includes('.css')
	)
		return
	origin = origin || api_url
	if (headers && headers.get('cookie') && headers.get('cookie').includes('store')) {
		origin = headers.get('origin') || headers.get('host')
		if (origin === api_url) origin = api_url
		else origin = 'https://' + origin
	} else {
	}
	let uri = new URL(path, origin)

	if (!path.includes('/api/')) {
		// When microservice path provided
		uri = new URL('api/' + path, origin)
	}
	const domain = uri.searchParams.get('domain')
	const st = uri.searchParams.get('store')

	const opts: any = {
		method
	}
	opts.headers = headers ? headers : { Cache: 'no-cache' }
	if (data) {
		const contentType = data?.files && data?.files[0]?.type
		if (
			!(
				contentType == 'image/jpeg' ||
				contentType == 'image/gif' ||
				contentType == 'image/png' ||
				contentType == 'image/ico' ||
				contentType == 'image/webp' ||
				contentType == 'application/pdf' ||
				contentType == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
				contentType == 'application/msword' ||
				contentType == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
			)
		) {
			opts.headers['Content-Type'] = 'application/json'
			opts.body = JSON.stringify(data)
		} else {
			const form = new FormData()
			if (data && data.files) {
				for (let x of data.files) {
					form.append('files', x)
				}
			}
			for (let d in data) {
				if (d !== 'files') form.append(d, data[d])
			}
			opts.body = form
		}
	}
	if (token) {
		opts.headers['Authorization'] = `Bearer ${token}`
	}
	if (!params) params = {}
	if (params) {
		Object.keys(params).forEach((key) => uri.searchParams.append(key, params[key]))
	}
	try {
		const url = uri.toString()
		let response = await fetch(url, opts)
		const isJson = response.headers.get('content-type')?.includes('application/json')

		const res = isJson ? await response.json() : await response.text()
		if (res?.status > 399) {
			throw { status: res.status, message: res }
		} else if (response?.status > 399) {
			throw { status: response.status, message: res }
		} else {
			return res
		}
	} catch (e) {
		console.log(e);
		
		throw e
	}
}

export const get = (path, origin, headers?) => {
	return send({ method: 'GET', path, origin, headers })
}

export const del = (path, origin, headers?) => {
	return send({ method: 'DELETE', path, origin, headers })
}

export const post = (path, data, origin, headers?) => {
	return send({ method: 'POST', path, data, origin, headers })
}

export const put = (path, data, origin, headers?) => {
	return send({ method: 'PUT', path, data, origin, headers })
}