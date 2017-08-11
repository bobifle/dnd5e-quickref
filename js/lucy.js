function item_getIcon(data) {
	var icon = data.icon;
	if (!icon) {
		if (data.url.indexOf("spells") !== -1) {
			// chose an book icon feature the spell level
			icon = 'white-book-' + data.level;
		}
		if (data.url.indexOf("features") !== -1) {
			if (data.class.name == "Barbarian") {
				icon = "barbarian";
			} else {
				icon = "juggler";
			}
		}
	}
	return icon || "perspective-dice-six-faces-one";
}

function item_getSubtitle(data) {
	if (data.subtitle) {return data.subtitle;};
	if (data.url.indexOf("spells") !== -1) {
		sub = data.casting_time + ", " + data.range + ", ";
		if (typeof data.components == "string") { sub += data.components;};
		if (typeof data.components != "string") { sub += data.components.join("");};
		if (data.concentration == "yes") {sub += ", con"}
		if (data.ritual == "yes") {sub += ", ritual"}
		return sub;
	}
	if (data.url.indexOf("features") !== -1) {
		sub = ""
		if (data.subclass) {sub +=  data.subclass.name + " ";}
		sub += "Level " + data.level;
		return sub;
	}
	return "";
}
function item_getBullets(data) {
	if (data.bullets) {return data.bullets;};
	bullets = [];
	if (data.url.indexOf("spells") !== -1) {
		bullets.push("Level " + data.level + " " + data.school.name + " spell for"+ data.classes.map(function (e) {return e["name"];}).join(","));
		bullets.push('casting time: ' + data.casting_time + ', Duration: '+ data.duration + ', Range: ' + data.range);
		bullets.push('concentration: ' + data.concentration + ', ritual: ' + data.ritual)
		bullets.push('material: ' + data.material)
	}
	if (data.url) { // extracted from online dnd api
		bullets.push(data.desc);
	}
	return bullets;
}


function add_quickref_item(parent, data, type) {
    var icon = item_getIcon(data);
    var subtitle = item_getSubtitle(data);
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
    var subtitle = item_getSubtitle(data)
    var bullets = item_getBullets(data);
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
	if (!parent) {return;}
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

	var barb_feat = data_features.filter(function (e) {return e["class"]["name"] == "Barbarian"});
	fill_section(barb_feat, 'features-barbarian', 'Feat')

	var modal = document.getElementById("modal");
	modal.onclick = hide_modal;
}

$(window).load(init);
