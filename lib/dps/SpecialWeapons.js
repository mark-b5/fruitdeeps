import { HitFreqStore } from "./HitFreqStore.js";

function pickaxeToLevel(pickName) {
    switch (pickName) {
        case "3rd age pickaxe":
        case "Crystal pickaxe (Active)":
        case "Crystal pickaxe (Inactive)":
        case "Crystal pickaxe (The Gauntlet)":
        case "Corrupted pickaxe":
        case "Infernal pickaxe (Charged)":
        case "Infernal pickaxe (Uncharged)":
        case "Dragon pickaxe":
        case "Dragon pickaxe (upgraded)":
        case "Dragon pickaxe(or)":
            return 61;

        case "Rune pickaxe":
        case "Gilded pickaxe":
            return 41;

        case "Adamant pickaxe":
            return 31;

        case "Mithril pickaxe":
            return 21;

        case "Black pickaxe":
            return 11;

        case "Steel pickaxe":
            return 6;

        case "Iron pickaxe":
        case "Bronze pickaxe":
            return 1
    }
    return 0;
}


export class SpecialWeapons {
    constructor(state, calcs) {
        this.state = state
        this.calcs = calcs
    }

    keris() {
        const dps = this.calcs
        const acc = this.calcs.accuracy
        const altAcc = this.calcs.altAccuracy
        const baseMax = dps.maxHit
        const newMax = Math.floor(baseMax * 133 / 100)
        const specMax = baseMax * 3;

        // Create damage boosted hit store
        let hitStore = new HitFreqStore();
        hitStore.store([0], 1 - acc)

        for (let h1 = 0; h1 <= newMax; h1 += 1) {
            hitStore.store([h1], acc * 50 / 51 / (newMax + 1))
        }

        for (let h2 = 0; h2 <= baseMax; h2 += 1) {
            hitStore.store([h2 * 3], acc / 51 / (baseMax + 1))
        }

        // Create damage boosted alt hit store using the alterante accuracy 
        let altHitStore = new HitFreqStore();
        altHitStore.store([0], 1 - altAcc)

        for (let h1 = 0; h1 <= newMax; h1 += 1) {
            altHitStore.store([h1], altAcc * 50 / 51 / (newMax + 1))
        }

        for (let h2 = 0; h2 <= baseMax; h2 += 1) {
            altHitStore.store([h2 * 3], altAcc / 51 / (baseMax + 1))
        }

        dps.maxList = [newMax]
        dps.maxHit = newMax;
        dps.maxHitSpec = specMax;
        dps.hitStore = hitStore;
        dps.altHitStore = altHitStore;

        return dps
    }

    // Use alternate accuracy when monster is under 25%
    kerisSun() {

    }

    //Dharok's set effect: Raises your damage according to your hp, after the damage roll
    dharoks() {
        const dps = this.calcs
        const currentHp = this.state.player.misc.currentHitpoints
        const baseHp = this.state.player.stats.hitpoints
        const acc = this.calcs.accuracy
        const hpMult = Math.max(1, 1 + (baseHp - currentHp) * baseHp / 10000)
        const oldMax = dps.maxHit
        const max = Math.floor(dps.maxHit * hpMult)


        let dharokStore = new HitFreqStore();
        // const dharokList = [{ dmg: [0], p: 1 - acc }]
        dharokStore.store([0], 1 - acc)

        for (let dmg = 0; dmg <= oldMax; dmg++) {
            // dharokList.push({ dmg: [Math.trunc(dmg * hpMult)], p: acc / (oldMax + 1) })
            dharokStore.store([Math.trunc(dmg * hpMult)], acc / (oldMax + 1))
        }

        dps.maxList = [max]
        dps.hitStore = dharokStore
        dps.maxHit = max
        return dps
    }


    darkbow() {
        const dps = this.calcs
        const acc = this.calcs.accuracy
        const m1 = this.calcs.maxHit

        let hitList = dps.hitStore.getFreqs();

        let dbowHitStore = new HitFreqStore();

        for (let i = 0; i < hitList.length; i++) {
            for (let j = 0; j < hitList.length; j++) {
                dbowHitStore.store([hitList[i].dmg[0], hitList[j].dmg[0]], hitList[i].p * hitList[j].p);
            }
        }

        dps.hitStore = dbowHitStore;
        dps.maxList = [m1, m1]
        dps.maxHit = m1 + m1
        return dps

    }

