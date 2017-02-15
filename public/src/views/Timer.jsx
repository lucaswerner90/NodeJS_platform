import React, {Component} from 'react';
import { render }   from 'react-dom';

export default class Timer extends Component{
	constructor(props){
		super(props);
		this.state = {
			dd: 0,
			mm: 0,
			yyyy: 0,
			hours: 0,
			minutes: 0,
			seconds: 0
		}
		this.setTime = this.setTime.bind(this);
	};
	componentWillMount() {
        this.setTime();
	};
	componentDidMount() {
        window.setInterval(function () {
        	this.setTime();
        }.bind(this), 1000);
	};

    setTime(){
		var currentdate = new Date();
		var dd = currentdate.getDate();
		var monthNames = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
		"JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
		];
		var mm = monthNames[currentdate.getMonth()]; //January is 0!
		var yyyy = currentdate.getFullYear();
		var hours = currentdate.getUTCHours() + 1;
		// correct for number over 24, and negatives
		if( hours >= 24 ){ hours -= 24; }
		if( hours < 0   ){ hours += 12; }
		// add leading zero, first convert hours to string
		hours = hours + "";
		if( hours.length == 1 ){ hours = "0" + hours; }
		// minutes are the same on every time zone
		var minutes = currentdate.getUTCMinutes();
		// add leading zero, first convert hours to string
		minutes = minutes + "";
		if( minutes.length == 1 ){ minutes = "0" + minutes; }
		var seconds = currentdate.getUTCSeconds();
		seconds = seconds + "";
		if( seconds.length == 1 ){ seconds = "0" + seconds; }
		// console.log(day, hours, minutes, seconds)
		this.setState({
			dd: dd,
			mm: mm,
			yyyy: yyyy,
			hours: hours,
			minutes: minutes,
			seconds: seconds
	  	});
	};
	render(){
		return(
            <div className="row currentDate" ref="cityRow">
            	<i className="fa fa-calendar" aria-hidden="true"></i>
                <span className="city-time">{this.state.dd} {this.state.mm}, {this.state.yyyy} </span>
                <i className="fa fa-clock-o" aria-hidden="true"></i>
                <span className="city-time">{this.state.hours}:{this.state.minutes}:{this.state.seconds}</span>
            </div>
		)
	}
}