import React from 'react';
import ReactDOM from 'react-dom';
import {Tabs, Tab, Panel} from 'react-bootstrap';
import update from 'immutability-helper';
const stringifyObject = require('stringify-object');

/**
 * Create a HTML Checkbox
 * Props:
 * isChecked 		bool 		Whether or not the element is checked.
 * name 			string 		HTML name attribute
 * label			string 		The label for the checkbox
 * checkBoxChanged	function 	Update the state and throw back to parent.
 */
class Checkbox extends React.Component {

	constructor(props) {
		super(props);

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

		this.props.checkBoxChanged(this.state.name, value);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			isChecked: nextProps.isChecked
		});
	}

	render() {
		// See: https://bootstrapdocs.com/v3.3.6/docs/css/#checkboxes-and-radios
		return (
			<div className="checkbox">
				<label>
					<input 
						type="checkbox" 
						name={this.props.name} 
						checked={this.state.isChecked} 
						onChange={this.handleInputChange} /> {this.props.label}
				</label>
			</div>
		);
	}
	
}

/**
 * Generate a textarea and update the applications state. This creates a form element that is used for
 * updating that page manually
 *
 * @todo make this agnostic of app saving feature, bad design
 */
class DebugPanelTextarea extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
		  data: this.props.data,
		  name: this.props.name
		};
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
		  data : nextProps.data
		});
	}

	render() {
		const styles = {
			height: '400px'
		}
		
		const pretty = stringifyObject(this.state.data, {
		    indent: '  ',
		    singleQuotes: false
		});

		const stringify = JSON.stringify(this.state.data);

		return (
			<div className="form-group">
				<textarea
					style={styles}
					className="form-control" 
					value={stringify} 
					name={this.state.name}
					readOnly
				/>
			</div>
		);
	}
	
}

/**
 * Wrapper for applications debug panel
 */
class DebugPanel extends React.Component {
	render() {
		return (
			<DebugPanelTextarea
				data={this.props.data} 
				name={this.props.name} 
				/>
		);
	}	
}

/**
 * Application global page options, enable or disable specific features.
 *
 * Originally intended as a proof of concept, there is no real meaning behidn these options yet.
 */
class PageOptions extends React.Component {

	render() {
		return (
			<div className="row">
				<Panel header="Enable Modules">
					<p>Here you can activate specific display areas for the homepage</p>
					<ul className="list-unstyled">
						<li>
							<Checkbox 
								isChecked={this.props.options.enableSlider}
								name="enableSlider"
								label={'Enable Slider'}
								checkBoxChanged={this.props.handlePageOptionChange}
							/>
						</li>
						<li>
							<Checkbox 
								isChecked={this.props.options.enableCallouts}
								name="enableCallouts"
								label={'Enable Callout Area'}
								checkBoxChanged={this.props.handlePageOptionChange}
							/>
						</li>

						<li></li>
						<li></li>
					</ul>	
			    </Panel>

			</div>
		);
	}
}

class Backend extends React.Component {

	render() {
		return (
			<p>hello world</p>
		);
	}
}

class AddRemoveButtons extends React.Component {
	render() {
		return (
			<div>
				<p><button className="btn btn-small btn-success">Add Row</button></p>
			</div>
		);
	}
}


class ColumnType extends React.Component {
	constructor(props) {
		super(props);
		this.bubbleUpHandler = this.bubbleUpHandler.bind(this);
	}

	bubbleUpHandler(event)
	{
		this.props.bubbleUp(event, this.props.data);
	}

	render() {
		return (
			<div className={this.props.data.cssClass} onClick={this.bubbleUpHandler}>
				{this.props.data.nicename}
			</div>
		);
	}
}

class RowPicker extends React.Component {		
	
	render() {	
		let rows = [];	

		for (var i = this.props.rowTypes.length - 1; i >= 0; i--) {
			rows.push(
				<ColumnType
					key={i}
					cssClass="col-sm-3"
					data={this.props.rowTypes[i]}
					bubbleUp={this.props.bubbleUp}
				/>
			);

		}

		return (
			<div className="row column-picker">
				<div className="col-sm-12">Please select your column type</div>
				{rows}
			</div>
		);
	}

}
class HeroSlider extends React.Component {
	render()
	{
		return (
			<p>Hero Slider</p>
		);
	}
}

class Bootstrap3Column extends React.Component {

