import { OverhitSwitcher } from './OverhitSwitcher.js';
import { Dps } from '../Dps.js';

export class DpsDefence {
    constructor(state, calcsList) {
        this.calcsList = calcsList
        this.state = state
        console.log('defence dps', state)
    }

    output() {
        let monster = this.state.monster
        let graphData = []
        let baseDef = monster.stats.def
        let graphObject = { defence: baseDef }
        for (var i = 0; i < this.calcsList.length; i++) {
            graphObject["Set " + (i + 1)] = parseFloat(this.calcsList[i].dps.toFixed(3));
        }
        graphData.push(graphObject)

        const defSet = new Set();
        for (let i = 0; i <= 20; i++) {
            if (i < baseDef) {
                defSet.add(i)
            }
        }

        for (let i = 0; i < baseDef; i += 5) {
            defSet.add(i)
        }

        let dwhDef = baseDef;
        for (let i = 0; i < 5; i++) {
            dwhDef = dwhDef - Math.trunc(dwhDef * 0.3);
            defSet.add(dwhDef)
        }

        let elderDef = baseDef; // added elder maul reduction
        for (let i = 0; i <5; i++) {
            elderDef = elderDef - Math.trunc(elderDef * 0.35);
            defSet.add(elderDef)
        }

        defSet.add(baseDef - Math.trunc(baseDef / 10) - 1)

        let defList = Array.from(defSet);
        defList.sort((a, b) => b - a);

        for (let i = 0; i < defList.length; i++) {
            graphObject = { defence: defList[i] }
            monster.stats.def = defList[i]
            for (let j = 0; j < this.calcsList.length; j++) {
                let dps = new Dps({ monster: monster, player: this.state.playerList[j] });
                graphObject['Set ' + (j + 1)] = parseFloat(dps.output().dps.toFixed(3));

            }
            graphData.push(graphObject)
        }

        monster.stats.def = baseDef;

        return { graphData: graphData }
    }
}