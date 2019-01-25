const webservices = {}

webservices.drawMajorCards = function (callback) {
  const request = requests.draw('Major', 1);
  makeRequest(request.method, request.path, callback);
};

webservices.drawMinorCards = function (callback) {
  const request = requests.draw('Minor', 1);
  makeRequest(request.method, request.path, callback);
};

webservices.drawUniqueCards = function (spirit, callback) {
  const request = requests.draw(spirit, -1);
  makeRequest(request.method, request.path, callback);
};

webservices.discardCards = function (callback, body) {
  const request = requests.discardCards();
  makeRequest(request.method, request.path, callback, body);
};

webservices.setCardsState = function (callback, state, body) {
  const request = requests.setCardsState(state);
  makeRequest(request.method, request.path, callback, body);
};

webservices.resetCards = function (callback) {
  const request = requests.reset();
  makeRequest(request.method, request.path, callback);
};

webservices.getUserCards = function (callback) {
  const request = requests.getUserCards();
  makeRequest(request.method, request.path, callback);
};

webservices.getSpirits = function (callback) {
  const request = requests.getSpirits();
  makeRequest(request.method, request.path, callback);
};

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
  },
  setCardsState: (state) => {
    return {
      method : "POST",
      path: `/cards/state/${state}`
    }
  },
  discardCards: () => {
    return {
      method: "POST",
      path: "/cards/discard"
    }
  },
  getUserCards: () => {
    return {
      method: "GET",
      path: '/cards',
    }
  },
  getSpirits: () => {
    return {
      method: "GET",
      path: '/spirits',
    }
  }
}

function getAuthToken() {
  return "Basic " + btoa(window.username);
}

function makeRequest(method, path, callback, body) {
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    // only perform callback on last ready state
    if (xhttp.readyState === 4 && callback) {
      console.log([path, xhttp.status])
      let response = ""
      if (xhttp.response)
        response = JSON.parse(xhttp.response)
      callback(response);
    }
  }

  xhttp.open(method, path, true);

  const authToken = getAuthToken();
  xhttp.setRequestHeader("Authorization", authToken);

  if (!body) {
    xhttp.send();
  } else {
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(body);
  }
}