import React, { Component } from 'react';
import { PotionDrinker } from '../lib/PotionDrinker.js';
import Image from "next/image";

class StatPicker extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const player = this.props.player
        return (
            <td>
                <div className="stat-wrap">
                    <Image width={16} height={16} src={this.props.imgSrc} alt={`${this.props.stat} icon`} />
                    <span>{this.props.player.boostedStats[this.props.stat]}/</span>
                    <input className="input-invisible" type="number" min="0" max="99" value={this.props.player.stats[this.props.stat]} onChange={(e) => {
                        player.setStat(this.props.stat, e.target.value);
                        this.props.setPlayer(player.minimize());
                    }} />
                </div>
            </td>
        )
    }
}

class HpPicker extends Component {
    constructor(props) {
        super(props)
    }

    setMisc(attribute, value) {
        const player = this.props.player
        player.setMisc(attribute, value)
        this.props.setPlayer(player.minimize())
    }

    render() {
        const player = this.props.player
        return (
            <td colSpan="2">
                <div className="stat-wrap">
                    <Image width={16} height={16} src={this.props.imgSrc} alt="Hitpoints icon" />
                    <input className="input-invisible" type="number" min="0" max="99" value={this.props.player.misc.currentHitpoints} onChange={(e) => { this.setMisc('currentHitpoints', e.target.value) }} />
                    <pre> / </pre>
                    <input className="input-invisible" type="number" min="10" max="99" value={this.props.player.stats.hitpoints} onChange={(e) => {
                        player.setStat('hitpoints', e.target.value);
                        this.props.setPlayer(player.minimize());
                    }} />
                </div>
            </td>
        )
    }
}

export class AttackerStats extends Component {
    constructor(props) {
        super(props)
        this.checkboxChange = this.checkboxChange.bind(this)
        this.checkList = props.bonusList
        this.boostClick = this.boostClick.bind(this)
    }

    checkboxChange(e) {
        console.log(e.target.checked, e.target.value)
        const player = this.props.player
        if (e.target.checked) {
            player.addBoost(e.target.value)
        } else {
            player.removeBoost(e.target.value)
        }
        this.props.setPlayer(player.minimize())
    }

    boostClick(e) {
        const player = this.props.player
        if (this.props.player.boostList.includes(e.target.value)) {
            player.removeBoost(e.target.value)
        } else {
            player.addBoost(e.target.value)
        }
        this.props.setPlayer(player.minimize())
    }

    render() {
        const boosts = (new PotionDrinker()).boostList();

        const potionInput = boosts.map((boost, i) => (
            <button key={i} value={boost} onClick={this.boostClick} className={this.props.player.boostList.includes(boost) ? "selected" : ""}>{boost}</button>
        ));
        
        return (
            <div className='highlight-section flex-container-vertical'>
                <table className="stats-table">
                    <tbody>
                        <tr>
                            <StatPicker stat="attack" imgSrc="/assets/svg/attack_icon.svg" player={this.props.player} setPlayer={this.props.setPlayer} />
                            <StatPicker stat="strength" imgSrc="/assets/svg/strength_icon.svg" player={this.props.player} setPlayer={this.props.setPlayer} />
                        </tr>
                        <tr>
                            <StatPicker stat="defence" imgSrc="/assets/svg/defence_icon.svg" player={this.props.player} setPlayer={this.props.setPlayer} />
                            <StatPicker stat="ranged" imgSrc="/assets/svg/ranged_icon.svg" player={this.props.player} setPlayer={this.props.setPlayer} />
                        </tr>
                        <tr>
                            <StatPicker stat="prayer" imgSrc="/assets/svg/prayer_icon.svg" player={this.props.player} setPlayer={this.props.setPlayer} />
                            <StatPicker stat="magic" imgSrc="/assets/svg/magic_icon.svg" player={this.props.player} setPlayer={this.props.setPlayer} />
                        </tr>
                        <tr>
                            <HpPicker imgSrc="/assets/svg/hitpoints_icon.svg" player={this.props.player} setPlayer={this.props.setPlayer} />
                        </tr>
                        <tr className="center">
                            <td>Current</td>
                            <td>Base</td>
                        </tr>
                    </tbody>
                </table>
                <div className="center stat-wrap">
                    <Image width={32} height={32} src="/assets/svg/combat_icon.svg" alt="Combat icon" />
                    {this.props.player.combat}
                </div>
                <div>
                    <h3>Boosts:</h3>
                    <div>
                        {potionInput.slice(0, 5)}
                    </div>
                    <div>
                        {potionInput.slice(5, 7)}
                    </div>
                    <div>
                        {potionInput.slice(7, 10)}
                    </div>
                    <div>
                        {potionInput.slice(10)}
                    </div>
                </div>
            </div>
        )
    }
}
