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
    $("#exhaustSelected").on("click", function (event) {
        $(".img-container").filter(".selected-card").addClass("exhausted-card");
        deselectAll(event);
    });
    $("#readySelected").on("click", function () {
        $(".img-container").filter(".selected-card").removeClass("exhausted-card");
    });
    $("#readyAll").on("click", function () {
        $(".img-container").removeClass("exhausted-card");
    });
    $("#deselectAll").on("click", deselectAll)
};

function addImgs(card) {

    const cardContainer = $("<div />").addClass("img-container").attr("selected", false);
    $("#cardImages").append(cardContainer);

    const width = 140;
    const name = card.name.toLowerCase().replace(/ /g, "_").replace(/['\-,]/g, "") + ".jpg";
    const src = "../../images/powers/" + name;
    const img = $("<img>").attr({
        src,
        width
    });
    cardContainer.append(img);

    cardContainer.on('click', changeCardState);
};

function changeCardState(event) {

    let isSelected = $(this).attr("selected");
    if (isSelected) {
        deselectCard(event, $(this));
        $(this).attr("selected", false);
    } else {
        selectCard(event, $(this));
        $(this).attr("selected", true);
    }
}

function selectCard(event, cardContainer) {

    event.preventDefault();
    event.stopPropagation();

    cardContainer.addClass("selected-card");


    const removeButton = $("<div />").addClass("remove-card-icon-container");
    removeButton.append($("<i class=\"far fa-times-circle\"></i>"));

    cardContainer.append(removeButton);

    removeButton.on('click', removeCard);
}

function removeCard(event) {
    event.stopPropagation();
    $(this).parent().remove();
}

function deselectCard(event, cardContainer) {

    event.preventDefault();
    cardContainer.removeClass("selected-card");
    cardContainer.find("div").remove();
}

function deselectAll(event) {
    $(".img-container").each(function () {
        deselectCard(event, $(this))
    });

}