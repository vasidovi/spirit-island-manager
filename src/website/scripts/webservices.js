const webservices = {}

webservices.drawMajorCards = function (callback) {
  const request = requests.draw('major', 4);
  makeRequest(request.method, request.path, callback);
}

webservices.resetCards = function (callback) {
  const request = requests.reset();

  makeRequest(request.method, request.path, callback);
}

const requests = {
  draw: (typeKey, count) => {
    return {
      method: "POST",
      path: `/cards/draw/${typeKey}/${count}`,
    }
  },
  reset: () => {
    return {
      method: "POST",
      path: `/reset`,
    }
  }
}

function getAuthToken() {
  return "Basic " + btoa(window.username);
}

function makeRequest(method, path, callback) {
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    // only perform callback on last ready state
    if (xhttp.readyState === 4 && callback) {
      console.log([path, xhttp.status])
      let response = ""
      if (xhttp.response)
        response = JSON.parse(xhttp.response)
      callback(response)
    }
  }

  xhttp.open(method, path, true);

  const authToken = getAuthToken();
  xhttp.setRequestHeader("Authorization", authToken);
  xhttp.send();
}