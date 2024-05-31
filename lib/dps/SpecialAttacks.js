import { Accuracy } from "./Accuracy.js";
import { HitFreqStore } from "./HitFreqStore.js";

export class SpecialAttacks {
    constructor(state, calcs) {
        this.state = state
        this.calcs = calcs
    }

    applySpec(specName) {
        switch (specName) {
            case "Slice and Dice":
                return this.dclaws();
            case "Puncture":
                return this.dds();
            case "Descent of Dragons":
                return this.dbow(true);
            case "Descent of Darkness":
                return this.dbow(false);
            case "Armadyl eye":
                return this.acb();
            case "Snapshot":
                return this.msb()
            case "Powershot":
                return this.magicLong();
            case "The Judgement":
                return this.ags();
            case "Healing Blade":
                return this.sgs();
            case "Warstrike":
                return this.bgs();
            case "Sweep":
                return this.chally();
            case "Immolate":
                return this.volatile();
            case "Toxic Siphon":
                return this.blowp();
            case "Smash":
                return this.dwh();
            case "Blood Sacrifice":
                return this.zgs();
            case "Bonk":
                return this.elder();
        }
        return this.calcs
    }

    dclaws() {
        let accCalc = new Accuracy(this.state, this.calcs)
        const dps = this.calcs
        let max = this.calcs.maxList[0]
        // let npcRoll = accCalc.generalFormula(this.state.monster.stats.def + 9, this.state.monster.stats.dslash)
        let npcRoll = accCalc.npcRoll('Slash')
        let acc = accCalc.compareRolls(this.calcs.playerRoll, npcRoll)
        let trueMax = (max - 1) + Math.trunc((max - 1) / 2) + 2 * Math.trunc((max - 1) / 4) + 1
        // let newDist = Array(trueMax + 1).fill(0)
        let clawHitStore = new HitFreqStore();


        //distribution of first successful roll
        let max1 = max - 1
        let min1 = Math.trunc(max / 2)
        for (let dmg = min1; dmg <= max1; dmg++) {
            // let dmgAll = dmg + Math.trunc(dmg / 2) + 2 * Math.trunc(dmg / 4)
            // newDist[dmgAll] += acc / (max1 - min1 + 1) / 2
            // newDist[dmgAll + 1] += acc / (max1 - min1 + 1) / 2
            clawHitStore.store([dmg, Math.trunc(dmg / 2), Math.trunc(dmg / 4), Math.trunc(dmg / 4)], acc / (max1 - min1 + 1) / 2)
            clawHitStore.store([dmg, Math.trunc(dmg / 2), Math.trunc(dmg / 4), Math.trunc(dmg / 4) + 1], acc / (max1 - min1 + 1) / 2)
        }
        let scalingAcc = (1 - acc)

        //distribution of second successful roll
        let max2 = Math.trunc(max * 7 / 8)
        let min2 = Math.trunc(max * 3 / 8)
        for (let dmg = min2; dmg <= max2; dmg++) {
            // let dmgAll = dmg + 2 * Math.trunc(dmg / 2)
            // newDist[dmgAll] += (acc * scalingAcc) / (max2 - min2 + 1) / 2
            // newDist[dmgAll + 1] += (acc * scalingAcc) / (max2 - min2 + 1) / 2
            clawHitStore.store([0, dmg, Math.trunc(dmg / 2), Math.trunc(dmg / 2)], (acc * scalingAcc) / (max2 - min2 + 1) / 2);
            clawHitStore.store([0, dmg, Math.trunc(dmg / 2), Math.trunc(dmg / 2) + 1], (acc * scalingAcc) / (max2 - min2 + 1) / 2);
        }
        scalingAcc = (1 - acc) * (1 - acc)


        //distribution of third successful roll
        let max3 = Math.trunc(max * 3 / 4)
        let min3 = Math.trunc(max * 1 / 4)
        for (let dmg = min3; dmg <= max3; dmg++) {
            // let dmgAll = 2 * dmg
            // newDist[dmgAll] += (acc * scalingAcc) / (max3 - min3 + 1) / 2
            // newDist[dmgAll + 1] += (acc * scalingAcc) / (max3 - min3 + 1) / 2
            clawHitStore.store([0, 0, dmg, dmg], (acc * scalingAcc) / (max3 - min3 + 1) / 2)
            clawHitStore.store([0, 0, dmg, dmg + 1], (acc * scalingAcc) / (max3 - min3 + 1) / 2)
        }
        scalingAcc = scalingAcc * (1 - acc)


        //distribution of fourth successful roll
        let max4 = Math.trunc(max * 5 / 4)
        let min4 = Math.trunc(max * 1 / 4)
        for (let dmg = min4; dmg <= max4; dmg++) {
            // let dmgAll = dmg
            // newDist[dmgAll] += (acc * scalingAcc) / (max4 - min4 + 1)
            clawHitStore.store([0, 0, 0, dmg], (acc * scalingAcc) / (max4 - min4 + 1))
        }
        scalingAcc = scalingAcc * (1 - acc)
        // newDist[0] += scalingAcc / 2
        // newDist[2] += scalingAcc / 2
        clawHitStore.store([0, 0, 0, 0], scalingAcc / 2)
        clawHitStore.store([0, 0, 1, 1], scalingAcc / 2)

        dps.hitStore = clawHitStore;
        dps.maxList = [max1, Math.trunc(max1 / 2), Math.trunc(max1 / 4), Math.trunc(max1 / 4) + 1]
        dps.accuracy = acc
        dps.rawAcc = acc
        return dps
    }

