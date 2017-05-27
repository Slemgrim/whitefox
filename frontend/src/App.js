import React, {Component} from 'react';
import CodeForm from './Components/CodeForm.js';
import AccessGranted from './Components/AccessGranted.js';
import AccessDenied from './Components/AccessDenied.js';
import Loading from './Components/Loading.js';
import Targeting from './Components/Targeting.js';
import Intro from './Components/Intro.js';

import UI from './Components/UI.js';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

import './App.css';
import Codes from './Codes.json';


class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedCode: '',
            codeState: 'intro',
            location: null,
            orientation: {
                alpha: 0,
                beta: 0,
                gamma: 0
            }
        };

        this.stateTimout = null;

        this.handleCodeChange = this.handleCodeChange.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.startLoading = this.startLoading.bind(this);
        this.startTargeting = this.startTargeting.bind(this);
        this.getLocation = this.getLocation.bind(this);
        this.setLocation = this.setLocation.bind(this);
        this.getOrientation = this.getOrientation.bind(this);
        this.setOrientation = this.setOrientation.bind(this);
        this.startIntro = this.startIntro.bind(this);
        this.startApp = this.startApp.bind(this);
    }

    componentDidMount(){
        this.getLocation();
        this.startIntro();
    }

    handleCodeChange(code) {
        let selectedCode = null;
        for(let i = 0; i<Codes.length; i++){
            if(Codes[i].code === code){
                selectedCode = Codes[i];
            }
        }

        if(selectedCode){
            this.setState({selectedCode: selectedCode});
            this.setState({codeState: 'valid'});
            this.stateTimout = setTimeout(this.startLoading, 2000);
        } else {
            this.setState({codeState: 'invalid'});
            this.stateTimout = setTimeout(this.handleReset, 2000);
            this.setState({selectedCode: null});
        }
    }

    startIntro(){
        this.stateTimout = setTimeout(this.startApp, 3000);
    }

    startApp(){
        this.setState({codeState: 'neutral'});

        // if(this.stateTimout != null){
        //     clearTimeout(this.stateTimout);
        // }
    }

    handleReset() {
        this.setState({codeState: 'neutral'});

        if(this.stateTimout != null){
            clearTimeout(this.stateTimout);
        }
    }

    startLoading() {
        this.setState({codeState: 'loading'});

        if(this.stateTimout != null){
            clearTimeout(this.stateTimout);
        }

        this.getLocation()
        this.getOrientation()
    }

    startTargeting(){
        if(!['neutral'].indexOf(this.state.codeState)){
            console.log('invalid state for targeting');
            return;
        }
        if(this.state.location == null){
            console.log('missing location');
            return;
        }
        this.setState({codeState: 'targeting'});
    }

    getLocation() {
        console.log('get location');
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.setLocation);
        } else {
            console.log("geolocation not supported")
        }
    }

    getOrientation(){
        console.log('get orientation');
        window.addEventListener('deviceorientationabsolute', this.setOrientation, false);
    }

    setOrientation(orientation){
        console.log('set orientation');
        console.log(orientation);
        this.setState({orientation: orientation}, this.startTargeting);
    }

    setLocation(location) {
        console.log('set location');
        console.log(location)
        this.setState({location: location}, this.startTargeting);
    }

    render() {

        let step = null;

        switch(this.state.codeState){
            case 'intro':
                step = <Intro/>
                break;
            case 'valid':
                step = <AccessGranted/>
                break;
            case 'invalid':
                step = <AccessDenied/>
                break;
            case 'loading':
                step = <Loading/>
                break;
            case 'targeting':
                step = <Targeting
                    code={this.state.selectedCode}
                    location={this.state.location}
                    orientation={this.state.orientation}/>
                break;
            case 'neutral':
            default:
                step = <CodeForm onChange={this.handleCodeChange}/>
                break;
        }

        return (
            <div className="Wrap">
                <div className="Square">
                    <UI codeState={this.state.codeState} />
                    <CSSTransitionGroup
                        transitionName="Step"
                        transitionAppear={true}
                        transitionAppearTimeout={2000}
                        transitionEnterTimeout={2000}
                        transitionLeaveTimeout={2000}>
                        {step}
                    </CSSTransitionGroup>
                </div>
            </div>
        );
    }
}

export default App;
