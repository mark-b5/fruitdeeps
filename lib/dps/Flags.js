//Flags.js is responsible for determining if various special effects are active for the player
//It takes in the state and outputs a list of effects
//This way, all the queries on a player are in one place

//potential flags: black mask, black mask i, salve, salve ei, salve i, salve e, 
//void melee, void ranged, void made, elite void ranged, elite void magic
//arclight, leaf-blade battleaxe, dragon hunter lance, viggora's chainmace, obsidian armor,
//dhcb, craws, twisted bow,

const flagDescriptions = {
    "Salve amulet": "16.7% damage bonus when meleeing undead monsters",
    "Salve amulet (e)": "0% damage bonus when meleeing undead monsters",
    "Salve amulet(i)": "16.7% damage bonus when meleeing undead monsters,15% when maging or ranging",
    "Salve amulet(ei)": "20% damage bonus when attacking undead monsters",
    "Void melee": "10% damage and accuracy bonus when meleeing monsters",
    "Void range": "10% damage and accuracy bonus when ranging monsters",
    "Void mage": "45% accuracy bonus when maging monsters",
    "Elite void range": "12.5% damage and 10% accuracy bonus when ranging monsters",
    "Elite void mage": "2.5% damage and 45% accuracy bonus when maging monsters",
    "Black mask": "16.7% damage and accuracy bonus when meleeing monsters",
    "Black mask (i)": "16.7% damage and accuracy bonus when meleeing monsters, 15% when ranging or maging",

    "Arclight": "70% damage and accuracy bonus against demons",
    "Leaf-bladed battleaxe": "17.5% damage bonus against kurasks and turoths",
    "Keris": "33% damage bonus against kalphites and scabarites, and a 1/51 chance to deal triple damage",
    "Keris partisan of breaching": "33% damage and accuracy bonuses against kalphites and scabarites, and a 1/51 chance to deal triple damage",
    "Keris partisan of the sun": "25% increase to accuracy for monsters with less than 25% health in Tombs of Amascut",
    "Twisted bow": "Damage and accuracy bonuses dependent on the opponent's magic level or magic attack",
    "Twisted bow - Chambers": "Damage and accuracy bonuses dependent on the opponent's magic level or magic attack, with a higher than normal cap",
    "Scythe of vitur": "Two extra hits of 50% and 25% of the standard max hit, each with their own accuracy roll",
    "Berserker necklace": "20% damage boost to melee obsidian weaponry",
    "Obsidian armour": "10% damage and accuracy boost to melee obsidian weaponry",
    "Dragon hunter crossbow": "30% damage and accuracy boost against dragons",
    "Craw's bow": "50% damage and accuracy boost in the wilderness",
    "Viggora's chainmace": "50% damage and accuracy boost when in the wilderness",
    "Thammaron's sceptre": "100% accuracy and 20% damage bonus when casting spells in the wilderness",
    "Dragon hunter lance": "20% damage and accuracy boost against dragons",
    "Dark bow": "Shoots two arrows at once with a single accuracy roll",
    "Osmumten's fang": "Hit distribution is tightened and attack roll for accuracy is rolled twice",
    "Tumeken's shadow": "Triples magic accuracy bonus and magic damage bonus. Quadruples in ToA",

    "Blisterwood flail": "25% damage and 5% accuracy bonus against vampyres",
    "Blisterwood sickle": "15% damage and 5% accuracy bonus against vampyres",
    "Ivandis flail": "20% damage bonus against vampyres",

    "Smoke battlestaff": "10% damage and accuracy boost when casting spells from the standard spellbook",
    "Tome of fire": "50% damage boost when casting fire elemental spells",
    "Chaos gauntlets": "+3 to the max hits of bolt spells",
    "Charge": "+10 to the max hits of god spells",
    "Slayer's staff (e)": "increases the maximum hit of Magic Dart",
    "Brimstone ring": "25% chance of ignoring 10% of the monster's total magic defence",

    "Enchanted opal bolts": "5% chance of a guaranteed hit with [visible ranged level / 10] extra damage",
    "Enchanted pearl bolts": "6% chance of a guaranteed hit with [visible ranged level / 20] extra damage",
    "Enchanted pearl bolts fiery": "6% chance of a guranteed hit with [visible ranged level / 15] extra damage",
    "Enchanted ruby bolts": "6% chance of a guaranteed hit that hits for 20% of the opponent's hp, capped at 100",
    "Enchanted diamond bolts": "10% chance of a guaranteed hit with a 15% increased max hit",
    "Enchanted dragonstone bolts": "6% chance to do [visible ranged level / 5] extra damage",
    "Enchanted onyx bolts": "11% chance to deal an extra 20% damage against alive monsters",

    "Kandarin hard diary": "Increases enchanted bolt proc chance by 10%",

    "Ahrim's set": "25% chance of increasing max hit by 30%",
    "Karil's set": "25% chance of doing an extra 50% damage (floored) with Amulet of the damned",
    "Dharok's set": "1% * [base hitpoints / 100] increased max hit for each hitpoint lost",
    "Verac's set": "25% chance of a guaranteed hit with 1 extra damage",

    "Inquisitor's armour set": "Increases crush accuracy and damage by 2.5%",

    "Harmonised nightmare staff": "Casts standard spells at an attack speed of 4 ticks",

    "Inquisitor's hauberk": "Increases crush accuracy and damage by 0.5%",
    "Inquisitor's great helm": "Increases crush accuracy and damage by 0.5%",
    "Inquisitor's plateskirt": "Increases crush accuracy and damage by 0.5%",

    "Crystal helm": "3% damage and 6% accuracy bonus when using the Crystal bow or Bowfa",
    "Crystal legs": "3% damage and 6% accuracy bonus when using the Crystal bow or Bowfa",
    "Crystal body": "3% damage and 6% accuracy bonus when using the Crystal bow or Bowfa",
    "Crystal armour set": "15% damage and 30% accuracy bonus when using the Crystal bow or Bowfa",

    "Quick Shot": "Range attacks have 100% increased accuracy, 10% increased damage, and attack twice as fast",
    "Fluid Strike": "Melee attacks have 25% increased accuracy and attack twice as fast",
    "Double Cast": "Magic attacks have 125% increased accuracy and attack twice as fast",

    "Double Cast Bug Abuse": "Ice spells sometimes have 100% accuracy with Double Cast",

    "Brawler's Resolve" : "asda",
    "Superior Sorcerer" : "asdsa",
    "Archer's Embrace" : "asda",    

    "Tier 6": "10% increased damage and accuracy",

    "Ice demon": "Ice demon takes 1/3 damage from range and melee, and 150% damage from fire spells; magic defence uses defence level",
    "Guardians": "Only pickaxes damage Guardians, and with a multiplier",
    "Zulrah": "Hits above 50 are re-rolled and melee does no damage",
    "Corporeal beast": "All hits are halved, except hits from spears, magic, or halberds on stab",
    "Barbarian Assault": "Each hit does extra damage according to the player's Attacker rank",
    "Verzik P1": "All hits, except those from Dawnbringer, are damage capped; magic defence uses defence level",
    "Verzik": "Magic defence uses defence level",
    "Tekton": "Dragon warhammer and Bandos godsword will drain additional defence on misses",
    "Maiden freeze": "When freezing Nylocas Matomenos, a special accuracy formula is used",
    "Tombs of Amascut": "Monsters in Tombs of Amascut get an extra 2% defence per 5 invocation"
}


