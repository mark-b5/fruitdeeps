import React, { Component } from 'react';

import { AttackerMisc } from './AttackerMisc.js'

const Tier3relic = (props) => {
    return (
        <div>
			<input
				type="checkbox"
				id={props.relicName + "-select"}
				checked={props.player.misc.tier3relic == props.relicName}
				value={props.relicName}
				onChange={props.setRelic}
			/>
			<label htmlFor={props.relicName + "-select"}>{props.relicName}</label>
		</div>
    )
}

export class AttackerRelics extends Component {
    constructor(props) {
        super(props)
        this.importRef = React.createRef();

        this.setT3Relic = this.setT3Relic.bind(this)
        this.toggleT6Relic = this.toggleT6Relic.bind(this)
    }

    setMisc(attribute, value) {
        const player = this.props.player
        player.setMisc(attribute, value)
        this.props.setPlayer(player.minimize())
    }

    setT3Relic(e) {
        if (e.target.checked) {
            this.setMisc('tier3relic', e.target.value)
        } else {
            this.setMisc('tier3relic', null)
        }
    }

    toggleT6Relic(e) {
        if (e.target.checked) {
            this.setMisc('tier6relic', true)
        } else {
            this.setMisc('tier6relic', false)
        }
    }

    render() {
        return (
            <div className="highlight-section flex-container-vertical">
				<AttackerMisc player={this.props.player} setMisc={this.setMisc.bind(this)} />
				<div>
					<h3>Relics</h3>
					<div>
						<Tier3relic player={this.props.player} relicName="Brawler's Resolve" setRelic={this.setT3Relic} />
						<Tier3relic player={this.props.player} relicName="Superior Sorcerer" setRelic={this.setT3Relic} />
						<Tier3relic player={this.props.player} relicName="Archer's Embrace" setRelic={this.setT3Relic} />
					</div>
					{/* <div>
						<input
							type="checkbox"
							id={"t6-select"}
							checked={this.props.player.misc.tier6relic}
							onChange={this.toggleT6Relic}
						/>
						<label htmlFor={"t6-select"}>Tier 6</label>
					</div> */}
				</div>
			</div>
        )
    }
}