	constructor(props) {
		super(props);

		const colUniqId = makeid();
		var use_store = false;
		let stored_data = this.props.column;
		if(stored_data !== null && typeof stored_data === 'object') {
			use_store = true;
		}

		const cssClassVal = ((use_store) ? this.props.column.cssClass : '')
		const layoutVal = ((use_store) ? this.props.column.layout : '');
		const uniqIdVal = ((use_store) ? this.props.column.id : colUniqId);
		const displayNameVal = ((use_store) ? this.props.column.displayName : 'Default');

		// console.log(cssClassVal);
		this.state = {
			cssClass: cssClassVal,
			cssClassLive: cssClassVal,
			layout: layoutVal,
			id: uniqIdVal,
			colUniqId: '-'+uniqIdVal,
			displayName: displayNameVal,
			displayNameLive: displayNameVal		    
		}

		this.changedColumnGridClass = this.changedColumnGridClass.bind(this);
		this.changedColumnGridState = this.changedColumnGridState.bind(this);
		this.changedColumnLayoutType = this.changedColumnLayoutType.bind(this);
		this.changedDisplayName = this.changedDisplayName.bind(this);

		this.changedDisplayNameState = this.changedDisplayNameState.bind(this);
	}



	// componentWillReceiveProps(nextProps) {
	//     let stored_data = this.props.column
	//     console.log('np');
	//     console.log(nextProps);
	  	
	   
	//     	this.setState(stored_data);
	//     }

	

	// componentWillReceiveProps(nextProps) {
	// 	let self = this;
	// 	self.props.bubbleUp(nextProps);
	// 	// setTimeout(function(){  }, 3000);
	// }
	/**
	 * The user has changed the bootstrap column class for the column
	 * @param  {event}
	 * @return {[type]}
	 */
	changedColumnGridClass(event) {

		this.setState({	
			'cssClass' : event.target.value
		});

		// The root issue behind using this awful code is that I can't find a component event
		// that can send state to parent only once, using bubbleUp in any of the component event update methods causing 
		// infinite loops, memory leaks, etc. I don't understand react or JS well enough to fix this currently
		// It appears that this "solution" works for now, but the if there's a bug regarding columns, look here first.
		// 
		// @ todo, redo this.
		// 
		// Send the state to the parent
		let self = this;
		setTimeout(function(){ self.props.bubbleUp(self.state) }, 3000);


	}

	/**
	 * This prop doesn't really mean anything, 
	 * allows for things like validation, 
	 * and screen not going nuts when user types	 * 
	 */
	changedColumnGridState(event) {
		this.setState({
			'cssClassLive' : event.target.value
		});
	}
	changedColumnLayoutType(event) {
		this.setState({
			'layout': event.target.value
		});

		// The root issue behind using this awful code is that I can't find a component event
		// that can send state to parent only once, using bubbleUp in any of the component event update methods causing 
		// infinite loops, memory leaks, etc. I don't understand react or JS well enough to fix this currently
		// It appears that this "solution" works for now, but the if there's a bug regarding columns, look here first.
		// 
		// @ todo, redo this.
		// 
		// Send the state to the parent
		let self = this;
		setTimeout(function(){ self.props.bubbleUp(self.state) }, 3000);
	}

	changedDisplayName(event) {
		let val = event.target.value;
		this.setState({
			displayName: val
		});

		// The root issue behind using this awful code is that I can't find a component event
		// that can send state to parent only once, using bubbleUp in any of the component event update methods causing 
		// infinite loops, memory leaks, etc. I don't understand react or JS well enough to fix this currently
		// It appears that this "solution" works for now, but the if there's a bug regarding columns, look here first.
		// 
		// @ todo, redo this.
		// 
		// Send the state to the parent
		let self = this;
		setTimeout(function(){ self.props.bubbleUp(self.state) }, 3000);
	}

	changedDisplayNameState(event) {
		let val = event.target.value;

		this.setState({
			'displayNameLive': val
		});
	}

	render() {
		const layout_options = [
			'PlainText', 'WYSIWYG','Image','BulletedList','Foo','Bar','Baz'
		];

		const layout_select = [];

		for (var i = layout_options.length - 1; i >= 0; i--) {
			let item = layout_options[i];
			let selected = (this.state.layout === item);
			layout_select.push(<option defaultValue={selected} key={i} name={item} >{item}</option>);
		}

		return (
			<div className={this.state.cssClass + ' admin-column-frontend'}>
					<div className="form-group">
						<label>Display Name*</label>
						<input type="text" className="form-control" onBlur={this.changedDisplayName} onChange={this.changedDisplayNameState} value={this.state.displayNameLive} />
						<p>CSS Selector: <code>.{ this.state.id }</code></p>
					</div>

					<div className="form-group">
						<label>Bootstrap Column Class*</label>
						<input type="text" className="form-control" disabled={!this.state.displayName} onBlur={this.changedColumnGridClass} onChange={this.changedColumnGridState} value={this.state.cssClassLive} />
					</div>
					<div className="form-group">
						<label>Content Type</label>
						<select className="form-control" disabled={!this.state.displayName} onChange={this.changedColumnLayoutType}>
							{layout_select}
						</select>
					</div>
					
					<div className="form-group">

					</div>
			
			</div>
		);
	}
}

