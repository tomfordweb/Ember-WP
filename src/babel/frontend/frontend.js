import React from 'react';
import {isEmpty, makeid} from '../helpers';
import update from 'immutability-helper';
import FontAwesome from 'react-fontawesome';
import {Bootstrap3ColumnsCreator} from './row-type-bootstrap';
import {HeroSlider} from './hero-slider-module';


const dynamic_row_render_options = {
	bootstrap3Columns : Bootstrap3ColumnsCreator,
	slider : HeroSlider

}

function RenderSpecificRow(className, props) {


	const SpecificComponent = dynamic_row_render_options[className];
	// console.log('render specific row is mapping ' + className + ' to...');
	// console.log(SpecificComponent);
	return (
		<SpecificComponent {...props} />
	);

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

		this.selectedColumn = this.selectedColumn.bind(this);
		this.getRowTitle = this.getRowTitle.bind(this);
		this.modifiedRow = this.modifiedRow.bind(this);
		this.renderRow = this.renderRow.bind(this);
	}	


	selectedColumn(id) {
		this.setState(update(this.state, {$merge: {selectedType: id}}));
	}


	modifiedRow(data) {

		let newState = update(this.state, {
			data: {$set : data}
		});

		this.setState(newState);
		this.props.updatedPageData(newState);
	}

	renderRow() {

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

	getRowTitle(row_information) {
		if(typeof row_information === 'object') {
			return (
				<div>
					<div className="pull-left">
						<FontAwesome name={row_information.icon}/>&nbsp;{ row_information.nicename }
					</div>
					<div className="pull-right">
						<FontAwesome onClick={this.togglePickerOverlay} name="pencil-square-o"/>
					</div>
				</div>
			);
		} else {

			return (
				<p>Row Picker</p>
			);
		}
	}
	render() {

		
		const panel_styles = {
			overflow: 'hidden'
		}

		const button_styles = {
			marginRight: '10px'
		}

		var row_information = this.props.rowTypes.find(x => x.id === this.state.selectedType);

	
		return (	
			<div className="col-sm-12">
				<div className="well">
					<p className="pull-left">Row: { this.state.id}</p>
					<div className="pull-right">
						<div className="form-inline">
							<button type="button" style={button_styles} onClick={this.deleteRow}className="btn btn-danger btn-xs">Delete Row { this.state.rowKey}</button>
							<button type="button" style={button_styles} onClick={this.cloneAbove} className="btn btn-default btn-xs">Clone Above</button>
							<button type="button" onClick={this.cloneBelow} className="btn btn-default btn-xs">Clone Below</button>
						</div>
					</div>	
					<div className="row">
						<div className="col-sm-12">
							<div className="panel panel-default">							
								<div className="panel-heading" style={panel_styles}>
									{ this.getRowTitle(row_information) }
								
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
