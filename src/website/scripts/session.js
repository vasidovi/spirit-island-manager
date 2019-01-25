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


$('#gameSetupModal').on('show.bs.modal', function (e) {

  webservices.getSpirits((res) => {
    const selector = $("#spiritSelect")
    selector.empty();
    Object.keys(res).forEach(key => {
      const option = $("<option />").attr("value", key).text(res[key])
      selector.append(option)
    })
  })
  $("#loadSpirit").on("click", function (event) {
    const spirit = $('#spiritSelect').find(":selected").attr("value")
    webservices.drawUniqueCards(spirit, (res) => {
      res.forEach(c => addImgs(c))
    })
  });
})

$(document).ready(function () {
  console.log("ready");
  webservices.getUserCards((res) => {
    for (const value of res) {
      addImgs(value);
    };
  });
});