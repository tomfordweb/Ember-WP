import React from 'react';
import ReactDOM from 'react-dom';
import {Tabs, Tab, Panel} from 'react-bootstrap';


class BS3Checkbox extends React.Component {
	constructor(props) {
	    super(props);
	    console.log(this.props.isChecked);
	    this.state = {
	      isChecked: this.props.isChecked,
	      name: this.props.name
	    };

	    this.handleInputChange = this.handleInputChange.bind(this);
	  }

	  handleInputChange(event) {
	    const target = event.target;
	    const value = target.checked;
	

	    this.setState({
	      isChecked : value
	    });

	    this.props.checkBoxChanged(this.state.name, value)
  	}

	render() {

		let is_checked = (this.props.checked == true) ? 'checked' : null;

		return (
			<div className="checkbox">
		    <label>
		      <input type="checkbox" name={this.props.name} checked={this.state.isChecked} onChange={this.handleInputChange} /> {this.props.label}
		    </label>
		  </div>
		);
	}
	
}

class PageOptions extends React.Component {

	render() {
		return (
			<div className="row">
				<Panel header="Enable Modules">
					<p>Here you can activate specific display areas for the homepage</p>
					<ul className="list-unstyled">
						<li>
							<BS3Checkbox 
								isChecked={this.props.options.enableSlider}
								name="enableSlider"
								label={'Enable Slider'}
								checkBoxChanged={this.props.handlePageOptionChange}
							/>
						</li>
						<li>
							<BS3Checkbox 
								isChecked={this.props.options.enableCallouts}
								name="enableCallouts"
								label={'Enable Callout Area'}
								checkBoxChanged={this.props.handlePageOptionChange}
							/>
						</li>
						<li></li>
						<li></li>
						<li></li>
					</ul>	
			    </Panel>

			</div>
		);
	}
}

class LandingPageApp extends React.Component {

	 constructor(props) {
	    super(props);

	    this.state = {
	      meta_key : this.props.metaKey,
	      page_settings: [],
	      page_options: {
	      	enableSlider : true,
	      	enableCallouts: false
	      },
	    }
	    this.handlePageOptionChange = this.handlePageOptionChange.bind(this);
	    this.updateSettings = this.updateSettings.bind(this);
	  }

	  updateSettings() {

	  }
	  handlePageOptionChange(name, value) {
	  	var stateCopy = Object.assign({}, this.state);

	  	console.log(stateCopy);
		stateCopy.page_options[name] = value
		this.setState(stateCopy);
	  }
	render() {



		return (
			<div className="row">
				<textarea value={JSON.stringify(this.state, null, 2)} name={this.state.meta_key} onChange={this.updateSettings}/>
					<Tabs defaultActiveKey={1} id="ember-landing-page">
					    <Tab eventKey={1} title="Page Options">
					    	<PageOptions
					    		handlePageOptionChange={this.handlePageOptionChange}
					    		options={this.state.page_options}
					    	 />
					    </Tab>
			    <Tab eventKey={2} title="Tab 2">Tab 2 content</Tab>
			    <Tab eventKey={3} title="Tab 3">Tab 3 content</Tab>
			  </Tabs>		
			</div>
		);
	}
}

const app = document.getElementById('root');
ReactDOM.render(
  <LandingPageApp
  	metaKey={app.dataset.metakey}
   />,
  app
);