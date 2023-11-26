import { Flags } from "./Flags.js";
import { MaxHit } from "./MaxHit.js";
import { Accuracy } from "./Accuracy.js";
import { AttackSpeed } from "./AttackSpeed.js";
import { SpecialWeapons } from "./SpecialWeapons.js";
import { SpecialAttacks } from "./SpecialAttacks.js";
import { HitFreqStore } from "./HitFreqStore.js";
import Player from "../Player.js";

import { Overhit } from "./overhit/Overhit.js";

// const pickSpec = (weapon) => {
//     switch (weapon) {
//         case "Dragon claws":
//             return "Slice and Dice";
//         case "Dragon dagger (Unpoisoned)":
//         case "Dragon dagger (Poison)":
//         case "Dragon dagger (Poison+)":
//         case "Dragon dagger (Poison++)":
//             return "Puncture";
//     }
//     return null
// }

export class Dps {
    constructor(stateObj) {
        this.state = {
            ...stateObj,
            player: new Player(stateObj.player)
        }
        this.calcs = {
            vertex: "Melee",
            flags: [],
            maxHit: 0,
            accuracy: 0,
            altAccuracy: 0,
            attackSpeed: 1,
            dps: 0,
            acc1plus: 0,
            overhit1: 0,
            overhit2: 0,
            hitpoints: this.state.monster.stats.hitpoints,
            specName: null,
            specCalcs: null,
            eHealing: 0,
            ePrayer: 0,
            eDefReduction: 0,
        }

    }

    pickSpec(weapon) {
        switch (weapon) {
            case "Dragon claws":
                return "Slice and Dice";

            case "Dragon dagger (Unpoisoned)":
            case "Dragon dagger (Poison)":
            case "Dragon dagger (Poison+)":
            case "Dragon dagger (Poison++)":
            case "Dragon dagger":
                return "Puncture";

            case "Dark bow":
            case "Dark bow (Yellow)":
            case "Dark bow (Blue)":
            case "Dark bow (White)":
            case "Dark bow (Green)":
                return this.state.player.equipment.ammo.name.includes("Dragon") ? "Descent of Dragons" : "Descent of Darkness";
            case "Armadyl crossbow":
                return "Armadyl eye";

            case "Magic shortbow":
            case "Magic shortbow (i)":
                return "Snapshot"

            case "Magic longbow":
            case "Magic comp bow":
                return "Powershot"

            case "Armadyl godsword":
            case "Armadyl godsword (or)":
                return "The Judgement"

            case "Saradomin godsword":
            case "Saradomin godsword (or)":
                return "Healing Blade"

            case "Bandos godsword":
            case "Bandos godsword (or)":
                return "Warstrike"

            case "Crystal halberd":
                return "Sweep";
            case "Dragon warhammer":
                return "Smash";
            case "Ancient godsword":
                return "Blood Sacrifice"
        }
        if (weapon.includes("Toxic blowpipe")) {
            return "Toxic Siphon"
        }
        return null
    }

    setSpecName(name) {
        this.calcs.specName = name
    }

    setVertex() {
        const type = this.state.player.attackStyle.type
        const style = this.state.player.attackStyle.style
        const spell = this.state.player.spell

        if (spell != null || type == "Magic") {
            this.calcs.vertex = "Magic";
            this.calcs.attackType = "Magic"
            if (type == "Magic") {
                this.calcs.attackStyle = style
            } else if (spell) {
                this.calcs.attackStyle = "Spell"
            }
        } else if (type == "Ranged") {
            this.calcs.vertex = "Ranged"
            this.calcs.attackType = "Ranged"
            this.calcs.attackStyle = style
        } else {
            this.calcs.vertex = "Melee"
            this.calcs.attackType = type
            this.calcs.attackStyle = style
        }
    }

    setFlags() {
        var flags = new Flags(this.state, this.calcs);
        this.calcs.flags = flags.outputFlags()
    }

