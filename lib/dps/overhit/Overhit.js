import { Dps } from "../Dps.js";

export class Overhit {
    constructor(state, calcs, continuous = true) {
        this.state = state
        this.calcs = calcs
        this.continuous = continuous
        console.log(continuous)
        this.generalMemory = [0]
    }

    getStep(i) {
        if (i <= 0) {
            return (this.continuous ? 0 : this.calcs.attackSpeed * -1)
        } else if (typeof this.generalMemory[i] !== 'undefined') {
            return this.generalMemory[i]
        } else {
            return this.timeToKill(i)
        }
    }

    setMemory(memory) {
        this.generalMemory = memory
    }

    fillMemory(hp) {
        for (var i = 0; i < hp; i++) {
            this.getStep(i)
        }
    }

    timeToKill(hp) {
        const max = this.calcs.maxHit
        const accuracy = this.calcs.accuracy
        const speed = this.calcs.attackSpeed
        let hitDist = this.calcs.hitDist
        let flags = this.calcs.flags
        let state = this.state


        if (flags.includes("Enchanted ruby bolts")) {
            state.monster.stats.hitpoints = hp;
            let dps = new Dps(state);
            hitDist = dps.output().hitDist;
        }

        if (flags.includes("Keris partisan of the sun")) {
            const maxHp = state.monster.stats.maxhp
            state.monster.stats.hitpoints = hp;
            console.log("maxHp" + maxHp+" hp:"+hp)
            let dps = new Dps(state);
            if (hp / maxHp < 1/4) {
                hitDist = dps.output().altHitDist
                console.log("using alt dist")
            } else {
                hitDist = dps.output().hitDist
            }
        }

        if (typeof this.generalMemory[hp - 1] === 'undefined') {
            this.fillMemory(hp)
        }

        let sum = 0
        for (let hit = 1; hit < hitDist.length; hit += 1) {
            sum += this.getStep(hp - hit) * hitDist[hit]
        }

        const ttk = (sum + speed) / (1 - hitDist[0])
        this.generalMemory[hp] = ttk
        return ttk
    }

    approximate() {
        const hp = this.state.monster.stats.hitpoints
        const max = this.calcs.maxHit
        const acc = this.calcs.accuracy
        const speed = this.calcs.attackSpeed

        if (hp <= max + 1) {
            return Math.pow((max + 1) / max, hp)
        } else {
            return 2 * hp / max + (2 * max - 2) / (3 * max)
        }
    }

    // hitsToDps(hits){
    // 	const acc = this.calcs.accuracy
    // 	const hp = this.state.monster.stats.hitpoints
    // 	const speed = this.calcs.attackSpeed
    // 	return hp * acc / hits / speed / 0.6
    // }

    output() {
        return { ttk: this.timeToKill(this.state.monster.stats.hitpoints), ttkList: this.generalMemory }
    }
}