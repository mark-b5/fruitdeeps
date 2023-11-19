//Melee, ranged, and magic methods are turbo redundant but I think it increases readability that way
import { PrayerBook } from '../PrayerBook.js';


export class Accuracy {
    constructor(stateObj, calcs) {
        this.vertex = calcs.vertex;
        this.flags = calcs.flags;
        this.state = stateObj

        var prayerBook = new PrayerBook()
        this.prayerModifiers = prayerBook.getModifiers(this.state.player.prayers)

    }

    generalFormula(a, b) {
        return a * (b + 64)
    }

    compareRolls(atk, def) {
        if (atk > def) {
            return Math.max(0, Math.min(1, 1 - (def + 2) / (2 * (atk + 1))))
        } else {
            return Math.max(0, Math.min(1, atk / (2 * (def + 1))))
        }
    }

    melee() {
        const player = this.state.player
        const monster = this.state.monster
        const attackStyle = player.attackStyle.style
        const attackType = player.attackStyle.type

        var effectiveAtt = player.boostedStats.attack;
        effectiveAtt = Math.floor(effectiveAtt * this.prayerModifiers.attack)

        if (attackStyle == "Accurate") {
            effectiveAtt += 3
        } else if (attackStyle == "Controlled") {
            effectiveAtt += 1
        }

        effectiveAtt += 8

        if (this.flags.includes("Void melee")) {
            effectiveAtt = Math.floor(effectiveAtt * 11 / 10)
        }

        var playerBonus = 0
        switch (attackType) {
            case "Stab":
                playerBonus = player.bonuses[0]
                break;
            case "Slash":
                playerBonus = player.bonuses[1]
                break;
            case "Crush":
                playerBonus = player.bonuses[2]
                break;
        }
        var playerRoll = this.generalFormula(effectiveAtt, playerBonus)

        //apply black mask/salve bonus
        if (this.flags.includes("Salve amulet (e)") || this.flags.includes("Salve amulet(ei)")) {
            playerRoll = Math.floor(playerRoll * 6 / 5)
        } else if (this.flags.includes("Salve amulet") || this.flags.includes("Salve amulet(i)")) {
            playerRoll = Math.floor(playerRoll * 7 / 6)
        }
        //Redundant, but separate from salve amulet for readability. The minimizer fixes this in production
        else if (this.flags.includes("Black mask") || this.flags.includes("Black mask (i)")) {
            playerRoll = Math.floor(playerRoll * 7 / 6)
        }

        if (this.flags.includes("Arclight")) {
            playerRoll = Math.floor(playerRoll * 17 / 10)
        } else if (this.flags.includes("Viggora's chainmace")) {
            playerRoll = Math.floor(playerRoll * 3 / 2)
        } else if (this.flags.includes("Dragon hunter lance")) {
            playerRoll = Math.floor(playerRoll * 6 / 5)
        } else if (this.flags.includes("Obsidian armour")) {
            playerRoll = Math.floor(playerRoll * 11 / 10)
        }
        else if (this.flags.includes("Keris partisan of breaching")){
            playerRoll = Math.floor(playerRoll * 4 / 3)
        }

        if (this.flags.includes("Blisterwood flail") || this.flags.includes("Blisterwood sickle")) {
            playerRoll = Math.floor(playerRoll * 21 / 20)
        }

        const inqList = ["Inquisitor's hauberk", "Inquisitor's great helm", "Inquisitor's plateskirt"]
        //inq bonus
        var inqBonus = 1000
        inqList.forEach((flag) => {
            if (this.flags.includes(flag)) {
                inqBonus += 5
            }
        })
        if (this.flags.includes("Inquisitor's armour set")) {
            inqBonus = 1025
        }

        playerRoll = Math.floor(playerRoll * inqBonus / 1000)


        // if (this.flags.includes("Fluid Strike") && this.flags.includes("Tier 6")) {
        //     playerRoll = Math.floor(playerRoll * 135 / 100)
        // } else if (this.flags.includes("Fluid Strike")) {
        //     playerRoll = Math.floor(playerRoll * 125 / 100)
        // } else if (this.flags.includes("Tier 6")) {
        //     playerRoll = Math.floor(playerRoll * 11 / 10)
        // }

        if (this.flags.includes("Brawler's Resolve")) {
            playerRoll = Math.floor(playerRoll * 150 / 100)
        }

        return playerRoll
    }