    scythe() {
        const dps = this.calcs
        const acc = this.calcs.accuracy
        const m1 = this.calcs.maxHit


        let m2 = Math.trunc(m1 / 2)
        let m3 = Math.trunc(m1 / 4)

        let scytheHitStore = new HitFreqStore();
        // let scytheHitList = []

        for (let hit1 = 0; hit1 <= m1; hit1++) {
            let p1 = acc / (m1 + 1)
            if (hit1 === 0) {
                p1 += 1 - acc
            }

            for (let hit2 = 0; hit2 <= m2; hit2++) {
                let p2 = acc / (m2 + 1)
                if (hit2 === 0) {
                    p2 += 1 - acc
                }

                for (let hit3 = 0; hit3 <= m3; hit3++) {
                    let p3 = acc / (m3 + 1)
                    if (hit3 === 0) {
                        p3 += 1 - acc
                    }
                    scytheHitStore.store([hit1, hit2, hit3], p1 * p2 * p3)
                }

            }
        }

        dps.hitStore = scytheHitStore
        dps.maxList = [m1, m2, m3]
        dps.maxHit = m1 + m2 + m3

        return dps
    }


    //Verac's set effect: skips accuracy roll and adds 1 damage 25% of the time
    veracs() {
        const dps = this.calcs
        const specChance = 0.25
        const speed = dps.attackSpeed
        const acc = dps.accuracy
        const max = dps.maxHit
        const specMax = max + 1

        dps.maxHitSpec = dps.maxHit + 1

        // const veracsHitList = [{ dmg: [0], p: 1 - (0.25 + 0.75 * acc) }]
        let veracHitStore = new HitFreqStore();
        veracHitStore.store([0], 1 - (0.25 + 0.75 * acc))
        for (let dmg = 0; dmg <= max; dmg++) {
            veracHitStore.store([dmg], 0.75 * acc / (max + 1))
            veracHitStore.store([dmg + 1], 0.25 / (max + 1))
        }

        dps.rawAcc = acc
        dps.accuracy = specChance + (1 - specChance) * dps.accuracy
        dps.specAcc = dps.accuracy
        dps.hitStore = veracHitStore
        return dps
    }

    //Karils set effect: 25% chance of 50% extra damage
    karils() {
        const dps = this.calcs
        const acc = dps.accuracy
        const m1 = dps.maxHit
        const m2 = Math.floor(dps.maxHit / 2)
        const mSum = m1 + m2

        // let karilsHitList = [{ dmg: [0], p: 1 - acc }]
        let karilsHitStore = new HitFreqStore();
        karilsHitStore.store([0], 1 - acc)
        for (let dmg = 0; dmg <= m1; dmg++) {
            karilsHitStore.store([dmg], 0.75 * acc / (m1 + 1))
            karilsHitStore.store([dmg, Math.trunc(dmg / 2)], 0.25 * acc / (m1 + 1))
        }

        dps.hitStore = karilsHitStore
        dps.maxList = [m1, m2];
        dps.maxHit = mSum
        return dps
    }

    //Ahrim's set effect: 25% chance to raise your max hit roll by 30%
    ahrims() {
        const dps = this.calcs
        const speed = dps.attackSpeed
        const m1 = dps.maxHit
        const m2 = Math.floor(dps.maxHit * 13 / 10)
        const acc = dps.accuracy


        // const ahrimsHitList = [{ dmg: [0], p: 1 - acc }]
        let ahrimsHitStore = new HitFreqStore();
        ahrimsHitStore.store([0], 1 - acc)
        for (let dmg = 0; dmg <= m1; dmg++) {
            ahrimsHitStore.store([dmg], 0.75 * acc / (m1 + 1))

        }
        for (let dmg = 0; dmg <= m2; dmg++) {
            ahrimsHitStore.store([dmg], 0.25 * acc / (m2 + 1))
        }

        dps.hitStore = ahrimsHitStore
        dps.maxHitSpec = m2
        return dps
    }

