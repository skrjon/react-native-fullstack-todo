import { DOMAIN } from '../config';
import store from '../store';

async function request(url, params = {}) {
  let token = store.getState().profile.token;
  // Make sure params.headers exists
  if(!params.headers) params.headers = {}
  // If we have an access_token lets use it
  if (token.access_token) {
    params.headers.access_token = token.access_token;
  }
  // Check if we have a body stringify and add content type
  if (params.body) {
    params.headers['content-type'] ='application/json';
    params.body = JSON.stringify(params.body);
  }
  // Make fetch request
  let fetch_response = await fetch(DOMAIN + url, params);
  console.log('request:fetch_response', fetch_response);
  let response = await fetch_response.json();

  return response;
}

async function refresh(url) {
  let params = {
    headers:{
      'refresh_token': store.getState().profile.token.refresh_token,
    }
  };
  return await request(url, params);
}

async function put(url, params = {}) {
  let merged_params = {
    ...params,
    method: 'PUT',
  }
  return await request(url, merged_params); 
}

async function post(url, params = {}) {
  let merged_params = {
    ...params,
    method: 'POST',
  }
  return await request(url, merged_params); 
}

async function get(url, params = {}) {
  let merged_params = {
    ...params,
    body: null, // We do not send a body in a get request
    method: 'GET',
  }
  return await request(url, merged_params); 
}

module.exports = {
  get,
  post,
  put,
  refresh,
}