    ranged() {
        const player = this.state.player
        const monster = this.state.monster
        const attackStyle = player.attackStyle.style
        const attackType = player.attackStyle.type

        var effectiveRanged = player.boostedStats.ranged;
        effectiveRanged = Math.floor(effectiveRanged * this.prayerModifiers.rangedAcc)

        if (attackStyle == "Accurate") {
            effectiveRanged += 3
        }

        effectiveRanged += 8

        if (this.flags.includes("Elite void range") || this.flags.includes("Void range")) {
            effectiveRanged = Math.floor(effectiveRanged * 11 / 10)
        }

        const playerBonus = player.bonuses[4] //ranged attack

        var playerRoll = this.generalFormula(effectiveRanged, playerBonus)

        //apply black mask/salve bonus
        if (this.flags.includes("Salve amulet(ei)")) {
            playerRoll = Math.floor(playerRoll * 6 / 5)
        } else if (this.flags.includes("Salve amulet(i)") || this.flags.includes("Black mask (i)")) {
            playerRoll = Math.floor(playerRoll * 23 / 20)
        }

        if (this.flags.includes("Dragon hunter crossbow")) {
            playerRoll = Math.floor(playerRoll * 13 / 10)
        } else if (this.flags.includes("Twisted bow") || this.flags.includes("Twisted bow - Chambers")) {
            let cap = 250;
            if (this.flags.includes("Twisted bow - Chambers")) {
                cap = 350;
            }
            const magic = Math.min(Math.max(monster.stats.mage, monster.stats.amagic), cap);
            const tbowMod = 140 + Math.floor((3 * magic - 10) / 100) - Math.floor(Math.pow(3 * magic / 10 - 100, 2) / 100)
            playerRoll = Math.floor(playerRoll * Math.min(tbowMod, 140) / 100)
        } else if (this.flags.includes("Craw's bow")) {
            playerRoll = Math.floor(playerRoll * 3 / 2)
        }

        const crystalList = ["Crystal body", "Crystal legs", "Crystal helm"]
        //inq bonus
        var crystalBonus = 100
        crystalList.forEach((flag) => {
            if (this.flags.includes(flag)) {
                crystalBonus += 6
            }
        })
        if (this.flags.includes("Crystal armour set")) {
            crystalBonus = 130
        }

        playerRoll = Math.floor(playerRoll * crystalBonus / 100)



        // if (this.flags.includes("Quick Shot") && this.flags.includes("Tier 6")) {
        //     playerRoll = Math.floor(playerRoll * 21 / 10)
        // } else if (this.flags.includes("Quick Shot")) {
        //     playerRoll = Math.floor(playerRoll * 2)
        // } else if (this.flags.includes("Tier 6")) {
        //     playerRoll = Math.floor(playerRoll * 11 / 10)
        // }

        if (this.flags.includes("Archer's Embrace")) {
            playerRoll = Math.floor(playerRoll * 2)
        }

        

        return playerRoll
    }

