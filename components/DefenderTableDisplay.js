import React, { Component } from 'react';
import Image from 'next/image';
import npcFinder from '../lib/npcSpecificFinder.js';

const attributeList = [
    "dragon",
    "fiery",
    "spectral",
    "undead",
    "kalphite",
    "vampyre",
    "demon",
    "shade",
    "leafy",
    "penance",
    "xerician"
]

const MonsterStat = (props) => {
    return (
        <input type="number" className="input-invisible" min="1" value={props.value} data-stat={props.stat} onChange={props.onChange} />
    )
}

const MonsterBonus = props => {
    return (
        <td className={(props.value > 0 ? "color-3 " : props.value < 0 ? "color-1" : "color-grey")}>
        <input type="number"  className="input-invisible align-right" min="0" value={props.value} data-stat={props.stat} onChange={props.onChange} />
    	</td>
    )
}

export class DefenderTableDisplay extends Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
		this.changeInvocation = this.changeInvocation.bind(this)
        this.toggleAttribute = this.toggleAttribute.bind(this)
    }

    handleChange(e) {
        e.persist()
        let stat = e.target.getAttribute("data-stat")
        let value = e.target.value
        this.props.setMonsterStat(stat, value)
    }

	changeInvocation(e){
		e.persist()
		let newMonster = JSON.parse(JSON.stringify(this.props.monster))
		console.log(newMonster)
		if (!("basehp" in newMonster.stats)) {
			console.log("setting base hp", newMonster.stats.hitpoints)
			newMonster.stats.basehp = newMonster.stats.hitpoints
		}

		let invo = parseInt(e.target.value) || 0
		newMonster.invocation = invo
		let statScale = Math.floor(newMonster.invocation / 5) * 0.02
		let hp = newMonster.stats.basehp
		let scaledHp = hp + Math.floor(hp * statScale)
		newMonster.stats.maxhp = scaledHp
		newMonster.stats.hitpoints = scaledHp
		this.props.setMonster(newMonster)
	}

    toggleAttribute(e) {
        e.persist()
        let attribute = e.target.value
        let monster = this.props.monster
        let newMonster = {}
        newMonster = Object.assign(newMonster, monster)

        if (newMonster.attributes.includes(attribute)) {
            newMonster.attributes = newMonster.attributes.filter(e => e !== attribute);
        } else {
            newMonster.attributes.push(attribute)
        }
        console.log(newMonster.attributes, attribute)
        this.props.setMonster(newMonster)
    }

    render() {
        return (
            <div className='flex-container-vertical'>
				<div>
					<h3>Stats</h3>
					<table className='stats-table'>
						<tr>
							<td>
								<div className='stat-wrap'>
									<img src="/assets/svg/combat_icon.svg" />
									{this.props.monster.combat}
								</div>
							</td>
							<td>
								<div className='stat-wrap'>
									<img src="/assets/svg/hitpoints_icon.svg" />
									
									<MonsterStat value={this.props.monster.stats.hitpoints} stat="hitpoints" onChange={this.handleChange} />
								</div>
							</td>
						</tr>
						<tr>
							<td>
								<div className='stat-wrap'>
									<img src="/assets/svg/defence_icon.svg" />
									<MonsterStat value={this.props.monster.stats.def} stat="def" onChange={this.handleChange} />
								</div>
							</td>
							<td>
								<div className='stat-wrap'>
									<img src="/assets/svg/magic_icon.svg"/>
									<MonsterStat value={this.props.monster.stats.mage} stat="mage" onChange={this.handleChange} />
								</div>
							</td>
						</tr>
					</table>
				</div>
				<div>
					<h3>Attack Bonus</h3>
					<table className="bonus-table">
					<tr>
					<td>
						Magic
					</td>
						<MonsterBonus value={this.props.monster.stats.amagic} stat="amagic" onChange={this.handleChange} />
						</tr>
					</table>
				</div>
				<div>
					<h3>Defence bonus</h3>
					<table className='bonus-table'>
					<tr>
						<td>Stab</td>
						<MonsterBonus value={this.props.monster.stats.dstab} stat="dstab" onChange={this.handleChange} />
					</tr>
					<tr>
						<td>Slash</td>
						<MonsterBonus value={this.props.monster.stats.dslash} stat="dslash" onChange={this.handleChange} />
					</tr>
					<tr>
						<td>Crush</td>
						<MonsterBonus value={this.props.monster.stats.dcrush} stat="dcrush" onChange={this.handleChange} />
					</tr>
					<tr>
						<td>Magic</td>
						<MonsterBonus value={this.props.monster.stats.dmagic} stat="dmagic" onChange={this.handleChange} />
					</tr>
					<tr>
						<td>Range</td>
						<MonsterBonus value={this.props.monster.stats.drange} stat="drange" onChange={this.handleChange} />
					</tr>
						
					</table>
				</div>

				<div>
						<h3>Attributes</h3>
						{attributeList.map((attribute, i) =>
							<button key={i} value={attribute} onClick={this.toggleAttribute} className={this.props.monster.attributes.includes(attribute) ? "selected" : ""}>{attribute}</button>
						)}
				</div>
				{
					"invocation" in this.props.monster ? 
						<div>
							<h3>Invocation</h3>
							<div className="flex-valign"><input type="number" min="0" max="600" value={this.props.monster.invocation} step="5" id="invocationInput" onChange={this.changeInvocation} className="input-invisible"></input>
							<input type="range" min="0" max="600" value={this.props.monster.invocation} step="5" id="invocationSlider" className="slider" onChange={this.changeInvocation}></input></div>
						</div> : ""
				}
			</div>
        )
    }
}