    dds() {
        const dps = this.calcs
        let accCalc = new Accuracy(this.state, this.calcs)
        let pRoll = Math.trunc(dps.playerRoll * 23 / 20);
        let npcRoll = accCalc.npcRoll("Slash")
        let max = Math.trunc(dps.maxHit * 23 / 20);

        let acc = accCalc.compareRolls(pRoll, npcRoll)

        let ddsHitStore = new HitFreqStore();

        let p1 = 0;
        let p2 = 0;
        for (let hit1 = 0; hit1 <= max; hit1++) {
            p1 = acc / (max + 1)
            if (hit1 === 0) {
                p1 += 1 - acc
            }
            for (let hit2 = 0; hit2 <= max; hit2++) {
                p2 = acc / (max + 1)
                if (hit2 === 0) {
                    p2 += 1 - acc
                }
                ddsHitStore.store([hit1, hit2], p1 * p2)
            }
        }

        dps.hitStore = ddsHitStore;
        dps.rawAcc = acc
        dps.accuracy = acc
        dps.playerRoll = pRoll
        dps.npcRoll = npcRoll
        dps.maxList = [max, max]
        dps.maxHit = max + max
        return dps
    }

    dbow(dragon = true) {
        const dps = this.calcs
        const minDmg = dragon ? 8 : 5;
        const maxDmg = 48;
        const acc = this.calcs.accuracy
        const boost = dragon ? 15 : 13
        let max = Math.trunc(dps.maxHit * boost / 10);

        let dbowHitStore = new HitFreqStore();

        dbowHitStore.store([minDmg], 1 - acc)
        for (let i = 0; i <= max; i++) {
            let dmg = Math.max(Math.min(i, maxDmg), minDmg);
            dbowHitStore.store([dmg], acc / (max + 1))
        }

        let capMax = Math.min(max, maxDmg)
        dps.maxHit = capMax
        dps.hitStore = dbowHitStore
        return dps
    }