    generalBolt(bolt) {
        const ranged = this.state.player.boostedStats.ranged
        const boostTable = {
            "Enchanted pearl bolts": Math.floor(ranged / 20),
            "Enchanted opal bolts": Math.floor(ranged / 10),
            "Enchanted jade bolts": 0,
            "Enchanted pearl bolts fiery": Math.floor(ranged / 15),
            "Enchanted dragonstone bolts": Math.floor(ranged / 20)
        }

        const dps = this.calcs
        const acc = dps.accuracy
        const boost = boostTable[bolt]
        const m1 = dps.maxHit
        const m2 = m1 + boost

        let specChance = (bolt == "Enchanted opal bolts" ? 0.05 : 0.06)
        specChance = this.calcs.flags.includes("Kandarin hard diary") ? specChance * 11 / 10 : specChance

        specChance = this.calcs.flags.includes("Archer's Embrace") ? specChance * 2 : specChance


        let boltHitStore = new HitFreqStore();
        boltHitStore.store([0], (1 - specChance) * (1 - acc))
        // const boltHitList = [{ dmg: [0], p: (1 - specChance) * (1 - acc) }]
        // const newDist = Array(m2 + 1).fill(0);
        // newDist[0] += (1 - specChance) * (1 - acc)

        for (let dmg = 0; dmg <= m1; dmg++) {
            // boltHitList.push({ dmg: [dmg], p: (1 - specChance) * acc / (m1 + 1) })
            // boltHitList.push({ dmg: [dmg + boost], p: specChance / (m1 + 1) })
            boltHitStore.store([dmg], (1 - specChance) * acc / (m1 + 1))
            boltHitStore.store([dmg + boost], specChance / (m1 + 1))
        }



        dps.hitStore = boltHitStore
        //max hit of the spec
        dps.maxHitSpec = m2
        dps.rawAcc = acc
        //Accuracy when taking spec into account
        dps.accuracy = specChance + (1 - specChance) * dps.accuracy
        dps.specAcc = dps.accuracy
        return dps
    }

    rubyBolts() {
        const dps = this.calcs
        const acc = dps.accuracy
        const hp = this.state.monster.stats.hitpoints
        let specDmg = Math.trunc(hp / 5)
        if (dps.flags.includes("Corporeal beast")) {
            specDmg = Math.trunc(specDmg / 2)
        }
        specDmg = Math.min(100, specDmg);
        const max = dps.maxHit
        let specChance = this.calcs.flags.includes("Kandarin hard diary") ? 0.066 : 0.06
        specChance = this.calcs.flags.includes("Archer's Embrace") ? specChance * 2 : specChance

        const rubiesHitStore = new HitFreqStore();
        rubiesHitStore.store([0], (1 - specChance) * (1 - acc));
        // let rubiesHitList = [{ dmg: [0], p: (1 - specChance) * (1 - acc) }]
        for (let dmg = 0; dmg <= max; dmg++) {
            // rubiesHitList.push({ dmg: [dmg], p: (1 - specChance) * acc / (max + 1) })
            rubiesHitStore.store([dmg], (1 - specChance) * acc / (max + 1))
        }
        rubiesHitStore.store([specDmg], specChance)


        dps.specChance = specChance
        dps.hitStore = rubiesHitStore;
        dps.maxHitSpec = specDmg
        dps.specAcc = specChance + (1 - specChance) * dps.accuracy
        return dps
    }

    diamondBolts() {
        const dps = this.calcs
        let specChance = this.calcs.flags.includes("Kandarin hard diary") ? 0.11 : 0.10
        specChance = this.calcs.flags.includes("Archer's Embrace") ? specChance * 2 : specChance
        const m1 = dps.maxHit
        const m2 = Math.floor(dps.maxHit * 23 / 20)
        const acc = dps.accuracy
        dps.specChance = specChance

        // const newDist = Array(Math.max(m1, m2) + 1).fill(0)

        // newDist[0] += (1 - acc) * (1 - specChance)

        // let diamondHitList = [{ dmg: [0], p: (1 - specChance) * (1 - acc) }]
        const diamondHitStore = new HitFreqStore();
        diamondHitStore.store([0], (1 - specChance) * (1 - acc))

        for (let dmg = 0; dmg <= m1; dmg++) {
            // diamondHitList.push({ dmg: [dmg], p: acc * (1 - specChance) / (m1 + 1) })
            diamondHitStore.store([dmg], acc * (1 - specChance) / (m1 + 1))
        }

        for (let dmg = 0; dmg <= m2; dmg++) {
            // diamondHitList.push({ dmg: [dmg], p: specChance / (m2 + 1) })
            diamondHitStore.store([dmg], specChance / (m2 + 1))
        }


        dps.hitStore = diamondHitStore
        dps.rawAcc = dps.accuracy
        dps.accuracy = specChance + (1 - specChance) * dps.accuracy
        dps.specAcc = dps.accuracy
        dps.maxHitSpec = m2
        return dps
    }

