/* PotionDrinker.js 
 * Manages a list of potential boosts and their effects
 * Accepts a stat object and list of boosts and returns a boosted stat object
 */

const boosts = [
    "Attack",
    "Super attack",
    "Strength",
    "Super strength",
    "Zamorak brew",
    "Ranging",
    "Super ranging",
    "Magic",
    "Super magic",
    "Imbued heart",
    "Super combat",
    "Overload (+)",
    "Smelling salts",
    "Saturated heart" // add saturated heart
]

const stats = ['attack', 'strength', 'ranged', 'magic', 'hitpoints', 'prayer', 'defence']


export class PotionDrinker {
    constructor() {
        this.potionEffects = {
            Attack: (statObj) => {
                return {
                    ...statObj,
                    attack: statObj.attack + Math.floor(statObj.attack / 10) + 3
                }
            },

            "Super attack": (statObj) => {
                return {
                    ...statObj,
                    attack: statObj.attack + Math.floor(statObj.attack * 0.15) + 5
                }
            },

            "Strength": (statObj) => {
                return {
                    ...statObj,
                    strength: statObj.strength + Math.floor(statObj.strength / 10) + 3
                }
            },

            "Super strength": (statObj) => {
                return {
                    ...statObj,
                    strength: statObj.strength + Math.floor(statObj.strength * 0.15) + 5
                }
            },

            "Zamorak brew": (statObj) => {
                return {
                    ...statObj,
                    attack: statObj.attack + Math.floor(statObj.attack / 5) + 2,
                    strength: statObj.strength + Math.floor(statObj.strength * 0.12) + 2
                }
            },

            "Ranging": (statObj) => {
                return {
                    ...statObj,
                    ranged: statObj.ranged + Math.floor(statObj.ranged / 10) + 4
                }
            },

            "Super ranging": (statObj) => {
                return {
                    ...statObj,
                    ranged: statObj.ranged + Math.floor(statObj.ranged * 0.15) + 5
                }
            },

            "Magic": (statObj) => {
                return {
                    ...statObj,
                    magic: statObj.magic + 4
                }
            },

            "Super magic": (statObj) => {
                return {
                    ...statObj,
                    magic: statObj.magic + Math.floor(statObj.magic * 0.15) + 5
                }
            },

            "Imbued heart": (statObj) => {
                return {
                    ...statObj,
                    magic: statObj.magic + Math.floor(statObj.magic / 10) + 1
                }
            },

            "Saturated heart": (statObj) => {
                return {
                    ...statObj,
                    magic: statObj.magic + Math.floor(statObj.magic / 10) + 4
                }
            },

            "Super combat": (statObj) => {
                var boostObj = { ...statObj };
                ['attack', 'strength', 'defence'].forEach((stat) => {
                    boostObj[stat] = boostObj[stat] + Math.floor(boostObj[stat] * 0.15) + 5;
                });
                return boostObj;
            },

            "Overload (+)": (statObj) => {
                var boostObj = { ...statObj };
                ['attack', 'strength', 'magic', 'ranged', 'defence'].forEach((stat) => {
                    boostObj[stat] = boostObj[stat] + Math.floor(boostObj[stat] * 0.16) + 6;
                });
                return boostObj;
            },

            "Smelling salts": (statObj) => {
                var boostObj = { ...statObj};
                ['attack', 'strength', 'magic', 'ranged', 'defence'].forEach((stat) => {
                    boostObj[stat] = boostObj[stat] + Math.floor(boostObj[stat] * 0.22) + 5;
                });
                return boostObj;
            }
        }
    }

    boostList() {
        return boosts;
    }

    consolidateBoosts(boostedStatsList) {
        var maxBoosts = {}
        stats.forEach((stat) => {
            boostedStatsList.forEach((boostObj) => {
                if (!(stat in maxBoosts) || boostObj[stat] > maxBoosts[stat]) {
                    maxBoosts[stat] = boostObj[stat]
                }
            })
        })
        return maxBoosts
    }

    boostStats(stats, boostList) {
        var boostedStatsList = boostList.map((boost) => {
            return this.potionEffects[boost](stats)
        })
        boostedStatsList.push({ ...stats })
        return this.consolidateBoosts(boostedStatsList)
    }

}