    setMaxHit() {
        var max = new MaxHit(this.state, this.calcs)


        this.calcs.maxHit = max.output()

        this.calcs.maxList = [this.calcs.maxHit]
        // if (this.calcs.flags.includes("Dark bow")) {
        //     this.calcs.maxList.push(this.calcs.maxHit)
        // } else if (this.calcs.flags.includes("Scythe of vitur")) {
        //     this.calcs.maxList.push(Math.trunc(this.calcs.maxHit / 2))
        //     this.calcs.maxList.push(Math.trunc(this.calcs.maxHit / 4));
        // }

        // let maxHit = 0;
        // for (var i = 0; i < this.calcs.maxList.length; i++) {
        //     maxHit += this.calcs.maxList[i]
        // }

        // this.calcs.maxHit = maxHit
    }

    setAccuracy() {
        var acc = new Accuracy(this.state, this.calcs)
        this.calcs.playerRoll = acc.output();

        if(this.calcs.vertex === "Melee"){
            this.calcs.npcRoll = acc.npcRoll(this.state.player.attackStyle.type)
        }
        else{
            this.calcs.npcRoll = acc.npcRoll(this.calcs.vertex)
        }




        this.calcs.accuracy = acc.compareRolls(this.calcs.playerRoll, this.calcs.npcRoll);
        this.calcs.altAccuracy = acc.compareRolls(acc.altOutput(), this.calcs.npcRoll);
        if (this.calcs.flags.includes("Double Cast Bug Abuse")) {
            this.calcs.accuracy = 1
        }
        if (this.calcs.flags.includes("Brimstone ring")) {
            this.calcs.accuracy = 0.75 * this.calcs.accuracy + 0.25 * acc.compareRolls(this.calcs.playerRoll, Math.ceil(this.calcs.npcRoll * 9 / 10))
        }

        if (this.calcs.flags.includes("Maiden freeze")) {
            let minRoll = acc.generalFormula(this.state.player.stats.magic + 9, 0)
            let maxRoll = acc.generalFormula(this.state.player.stats.magic + 9, 140)
            if (this.calcs.playerRoll >= maxRoll) {
                this.calcs.accuracy = 1;
            } else if (this.calcs.playerRoll < minRoll) {
                this.calcs.accuracy = 0;
            } else {
                this.calcs.accuracy = (this.calcs.playerRoll - minRoll + 1) / (maxRoll - minRoll + 1)
            }
        }

        this.calcs.rawAcc = this.calcs.accuracy
    }

    setAttackSpeed() {
        var speed = new AttackSpeed(this.state, this.calcs)
        this.calcs.attackSpeed = speed.output()
    }

    setHitDist() {
        const acc = this.calcs.accuracy
        const altAcc = this.calcs.altAccuracy
        const max = this.calcs.maxHit
        const hp = this.state.monster.stats.hitpoints;

        let hitStore = new HitFreqStore();
        hitStore.store([0], 1 - acc);
        for (var dmg = 0; dmg <= max; dmg++) {
            hitStore.store([dmg], acc / (max + 1))
        }
        this.calcs.hitStore = hitStore;
        this.calcs.hitDist = hitStore.getDist(hp);
        
        let altHitStore = new HitFreqStore();
        altHitStore.store([0], 1 - altAcc);
        for (var dmg = 0; dmg <= max; dmg++) {
            altHitStore.store([dmg], altAcc / (max + 1))
        }
        this.calcs.altHitStore = altHitStore;
        this.calcs.altHitDist = altHitStore.getDist(hp);

        this.applySpecials();

        let maxHit = 0;
        for (var i = 0; i < this.calcs.maxList.length; i++) {
            maxHit += this.calcs.maxList[i]
        }

        this.calcs.maxHit = maxHit;
        this.calcs.npcHp = hp; 
    }