    acb() {
        let accCalc = new Accuracy(this.state, this.calcs)
        const dps = this.calcs
        const playerRoll = dps.playerRoll
        const npcRoll = dps.npcRoll

        const max = dps.maxHit

        let newPRoll = playerRoll * 2

        let acc = accCalc.compareRolls(newPRoll, npcRoll);

        let acbHitStore = new HitFreqStore();
        acbHitStore.store([0], 1 - acc)

        for (let i = 0; i <= max; i++) {
            acbHitStore.store([i], acc / (max + 1))
        }


        dps.hitStore = acbHitStore;
        dps.accuracy = acc;
        dps.rawAcc = acc;
        dps.playerRoll = newPRoll
        return dps
    }

    msb() {
        const dps = this.calcs
        const strBonus = this.state.player.bonuses[11]
        const rangedLvl = this.state.player.boostedStats.ranged
        let accCalc = new Accuracy(this.state, this.calcs)
        const playerRoll = Math.trunc(dps.playerRoll * 10 / 7);

        let acc = accCalc.compareRolls(playerRoll, dps.npcRoll);
        let max = Math.trunc(0.5 + (rangedLvl + 10) * (strBonus + 64) / 640);

        let p1 = 0;
        let p2 = 0;
        let msbHitStore = new HitFreqStore();
        for (let hit1 = 0; hit1 <= max; hit1++) {
            p1 = acc / (max + 1)
            if (hit1 === 0) {
                p1 += (1 - acc)
            }
            for (let hit2 = 0; hit2 <= max; hit2++) {
                p2 = acc / (max + 1)
                if (hit2 === 0) {
                    p2 += (1 - acc)
                }
                msbHitStore.store([hit1, hit2], p1 * p2)
            }
        }

        dps.hitStore = msbHitStore
        dps.maxList = [max, max]
        dps.maxHit = max + max
        dps.accuracy = acc
        dps.rawAcc = acc
        return dps
    }

    magicLong() {
        const dps = this.calcs
        const strBonus = this.state.player.bonuses[11]
        const rangedLvl = this.state.player.boostedStats.ranged

        let acc = 1
        let max = Math.trunc(0.5 + (rangedLvl + 10) * (strBonus + 64) / 640);

        let mlbHitStore = new HitFreqStore();
        for (let hit = 0; hit <= max; hit++) {
            mlbHitStore.store([hit], 1 / (max + 1))
        }

        dps.hitStore = mlbHitStore
        dps.maxList = [max]
        dps.maxHit = max
        dps.accuracy = acc
        dps.rawAcc = acc
        return dps;
    }

    ags() {
        const dps = this.calcs
        let playerRoll = dps.playerRoll * 2
        let accCalc = new Accuracy(this.state, this.calcs)
        // let npcRoll = accCalc.generalFormula(this.state.monster.stats.def + 9, this.state.monster.stats.dslash)
        let npcRoll = accCalc.npcRoll("Slash")

        let acc = accCalc.compareRolls(playerRoll, npcRoll);
        let max = Math.trunc(dps.maxHit * 1.375)

        let agsHitStore = new HitFreqStore();
        agsHitStore.store([0], 1 - acc)

        for (let dmg = 0; dmg <= max; dmg++) {
            agsHitStore.store([dmg], acc / (max + 1))
        }

        dps.maxHit = max
        dps.maxList = [max]
        dps.rawAcc = acc
        dps.accuracy = acc
        dps.hitStore = agsHitStore
        dps.npcRoll = npcRoll
        dps.playerRoll = playerRoll

        return dps;
    }

