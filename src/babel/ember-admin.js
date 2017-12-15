import React from 'react';
import ReactDOM from 'react-dom';
import {Tabs, Tab, Panel} from 'react-bootstrap';
import update from 'immutability-helper';
import {TFWCheckbox}  from './html-elements/form-elements';
import {EmberFrontend, FrontEndRow} from './frontend/frontend';
import FontAwesome from 'react-fontawesome';
import {rowTypeData} from './schema/row-types';
import {isEmpty, makeid} from './helpers';


/**
 * @todo  The delete method seems to remove the last row visually, but the data isn't bubbling down to children
 */
class LandingPageApp extends React.Component {

	constructor(props) {
		super(props);
			
		 let pageData = (typeof this.props.loadData === 'undefined') ? [] : this.props.loadData.pageData;

		 this.state = {
			meta_key : "tomfordwebembe_79316",
			pageData: pageData,
			row_types: rowTypeData
		};

		this.renderFrontEndRows = this.renderFrontEndRows.bind(this);
		this.pushEmptyRow = this.pushEmptyRow.bind(this);
		this.handlePageDataUpdated = this.handlePageDataUpdated.bind(this);
	}


	handlePageDataUpdated(data) {
		const id    = data.id; // the unique id of the column
		// first find the existing record. 
		// @todo create a validator for this
		let existing_record = this.state.pageData.find(x => x.id === id);


		// kind of backwards...but get the index of the single column object we found earlier.
		var index = this.state.pageData.indexOf(existing_record);

		let newState = update(this.state, {
			pageData: {
				[index] : {$set: data}
			}
		});

		this.setState(newState);
	}

  	pushEmptyRow() {

  		let uniqId = makeid();		

  		let pgData = update(this.state.pageData, {$push: [{
  			id: uniqId,
  			data: [],
  			selectedType: false,
  		}]});

  		this.setState({
  			pageData: pgData
  		});
  	}

	  
	  renderFrontEndRows() {
	  	let fe = this.state.pageData;
	  	let output = [];
	  	for(let i in fe) {
	  		let row = fe[i];
	  		output.push(
		  		<FrontEndRow
					key={i}
					id={row.id}
					selectedType={row.selectedType}
					updatedPageData={this.handlePageDataUpdated}
					data={row}
				/>
			);
	  	}
	  	return output;
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




