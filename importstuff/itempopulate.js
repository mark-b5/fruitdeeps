// const https = require("https");

// const ImageDataURI = require("image-data-uri");

import https from "https";
// import api from '../lib/api.js'
import ImageDataURI from "image-data-uri";
import fs from "fs";

// const db = require("../server/database.js");

const boxUrl = "https://raw.githubusercontent.com/0xNeffarion/osrsreboxed-db/master/docs/items-json-slot/items-";

// import con from "../database/connection.js";
const categoryTable = {
	chinchompas: "Chinchompas",
	slash_sword: "Slash Sword",
	stab_sword: "Stab Sword",
	thrown: "Thrown",
	crossbow: "Crossbow",
	staff: "Staff",
	pickaxe: "Pickaxe",
	blunt: "Blunt",
	axe: "Axe",
	spiked: "Spiked",
	unarmed: "Unarmed",
	banner: "Banner",
	whip: "Whip",
	spear: "Spear",
	claw: "Claws",
	polestaff: "Polestaff",
	bladed_staff: "Bladed Staff",
	"powered_staff": "Powered Staff",
	"2h_sword": "2h Sword",
	scythe: "Scythe",
	bow: "Bow",
	bulwark: "Bulwark",
	gun: "Gun",
	polearm: "Polearm",
	salamander: "Salamander",
	partisan: "Partisan"
};

const bonusTable = {
	attack_stab: "stabAttack",
	attack_slash: "slashAttack",
	attack_crush: "crushAttack",
	attack_magic: "magicAttack",
	attack_ranged: "rangedAttack",
	defence_stab: "stabDefence",
	defence_slash: "slashDefence",
	defence_crush: "crushDefence",
	defence_magic: "magicDefence",
	defence_ranged: "rangedDefence",
	melee_strength: "strength",
	ranged_strength: "rangedStrength",
	magic_damage: "magicStrength",
	prayer: "prayer",
};

const boxBonusList = [
	"attack_stab",
	"attack_slash",
	"attack_crush",
	"attack_magic",
	"attack_ranged",
	"defence_stab",
	"defence_slash",
	"defence_crush",
	"defence_magic",
	"defence_ranged",
	"melee_strength",
	"ranged_strength",
	"magic_damage",
	"prayer"
]

// const slot = "weapon";

const slots = [
	"cape",
	"head",
	"neck",
	"ammo",
	"weapon",
	"shield",
	"body",
	"legs",
	"hands",
	"feet",
	"ring",
	"2h",
];

