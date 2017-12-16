import React from 'react';
import {isEmpty, makeid, GetIndexByKey} from '../helpers';
import update from 'immutability-helper';
import FontAwesome from 'react-fontawesome';
import {Bootstrap3ColumnsCreator} from './row-type-bootstrap';
import {HeroSlider} from './hero-slider-module';
import {rowTypeData} from '../schema/row-types';
import PropTypes from 'prop-types';

const row_control_container_styles = {
	position: 'absolute',
	bottom: 0,
	right: 0
}

/**
 * HOF to return search rowTypeData schema by prop rowTypeDataID
 * @param  {string} rowTypeDataID The ID attribute
 * @return {object}               The model attribute of the object, a direct reference to a react component.
 */
export const DynamicRowRenderModels = (rowTypeDataID) => {

	const key = GetIndexByKey('id', rowTypeDataID, rowTypeData);
	const record = rowTypeData[key];
	return record.model;
}

DynamicRowRenderModels.propTypes = {
	rowTypeDataID : PropTypes.string
}

/**
 * Another HOF to generate a react component model by variable inside of rowTypeData object in schema.
 * @param  {string} className The id to pass to DynamicRowRenderModels
 * @param  {object} props     Additional properties to pass to the component
 * @return {object}           A react component
 */
export const RenderSpecificRow = (className, props) => {

	const SpecificComponent = DynamicRowRenderModels(className);

	return (
		<SpecificComponent {...props} />
	);

}

RenderSpecificRow.propTypes = {
	className : PropTypes.string,
	props: PropTypes.props

}


/**
 * Top level component for this level of logic.
 * The parent component "FrontEnd" exists to easily pass props to each registered child.
 *
 * All descendents of this should have their own state, as this component mainly just manages an array of its' children.
 *
 * Children of this class are loaded dynamically by the function used above. In order to use one of these elements in the application
 * You must add it to the object used with the function.
 *
 * todo: add makeid() function to the parent_key prop so we aren't accessing rows by index, that should get the clone above/below and delete methods working.
 * todo: clean up the first data prop of this class, i don't really know what it is used for, may be duplicating something.
 */
export class FrontEndRow extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
		  id: this.props.id,	
		  data: this.props.data,
		  selectedType: this.props.selectedType	 
		};
	}	

	selectedColumn = (id) => {
		this.setState(update(this.state, {$merge: {selectedType: id}}));
	}

	modifiedRow = (data) => {
		let newState = update(this.state, {
			data: {$set : data}
		});

		this.setState(newState);
		this.props.updatedPageData(newState);
	}

	renderRow = () => {

		if(! this.state.selectedType) {
			return(
				<RowTypeSelector
					rowTypes={this.props.rowTypes}
					bubbleUp={this.selectedColumn}
				/>
			)
		}
		
		return RenderSpecificRow(this.state.selectedType, 
		{
			data: this.state.data.data,
			bubbleUp: this.modifiedRow,
		})

	}

	deleteRow = () => {

	}

	cloneAbove = () => {

	}

	cloneBelow = () => {

	}

	render() {

		
		const panel_styles = {
			overflow: 'hidden'
		}

			const button_styles = {
			marginRight: '10px'
		}

		var row_information = rowTypeData.find(x => x.id === this.state.selectedType);

		console.log(row_information);
		return (	
			<div className="col-sm-12">
				<div className="well">
					<p className="pull-left">Row: { this.state.id}</p>
					<div className="pull-right">
						<div className="form-inline">
							<FrontEndRowButton onClick={this.deleteRow} className="btn btn-danger btn-xs" value="Delete Row" />
							<FrontEndRowButton onClick={this.cloneAbove} className="btn btn-default btn-xs" value="Clone Above" />
							<FrontEndRowButton onClick={this.cloneBelow} className="btn btn-default btn-xs" value="Clone Below" />
						</div>
					</div>	
					<div className="row">
						<div className="col-sm-12">
							<div className="panel panel-default">							
								<div className="panel-heading" style={panel_styles}>
									<FrontEndRowHeaderInformation row={row_information} editAction={this.togglePickerOverlay} />								
						  		</div>
						  <div className="panel-body">
						  	{ this.renderRow() }
						  </div>
						  </div>
						  </div>
					</div>		
				</div>
			</div>
		);
	}
}