    sgs() {
        const dps = this.calcs
        let playerRoll = dps.playerRoll * 2
        let accCalc = new Accuracy(this.state, this.calcs)
        // let npcRoll = accCalc.generalFormula(this.state.monster.stats.def + 9, this.state.monster.stats.dslash)
        let npcRoll = accCalc.npcRoll("Slash")

        let acc = accCalc.compareRolls(playerRoll, npcRoll);
        let max = Math.trunc(dps.maxHit * 1.1)

        let sgsHitStore = new HitFreqStore();
        sgsHitStore.store([0], 1 - acc)

        let eHealing = 0;
        let ePrayer = 0;
        for (let dmg = 0; dmg <= max; dmg++) {
            sgsHitStore.store([dmg], acc / (max + 1))
            eHealing += Math.max(10, Math.trunc(dmg / 2)) * acc / (max + 1)
            ePrayer += Math.max(5, Math.trunc(dmg / 4)) * acc / (max + 1)
        }


        dps.eHealing += eHealing
        dps.ePrayer += ePrayer
        dps.maxHit = max
        dps.maxList = [max]
        dps.rawAcc = acc
        dps.accuracy = acc
        dps.hitStore = sgsHitStore
        dps.npcRoll = npcRoll
        dps.playerRoll = playerRoll

        return dps
    }

    bgs() {
        const dps = this.calcs
        let playerRoll = dps.playerRoll * 2
        let accCalc = new Accuracy(this.state, this.calcs)
        // let npcRoll = accCalc.generalFormula(this.state.monster.stats.def + 9, this.state.monster.stats.dcrush)
        let npcRoll = accCalc.npcRoll("Slash")

        let acc = accCalc.compareRolls(playerRoll, npcRoll);
        const def = this.state.monster.stats.def
        let max = Math.trunc(Math.trunc(dps.maxHit * 1.1) * 1.1);

        let bgsHitStore = new HitFreqStore();
        bgsHitStore.store([0], (1 - acc));
        bgsHitStore.store([1], acc / (max+ 1 ));
        bgsHitStore.store([1], acc / (max + 1));

        let eDefReduction = 0;
        if (dps.flags.includes("Tekton")) {
            eDefReduction += Math.min(def, 10) * (1 - acc)
        }

        for (let dmg = 2; dmg <= max; dmg++) {
            bgsHitStore.store([dmg], acc / (max + 1))
            eDefReduction += Math.min(def, dmg) * acc / (max + 1)
        }

        dps.hitStore = bgsHitStore
        dps.eDefReduction += eDefReduction
        dps.playerRoll = playerRoll
        dps.npcRoll = npcRoll
        dps.accuracy = acc
        dps.rawAcc = acc
        dps.maxHit = max
        dps.maxList = [max]
        return dps;
    }

    zgs() {
        const dps = this.calcs
        let playerRoll = dps.playerRoll * 2
        let accCalc = new Accuracy(this.state, this.calcs)
        // let npcRoll = accCalc.generalFormula(this.state.monster.stats.def + 9, this.state.monster.stats.dcrush)
        let npcRoll = accCalc.npcRoll("Slash")
        let acc = accCalc.compareRolls(playerRoll, npcRoll);
        let max = Math.trunc(dps.maxHit * 1.1);

        let zgsHitStore = new HitFreqStore();
        zgsHitStore.store([0], (1 - acc))

        for (let dmg = 0; dmg <= max; dmg++) {
            zgsHitStore.store([dmg, 25], acc / (max + 1))
        }

        dps.hitStore = zgsHitStore
        dps.playerRoll = playerRoll
        dps.npcRoll = npcRoll
        dps.accuracy = acc
        dps.rawAcc = acc
        dps.maxHit = max
        dps.maxHitSpec = 25
        dps.maxList = [max]
        dps.eHealing = 25 * acc
        return dps;
    }

