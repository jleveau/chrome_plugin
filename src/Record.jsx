import React from 'react';
import {render} from 'react-dom';
import {addWaitToScenarioAndSave} from './ScenarioHelper.js';

const WAIT_TIME = 2000;

export default class Record extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            start: false,
            publish: true,
            reinit: true,
            isLoggedIn: false
        };
        this.clickStart = this.clickStart.bind(this);
        this.clickPublish = this.clickPublish.bind(this);
        this.clickReinit = this.clickReinit.bind(this);
    }

    componentDidMount() {
        chrome.runtime.sendMessage({kind:'getState'}, response => {
            this.setState( () => {
                return {
                    start: response.isRecording ,
                    publish: !response.isRecording ,
                    reinit: !response.isRecording ,
                    isLoggedIn : response.isLoggedIn
                };
            });
        });
    }

    clickStart() {
        chrome.runtime.sendMessage({kind:'start'});
        this.setState( (prevState) => {
            return {
                start: true ,
                publish: false ,
                reinit: false ,
                isLoggedIn : prevState.isLoggedIn
            };
        });
    }

    clickPublish() {
        console.log("start publish");
        chrome.runtime.sendMessage({kind:'publish'}, recordedScenario => {
            console.log("publish ok");
            addWaitToScenarioAndSave(recordedScenario, WAIT_TIME).then(() => {
                this.setState( (prevState) => {
                    return {
                        start: false ,
                        publish: true ,
                        reinit: true ,
                        isLoggedIn : prevState.isLoggedIn
                    };
                });
            })
                .catch( err => {
                    console.log(err);
                });
        });
    }

    clickReinit() {
        chrome.runtime.sendMessage({kind:'reinit'});
        this.setState( (prevState) => {
            return {
                start: false ,
                publish: true ,
                reinit: true ,
                isLoggedIn : prevState.isLoggedIn
            };
        });
    }

    render() {
        if (this.state.isLoggedIn) {
            return (
                <div>
                    <button onClick={this.clickStart} disabled={this.state.start}>START RECORDING</button>
                    <button onClick={this.clickPublish} disabled={this.state.publish}>STOP AND PUBLISH</button>
                    <button onClick={this.clickReinit} disabled={this.state.reinit}>STOP AND REINIT</button>
                </div>
            );
        } else {
            return (
                <div>Not Logged Yet !</div>

            );
        }
    }
}

