$("#drawMajor").on("click", function (event) {
  webservices.drawMajorCards((res) => {
    // response is JSON
    // for (const i = 0; i < res.length; i++) tik eina per values , in res eina per indeksus
    for (const value of res) {
      addImgs(value);
    };
  });
});

$("#drawMinor").on("click", function (event) {
  webservices.drawMinorCards((res) => {
    for (const value of res) {
      addImgs(value);
    };
  });
});


$("#resetDeck").on("click", function (event) {
  webservices.resetCards((res) => {
    console.log(res)
    alert("Decks have been successfully reset")
  })
});


$(document).ready(function () {
  console.log("ready");
  webservices.getUserCards((res) => {
    for (const value of res) {
      addImgs(value);
    };
  });
});