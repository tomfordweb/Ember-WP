import React from 'react';
import ReactDOM from 'react-dom';
import {Tabs, Tab, Panel} from 'react-bootstrap';
import update from 'immutability-helper';
import {TFWCheckbox}  from './html-elements/form-elements';
import {EmberFrontend, FrontEndRow, AddRowElement} from './frontend/frontend';
import FontAwesome from 'react-fontawesome';
import {rowTypeData} from './schema/row-types';

import {isEmpty, makeid, ReturnArrayIfUndefined, GetIndexByKey} from './helpers';

const debug_textarea_styles = {
	height: '400px'
}



export const CreateEmptyRow = (uniqId) => {
	return {
		id: uniqId,
		data: [],
		selectedType: false,
	}
}

/**
 * @todo  The delete method seems to remove the last row visually, but the data isn't bubbling down to children
 */
class LandingPageApp extends React.Component {

	constructor(props) {
		super(props)

		 const pageData = ReturnArrayIfUndefined(this.props.loadData.pageData)

		 this.state = {
			meta_key : "tomfordwebembe_79316",
			pageData: pageData,
			row_types: rowTypeData
		}
	}


	handlePageDataUpdated = (data) => {

		const index = GetIndexByKey('id', data.id, this.state.pageData);

		let newState = update(this.state, {
			pageData: {
				[index] : {$set: data}
			}
		});

		this.setState(newState);
	}

  	pushEmptyRow = () => {

  		let uniqId = makeid();		

  		const row = CreateEmptyRow(uniqId);

  		let pgData = update(this.state.pageData, {$push: [row]});

  		this.setState({
  			pageData: pgData
  		});
  	}

	  
	renderFrontEndRows = () => {
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

				    	<AddRowElement
				    		pushEmptyRow={this.pushEmptyRow}
				    	/>
				    	
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

const app = document.getElementById('root')

const page_data = app.dataset.metakey + '_load_data'

ReactDOM.render(
  <LandingPageApp
  	metaKey={app.dataset.metakey}
  	loadData={window[page_data]}
   />,
  app
)