import { SpellBook } from "../SpellBook.js";

const salvList = ["Salve amulet", "Salve amulet (e)", "Salve amulet(i)", "Salve amulet(ei)"]

const obbyMelee = ['Toktz-xil-ak', 'Tzhaar-ket-em', 'Tzhaar-ket-om', 'Tzhaar-ket-om (t)', 'Toktz-xil-ek']

export class Flags {
    constructor(state = {}, calcs = {}) {
        this.state = state;
        this.calcs = calcs
    }

    salveBlackMask() {
        const neck = this.state.player.equipment.neck.name
        const head = this.state.player.equipment.head.name
        const attributes = this.state.monster.attributes

        if (attributes.includes("undead") && salvList.includes(neck)) {
            if (neck == "Salve amulet(i)" || neck == "Salve amulet(ei)" || this.calcs.vertex == "Melee") {
                return [neck]
            }
        }

        if (this.state.player.misc.onTask && (head.includes("Black mask") || head.toLowerCase().includes("slayer helmet"))) {
            if (head.includes("(i)")) {
                return ["Black mask (i)"]
            } else if (this.calcs.vertex == "Melee") {
                return ["Black mask"]
            }
        }
        return []
    }

    void() {
        const head = this.state.player.equipment.head.name
        const hands = this.state.player.equipment.hands.name
        const body = this.state.player.equipment.body.name
        const legs = this.state.player.equipment.legs.name
        const slots = ["head", "hands", "body", "legs"]

        const elite = (body.includes("Elite") && legs.includes("Elite"))

        //Check each slot and return null if it's not void
        //I named the variable dumb bc this code is dumb
        var dumb = false
        slots.forEach((slot) => {
            if (!this.state.player.equipment[slot].name.toLowerCase().includes("void")) {
                dumb = true
            }
        })
        if (dumb) {
            //early return if not wearing void
            return []
        }

        if (head.includes("Void melee helm")) {
            return ["Void melee"]
        } else if (head.includes("Void ranger helm") && elite && this.calcs.vertex == "Ranged") {
            return ["Elite void range"]
        } else if (head.includes("Void mage helm") && elite) {
            return ["Elite void mage"]
        } else if (head.includes("Void ranger helm") && this.calcs.vertex == "Ranged") {
            return ["Void range"]
        } else if (head.includes("Void mage helm")) {
            return ["Void mage"]
        }
        return []
    }

