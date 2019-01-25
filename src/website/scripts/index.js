// powerCards.forEach( function(index, value){...});

const powerCards = PowerCards.filter(card => card.set === ProductSet.Basegame);

const majorCards = powerCards.filter(card => card.type === PowerDeckType.Major);
const minorCards = powerCards.filter(card => card.type === PowerDeckType.Minor);
const uniqueCards = powerCards.filter(card => Object.values(Unique).includes(card.type));

let cardImgPairs = [];
let runeImgPairs = [];

majorCards.sort(function (a, b) {
    if (a.name < b.name) {
        return -1;
    }
    if (a.name > b.name) {
        return 1;
    }
    return 0;
});

minorCards.sort(function (a, b) {
    if (a.name < b.name) {
        return -1;
    }
    if (a.name > b.name) {
        return 1;
    }
    return 0;
});

createList("#majorCards", majorCards);
createList("#minorCards", minorCards);
createList("#uniqueCards", uniqueCards);
addRunes("#runesSection", Elements);

function addRunes(id, runes) {
    $.each(runes, function (index, value) {
        const runeContainer = $("<div />").addClass("rune-container");
        const src = "../../images/symbols/" + value + "_unchecked.jpg";
        const pathChecked = "../../images/symbols/" + value + "_checked.jpg";
        const runeImg = $("<img>").addClass("rune-img").attr({
            src,
        });
        $(id).append(runeContainer);
        runeContainer.append(runeImg);
        const countBox = $("<div />").addClass("countBox").text("0");
        runeContainer.append(countBox);

        const runeImgPair = {};
        runeImgPair.rune = value;
        runeImgPair.pathUnchecked = src;
        runeImgPair.pathChecked = pathChecked;
        runeImgPair.runeContainer = runeContainer;

        runeImgPairs.push(runeImgPair);
    });
};

function updateRuneCount() {
    // eg. [ Elements.Sun] 

    const runes = [];
    $(".selected-card").each(function () {
        const src = $(this).find("img").attr("src");
        const pair = cardImgPairs.find(card => (card.path === src));
        const powerCard = pair.card;

        for (let i = 0; i < powerCard.elements.length; i++) {
            const rune = {};
            rune.name = powerCard.elements[i];
            const existingRune = runes.find(el => (el.name === rune.name));

            if (existingRune) {
                existingRune.count = existingRune.count + 1;

            } else {
                rune.count = 1;
                runes.push(rune);
            }
        }
    });

    runeImgPairs.forEach(function (pair) {
        const runeName = pair.rune;
        let src;
        const rune = runes.find(el => (el.name === runeName));
        let isChecked = rune ? true : false;

        const img = pair.runeContainer.find("img");

        if (isChecked) {
            runeCount = rune.count;
            src = pair.pathChecked;

            img.addClass("active")
        } else {
            runeCount = 0;
            src = pair.pathUnchecked;

            img.removeClass("active")
        }

        img.attr("src", src);
        pair.runeContainer.find("div").text(runeCount);

    });

};

function createList(id, cards) {
    $.each(cards, function (index, value) {

        $(id).append($("<li />").text(value.name)
            .on("click", function () {
                addImgs(value);
            }));
    });
};

$("#exhaustSelected").on("click", function (event) {
    const exhaustedCards = [];
    $(".img-container").filter(".selected-card").each(function () {
        $(this).addClass("exhausted-card");
        const cardSrc = $(this).find("img").attr("src");
        const cardIndex = cardImgPairs.findIndex(card => (card.path === cardSrc));
        const card = cardImgPairs[cardIndex].card;
        exhaustedCards.push(card);
    });

    webservices.setCardsState(() => {}, "exhaust", JSON.stringify(exhaustedCards));

    deselectAll(event);
});

$("#readySelected").on("click", function () {
    const readyCards = [];

    $(".img-container").filter(".selected-card").each(function () {
        $(this).removeClass("exhausted-card");
        const cardSrc = $(this).find("img").attr("src");
        const cardIndex = cardImgPairs.findIndex(card => (card.path === cardSrc));
        const card = cardImgPairs[cardIndex].card;
        readyCards.push(card);
    });
    webservices.setCardsState(() => {}, "ready", JSON.stringify(readyCards));

});

$("#readyAll").on("click", function () {

    const readyCards = [];
     
    $(".img-container").each(function () {
        $(this).removeClass("exhausted-card");
        const cardSrc = $(this).find("img").attr("src");
        const cardIndex = cardImgPairs.findIndex(card => (card.path === cardSrc));
        const card = cardImgPairs[cardIndex].card;
        readyCards.push(card);
    });
    
    webservices.setCardsState(() => {}, "ready", JSON.stringify(readyCards));

});

$("#deselectAll").on("click", deselectAll)


function addImgs(card) {

    const cardContainer = $("<div />").addClass("img-container").attr("selected", false);
    $("#cardImages").append(cardContainer);

    const width = 140;
    let src;
    if (card.imgSrc) {
        src = card.imgSrc;
    } else {
        const name = card.name.toLowerCase().replace(/ /g, "_").replace(/['\-,]/g, "") + ".jpg";
        src = "../../images/powers/" + name;
    }
    const img = $("<img>").attr({
        src,
        width
    });
    cardContainer.append(img);

    if (card.state === "exhaust") {
        cardContainer.addClass("exhausted-card");
    };

    cardContainer.on('click', changeCardState);

    const cardImgPair = {};
    cardImgPair.card = card;
    cardImgPair.path = src;

    cardImgPairs.push(cardImgPair);
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

    // const cardSrc = cardContainer.find("img").attr("src"); 
    // const cardImgPair = cardImgPairs.find(card => (card.path === cardSrc));
    //  addRuneCount(cardImgPair.card);

    updateRuneCount();
}

function removeCard(event) {
    event.stopPropagation();
    const cardSrc = $(this).parent().find("img").attr("src");

    const cardIndex = cardImgPairs.findIndex(card => (card.path === cardSrc));
    const card = cardImgPairs[cardIndex].card;

    webservices.discardCards(() => {
        cardImgPairs.splice(cardIndex, 1);
        $(this).parent().remove();
        updateRuneCount();

    }, JSON.stringify([card]));
}

function deselectCard(event, cardContainer) {

    event.preventDefault();
    cardContainer.removeClass("selected-card");
    cardContainer.find("div").remove();

    updateRuneCount();

}

function deselectAll(event) {
    $(".img-container").each(function () {
        deselectCard(event, $(this))
    });

}