    dragonstoneBolts() {
        const dps = this.calcs
        let specChance = this.calcs.flags.includes("Kandarin hard diary") ? 0.066 : 0.06
        specChance = this.calcs.flags.includes("Archer's Embrace") ? specChance * 2 : specChance
        const ranged = this.state.player.boostedStats.ranged
        const boost = Math.trunc(ranged / 5);
        const acc = dps.accuracy
        const m1 = dps.maxHit
        const m2 = m1 + boost;

        // let dstoneHitList = [{ dmg: 0, p: 1 - acc }]
        const dstoneHitStore = new HitFreqStore();
        dstoneHitStore.store([0], 1 - acc)
        for (let dmg = 0; dmg <= m1; dmg++) {
            // dstoneHitList.push({ dmg: [dmg], p: (1 - specChance) * acc / (m1 + 1) });
            // dstoneHitList.push({ dmg: [dmg + boost], p: specChance * acc / (m1 + 1) });
            dstoneHitStore.store([dmg], (1 - specChance) * acc / (m1 + 1));
            dstoneHitStore.store([dmg + boost], specChance * acc / (m1 + 1))
        }

        dps.hitStore = dstoneHitStore;
        dps.maxHitSpec = m2;

        return dps;

    }

    onyxBolts() {
        const dps = this.calcs
        let specChance = this.calcs.flags.includes("Kandarin hard diary") ? 0.121 : 0.11
        specChance = this.calcs.flags.includes("Archer's Embrace") ? specChance * 2 : specChance
        const acc = dps.accuracy
        const m1 = dps.maxHit
        const m2 = Math.floor(dps.maxHit * 6 / 5)

        // let onyxHitList = [{ dmg: [0], p: 1 - acc }]
        let onyxHitStore = new HitFreqStore();
        onyxHitStore.store([0], 1 - acc);

        for (let dmg = 0; dmg <= m1; dmg++) {
            // onyxHitList.push({ dmg: [dmg], p: acc * (1 - specChance) / (m1 + 1) })
            onyxHitStore.store([dmg], acc * (1 - specChance) / (m1 + 1))

        }

        for (let dmg = 0; dmg <= m2; dmg++) {
            // onyxHitList.push({ dmg: [dmg], p: acc * specChance / (m2 + 1) });
            onyxHitStore.store([dmg], acc * specChance / (m2 + 1))
        }

        dps.hitStore = onyxHitStore
        dps.maxHitSpec = m2

        return dps
    }

    barbarianAssault() {
        const dps = this.calcs
        const m1 = dps.maxHit
        let rank = this.state.player.misc.baRank
        const m2 = m1 + rank

        let hitList = dps.hitStore.getFreqs();

        let barbHitStore = new HitFreqStore();
        for (var i = 0; i < hitList.length; i++) {
            let hit = { dmg: [], p: hitList[i].p }
            for (let j = 0; j < hitList[i].dmg.length; j++) {
                hit.dmg[j] = hitList[i].dmg[j] + rank
            }
            barbHitStore.store(hit.dmg, hit.p)
        }

        for (let hitNum = 0; hitNum < dps.maxList.length; hitNum++) {
            dps.maxList[hitNum] += this.state.player.misc.baRank;
        }

        if ("maxHitSpec" in dps) {
            dps.maxHitSpec += this.state.player.misc.baRank;
        }

        dps.hitStore = barbHitStore;

        return dps;
    }