    weapon() {
        const weapon = this.state.player.equipment.weapon.name
        const player = this.state.player

        const attributes = this.state.monster.attributes
        const vampyre = attributes.includes("vampyre")
        const xerician = attributes.includes("xerician")

        if (weapon.includes("Craw's bow") && player.misc.wilderness) {
            return ["Craw's bow"]
        }

        if (weapon.includes("Viggora's chainmace") && player.misc.wilderness) {
            return ["Viggora's chainmace"]
        }

        if (weapon.includes("Dark bow")) {
            return ["Dark bow"]
        }

        if (weapon.includes("Osmumten's fang")){
            return ["Osmumten's fang"]
        }

        if (weapon == "Thammaron's sceptre") {
            return player.spell && player.misc.wilderness ? ["Thammaron's sceptre"] : []
        }

        if (weapon.toLowerCase().includes("scythe of vitur")) {
            return ["Scythe of vitur"]
        }

        if(weapon.includes("Keris partisan of breaching")) {
            return attributes.includes('kalphite') ? ["Keris partisan of breaching"] : []
        }
        if(weapon.includes("Keris partisan of the sun")) {
            var flags = []
            if ("invocation" in this.state.monster) {
                flags.push("Keris partisan of the sun")
            }
            if (attributes.includes('kalphite')) {
                flags.push("Keris")
            }
            return flags
        }
        if (weapon.includes("Keris")) {
            return attributes.includes('kalphite') ? ["Keris"] : []
        }

        switch (weapon) {
            case "Arclight":
                return (attributes.includes('demon') ? [weapon] : [])
            case "Leaf-bladed battleaxe":
                return (attributes.includes('leafy') ? [weapon] : [])
            case "Dragon hunter lance":
            case "Dragon hunter crossbow":
                return (attributes.includes('dragon') ? [weapon] : [])
            case "Blisterwood flail":
            case "Blisterwood sickle":
            case "Ivandis flail":
                return vampyre ? [weapon] : []
            case "Twisted bow":
                if (xerician) {
                    return ["Twisted bow - Chambers"]
                }
                return [weapon]
        }
        return []
    }

    obsidian() {
        const weapon = this.state.player.equipment.weapon.name;
        const neck = this.state.player.equipment.neck.name

        const body = this.state.player.equipment.body.name
        const legs = this.state.player.equipment.legs.name
        const head = this.state.player.equipment.head.name

        var flaglist = []
        if (!obbyMelee.includes(weapon) || this.calcs.vertex !== 'Melee') {
            return []
        }



        if (body == "Obsidian platebody" && legs == "Obsidian platelegs" && head == "Obsidian helmet") {
            flaglist.push("Obsidian armour")
        }

        if (neck == "Berserker necklace" || neck == "Berserker necklace (or)") {
            flaglist.push("Berserker necklace")
        }

        return flaglist

    }

