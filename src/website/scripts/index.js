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

    const cardContainer = $("<div />").addClass("img-container").attr("active", true);
    $("#cardImages").append(cardContainer);

    const width = 140;
    const name = card.name.toLowerCase().replace(/ /g, "_").replace(/['\-,]/g, "") + ".jpg";
    const src = "../../images/powers/" + name;
    const img = $("<img>").attr({
        src,
        width
    });
    cardContainer.append(img);


    // img.on('click', deactivateCard);
    cardContainer.on('click', changeCardState);
};

function changeCardState(event) {

    let isActive = ($(this).attr("active") === 'true');

    if (isActive) {
        deactivateCard(event, $(this));
        $(this).attr("active", false);
    } else {
        activateCard(event, $(this));
        $(this).attr("active", true);
    }
}

function deactivateCard(event, cardContainer) {

    event.preventDefault();
    event.stopPropagation();

    cardContainer.find("img").css({
        "opacity": "0.4"
    });

    cardContainer.css({
        "background-color": "black",
    });

    const removeButton = $("<div />").addClass("remove-card-icon-container");
    removeButton.append($("<i class=\"far fa-times-circle\"></i>"));

    cardContainer.append(removeButton);

    removeButton.on('click', removeCard);
}

function removeCard(event) {
    event.stopPropagation();
    $(this).parent().remove();
}

function activateCard(event, cardContainer) {

    event.preventDefault();

    cardContainer.css({
        "background-color": "initial"
    });

    cardContainer.find("img").css({
        "opacity": "1"
    });

    cardContainer.find("div").remove();

}