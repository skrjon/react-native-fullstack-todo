import { DOMAIN } from '../config';
import store from '../store';

async function request(url, params = {}) {  
  let token = store.getState().profile.token;
  // If we have an access_token lets use it
  if (token && token.access_token) {
    // Make sure params.headers exists
    if(!params.headers) params.headers = {}
    params.headers.access_token = token.access_token;
  }
  // Check if we have a body stringify and add content type
  if (params.body) {
    // Make sure params.headers exists
    if(!params.headers) params.headers = {}
    params.headers['content-type'] ='application/json';
    params.body = JSON.stringify(params.body);
  }
  // Make fetch request
  let fetch_response = await fetch(DOMAIN + url, params);
  console.log('request:fetch_response', fetch_response);
  // Conert to JSON object, if there is an error the calling method will need to catch
  let response = await fetch_response.json();
  // If the reponse is not ok we need to throw an error
  if(!fetch_response.ok) throw response;
  // Return the valid response
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

async function remove(url, params = {}) {
  let merged_params = {
    ...params,
    method: 'DELETE',
  }
  return await request(url, merged_params); 
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
  remove,
}