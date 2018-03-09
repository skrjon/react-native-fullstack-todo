import { DOMAIN } from '../config';
import store from '../store';
import {
  loginProfile,
} from '../store/actions';

async function request(url, params = {}, refreshAuth = false) {
  console.log('request:url', url, refreshAuth);
  let token = store.getState().profile.token;
  // Make sure params.headers exists
  if(!params.headers) params.headers = {}
  // If we have an access_token lets use it
  if (token && token.access_token) {
    params.headers.access_token = token.access_token;
  }
  // Check if we have a body stringify and add content type
  if (params.body && typeof params.body === 'object') {
    params.headers['content-type'] ='application/json';
    params.body = JSON.stringify(params.body);
  }
  // Make fetch request
  let fetch_response = await fetch(DOMAIN + url, params);
  console.log('request:fetch_response', fetch_response);
  // Conert to JSON object, if there is an error the calling method will need to catch
  let response = await fetch_response.json();
  // If this is an authentication issue
  if(refreshAuth && response.statusCode === 401) {
    console.log('request:refreshAuth', refreshAuth);
    // Get a new refresh token
    let refresh_response = await refresh('/auth/token');
    console.log('request:refresh_response', refresh_response);
    // If successful recall the request without refreshAuth
    if (refresh_response.type === 'PROFILE_LOGIN') {
      return await request(url, params, false);
    }
    // Refresh failed, they need to logout
    throw {statusCode: 401, message:'Failed to refresh token'};
  }
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
  let response = await get(url, params, false);
  // Assemble the updated token
  let token = {
    access_token: response.access_token,
    expires_in: response.expires_in,
    refresh_token: store.getState().profile.token.refresh_token,
  }
  return store.dispatch(loginProfile(token));
}

async function remove(url, params = {}, refreshAuth = true) {
  let merged_params = {
    ...params,
    method: 'DELETE',
  }
  return await request(url, merged_params, refreshAuth); 
}

async function put(url, params = {}, refreshAuth = true) {
  let merged_params = {
    ...params,
    method: 'PUT',
  }
  return await request(url, merged_params, refreshAuth);
}

async function post(url, params = {}, refreshAuth = true) {
  let merged_params = {
    ...params,
    method: 'POST',
  }
  return await request(url, merged_params, refreshAuth); 
}

async function get(url, params = {}, refreshAuth = true) {
  let merged_params = {
    ...params,
    body: null, // We do not send a body in a get request
    method: 'GET',
  }
  return await request(url, merged_params, refreshAuth); 
}

module.exports = {
  get,
  post,
  put,
  refresh,
  remove,
}