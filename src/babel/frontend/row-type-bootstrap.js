import React from 'react';
import {makeid, isEmpty, GetIndexByKey} from '../helpers';
import FontAwesome from 'react-fontawesome';
import update from 'immutability-helper';
import PropTypes from 'prop-types';



export const makeNewColumn = (uniqueId) => {
	return {
		cssClass: 'col-sm-12',
		id: uniqueId,
		displayName: 'Field ' + uniqueId
	};
}

export class Bootstrap3ColumnsCreator extends React.Component {

	constructor(props) {
		super(props);

		this.state=  {
			/**
			 * An array that contains the state(s) of Bootstrap3Column component
			 * @type {Array}
			 */
			columns : this.props.data
		};
	}

	addColumn = () => {
		let id = makeid();

		let column = makeNewColumn(id);
		console.log(column);
		let new_state = update(this.state.columns, {
			$push: [column]
		});

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
	handleChildColumnChange = (event) => {
		const field = event.target.getAttribute('name'); // the key
		const value = event.target.value; // the value
		const id    = event.target.getAttribute('data-id'); // the unique id of the column
	
		var index = GetIndexByKey('id', id, this.state.columns);

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
	renderColumns = () => {
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
					<p className="text-center">
						<button type="button" className="btn btn-primary btn-sm" onClick={this.addColumn}>
							Add Column
						</button>
					</p>
				</div>
			</div>
		);
	}
}

Bootstrap3ColumnsCreator.propTypes = {
	columns : PropTypes.array
};



export const Bootstrap3Column = function(props) {
	
	return (
		<div className={props.cssClass + ' admin-column-frontend'}>
			<div style={columnCssStyles}>
				<div className="form-group">
					<span className="label label-default">Column: {props.columnIndex}</span>
				</div>
				<div className="form-group">
					<label>Display Name*</label>
					<input type="text" className="form-control" name="displayName" data-id={props.colId} onChange={props.bubbleUp} value={props.displayName} />					
				</div>

				<div className="form-group">
					<label>Bootstrap Column Class*</label>
					<input type="text" className="form-control" name="cssClass" data-id={props.colId} onChange={props.bubbleUp} value={props.cssClass} />
				</div>
			</div>		
		</div>
	);
}

Bootstrap3Column.propTypes = {
	cssClass : PropTypes.string.isRequired,
	colId : PropTypes.string.isRequired,
	columnIndex: PropTypes.number.isRequired
}

const columnCssStyles = {
	border: '1px solid #aaa',
	padding: '10px',
	marginBottom: '20px',
	clear: 'both',
	borderRadius: '5px'
}




export const Bootstrap3IntroductionText = function() {
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