    magicStuff() {
        const specialWeapons = ["Trident of the seas", "Trident of the swamp", 'Sanguinesti staff', 'Black salamander', "Red salamander", "Orange Salamander", "Swamp Lizard"]
        const godSpells = ['Saradomin Strike', 'Flames of Zamorak', 'Claws of Guthix']
        const stdSpells = new SpellBook().getSpellList().standard

        const spellBook = new SpellBook();

        const spell = this.state.player.spell
        const charge = this.state.player.misc.charge
        const weapon = this.state.player.equipment.weapon.name;
        const shield = this.state.player.equipment.shield.name;
        const hands = this.state.player.equipment.hands.name;
        const ring = this.state.player.equipment.ring.name;
        const attributes = this.state.monster.attributes
        var flags = []



        // console.log('standard', spellBook.getSpellList().standard)

        if (spellBook.getSpellList().standard.includes(spell) && weapon == "Harmonised nightmare staff") {
            flags.push("Harmonised nightmare staff")
        }

        if (charge && godSpells.includes(spell)) {
            flags.push('Charge')
        }
        if (hands == "Chaos gauntlets" && spell.includes("Bolt")) {
            flags.push(hands)
        }
        if (shield == "Tome of fire" && spell && spell.includes("Fire")) {
            flags.push("Tome of fire")
        }
        if (weapon == "Smoke battlestaff" && stdSpells.includes(spell)) {
            flags.push(weapon)
        }
        if (ring == "Brimstone ring" && this.calcs.vertex == "Magic") {
            flags.push(ring)
        }
        if(weapon === "Tumeken's shadow" && !spell){
            flags.push("Tumeken's shadow")
        }

        if (weapon == "Slayer's staff (e)" && spell == "Magic Dart" && this.state.player.misc.wilderness) {
            flags.push(weapon)
        }



        return flags
    }

    enchantedBolts() {
        const player = this.state.player
        const monster = this.state.monster
        const category = player.equipment.weapon.category
        const ammo = player.equipment.ammo.name
        const fiery = this.state.monster.attributes.includes("fiery")
        const dragon = monster.attributes.includes("dragon")
        const undead = monster.attributes.includes("undead")

        const flags = []
        // console.log('category', category)
        if (player.spell || category != "Crossbow") {
            return flags
        }

        switch (ammo) {
            case "Opal bolts (e)":
            case "Opal dragon bolts (e)":
                flags.push("Enchanted opal bolts")
                break;
            case "Jade bolts (e)":
            case "Jade dragon bolts (e)":
                flags.push("Enchanted Jade bolts")
                break;
            case "Pearl bolts (e)":
            case "Pearl dragon bolts (e)":
                flags.push(fiery ? "Enchanted pearl bolts fiery" : "Enchanted pearl bolts")
                break;
            case "Ruby bolts (e)":
            case "Ruby dragon bolts (e)":
                flags.push("Enchanted ruby bolts")
                break;
            case "Diamond bolts (e)":
            case "Diamond dragon bolts (e)":
                flags.push("Enchanted diamond bolts")
                break;
            case "Dragonstone bolts (e)":
            case "Dragonstone dragon bolts (e)":
                dragon || flags.push("Enchanted dragonstone bolts")
                break;
            case "Onyx bolts (e)":
            case "Onyx dragon bolts (e)":
                console.log("onyx bolts ee ------")
                undead ? null : flags.push("Enchanted onyx bolts")
                break;
        }

        if (flags.length > 0 && player.misc.kandarinHard) {
            flags.push("Kandarin hard diary")
        }

        return flags
    }

    barrows() {
        const player = this.state.player
        const body = player.equipment.body.name
        const legs = player.equipment.legs.name
        const weapon = player.equipment.weapon.name
        const head = player.equipment.head.name
        const neck = player.equipment.neck.name
        const ammo = player.equipment.ammo.name

        const loadOut = [body, legs, weapon, head]

        var dharoks = (this.calcs.vertex == "Melee")
        loadOut.forEach((slot) => {
            if (!slot.includes("Dharok's")) {
                dharoks = false
            }
        })

        var veracs = true
        loadOut.forEach((slot) => {
            if (!slot.includes("Verac's")) {
                veracs = false
            }
        })


        var ahrims = (neck.includes("Amulet of the damned") && player.spell)
        loadOut.forEach((slot) => {
            if (!slot.includes("Ahrim's")) {
                ahrims = false
            }
        })


        var karils = (neck.includes("Amulet of the damned") && ammo == "Bolt rack")
        loadOut.forEach((slot) => {
            if (!slot.includes("Karil's")) {
                karils = false
            }
        })

        if (dharoks) {
            return ["Dharok's set"]
        }
        if (karils) {
            return ["Karil's set"]
        }
        if (ahrims) {
            return ["Ahrim's set"]
        }
        if (veracs) {
            return ["Verac's set"]
        }
        return []
    }

