import {HeroSlider} from '../frontend/hero-slider-module';
import {Bootstrap3ColumnsCreator} from '../frontend/row-type-bootstrap';
import {GetIndexByKey} from '../helpers';

export const rowTypeData = [{
	id: 'bootstrap3Columns',
	model: Bootstrap3ColumnsCreator,
	nicename: 'Bootstrap Columns',
	cssClass: 'ember-bs3-column',
	description : 'Create complex responsive layouts easily with bootstrap grid layout.',
	helpText: 'Please read bootstraps documentation on grid layout',
	icon: 'cogs',
},{
	id: 'slider',
	model: HeroSlider,
	nicename: 'Hero Slider',
	cssClass: 'col-sm-12',
	description : 'A page slider with a number of configuration options.',
	icon: 'arrows'
},{
	id: 'ember-callouts',
	model: false,
	nicename: 'Callout Section',
	cssClass: 'col-sm-12',
	description: 'Display an image, title, sentence, and a CTA button',
	icon : 'cogs'
},{
	id: 'ember-fw-googlemaps',
	model: false,
	nicename: 'Full Width Google Map',
	cssClass: 'col-sm-12',
	description: 'Display an embedded map, can conform to the devices viewport, or container.',
	icon: 'cogs'
}]