class Bootstrap3NewColumn extends React.Component {

	render() {
		return (
			<div className="col-sm-12">
				<p className="btn btn-sm btn-default" onClick={this.props.addColumn}>Add Column</p>
			</div>
		);
	}
}

class Bootstrap3ColumnsCreator extends React.Component {

	constructor(props) {
		super(props);
		console.log('col creator props');
		console.log(this.props);
		let use_defaults = false;
		if(typeof this.props.columns === 'undefined') {
			use_defaults = true;
		}
		console.log('--instantiating col creator---');
		console.log(this.props.columns);
		console.log('using defaults ' + use_defaults);
		this.state=  {
			columns : (use_defaults) ? [] : this.props.columns,
			columns_count : (use_defaults) ? 0 : this.props.columns.length,
		};

		this.addColumn = this.addColumn.bind(this);
		this.handleChildColumnChange = this.handleChildColumnChange.bind(this);

	}


	addColumn()
	{	
		this.setState({
			columns_count: this.state.columns_count + 1
		});
	}
	handleChildColumnChange(data) {

		let existing_record = this.state.columns.find(x => x.id === data.id);

		if(typeof existing_record === 'undefined') {
			this.setState({
				columns: this.state.columns.concat([data])
			});
		} else {
			// i think this is what is breaking child bubble up bug
			// pretty sure this is modifying the state of the child component causing infinte loops.
			// 
			// @todo check component bubbleUp bug against this
			var copy = this.state.columns.slice();
			var index = this.state.columns.indexOf(existing_record);

			copy[index] = data;

			this.setState({
				columns: copy
			})


		}

		this.props.bubbleUp(this.state);
	}

	render()
	{

		var columns = [];
		if(this.state.columns_count > 0) {
			console.log('iterating columns');
			for (var i = 0; i < this.state.columns_count; i++) {		
	
				columns.push(<Bootstrap3Column
								key={i}							
								bubbleUp={this.handleChildColumnChange}
								column={this.state.columns[i]}
							 />
							);
			}
		}

		return (
			<div className="col-sm-12">
				<h4>Bootstrap 3 Columns</h4>
				<p>Please read bootstrap documentation if unfamiliar with grid layout.</p>
				<div className="row">
				{ columns }
				</div>
				
				<Bootstrap3NewColumn
					addColumn={this.addColumn}
				 />
			</div>
		);
	}
}

/**
 * This is where the magic happens for rows
 *
 * Contains all of the data used to display a row on the frontend of the website
 * 
 * Most datsets nested in this will bubble up to this class,
 * Where the state of this class is pushed to the application to be saved, etc.
 *
 * todo: clean up the first data prop of this class, i don't really know what it is used for, may be duplicating something.
 */
class FrontEndRow extends React.Component {
	constructor(props) {
		super(props);

		const data = (typeof this.props.data !== 'undefined') ? this.props.data : {};
		// console.log('--- instantiating front end row---');
	 // 	console.log(data);	
		this.state = {
		  parent_key: this.props.parentId,	
		  key: this.props.name,
		  data: data,
		  picker: false,
		  row_types: [
		  {
		  	id: 'bootstrap3Columns',
		  	nicename: 'Bootstrap Columns',
		  	cssClass: 'ember-bs3-column',
		  	data: []
		  },
		  {
		  	id: 'slider',
		  	nicename: 'Hero Slider',
		  	cssClass: 'col-sm-12',
		  	data: []
		  }
		  ]
		};

		this.showPicker = this.showPicker.bind(this);
		this.selectedColumn = this.selectedColumn.bind(this);
		this.hidePicker = this.hidePicker.bind(this);
		this.modifiedBootstrapRow = this.modifiedBootstrapRow.bind(this);
	}	

	hidePicker() {
		this.setState({
			picker: false
		});
	}

	showPicker() {
		this.setState({
			picker: true
		});
	}
	modifiedBootstrapRow(data) {

		let copy = Object.assign({}, this.state);
		copy.data = data;

		this.setState({
		  data: data
		});


		this.props.bubbleUp(copy);
	}

	selectedColumn(event, data) {


		this.setState({ 
		  data: data,
		  picker: false
		});

		this.props.bubbleUp(this.state);
	}