    corporealBeast() {
        const dps = this.calcs;

        let hitList = dps.hitStore.getFreqs()
        const corpHitStore = new HitFreqStore();
        for (var i = 0; i < hitList.length; i++) {
            let hit = { dmg: [], p: hitList[i].p }
            for (let j = 0; j < hitList[i].dmg.length; j++) {
                hit.dmg[j] = Math.trunc(hitList[i].dmg[j] / 2);
            }
            corpHitStore.store(hit.dmg, hit.p)
        }
        dps.hitStore = corpHitStore
        for (let i = 0; i < dps.maxList.length; i++) {
            dps.maxList[i] = Math.trunc(dps.maxList[i] / 2)
        }

        return dps;
    }

    zulrah() {
        const dps = this.calcs;
        const dmgCap = 50;
        const oldDistList = dps.hitStore.getFreqs()
        let capHitStore = new HitFreqStore();

        for (let i = 0; i < oldDistList.length; i++) {
            let hitItem = oldDistList[i];
            for (let dmgIndex = 0; dmgIndex < hitItem.dmg.length; dmgIndex++) {
                hitItem.dmg[dmgIndex] = Math.min(dmgCap + 1, hitItem.dmg[dmgIndex])
            }
            capHitStore.store(hitItem.dmg, hitItem.p);
        }

        let hitList = capHitStore.getFreqs();
        let zulrahHitStore = new HitFreqStore();


        for (let i = 0; i < hitList.length; i++) {
            let toAppend = [hitList[i]]

            for (let dmgIndex = 0; dmgIndex < hitList[i].dmg.length; dmgIndex++) {
                let newAppend = []
                for (let appendIndex = 0; appendIndex < toAppend.length; appendIndex++) {
                    if (toAppend[appendIndex].dmg[dmgIndex] > dmgCap) {
                        for (let dmg = 45; dmg <= 50; dmg++) {
                            let hitObj = { dmg: [...toAppend[appendIndex].dmg], p: toAppend[appendIndex].p }
                            hitObj.dmg[dmgIndex] = dmg;
                            hitObj.p = hitObj.p / 6
                            newAppend.push(hitObj)
                        }
                    } else {
                        newAppend.push(toAppend[appendIndex]);
                    }
                }
                toAppend = newAppend
            }

            for (let j = 0; j < toAppend.length; j++) {
                zulrahHitStore.store(toAppend[j].dmg, toAppend[j].p);
            }

        }

        // const newDistList = [];


        dps.hitStore = zulrahHitStore;

        for (let i = 0; i < dps.maxList.length; i++) {
            dps.maxList[i] = Math.min(50, dps.maxList[i])
        }

        if ("maxHitSpec" in dps && dps.maxHitSpec > 50) {
            dps.maxHitSpec = 50;
        }

        return dps
    }

    guardians() {
        const dps = this.calcs;
        const pick = pickaxeToLevel(this.state.player.equipment.weapon.name)
        const guardiansHitStore = new HitFreqStore();

        if (pick === 0) {
            dps.maxHit = 0;
            for (var i = 0; i < dps.maxList.length; i++) {
                dps.maxList[i] = 0;
            }
            guardiansHitStore.store([0], 1);
            dps.hitStore = guardiansHitStore;
            return dps;
        }

        const boost = (50 + pick + this.state.player.misc.mining) / 150;
        console.log('boost', boost)


        const hitDist = dps.hitStore.getFreqs()


        for (var i = 0; i < hitDist.length; i++) {

            for (let dmg = 0; dmg < hitDist[i].dmg.length; dmg++) {
                hitDist[i].dmg[dmg] = Math.trunc(hitDist[i].dmg[dmg] * boost)
            }
            guardiansHitStore.store(hitDist[i].dmg, hitDist[i].p)
        }

        dps.hitStore = guardiansHitStore

        for (let i = 0; i < dps.maxList.length; i++) {
            dps.maxList[i] = Math.trunc(dps.maxList[i] * boost);
        }

        return dps
    }