    setDps() {
        const acc = this.calcs.accuracy
        const max = this.calcs.maxHit
        const speed = this.calcs.attackSpeed

        let hitDist = this.calcs.hitDist
        let dps = 0;

        let eDmg = 0;

        for (let dmg = 0; dmg < hitDist.length; dmg++) {
            dps += dmg * hitDist[dmg] / speed / 0.6
            eDmg += dmg * hitDist[dmg]
        }

        this.calcs.eDmg = eDmg
        this.calcs.dps = dps
    }

    setAccOverOne() {
        this.calcs.acc1plus = 1 - this.calcs.hitDist[0]
    }

    applySpecials() {
        const someBolts = [
            "Enchanted pearl bolts",
            "Enchanted opal bolts",
            "Enchanted jade bolts",
            "Enchanted pearl bolts fiery",
        ]
        const specs = new SpecialWeapons(this.state, this.calcs)
        const specialAttacks = new SpecialAttacks(this.state, this.calcs);

        if (this.calcs.specName !== null) {
            this.calcs = specialAttacks.applySpec(this.calcs.specName)
        }


        if (this.calcs.flags.includes("Scythe of vitur")) {
            this.calcs = specs.scythe()
        } else if (this.calcs.flags.includes("Dark bow")) {
            this.calcs = specs.darkbow();
        }
        else if (this.calcs.flags.includes("Osmumten's fang")){
            this.calcs = specs.fang();
        }



        if (this.calcs.flags.includes("Enchanted diamond bolts")) {
            this.calcs = specs.diamondBolts()
        } else if (this.calcs.flags.includes("Enchanted onyx bolts")) {
            this.calcs = specs.onyxBolts()
        } else if (this.calcs.flags.includes("Keris") || this.calcs.flags.includes("Keris partisan of breaching")) {
            this.calcs = specs.keris()
        } else if (this.calcs.flags.includes("Verac's set")) {
            this.calcs = specs.veracs()
        } else if (this.calcs.flags.includes("Karil's set")) {
            this.calcs = specs.karils()
        } else if (this.calcs.flags.includes("Ahrim's set")) {
            this.calcs = specs.ahrims()
        } else if (this.calcs.flags.includes("Dharok's set")) {
            this.calcs = specs.dharoks()
        } else if (this.calcs.flags.includes("Enchanted dragonstone bolts")) {
            this.calcs = specs.dragonstoneBolts();
        }

        if(this.calcs.flags.includes("Brawler's Resolve")){
            this.calcs = specs.brawlers();
        }

        someBolts.forEach((bolt) => {
            if (this.calcs.flags.includes(bolt)) {
                this.calcs = specs.generalBolt(bolt)
            }
        })

        if (this.calcs.flags.includes("Enchanted ruby bolts")) {
            this.calcs = specs.rubyBolts()
        }

        if(this.calcs.flags.includes("Archer's Embrace")){
            this.calcs = specs.embrace();
        }

        if (this.calcs.flags.includes("Barbarian Assault")) {
            this.calcs = specs.barbarianAssault();
        }

        if (this.calcs.flags.includes("Guardians")) {
            this.calcs = specs.guardians();
        }

        if (this.calcs.flags.includes("Corporeal beast")) {
            this.calcs = specs.corporealBeast();
        }

        if (this.calcs.flags.includes("Zulrah")) {
            this.calcs = specs.zulrah();
        }

        if (this.calcs.flags.includes("Verzik P1")) {
            this.calcs = specs.verzik();
        }


    }

    output() {
        const weapon = this.state.player.equipment.weapon.name
        const spec = this.pickSpec(weapon);
        this.setVertex();
        this.setFlags();
        this.setMaxHit();
        this.setAccuracy();
        this.setAttackSpeed();

        this.setHitDist();

        this.setDps();
        this.setAccOverOne();

        if (spec !== null && this.calcs.specName === null) {
            const specDps = new Dps(this.state);
            specDps.setSpecName(spec);
            this.calcs.specCalcs = specDps.output();
        }
        return this.calcs
    }
}