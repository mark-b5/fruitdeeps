class HitFreqItem {
    constructor() {
        this.nextHitList = []
        this.p = 0
    }

    next(i) {
        if (this.nextHitList[i] === undefined) {
            this.nextHitList[i] = new HitFreqItem();
        }
        return this.nextHitList[i]
    }

    setP(p) {
        this.p += p
    }

    getP() {
        return this.p;
    }
}

export class HitFreqStore {
    constructor() {
        this.base = new HitFreqItem();
        this.hitSet = [];
    }
    store(hitList, p) {
        hitList = [...hitList]
        hitList.sort((a, b) => b - a)

        let hitItem = this.base;
        for (let i = 0; i < hitList.length; i++) {
            let dmg = hitList[i]
            hitItem = hitItem.next(dmg);
        }

        if (hitItem.getP() === 0) {
            this.hitSet.push(hitList)
        }

        hitItem.setP(p)
    }

    getFreqs() {
        let hitList = []
        for (let i = 0; i < this.hitSet.length; i++) {
            let hitItem = this.base
            for (let j = 0; j < this.hitSet[i].length; j++) {
                hitItem = hitItem.next(this.hitSet[i][j])
            }
            hitList.push({ dmg: [...this.hitSet[i]], p: hitItem.getP() })
        }
        return hitList
    }

    getDist(hp) {
        let hitList = this.getFreqs()
        let hitDist = [];

        for (let index = 0; index < hitList.length; index++) {
            let hit = hitList[index]
            let sum = 0;
            // console.log(hit)
            for (let hitNum = 0; hitNum < hit.dmg.length; hitNum++) {
                sum += hit.dmg[hitNum];
            }
            if (hitDist[sum] === undefined) {
                hitDist[sum] = hit.p
            } else {
                hitDist[sum] += hit.p
            }
        }
        for (let hit = 0; hit < hitDist.length; hit++) {
            if (hitDist[hit] === undefined) {
                hitDist[hit] = 0;
            }
        }
        let newDist = hitDist
        if (hitDist.length > (hp + 1)) {
            newDist = Array(hp + 1).fill(0);
            for (var dmg = 0; dmg < hitDist.length; dmg++) {
                if (dmg > hp) {
                    newDist[hp] += hitDist[dmg]
                } else {
                    newDist[dmg] += hitDist[dmg]
                }
            }
        }
        return newDist
    }
}