    verzik() {
        const dps = this.calcs
        const oldDistList = dps.hitDistList
        const newDistList = []

        let capMax = 10;
        if (this.calcs.attackType === "Ranged") {
            capMax = 3;
        } else if (this.calcs.attackType === "Mage") {
            capMax = 3;
        }

        let hitStore = dps.hitStore
        let capHitStore = new HitFreqStore();

        let hitList = hitStore.getFreqs();
        for (let i = 0; i < hitList.length; i++) {
            let dmg = hitList[i].dmg
            let cappedDmg = []
            for (let j = 0; j < dmg.length; j++) {
                cappedDmg.push(Math.min(dmg[j], capMax))
            }
            capHitStore.store(cappedDmg, hitList[i].p)
        }

        hitList = capHitStore.getFreqs();
        console.log(hitList)
        let verzikHitStore = new HitFreqStore();

        if (this.state.player.equipment.weapon.name !== "Dawnbringer") {
            for (let hitListIndex = 0; hitListIndex < hitList.length; hitListIndex++) {
                let toAppend = [hitList[hitListIndex]]
                for (let hitNum = 0; hitNum < hitList[hitListIndex].dmg.length; hitNum++) {
                    let newAppend = []
                    for (let appendIndex = 0; appendIndex < toAppend.length; appendIndex++) {
                        let dmg = toAppend[appendIndex].dmg[hitNum]
                        for (let verzikRoll = 0; verzikRoll <= Math.min(capMax, dmg); verzikRoll++) {
                            let hitObj = { dmg: [...toAppend[appendIndex].dmg], p: toAppend[appendIndex].p }
                            hitObj.dmg[hitNum] = verzikRoll;
                            if (verzikRoll === dmg) {
                                hitObj.p = hitObj.p / (capMax + 1) * (capMax - dmg + 1)
                            } else {
                                hitObj.p = hitObj.p / (capMax + 1);
                            }
                            newAppend.push(hitObj);
                        }
                    }
                    toAppend = newAppend;
                }
                for (let appendIndex = 0; appendIndex < toAppend.length; appendIndex++) {
                    verzikHitStore.store(toAppend[appendIndex].dmg, toAppend[appendIndex].p)
                }
            }

            dps.hitStore = verzikHitStore
        }

        return dps;
    }

    fang(){
        const dps = this.calcs
        const oldMax = dps.maxHit
        const min = Math.trunc(oldMax * 0.15)
        const newMax = oldMax - min

        const accuracyFormula = (atk, def) => {
            let clamp = (n) => Math.max(0, Math.min(1, n))

            if (atk > def) {
                return clamp(1 - (def + 2)*(2*def+3)/(atk+1)/(atk+1)/6)
            } else {
                return clamp(atk * (4 * atk + 5) / 6 / (atk + 1) / (def + 1))
            }
        }

        let acc = dps.accuracy

        if(this.calcs.flags.includes("Tombs of Amascut")){
            acc = dps.accuracy + (1 - dps.accuracy) * dps.accuracy
        }
        else{
            acc = accuracyFormula(dps.playerRoll, dps.npcRoll)
        }
        

        

        let hitStore = new HitFreqStore();
        hitStore.store([0], 1 - acc)


        for (let h1 = min; h1 <= newMax; h1 += 1) {
            // kerisHitList.push({ dmg: [h1], p: acc * 50 / 51 / (newMax + 1) })
            hitStore.store([h1], acc / (newMax - min + 1))
        }

        dps.maxHitSpec = newMax
        if(dps.flags.includes("Corporeal beast")){
            dps.maxHitSpec = Math.trunc(newMax/2)
        }


        dps.hitStore = hitStore
        dps.specAcc = acc
        return dps
    }

    brawlers(){
        const dps = this.calcs
        const oldStore = dps.hitStore

        let hitStore = new HitFreqStore();

        oldStore.getFreqs().forEach((splats) => {
            hitStore.store(splats.dmg, splats.p * 0.9);
            hitStore.store(splats.dmg.map(splat => splat * 2), splats.p * 0.1);
        });

        dps.hitStore = hitStore

        return dps;
    }

    embrace(){
        const dps = this.calcs
        const oldStore = dps.hitStore

        let hitStore = new HitFreqStore();

        oldStore.getFreqs().forEach((splats) => {
            hitStore.store(splats.dmg, splats.p * 0.9);

            oldStore.getFreqs().forEach((splats2) => {
                hitStore.store([...splats.dmg, ...splats2.dmg], splats.p * splats2.p * 0.1);
            });
        });

        dps.hitStore = hitStore

        return dps;
    }
}