$("#drawMajor").on("click", function (event) {
  webservices.drawMajorCards((res) => {
    console.log(res)
    alert(JSON.stringify(res))
  })
});
$("#resetDeck").on("click", function (event) {
  webservices.resetCards((res) => {
    console.log(res)
    alert("Decks have been successfully reset")
  })
});