    inquisitors() {
        const player = this.state.player
        const body = player.equipment.body.name
        const head = player.equipment.head.name
        const legs = player.equipment.legs.name

        const slots = ['body', 'head', 'legs']

        const flags = []

        if (player.attackStyle.type !== "Crush" || player.spell) {
            return flags
        }

        slots.forEach((slot) => {
            if (player.equipment[slot].name.includes("Inquisitor's")) {
                flags.push(player.equipment[slot].name)
            }
        })

        if (flags.length == 3) {
            return ["Inquisitor's armour set"]
        } else {
            return flags
        }
    }

    crystalArmor() {
        const player = this.state.player
        const weapon = player.equipment.weapon.name
        const legs = player.equipment.legs.name
        const body = player.equipment.body.name
        const head = player.equipment.head.name

        const flags = []

        if (player.spell || weapon !== "Crystal bow" && weapon !== "Bow of faerdhinen") {
            return flags
        }

        if (body === "Crystal body (Active)" || body === "Crystal body") {
            flags.push("Crystal body")
        }

        if (legs === "Crystal legs (Active)" || legs === "Crystal legs") {
            flags.push("Crystal legs")
        }

        if (head === "Crystal helm (Active)" || head === "Crystal helm") {
            flags.push("Crystal helm")
        }

        if (flags.length === 3) {
            return ["Crystal armour set"]
        }
        return flags


    }

    description(flag) {
        return flagDescriptions[flag]
    }

    relics() {
        const player = this.state.player
        const vertex = this.calcs.vertex
        const t3 = player.misc.tier3relic
        const voidList = this.void();
        const mBonus = player.bonuses[3]
        const flags = []

        const ice = player.spell && player.spell.includes("Ice")

        if (t3 == "Quick Shot" && vertex == "Ranged") {
            flags.push(t3)
        } else if (t3 == "Fluid Strike" && vertex == "Melee") {
            flags.push(t3)
        } else if (t3 == "Double Cast" && vertex == "Magic") {
            flags.push(t3)
            if (ice && (mBonus >= 60 || mBonus >= 20 && (voidList.includes('Void mage') || voidList.includes("Elite void mage")))) {
                flags.push("Double Cast Bug Abuse")
            }
        }

        else if (t3 == "Brawler's Resolve" && vertex == "Melee"){
            flags.push(t3)
        }
        else if (t3 == "Superior Sorcerer" && vertex == "Magic"){
            flags.push(t3)
        }
        else if (t3 == "Archer's Embrace" && vertex == "Ranged"){
            flags.push(t3)
        }

        if (player.misc.tier6relic) {
            flags.push('Tier 6')
        }

        return flags
    }


    npcs() {
        const flags = []
        const category = this.state.player.equipment.weapon.category;
        const type = this.state.player.attackStyle.type
        const weaponName = this.state.player.equipment.weapon.name

        if (this.state.monster.name == "Zulrah") {
            flags.push("Zulrah");
        }

        if (this.state.monster.attributes.includes("penance")) {
            flags.push("Barbarian Assault");
        }

        if (this.state.monster.name == "Corporeal Beast") {
            if (!(this.calcs.vertex == "Magic" || weaponName.includes("spear") || (weaponName.includes("halberd") || weaponName.includes("fang")) && type == "Stab")) {
                flags.push("Corporeal beast");
            }
        }

        if (this.state.monster.name == "Ice demon") {
            flags.push("Ice demon");
        }

        if (this.state.monster.name == "Guardian") {
            flags.push("Guardians");
        }

        if (this.state.monster.name === "Verzik Vitur") {
            flags.push(this.state.monster.combat === 1040 ? "Verzik P1" : "Verzik");
        }

        if (this.state.monster.name.includes("Tekton")) {
            flags.push("Tekton")
        }

        if (this.state.monster.name.includes("Nylocas Matomenos") && this.state.player.spell !== null && this.state.player.spell.includes("Ice")) {
            flags.push("Maiden freeze")
        }

        
        if ("invocation" in this.state.monster) {
            flags.push("Tombs of Amascut")
        }

        return flags
    }

    outputFlags() {
        var state = this.state
        var flags = []

        // console.log('this.weapon', this.weapon())

        //Runs all the methods and consolidates their return lists
        flags = [
            ...this.salveBlackMask(),
            ...this.void(),
            ...this.weapon(),
            ...this.obsidian(),
            ...this.magicStuff(),
            ...this.enchantedBolts(),
            ...this.barrows(),
            ...this.inquisitors(),
            ...this.crystalArmor(),
            ...this.relics(),
            ...this.npcs()
        ]

        return flags

    }
}