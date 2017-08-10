function item_getIcon(data) {
	var icon = data.icon;
	if (!icon) {
		if (data.school) { // it's a spell
			icon = 'white-book-' + data.level;
		} else {
    		icon = "perspective-dice-six-faces-one";
		}
	}
	return icon;
}

function add_quickref_item(parent, data, type) {
    var icon = item_getIcon(data);
    var subtitle = data.subtitle || "";
    var title = data.title || data.name || "[no title]";

    var item = document.createElement("div");
    item.className += "item itemsize"
    item.innerHTML =
    '\
    <div class="item-icon iconsize icon-' + icon + '"></div>\
    <div class="item-text-container text">\
        <div class="item-title">' + title + '</div>\
        <div class="item-desc">' + subtitle + '</div>\
    </div>\
    ';

    var style = window.getComputedStyle(parent.parentNode.parentNode);
    var color = style.backgroundColor;

    item.onclick = function () {
        show_modal(data, color, type);
    }

    parent.appendChild(item);
}

function show_modal(data, color, type) {
    var title = data.title || data.name || "[no title]";
    var subtitle = data.description || data.subtitle || "";
    var bullets = data.bullets || data.desc || [];
    var reference = data.reference || data.page || "";
    type = type || "";
    color = color || "black"

    $("body").addClass("modal-open");
    $("#modal").addClass("modal-visible");
    $("#modal-backdrop").css("height", window.innerHeight + "px");
    $("#modal-container").css("background-color", color).css("border-color", color);
    $("#modal-title").text(title).append("<span class=\"float-right\">" + type + "</span>");
    $("#modal-subtitle").text(subtitle);
    $("#modal-reference").text(reference);

    var bullets_html = bullets.map(function (item) { return "<p class=\"fonstsize\">" + item + "</p>"; }).join("\n<hr>\n");
    $("#modal-bullets").html(bullets_html);
}

function hide_modal() {
    $("body").removeClass("modal-open");
    $("#modal").removeClass("modal-visible");
}

function fill_section(data, parentname, type) {
    var parent = document.getElementById(parentname);
    data.forEach(function (item) {
		add_quickref_item(parent, item, type);
    });
}

function init() {
	if (typeof data_rogue !== 'undefined') {fill_section(data_rogue, "basic-rogue", "Rogue");};
	if (typeof data_rogue_assassin !== 'undefined') {fill_section(data_rogue_assassin, "basic-rogue", "Rogue");};
	if (typeof data_bard !== 'undefined') {fill_section(data_bard, "basic-bard", "Rogue");};
	if (typeof data_movement !== 'undefined') {fill_section(data_movement, "basic-movement", "Rogue");};
	if (typeof data_bonus !== 'undefined') {fill_section(data_bonus, "basic-bonus", "Rogue");};
	data_spells.sort(function (a,b) {if (a.level<b.level) return -1; if(a.level>b.level) {return 1}; return 0;})
	fill_section(data_spells, "basic-spells", "Spell");
	var modal = document.getElementById("modal");
	modal.onclick = hide_modal;
}

$(window).load(init);