const itemList = [
    // {"name":"Osmumten's fang","slot":"weapon","bonuses":[105,75,0,0,0,0,0,0,0,0,103,0,0,0],"id":26219,"category":"Stab Sword","speed":5},
    // {"name":"Elidinis' ward","slot":"shield","bonuses":[0,0,0,0,0,5,3,9,0,6,0,0,3,0],"id":25985},
    // {"name":"Elidinis' ward (f)","slot":"shield","bonuses":[0,0,0,25,0,53,55,73,2,52,0,0,5,4],"id":27251},
    // {"name":"Tumeken's shadow","slot":"weapon","bonuses":[0,0,0,35,0,0,0,0,20,0,0,0,0,1],"id":27277,"category":"Powered Staff","speed":5},
    // {"name":"Masori mask","slot":"head","bonuses":[0,0,0,-1,12,3,4,3,6,4,0,2,0,0],"id":27226},
    // {"name":"Masori body","slot":"body","bonuses":[0,0,0,-4,43,37,35,38,25,33,0,4,0,0],"id":27229},
    // {"name":"Masori chaps","slot":"legs","bonuses":[0,0,0,-2,27,26,24,29,19,22,0,2,0,0],"id":27232},
    // {"name":"Masori chaps (f)","slot":"legs","bonuses":[0,0,0,-2,27,35,30,39,46,37,0,2,0,1],"id":27241},
    // {"name":"Masori mask (f)","slot":"head","bonuses":[0,0,0,-1,12,8,10,12,12,9,0,2,0,1],"id":27235},
    // {"name":"Masori body (f)","slot":"body","bonuses":[0,0,0,-4,43,59,52,64,74,60,0,4,0,1],"id":27238},

	// {"name":"Keris partisan of corruption","slot":"weapon","bonuses":[58,-2,57,2,0,0,0,0,0,0,45,0,0,3],"id":27287,"category":"Partisan","speed":4},
	// {"name":"Keris partisan of the sun","slot":"weapon","bonuses":[58,-2,57,2,0,0,0,0,0,0,45,0,0,3],"id":27291,"category":"Partisan","speed":4},
	// {"name":"Keris partisan of breaching","slot":"weapon","bonuses":[58,-2,57,2,0,0,0,0,0,0,45,0,0,3],"id":25981,"category":"Partisan","speed":4},
	// {"name":"Keris partisan","slot":"weapon","bonuses":[58,-2,57,2,0,0,0,0,0,0,45,0,0,3],"id":25979,"category":"Partisan","speed":4},

	{"name":"Toxic blowpipe (Bronze)","slot":"2h","bonuses":[0,0,0,0,30,0,0,0,0,0,0,21,0,0],"id":12926,"category":"Thrown","speed":3},
	{"name":"Toxic blowpipe (Iron)","slot":"2h","bonuses":[0,0,0,0,30,0,0,0,0,0,0,22,0,0],"id":12926,"category":"Thrown","speed":3},
	{"name":"Toxic blowpipe (Steel)","slot":"2h","bonuses":[0,0,0,0,30,0,0,0,0,0,0,23,0,0],"id":12926,"category":"Thrown","speed":3},
	{"name":"Toxic blowpipe (Black)","slot":"2h","bonuses":[0,0,0,0,30,0,0,0,0,0,0,26,0,0],"id":12926,"category":"Thrown","speed":3},
	{"name":"Toxic blowpipe (Mithril)","slot":"2h","bonuses":[0,0,0,0,30,0,0,0,0,0,0,29,0,0],"id":12926,"category":"Thrown","speed":3},
	{"name":"Toxic blowpipe (Adamant)","slot":"2h","bonuses":[0,0,0,0,30,0,0,0,0,0,0,37,0,0],"id":12926,"category":"Thrown","speed":3},
	{"name":"Toxic blowpipe (Rune)","slot":"2h","bonuses":[0,0,0,0,30,0,0,0,0,0,0,46,0,0],"id":12926,"category":"Thrown","speed":3},
	{"name":"Toxic blowpipe (Amethyst)","slot":"2h","bonuses":[0,0,0,0,30,0,0,0,0,0,0,48,0,0],"id":12926,"category":"Thrown","speed":3},
	{"name":"Toxic blowpipe (Dragon)","slot":"2h","bonuses":[0,0,0,0,30,0,0,0,0,0,0,55,0,0],"id":12926,"category":"Thrown","speed":3},

]

const itemNames = itemList.map((item) => item.name)

const addSlot = (slot, callback) => {
	https
		.get(
			boxUrl +
				slot +
				".json",
			(resp) => {
				let data = "";

				// A chunk of data has been recieved.
				resp.on("data", (chunk) => {
					data += chunk;
				});

				// The whole response has been received. Print out the result.
				resp.on("end", async () => {
					// console.log(data)
					const wObj = JSON.parse(data, false, 2);
					for (const [key, value] of Object.entries(wObj)) {
						const item = {
							name: value.wiki_name,
							slot: slot,
							bonuses: boxBonusList.map((bonus) => value.equipment[bonus]),
							id: value.id,
						}

						if (slot === '2h' || slot === 'weapon'){
							item.category = categoryTable[value.weapon['weapon_type']]
							item.speed = value.weapon.attack_speed
						}


						// await api.addItem(item).then(()=>{console.log("added", item.name)})
						if(!itemNames.includes(item.name)){
							itemList.push(item)
							itemNames.push(item.name)

							let dataURI =
							"data:image/png;base64," + value.icon;
							let path =
								"./public/assets/item_images/" + value.id + ".png";
							ImageDataURI.outputFile(dataURI, path).then(()=>
								console.log("image created", value.id +".png")
							);
						}
						
					}
					callback(slot)
				});
			}
		)
		.on("error", (err) => {
			console.log("Error: " + err.message);
			callback(slot)
		});
}

const nextSlot = (slot) => {
	let index = slots.findIndex(s => s === slot)
	if(index === slots.length - 1){
		fs.writeFileSync('./public/assets/items.json', JSON.stringify(itemList));
		console.log("all slots complete")
		process.exit()
	}
	else{
		addSlot(slots[index + 1], nextSlot)
	}
}

addSlot('cape', nextSlot)