import React from 'react';
import {makeid, isEmpty} from '../helpers';
import FontAwesome from 'react-fontawesome';
import update from 'immutability-helper';

export class Bootstrap3ColumnsCreator extends React.Component {

	constructor(props) {
		super(props);

		let use_defaults = false;
		

		this.state=  {
			/**
			 * An array that contains the state(s) of Bootstrap3Column component
			 * @type {Array}
			 */
			columns : this.props.data,
		};

		this.addColumn = this.addColumn.bind(this);
		this.handleChildColumnChange = this.handleChildColumnChange.bind(this);
		this.renderColumns = this.renderColumns.bind(this);
	}


	/**
	 * Increases the columns counter on state by 1,
	 * This will allow for the column editor HTML to be drawn when the component rerenders.
	 */
	addColumn()
	{	
		let id = makeid();

		var newObj = {
			cssClass: 'col-sm-12',
			id: id,
			displayName: 'Field ' + id
		};

		// console.log(this.state.columns);

		let new_state = update(this.state.columns, {$push: [newObj]});

		this.setState( {
			columns: new_state
		});

		this.props.bubbleUp(new_state);

	}

	/**
	 * When a child column fiel,d is changed, it's bubbleUp function will be passed to this
	 * Update the specific record (fields are passed via attributes name, and data-id) from event object
	 * And pass state up to parents
	 */
	handleChildColumnChange(event) {

		const field = event.target.getAttribute('name'); // the key
		const value = event.target.value; // the value
		const id    = event.target.getAttribute('data-id'); // the unique id of the column

		// first find the existing record. 
		// @todo create a validator for this
		let existing_record = this.state.columns.find(x => x.id === id);

		// kind of backwards...but get the index of the single column object we found earlier.
		var index = this.state.columns.indexOf(existing_record);
		
		// use immutability helpers to set the colums value for the specific field
		let updated_columns = update(this.state.columns, {[index]: {[field] : {$set: value}}});

		this.setState({
			columns: updated_columns
		});

		// share state with parents.
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
		for (var i = 0; i < this.state.columns.length; i++) {		
			var column = this.state.columns[i];

			columns.push(<Bootstrap3Column
				key={i}	
				columnIndex={i}						
				bubbleUp={this.handleChildColumnChange}
				cssClass={column.cssClass}
				displayName={column.displayName}
				colId={column.id}
				/>
			);
		}			
		
		return columns;
	}

	render()
	{	

		return (			
			<div>				  
				{ this.renderColumns() }		
				<div className="col-sm-12 clearfix">
					{this.state.columns.length === 0 ? <Bootstrap3IntroductionText /> : null }
					<p className="text-center"><button type="button" className="btn btn-primary btn-sm" onClick={this.addColumn}>Add Column</button></p>
				</div>
			</div>
		);
	}
}


/**
 * Single column
 */
export class Bootstrap3Column extends React.Component {

	render() {
		let styles = {
			border: '1px solid #aaa',
			padding: '10px',
			marginBottom: '20px',
			clear: 'both',
			borderRadius: '5px'
		}

		return (
			<div className={this.props.cssClass + ' admin-column-frontend'}>
				<div style={styles}>
					<div className="form-group">
						<span className="label label-default">Column: {this.props.columnIndex}</span>
					</div>
					<div className="form-group">
						<label>Display Name*</label>
						<input type="text" className="form-control" name="displayName" data-id={this.props.colId} onChange={this.props.bubbleUp} value={this.props.displayName} />
						
					</div>

					<div className="form-group">
						<label>Bootstrap Column Class*</label>
						<input type="text" className="form-control" name="cssClass" data-id={this.props.colId} onChange={this.props.bubbleUp} value={this.props.cssClass} />
					</div>
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

				<p>Short Explanation: You are given 12 horizontal columns to add content to. You can arrange these columns however you want for 4 responsive breakpoints (XS, SM, MD, LG). Go left to right, top to bottom arranging columns.</p>

				<p>The layout for column classes follows a consistent format:</p>

				<p>You are able to append any bootstrap responsive class to the columns. Including: <code>.col-xs-, .col-sm-, .col-md-, .col-lg-</code></p>
			</div>
		)
	}
}