    magic() {
        const player = this.state.player
        const monster = this.state.monster
        const attackStyle = player.attackStyle.style
        const attackType = player.attackStyle.type

        var effectiveMagic = player.boostedStats.magic;
        effectiveMagic = Math.floor(effectiveMagic * this.prayerModifiers.magic)

        if (this.flags.includes("Elite void mage") || this.flags.includes("Void mage")) {
            effectiveMagic = Math.floor(effectiveMagic * 29 / 20)
        }

        if (attackType == "Magic" && attackStyle == "Accurate") {
            effectiveMagic += 2
        }
        effectiveMagic += 9


        let playerBonus = player.bonuses[3] //Magic attack
        if(this.flags.includes("Tumeken's shadow") && this.flags.includes("Tombs of Amascut")){
            playerBonus = playerBonus * 4
        }
        else if(this.flags.includes("Tumeken's shadow")){
            playerBonus = playerBonus * 3
        }
        // if (this.flags.includes("Verzik P1") || this.flags.includes("Ice demon")) {
        //     npcRoll = this.generalFormula(monster.stats.def + 9, npcBonus);
        // }
        var playerRoll = this.generalFormula(effectiveMagic, playerBonus)

        //apply black mask/salve bonus
        if (this.flags.includes("Salve amulet(ei)")) {
            playerRoll = Math.floor(playerRoll * 6 / 5)
        } else if (this.flags.includes("Salve amulet(i)") || this.flags.includes("Black mask (i)")) {

            playerRoll = Math.floor(playerRoll * 23 / 20)
        }

        if (this.flags.includes("Smoke battlestaff")) {
            playerRoll = Math.floor(playerRoll * 11 / 10)
        }

        if (this.flags.includes("Thammaron's sceptre")) {
            playerRoll = playerRoll * 2
        }


        // if (this.flags.includes("Double Cast") && this.flags.includes("Tier 6")) {
        //     playerRoll = Math.floor(playerRoll * 235 / 100)
        // } else if (this.flags.includes("Double Cast")) {
        //     playerRoll = Math.floor(playerRoll * 225 / 100)
        // } else if (this.flags.includes("Tier 6")) {
        //     playerRoll = Math.floor(playerRoll * 11 / 10)
        // }

        if (this.flags.includes("Superior Sorcerer")) {
            playerRoll = Math.floor(playerRoll * 275 / 100)
        }

        // let acc = this.compareRolls(playerRoll, npcRoll)
        // if (this.flags.includes("Brimstone ring")) {
        //     acc = 0.75 * acc + 0.25 * this.compareRolls(playerRoll, Math.ceil(npcRoll * 9 / 10))
        // }

        return playerRoll

        if (this.flags.includes("Double Cast Bug Abuse")) {
            return 1
        }

        return acc
    }

    npcRoll(type) {
        const player = this.state.player
        const monster = this.state.monster
        let npcBonus = 0
        let roll = 0
        // if (this.vertex == "Melee") {
        //     const attackType = player.attackStyle.type
        switch (type) {
            case "Stab":
                npcBonus = monster.stats.dstab
                roll = this.generalFormula(monster.stats.def + 9, npcBonus)
                break;
            case "Slash":
                npcBonus = monster.stats.dslash
                roll = this.generalFormula(monster.stats.def + 9, npcBonus)
                break;
            case "Crush":
                npcBonus = monster.stats.dcrush
                roll = this.generalFormula(monster.stats.def + 9, npcBonus)
                break;
            case "Ranged":
                roll = this.generalFormula(monster.stats.def + 9, monster.stats.drange);
                break;
            case "Magic":
                if (this.flags.includes("Verzik P1") || this.flags.includes("Ice demon") || this.flags.includes("Verzik")) {
                    roll = this.generalFormula(monster.stats.def + 9, monster.stats.dmagic)
                }
                else{
                    roll = this.generalFormula(monster.stats.mage + 9, monster.stats.dmagic)
                }
                break;
        }

        // } else if (this.vertex === "Ranged") {
        //     roll = this.generalFormula(monster.stats.def + 9, monster.stats.drange)
        // } else if (this.vertex === "Magic") {
        //     if (this.flags.includes("Verzik P1") || this.flags.includes("Ice demon") || this.flags.includes("Verzik")) {
        //         roll = this.generalFormula(monster.stats.def + 9, monster.stats.dmagic)
        //     }
        //     else{
        //         roll = this.generalFormula(monster.stats.mage + 9, monster.stats.dmagic)
        //     }
        // }

        if(this.flags.includes("Tombs of Amascut")){
            roll = roll + Math.floor(roll * Math.floor(this.state.monster.invocation / 5) * 2)/100
        }

        return roll
    }

    output() {
        if (this.vertex === "Melee") {
            return this.melee()
        } else if (this.vertex === "Ranged") {
            return this.ranged()
        } else if (this.vertex === "Magic") {
            return this.magic()
        } else { return 0 }
    }

    altOutput() {
        const baseAcc = this.output()
        // 25% accuracy increase
        if (this.flags.includes("Keris partisan of the sun")) {
            return Math.floor(baseAcc * 5 / 4)
        }
        return baseAcc
    }
}