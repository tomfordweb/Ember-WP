import React from 'react';
import ReactDOM from 'react-dom';
import {Tabs, Tab, Panel} from 'react-bootstrap';

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
		this.props.bubbleUp(this.state.name, nextProps.data);
	}

	render() {
		const styles = {
			height: '400px'
		}
		return (
			<div className="form-group">
				<textarea
					style={styles}
					className="form-control" 
					value={this.state.data} 
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
				bubbleUp={this.props.updateSettings}/>
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
		// console.log(this.props.data.nicename + ' bubbling up!');
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

		this.state = {
			cssClass: 'col-sm-12',
			cssClassLive: 'col-sm-12',
			layout: 'PlainText',
			id: 'field-123456',
			displayName: 'Field 123456'		    
		}

		this.changedColumnGridClass = this.changedColumnGridClass.bind(this);
		this.changedColumnGridState = this.changedColumnGridState.bind(this);
		this.changedColumnLayoutType = this.changedColumnLayoutType.bind(this);
		this.changedDisplayName = this.changedDisplayName.bind(this);
	}

	/**
	 * The user has changed the bootstrap column class for the column
	 * @param  {event}
	 * @return {[type]}
	 */
	changedColumnGridClass(event) {
		this.setState({
			'cssClass' : event.target.value
		});

		this.props.bubbleUp(this.state);
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

		this.props.bubbleUp(this.state);
	}

	changedDisplayName(event) {

	}

	render() {
		const layout_options = [
			'PlainText', 'WYSIWYG','Image','BulletedList','Foo','Bar','Baz'
		];

		const layout_select = [];

		for (var i = layout_options.length - 1; i >= 0; i--) {
			let item = layout_options[i];
			let selected = (this.state.layout === item) ? 'selected' : '';
			layout_select.push(<option selected={selected} key={i} name={item} >{item}</option>);
		}

		return (
			<div className={this.state.cssClass + ' admin-column-frontend'}>
				<p>{ this.state.id }</p>
					<div className="form-group">
						<label>Bootstrap Column Class*</label>
						<input type="text" className="form-control" onBlur={this.changedColumnGridClass} onChange={this.changedColumnGridState} value={this.state.cssClassLive} />
					</div>
					<div className="form-group">
						<label>Content Type</label>
						<select className="form-control" onChange={this.changedColumnLayoutType}>
							{layout_select}
						</select>
					</div>
					<div className="form-group">
						<label>Display Name:</label>
						<input type="text" className="form-control" onChange={this.changedDisplayName} value={this.state.displayName} />
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

		this.state=  {
			columns : [],
			data : this.props.data
		};

		this.renderCurrentColumns = this.renderCurrentColumns.bind(this);
		this.addColumn = this.addColumn.bind(this);
	}

	renderCurrentColumns() {
		
	}

	addColumn()
	{	
		this.setState({
			columns: this.state.columns.concat([{
				'id' : null,
				'cssClass' : null,
				'content' : null
			}])
		});
	}

	render()
	{
		var columns = [];
		if(this.state.columns.length > 0) {
			for (var i = 0; i < this.state.columns.length; i++) {		
				var row = this.state.columns[i];
				columns.push(<Bootstrap3Column
								data={row}
								key={i}
								bubbleUp={this.props.bubbleUp}
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
		this.state = {
		  data: data,
		  key: this.props.name,
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
		console.log(data);
	}
	selectedColumn(event, data) {
		// console.log(data);
		// console.log('selected column');

		this.setState({ 
		  data: data,
		  picker: false
		});

		this.props.bubbleUp(event, data);
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


	renderRowData()
	{
		// console.log(this.state);
		if(!isEmpty(this.state.data)) {
			return (
				<div>
				<Bootstrap3ColumnsCreator
					data={this.state.data}
					bubbleUp={this.modifiedBootstrapRow}
				/>
				</div>
			);
		}

		return '';
	}
	render() {

		var add_more_message = (!isEmpty(this.state.data)) ? 'Change Row Type' : 'Select Row Type';
		return (
			<div className="col-sm-12">
				{ this.renderPicker() }
				<div className="well">
				<div className="row">
				{this.renderRowData() }
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
			return (
				<FrontEndRow
					key={0}
					bubbleUp={this.props.bubbleUp}
				/>
			);
		}

		// otherwise draw each frontendrow
		var rowColumns = [];

		for (var i = this.props.data.length - 1; i >= 0; i--) {
			var row = this.props.data[i];

			rowColumns.push(<FrontEndRow
				key={i}
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
	    this.updateSettings = this.updateSettings.bind(this);
	    this.handleFrontendUpdated = this.handleFrontendUpdated.bind(this);
	  }

	  handleFrontendUpdated(event, data) 
	  {
	  	this.setState({ 
		  frontend: this.state.frontend.concat([data])
		});
	  }
	  updateSettings(name, value) {

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
				    		updateSettings={this.updateSettings}
				    		data={ JSON.stringify(this.state, null, 2) }
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
