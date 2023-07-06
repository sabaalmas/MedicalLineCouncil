import axios from "axios";

const requestType = {
  POST: "post",
  GET: "get",
  PUT: "put",
  DELETE: "delete",
};

axios.interceptors.request.use((request) => {
  console.warn("API request=", request);
  return request;
});

export async function executeRequest(method, url, headers, params, data) {
  let response = await axios({
    method: method,
    url: url,
    headers: headers,
    params: params,
    data: data,
  })
    .then(async function (response) {
      if ((response.status == 200 || response.status == 201) && response.data) {
        return response.data;
      } else {
        throw new Error(response.Error);
      }
    })
    .catch(function (error) {
      if (error.response) {
        return error.response.data;
      } else {
        console.warn("ERROR", "Something went wrong");
        return { ERROR: error };
      }
    });

  console.warn("API RESPONSE=", response);
  return response;
}

export async function postRequest(url, data) {
  let response = await executeRequest(requestType.POST, url, null, null, data);
  return response;
}
export async function postRequestWithHeader(url, data, token) {
  //console.log("postrequestwithheader")
  let authToken = "Token " + token;
  //console.log(authToken)
  let response = await executeRequest(
    requestType.POST,
    url,
    { Authorization: authToken },
    null,
    data
  );
  return response;
}

export async function getRequest(url) {
  let response = await executeRequest(requestType.GET, url, null, null, null);
  return response;
}

export async function getRequestWithHeader(url, token) {
  let authToken = "Token " + token;
  let response = await executeRequest(
    requestType.GET,
    url,
    { Authorization: authToken },
    null,
    null
  );
  return response;
}
export async function getRequestWithHeaderData(url, token) {
  let authToken = "Token " + token;
  let response = await executeRequest(requestType.GET, url, { Authorization: authToken }, null);
  return response;
}

export async function putRequest(url, data, token) {
  let authToken = "Token " + token;
  let response = await executeRequest(
    requestType.PUT,
    url,
    { Authorization: authToken },
    null,
    data
  );
  return response;
}

export async function deleteRequest(url, token) {
  let authToken = token;
  authToken = "Token " + authToken;
  let response = await executeRequest(
    requestType.DELETE,
    url,
    { authorization: authToken },
    null,
    null
  );
  return response;
}