	renderPicker() {		

		if(this.state.picker) {
			
			return (
				<RowPicker
					rowTypes={this.state.row_types}
					bubbleUp={this.selectedColumn}
				/>
			);
		}

		return '';
		
	}


	render() {

		let add_more_message = (!isEmpty(this.state.data)) ? 'Change Row Type' : 'Select Row Type';

		let col_data = (typeof this.state.data.data === 'undefined') ? [] : this.state.data.data.columns;

		return (
			<div className="col-sm-12">
				{ this.renderPicker() }
				<div className="well">
					<div className="row">
						<Bootstrap3ColumnsCreator
							columns={col_data}
							bubbleUp={this.modifiedBootstrapRow}
						/>
					</div>
		
					<p className="text-center" onClick={this.showPicker}>{add_more_message}</p>
				
				</div>
			</div>
		);
	}
}

class Frontend extends React.Component {
	renderFrontEndRows() {
		

		// if no data exists, show a starter row
		if(this.props.data.length <= 0) {
			// console.log('calling in fresh frontendrow');
			return (
				<FrontEndRow
					key={0}
					bubbleUp={this.props.bubbleUp}
					parentId={0}
				/>
			);
		}

		// otherwise draw each frontendrow
		var rowColumns = [];


		for (var i = this.props.data.length - 1; i >= 0; i--) {
			var row = this.props.data[i];
			rowColumns.push(<FrontEndRow
				key={i}
				parentId={i}
				bubbleUp={this.props.bubbleUp}
				data={row}
			/>)
		}

		return rowColumns;
	}
	render() {

		
		return (
			<div className="frontend drawing-area">
				{this.renderFrontEndRows()}

				<AddRemoveButtons

				/>
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
	      frontend: [],
	      backend: {

	      },
	      page_options: {
	      	enableSlider : true,
	      	enableCallouts: false
	      },
	    };

	    this.handlePageOptionChange = this.handlePageOptionChange.bind(this);
	    this.handleFrontendUpdated = this.handleFrontendUpdated.bind(this);
	  }

	  /**
	   * Inject Row data into the frontend array
	   *
	   * These rows are stored in the order they appear.
	   */
	  handleFrontendUpdated(data) 
	  {

	  	// console.log('|||||||Start handleFrontEndUpdated|||||||||');
	  	


	  	if(this.state.frontend.length === 0) {
	  		// console.log('------adding a new frontend dataset----');
	  		// console.log('--row data--');
		  	// console.log(data);
		  	// console.log('--state--');
		  	// console.log(this.state);
		  	// console.log('state.frontend.length ' + this.state.frontend.length);

	  		this.setState({
	  			frontend: this.state.frontend.concat([data])
	  		});
	  	} else { 			

	  		let key = data.parent_key
	  		let element =  this.state.frontend;
	  		element[key] = data;


	  // 		console.log('-----we are updating this row----');
			// console.log(element);
			// console.log('-----with this data------');
			// console.log(data);
	  // 		console.log('-----this is what happened-----');
	  // 		console.log(element);

			this.setState({ 	
				frontend: element
			});
	  	}

	  }

	  componentDidUpdate() {
	  	// console.log('----app updating --');
	  	// console.log(this.state);
	  }
	  componentDidMount() {
	    let stored_data = this.props.loadData;

	  	if(this.props.loadData !== null && typeof this.props.loadData === 'object') {
	    	if(this.props.loadData.meta_key !== this.props.metaKey)
	    		throw 'Invalid post';
	    	this.setState(stored_data);
	    }

	    
	  }

	  handlePageOptionChange(name, value) {
	  	var stateCopy = Object.assign({}, this.state);
		stateCopy.page_options[name] = value
		this.setState(stateCopy);
	  }
	render() {
		return (
			<div className="row">
				
				<Tabs defaultActiveKey={3} id="ember-landing-page">
				    <Tab eventKey={1} title="Page Options">
				    	<PageOptions
				    		handlePageOptionChange={this.handlePageOptionChange}
				    		options={this.state.page_options}
				    	 />
				    </Tab>
				    <Tab eventKey={2} title="Backend">
				    	<Backend
				    		data={this.state}
				    	/>
				    </Tab>
				    <Tab eventKey={3} title="Frontend">
				    	<Frontend
				    		data={this.state.frontend}
				    		bubbleUp={this.handleFrontendUpdated}
				    	/>
				    </Tab>
				    <Tab eventKey={4} title="Debug">
				    	<DebugPanel
				    		data={ this.state }
				    		name={this.state.meta_key}
				    	/>
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

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}


function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
