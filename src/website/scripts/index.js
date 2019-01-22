// powerCards.forEach( function(index, value){...});
const powerCards = PowerCards.filter(card => card.set === ProductSet.Basegame);

powerCards.sort(function (a, b) {
    if (a.name < b.name) {
        return -1;
    }
    if (a.name > b.name) {
        return 1;
    }
    return 0;
})

const majorCards = powerCards.filter(card => card.type === PowerDeckType.Major);
const minorCards = powerCards.filter(card => card.type === PowerDeckType.Minor);
const uniqueCards = powerCards.filter(card => Object.values(Unique).includes(card.type));

createList("#majorCards", majorCards);
createList("#minorCards", minorCards);
createList("#uniqueCards", uniqueCards);

function createList(id, cards) {
    $.each(cards, function (index, value) {

        $(id).append($("<li />").text(value.name)
            .on("click", function () {
                addImgs(value);
            }));
    });
};

function addImgs(card) {
    const name = card.name.toLowerCase().replace(/ /g, "_").replace(/['\-,]/g, "") + ".jpg";
    const width = 140;
    const src = "images/powers/" + name;
    $("#cardImages").append($("<img>").attr({
        src,
        width
    }));

};