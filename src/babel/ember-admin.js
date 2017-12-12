import React from 'react';
import ReactDOM from 'react-dom';
import {Tabs, Tab, Panel} from 'react-bootstrap';
import update from 'immutability-helper';
import {TFWCheckbox}  from './html-elements/form-elements';
import {EmberFrontend, FrontEndRow} from './frontend/frontend';
import FontAwesome from 'react-fontawesome';


/**
 * @todo Rename state frontend to something more meaningful
 * @todo  The delete method seems to remove the last row visually, but the data isn't bubbling down to children
 */
class LandingPageApp extends React.Component {

	 constructor(props) {
	    super(props);

	     this.state = {
			meta_key : this.props.metaKey,
			page_settings: [],
			frontend: [],
			row_types: [{
				id: 'bootstrap3Columns',
				nicename: 'Bootstrap Columns',
				cssClass: 'ember-bs3-column',
				description : 'Create complex responsive layouts easily with bootstrap grid layout.',
				helpText: 'Please read bootstraps documentation on grid layout',
				icon: 'cogs',
			},{
				id: 'slider',
				nicename: 'Hero Slider',
				cssClass: 'col-sm-12',
				description : 'A page slider with a number of configuration options.',
				icon: 'arrows'
			},{
				id: 'ember-callouts',
				nicename: 'Callout Section',
				cssClass: 'col-sm-12',
				description: 'Display an image, title, sentence, and a CTA button',
				icon : 'cogs'
			},{
				id: 'ember-fw-googlemaps',
				nicename: 'Full Width Google Map',
				cssClass: 'col-sm-12',
				description: 'Display an embedded map, can conform to the devices viewport, or container.',
				icon: 'cogs'
			}]
	    };

	    this.handleFrontendUpdated = this.handleFrontendUpdated.bind(this);
	    this.renderFrontEndRows = this.renderFrontEndRows.bind(this);
	    this.pushEmptyRow = this.pushEmptyRow.bind(this);
	    this.cloneFrontEndRowAfter = this.cloneFrontEndRowAfter.bind(this);
	    this.cloneFrontEndRowBefore = this.cloneFrontEndRowBefore.bind(this);
	    this.deleteFrontEndRow = this.deleteFrontEndRow.bind(this);
	  }

	  /**
	   * Inject Row data into the frontend array
	   *
	   * These rows are stored in the order they appear.
	   */
	  handleFrontendUpdated(data) 
	  {
	  	if(this.state.frontend.length === 0) {
	  		this.setState({
	  			frontend: this.state.frontend.concat([data])
	  		});
	  	} else { 			
	  		let key = data.parent_key;

	  		if(typeof key === 'undefined') {
	  			throw 'Invalid row key supplied to App::handleFrontendUpdated';
	  			return;
	  		}

	  		let newFrontend = update(this.state.frontend, {
	  			[key] : {$set: data}
	  		});
	

			this.setState({ 	
				frontend: newFrontend
			});
	  	}

	  }


	  componentDidMount() {
	    let stored_data = this.props.loadData;

	  	if(this.props.loadData !== null && typeof this.props.loadData === 'object') {
	    	if(this.props.loadData.meta_key !== this.props.metaKey)
	    		throw 'Invalid post';
	    	this.setState(stored_data);
	    }
	    
	  }

	  	pushEmptyRow() {

	  		let new_key = (this.state.frontend.length === 0) ? 0 : this.state.frontend.length + 1;
	  		let row_types = this.state.row_types;
	  		var new_frontend = update(this.state.frontend, {$push: [{
	  			parent_key: new_key,
	  			data: {}
	  		}]});

	  		this.setState({
	  			frontend: new_frontend
	  		});
	  	}

	  
	  renderFrontEndRows() {
	  	let fe = this.state.frontend;
	  	let output = [];
	  	for(let i in fe) {
	  		let row = fe[i];
	  		output.push(
		  		<FrontEndRow
					key={i}
					parentId={i}
					data={row}
				/>
			);
	  	}
	  	return output;
	  }

	  cloneFrontEndRowAfter(row_id) {
	  	console.log('clone below ' + row_id);
	  }

	  cloneFrontEndRowBefore(row_id) {
	  	console.log('clone above ' + row_id);
	  }
	  deleteFrontEndRow(row_id) {

	  	let updated = update(this.state.frontend, {$splice: [[row_id, 1]]});
	  	this.setState({
		  frontend: updated
		});
	  }
	render() {
		const debug_textarea_styles = {
			height: '400px'
		}

		const row_control_container_styles = {
			position: 'absolute',
			bottom: 0,
			right: 0
		}
		
		const stringified_output = JSON.stringify(this.state);

		return (
			<div className="row">
				
				<Tabs defaultActiveKey={3} id="ember-landing-page">
				    <Tab eventKey={2} title="Backend">
				    	<p> Backend !</p>
				    </Tab>
				    <Tab eventKey={3} title="Frontend">
				    	<EmberFrontend 
				    		rowTypes={this.state.row_types} 
				    		bubbleUp={this.handleFrontendUpdated}
				    		rowCloneBelowHandler={this.cloneFrontEndRowAfter}
				    		rowCloneAboveHandler={this.cloneFrontEndRowBefore}
				    	    rowDeleteHandler={this.deleteFrontEndRow}>
				    		{this.renderFrontEndRows()}
				    	</EmberFrontend>

				    	<div style={row_control_container_styles}>
				    	<FontAwesome onClick={this.pushEmptyRow} name="plus-circle" size="2x"/>
				    	</div>
				    </Tab>
				    <Tab eventKey={4} title="Debug">
				    	<div className="form-group">
							<textarea
								style={debug_textarea_styles}
								className="form-control" 
								value={stringified_output} 
								name={this.state.meta_key}
								readOnly
							/>
						</div>
				    </Tab>
		  		</Tabs>		
			</div>
		);
	}
}




const app = document.getElementById('root');

const page_data = app.dataset.metakey + '_load_data';

ReactDOM.render(
  <LandingPageApp
  	metaKey={app.dataset.metakey}
  	loadData={window[page_data]}
   />,
  app
);




