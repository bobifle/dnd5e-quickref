function efind(what) {function _efind(e) {return e['title'].toLowerCase()==what.toLowerCase();}; return _efind;}
data_bonus = [
	data_bard.find(efind("Bard Inspirations")),
	data_movement.find(efind("Dash")),
    {
        title: "Hide",
        icon: "night-vision",
        subtitle: "Stealth check, no direct LoS",
        reference: "PHB, pg. ???",
        description: "Hide against Widsom (perception)",
        bullets: [
			"When you take the Hide action, you make a Dexterity (Stealth) check in an attempt to hide, following the rules for Hiding. If you succeed, you gain certain benefits, as described in the 'Unseen Attackers and Targets' section.",
        ]
    },	
	{
        title: "Disengage",
        icon: "acrobatic",
        subtitle: "Next move don't provoke any opportunity",	
        reference: "PHB, pg. ???",
        description: "If you take the Disengage action, your Movement doesn’t provoke opportunity attacks for the rest of the turn.",
        bullets: [
        ]
    },	

]

