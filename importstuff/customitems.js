import api from '../lib/api.js'

const blowp = {"name":"Toxic blowpipe","slot":"2h","bonuses":[0,0,0,0,30,0,0,0,0,0,0,20,0,0],"id":12926,"category":"Thrown","speed":3}

const darts = {
    "Bronze" : 1,
    "Iron" : 2,
    "Steel" : 3,
    "Black" : 6,
    "Mithril" : 9,
    "Adamant" : 17,
    "Rune" : 26,
    "Amethyst" : 28,
    "Dragon" : 35
}

const customs = [
    {"name":"Osmumten's fang","slot":"weapon","bonuses":[105,75,0,0,0,0,0,0,0,0,103,0,0,0],"id":26219,"category":"Stab Sword","speed":5},
    {"name":"Elidinis' ward","slot":"shield","bonuses":[0,0,0,0,0,5,3,9,0,6,0,0,3,0],"id":25985},
    {"name":"Elidinis' ward (f)","slot":"shield","bonuses":[0,0,0,25,0,53,55,73,2,52,0,0,5,4],"id":27251},
    {"name":"Tumeken's shadow","slot":"weapon","bonuses":[0,0,0,35,0,0,0,0,20,0,0,0,0,1],"id":27277,"category":"Powered Staff","speed":5},
    {"name":"Masori mask","slot":"head","bonuses":[0,0,0,-1,12,3,4,3,6,4,0,2,0,0],"id":27226},
    {"name":"Masori body","slot":"body","bonuses":[0,0,0,-4,43,37,35,38,25,33,0,4,0,0],"id":27229},
    {"name":"Masori chaps","slot":"legs","bonuses":[0,0,0,-2,27,26,24,29,19,22,0,2,0,0],"id":27232},
    {"name":"Masori chaps (f)","slot":"legs","bonuses":[0,0,0,-2,27,35,30,39,46,37,0,2,0,1],"id":27241},
    {"name":"Masori mask (f)","slot":"head","bonuses":[0,0,0,-1,12,8,10,12,12,9,0,2,0,1],"id":27235},
    {"name":"Masori body (f)","slot":"body","bonuses":[0,0,0,-4,43,59,52,64,74,60,0,4,0,1],"id":27238},
    {"name":"Ancestral hat","slot":"head","bonuses":[0,0,0,8,0,0,0,0,0,0,0,0,3,0],"id":21018}
]

// // const db = {};
// const bonusList = [
//     "stabAttack",
//     "slashAttack",
//     "crushAttack",
//     "magicAttack",
//     "rangedAttack",
//     "stabDefence",
//     "slashDefence",
//     "crushDefence",
//     "magicDefence",
//     "rangedDefence",
//     "strength",
//     "rangedStrength",
//     "magicStrength",
//     "prayer",
// ];


customs.forEach((item)=>{
    api.addItem(item).then(()=>{console.log("finished", item.name)})
})

Object.keys(darts).forEach((type)=>{
    const item = JSON.parse(JSON.stringify(blowp))

    item.name = blowp.name + " (" + type +")"
    item.bonuses[11] += darts[type]

    api.addItem(item).then(()=>{console.log("finished", item)})
})