    chally() {
        const dps = this.calcs
        const max = Math.trunc(dps.maxHit * 11 / 10);


        let accCalc = new Accuracy(this.state, this.calcs)
        // let npcRoll = accCalc.generalFormula(this.state.monster.stats.def + 9, this.state.monster.stats.dslash)
        let npcRoll = accCalc.npcRoll("Slash")
        let acc1 = accCalc.compareRolls(dps.playerRoll, npcRoll);
        let acc2 = accCalc.compareRolls(Math.trunc(dps.playerRoll * 3 / 4), npcRoll)

        let challyHitStore = new HitFreqStore();
        let p1 = 0;
        let p2 = 0;
        for (let hit1 = 0; hit1 <= max; hit1++) {
            p1 = acc1 / (max + 1)
            if (hit1 === 0) {
                p1 += 1 - acc1
            }
            for (let hit2 = 0; hit2 <= max; hit2++) {
                p2 = acc2 / (max + 1);
                if (hit2 === 0) {
                    p2 += 1 - acc2
                }
                challyHitStore.store([hit1, hit2], p1 * p2)
            }
        }


        dps.hitStore = challyHitStore
        dps.accuracy = acc1
        dps.rawAcc = acc1
        dps.npcRoll = npcRoll
        dps.maxHit = max + max
        dps.maxList = [max, max]

        return dps
    }

    volatile() {
        const dps = this.calcs
        let playerRoll = Math.trunc(dps.playerRoll * 1.5);
        let accCalc = new Accuracy(this.state, this.calcs)
        let acc = accCalc.compareRolls(playerRoll, dps.npcRoll)
        let magic = Math.min(99, this.state.player.stats.magic);
        let max = Math.trunc()
        dps.accuracy = acc
        dps.rawAcc = acc
        return dps
    }

    blowp() {
        const dps = this.calcs
        const max = Math.trunc(dps.maxHit * 3 / 2);
        const acc = dps.accuracy

        let blowpHitStore = new HitFreqStore();
        blowpHitStore.store([0], 1 - acc)

        let eHealing = 0;
        for (let dmg = 0; dmg <= max; dmg++) {
            blowpHitStore.store([dmg], acc / (max + 1));
            eHealing += Math.trunc(dmg / 2) * acc / (max + 1)
        }

        dps.hitStore = blowpHitStore
        dps.maxList = [max]
        dps.maxHit = max
        dps.eHealing += eHealing;
        return dps
    }

    dwh() {
        const dps = this.calcs
        const max = Math.trunc(dps.maxHit * 3 / 2);
        const acc = dps.accuracy
        const def = this.state.monster.stats.def

        let dwhHitStore = new HitFreqStore();
        dwhHitStore.store([0], 1 - acc);
        dwhHitStore.store([1], acc / (max+ 1 ));
        dwhHitStore.store([1], acc / (max + 1));

        let eDefReduction = 0;
        if (dps.flags.includes("Tekton")) {
            eDefReduction += Math.trunc(def / 10) * (1 - acc)
        }
        eDefReduction += Math.trunc(def * 3 / 10) * acc

        /*for (let dmg = 0; dmg <= max; dmg++) {
            dwhHitStore.store([dmg], acc / (max + 1))
        }*/

        for (let dmg = 2; dmg <= max; dmg++) {
            dwhHitStore.store([dmg], acc / (max + 1))
        }

        dps.hitStore = dwhHitStore
        dps.eDefReduction += eDefReduction
        dps.maxList = [max]
        dps.maxHit = max
        return dps;
    }

elder() {
    const dps = this.calcs
    const max = dps.maxHit
    const acc =  dps.accuracy * 1.25;
    const def = this.state.monster.stats.def

    let elderHitStore = new HitFreqStore();
    elderHitStore.store([0], 1 - acc);
    elderHitStore.store([1], acc / (max+ 1 ));
    elderHitStore.store([1], acc / (max + 1));

    let eDefReduction = 0;
    if (dps.flags.includes("Tekton")) {
        eDefReduction += Math.trunc(def / 10) * (1 - acc)
    }
    eDefReduction += Math.trunc(def * 3.5 / 10) * acc

    for (let dmg = 2; dmg <= max; dmg++) {
        elderHitStore.store([dmg], acc / (max + 1))
    }

    dps.hitStore = elderHitStore
    dps.eDefReduction += eDefReduction
    dps.maxList = [max]
    dps.maxHit = max
    return dps;
    }
}
