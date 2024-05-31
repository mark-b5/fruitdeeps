/* PrayerBook.js 
 * Manages a list of prayers and their effects
 * Applies prayer effects to a stat object
 */


const combatPrayers = {
	attack: [
		'Clarity of Thought',
		'Improved Reflexes',
		'Incredible Reflexes',
		],
	strength: [
		'Burst of Strength',
		'Superhuman Strength',
		'Ultimate Strength',
		],
	melee: [
		'Chivalry',
		'Piety'
		],
	magic: [
		'Mystic Will',
		'Mystic Lore',
		'Mystic Might',
		'Augury'
		],
	ranged: [
		'Sharp Eye',
		'Hawk Eye',
		'Eagle Eye',
		'Rigour'
		]
};

const prayerBonuses = {
	'Clarity of Thought': {attack: 1.05},
	'Improved Reflexes': {attack: 1.10},
	'Incredible Reflexes': {attack: 1.15},
	'Burst of Strength': {strength: 1.05},
	'Superhuman Strength': {strength: 1.10},
	'Ultimate Strength': {strength: 1.15},
	'Chivalry': {attack: 1.15, strength: 1.18},
	'Piety': {attack: 1.20, strength: 1.23},
	'Mystic Will': {magic: 1.05},
	'Mystic Lore': {magic: 1.10, magicStr: 1.01}, //add combat rework buff
	'Mystic Might': {magic: 1.15, magicStr: 1.02}, // add combat rework buff
	'Augury': {magic: 1.25, magicStr: 1.04}, //add combat rework buff
	'Sharp Eye': {rangedAcc: 1.05, rangedStr: 1.05},
	'Hawk Eye': {rangedAcc: 1.10, rangedStr: 1.10},
	'Eagle Eye': {rangedAcc: 1.15, rangedStr: 1.15},
	'Rigour': {rangedAcc: 1.20, rangedStr: 1.23}
}

export class PrayerBook{
	constructor(){

	}
	prayerList(){
		return combatPrayers;
	}

	getModifiers(prayerList){
		var prayerModifiers = {
			attack: 1,
			strength: 1,
			rangedAcc: 1,
			rangedStr: 1,
			magic: 1,
			magicStr: 1 //add augury buff
		}

		prayerList.forEach((prayer) => {
			if (prayer in prayerBonuses){
				prayerModifiers = {
					...prayerModifiers,
					...prayerBonuses[prayer]
				}
			}
		})

		return prayerModifiers
	}
}