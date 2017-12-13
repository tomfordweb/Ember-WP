import React from 'react';
import {makeid, isEmpty} from '../helpers';
import FontAwesome from 'react-fontawesome';
import update from 'immutability-helper';
/**
 * @async todo convert this to a child element like how the main app handles frontend rows...this will make code so much less fucking confusing.
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
		let id = makeid();

		let new_state = update(this.state.columns, {$push: [{
			cssClass: 'col-sm-12',
			id: id,
			displayName: 'Field ' + id
		}]});

		this.setState( {
			columns: new_state
		});

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
	handleChildColumnChange(event) {

		const field = event.target.getAttribute('name');
		const value = event.target.value;
		const id    = event.target.getAttribute('data-id');

		let existing_record = this.state.columns.find(x => x.id === id);
		var index = this.state.columns.indexOf(existing_record);
		
		let updated_columns = update(this.state.columns, {[index]: {[field] : {$set: value}}});

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

		console.log(this.state.columns);
		for (var i = 0; i < this.state.columns.length; i++) {		
			var column = this.state.columns[i];
	
			console.log(column);
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

				<p>Short Explanation: You are given 12 horizontal columns to add content to. You can arrange these columns however you want for 4 responsive breakpoints (XS, SM, MD, LG). Go left to right, top to bottom arranging columns.</p>

				<p>The layout for column classes follows a consistent format:</p>

				<p>You are able to append any bootstrap responsive class to the columns. Including: <code>.col-xs-, .col-sm-, .col-md-, .col-lg-</code></p>
			</div>
		)
	}
}