/**
 * The header for a frontend row. Contains the icon, it's title, and an edit button that is passed via prop editAction
 * @param  {object} props The props
 * @return {object}       JSX
 */
export const FrontEndRowHeaderInformation = (props) => {
	if(typeof props.row === 'object') {
		return (
			<div>
				<div className="pull-left">
					<FontAwesome name={props.row.icon}/>&nbsp;{ props.row.nicename }
				</div>
				<div className="pull-right">
					<FontAwesome onClick={props.editAction} name="pencil-square-o"/>
				</div>
			</div>
		);
	} 

	return (<p>Row Picker</p>);
	
}

/**
 * Pass a bunch of props to a button. Make sure to include a value prop
 * @param  {object} props Props
 * @return {html}         A button
 */
export const FrontEndRowButton = (props) => {
	const button_styles = {
		marginRight: '10px'
	}

	return (
		<button type="button" style={button_styles} {...props}>{props.value}</button>
	);

}


export class EmberFrontend extends React.Component {

	 constructor(props) {
	    super(props)
	    this.renderChildren = this.renderChildren.bind(this)
	  }



	renderChildren() {
		return React.Children.map(this.props.children, child => {
		    return React.cloneElement(child, {
		      bubbleUp: this.props.bubbleUp,
		      rowTypes: this.props.rowTypes,
		      rowDeleteHandler: this.props.rowDeleteHandler,
		      rowCloneAboveHandler: this.props.rowCloneAboveHandler,
		      rowCloneBelowHandler: this.props.rowCloneBelowHandler
		    })
		  });
	}
	render() {		
		return (
			<div>
				{ this.renderChildren() }
			</div>
		);
	}
}


export const AddRowElement = (props) => {
	return (
		<div style={row_control_container_styles}>
	    	<FontAwesome onClick={props.pushEmptyRow} name="plus-circle" size="2x"/>
	    </div>
	)	
}


/**
 * A "Modal" that allows for you to select what the row will display
 *
 * @todo Figure out CSS or some kind of modal package for this.
 */
export class RowTypeSelector extends React.Component {		
	
	constructor(props) {
		super(props);
		this.bubbleUpHandler = this.bubbleUpHandler.bind(this);
		this.renderRowTypes = this.renderRowTypes.bind(this);
	}	

	/**	
	 * Retreive the data-type attribute from the button, and pass it to parent
	 * This will essentially change the parents row type.
	 */
	bubbleUpHandler(event)
	{
		let type = event.target.getAttribute('data-type');
		this.props.bubbleUp(type);
	}

	/**
	 * Generate the row types, this is passes as a prop from the main application state where all of the row data is stored.
	 */
	renderRowTypes() {	
		
		let rows = [];	
		for (var i = this.props.rowTypes.length - 1; i >= 0; i--) {
			let row = this.props.rowTypes[i];
			rows.push(
				<div className="col-sm-3" key={i}>
					<div className="well" >
						<FontAwesome name={row.icon} size="2x"/>
						<h4>{row.nicename}</h4>
						<p>{row.description}</p>
						<button type="button" className="btn btn-default" data-type={row.id} onClick={this.bubbleUpHandler}>Add Row</button>
					</div>
				</div>
			);

		}

		return rows;
	}
	/**
	 * Render the row types and some instructions
	 */
	render() {			
		return (
			<div className="row column-picker">
				<div className="col-sm-12">
					<p>Please select the format you would like for your row.</p>
				</div>
				{this.renderRowTypes()}
			</div>
		);
	}

}
