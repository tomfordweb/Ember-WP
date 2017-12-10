import React from 'react';
/**

 * Create a HTML Checkbox
 * Props:
 * isChecked 		bool 		Whether or not the element is checked.
 * name 			string 		HTML name attribute
 * label			string 		The label for the checkbox
 * checkBoxChanged	function 	Update the state and throw back to parent.
 */
export class TFWCheckbox extends React.Component {

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
