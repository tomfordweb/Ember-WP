import React from 'react';
import {makeid, isEmpty} from '../helpers';
import FontAwesome from 'react-fontawesome';
import update from 'immutability-helper';
/**
 * @async todo convert this to a child element like how the main app handles frontend rows...this will make code so much less fucking confusing.
 */
export class Bootstrap3Column extends React.Component {

	constructor(props) {
		super(props);

		/**
		 * create a unique ID for the column so it can be referenced by parent functions
		 * @type {string}
		 */
		const colUniqId = makeid();		

		this.state = {
			cssClass: 'col-sm-12',
			layout: '',
			id: colUniqId,
			displayName: 'Field ' + colUniqId	    
		}
	
		this.handleColumnClassChange = this.handleColumnClassChange.bind(this);
		this.handleNiceNameChange = this.handleNiceNameChange.bind(this);
		
	}

	/**
	 * After any stored props bubble down, set them to the current state, overwriting any defaults
	 */
	componentDidMount() {
		let stored_data = this.props.column;
		if(stored_data !== null && typeof stored_data === 'object') {

			let state_copy = update(this.state, {
				cssClass: {$set: this.props.column.cssClass},
				layout: {$set: this.props.column.layout},
				id: {$set: this.props.column.id},
				displayName: {$set: this.props.column.displayName}
			});

			this.setState(state_copy);
		}
	}

	/**
	 * The user has changed the bootstrap column class for the column
	 */
	handleColumnClassChange(event) {
		let copy = update(this.state, {cssClass: {$set : event.target.value}});
		this.setState(copy);

		this.props.bubbleUp(copy);
	}


	handleNiceNameChange(event) {
		let copy = update(this.state, {displayName: {$set : event.target.value}});
		this.setState(copy);

		this.props.bubbleUp(copy);
	}



	render() {
		let styles = {
			border: '1px solid #aaa',
			padding: '10px',
			marginBottom: '20px',
			clear: 'both',
			borderRadius: '5px'
		}

		return (
			<div className={this.state.cssClass + ' admin-column-frontend'}>
				<div style={styles}>
					<div className="form-group">
						<span className="label label-default">Column: {this.props.columnIndex}</span>
					</div>
					<div className="form-group">
						<label>Display Name*</label>
						<input type="text" className="form-control" onChange={this.handleNiceNameChange} value={this.state.displayName} />
						
					</div>

					<div className="form-group">
						<label>Bootstrap Column Class*</label>
						<input type="text" className="form-control" disabled={!this.state.displayName} onChange={this.handleColumnClassChange} value={this.state.cssClass} />
					</div>
				</div>		
			</div>
		);
	}
}


export class Bootstrap3ColumnsCreator extends React.Component {

	constructor(props) {
		super(props);

		let use_defaults = false;
		

		this.state=  {
			/**
			 * An array that contains the state(s) of Bootstrap3Column component
			 * @type {Array}
			 */
			columns : [],
			/**
			 * Internal counter for iterations of child Bootstrap3Column components, no need to set this
			 * as a prop as this component gathers it from the length of the column array
			 * @type {Number}
			 */
			columns_count : 0
		};

		this.addColumn = this.addColumn.bind(this);
		this.handleChildColumnChange = this.handleChildColumnChange.bind(this);
		this.renderColumns = this.renderColumns.bind(this);
	}

	/**
	 * After the component mounts, set the state via props.
	 */
	componentDidMount() {


		if(! isEmpty(this.props.columns)) {

			let new_state = update(this.state, {
				columns: {$set: this.props.columns},
				columns_count: {$set: this.props.columns.length}
			});

			this.setState(new_state);
		}
	}

	/**
	 * Increases the columns counter on state by 1,
	 * This will allow for the column editor HTML to be drawn when the component rerenders.
	 */
	addColumn()
	{	
		// increase column count by 1 in a copy of state
		let new_state = update(this.state, {columns_count: {$apply: function(x) { 
			if(x == 0 ) return 1;

			return x + 1;
		}}});
		this.setState(new_state);

		this.props.bubbleUp(new_state);
	}

	/**
	 * When a child column is changed, it's bubbleUp function will be passed to this
	 *
	 * If the column does not exist, push it to state.columns array
	 * If the column does exist, find it by the unique ID assigned to it, and update it.
	 * After we create the row object, bubble it up to the parent.
	 *
	 * @property {object} data State from child Bootstrap3Column component.
	 */
	handleChildColumnChange(data) {

		let existing_record = this.state.columns.find(x => x.id === data.id);

		if(typeof existing_record === 'undefined') { 
			// Check to see this column in the record
			// push the object into this.state.columns array if not
			var updated_columns = update(this.state.columns, {$push: [data]});
			
		} else {
			// The column is being updated, not created
			// Find the record by passing in [index] and update the whole column array
			// Easiest way to do this is immutability-helpers package
			var index = this.state.columns.indexOf(existing_record);

			var updated_columns = update(this.state.columns, {[index]: {$set: data}});
		}

		this.setState({
			columns: updated_columns
		});

		this.props.bubbleUp(updated_columns);
	}

	/**
	 * Render the display of the column builder on the site
	 *
	 * There are no columns shown by default because you need to build the children objects via the counter, which runs off state.
	 * The timing is wrong and the "second" column doesn't render correctly, causing you to have to click the button twice.
	 * @return {[type]} [description]
	 */
	renderColumns() {
		var columns = [];
		
		if(this.state.columns_count === 0) return false;

		for (var i = 0; i < this.state.columns_count; i++) {		

			columns.push(<Bootstrap3Column
				key={i}	
				columnIndex={i}						
				bubbleUp={this.handleChildColumnChange}
				column={this.state.columns[i]}
			 />
			);
		}			
		
		return columns;
	}



	render()
	{	
		let column_count = this.state.columns.length;

		return (			
			<div>				  
				    { this.renderColumns() }		
				<div className="col-sm-12 clearfix">
					{column_count === 0 ? <Bootstrap3IntroductionText /> : null }
					<p className="text-center"><button type="button" className="btn btn-primary btn-sm" onClick={this.addColumn}>Add Column</button></p>
				</div>
			</div>
		);
	}
}

class Bootstrap3IntroductionText extends React.Component {

	render() {
		return (
			<div>
				<h3>Bootstrap Column Page Builder</h3>
				<p>Create a detailed responsive layout with the columns builder below. Content options for each individual column are set in the Backend section. This page is used to create the general layout of your page.</p>

				<p>You are able to append any bootstrap responsive class to the columns. Including sizes for <code>.col-xs-, .col-sm-, .col-md-, .col-lg-</code></p>
			</div>
		)
	}
}