<?php

add_action('admin_init', 'remove_textarea');

function remove_textarea() {
        remove_post_type_support( 'page', 'editor' );
}

class tomfordwebemberMetabox {
	private $screen = array(
		'page',
	);
	private $meta_fields = array(
			'label' => 'tomfordweb_ember',
			'id' => 'tomfordwebembe_79316',
			'type' => 'textarea'
	);

	public function enqueue_scripts() {
		wp_register_script('ember-admin-landing-page', get_stylesheet_directory_uri() . '/dist/js/ember-admin.js', array(), false, true);
		wp_enqueue_style('bootstrap-3', '//maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css',array());	
		wp_enqueue_style('font-awesome', '//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css', array());
		wp_enqueue_Script('ember-admin-landing-page');
	}


	public function __construct() {
		add_action( 'add_meta_boxes', array( $this, 'add_meta_boxes' ) );
		add_action( 'save_post', array( $this, 'save_fields' ) );
		add_action('admin_enqueue_scripts', array($this, 'enqueue_scripts'));
	}
	public function add_meta_boxes() {
		foreach ( $this->screen as $single_screen ) {
			add_meta_box(
				'tomfordwebember',
				__( 'TomFordWeb Ember', 'ember' ),
				array( $this, 'meta_box_callback' ),
				$single_screen,
				'advanced',
				'high'
			);
		}
	}
	public function meta_box_callback( $post ) {
		wp_nonce_field( 'tomfordwebember_data', 'tomfordwebember_nonce' );
		$this->field_generator( $post );
	}
	public function field_generator( $post ) {
		// $output = '';
		$id = $this->meta_fields['id'];
		$meta_value = get_post_meta( $post->ID, $id, true );
		$meta_value = maybe_unserialize($meta_value, true);
		$meta_value= json_decode(json_encode($meta_value), true);
		// $meta_value = json_decode($meta_value, true);
		// echo '<p>Page attached Meta Dump</p><pre>';
		// var_dump($meta_value);
		// echo '</pre>';
		$data = json_encode($meta_value);
		echo '<script type="text/javascript">';
		echo sprintf('var %s_load_data = %s;', $id, $data);
		echo '</script>';
		echo '<div id="root" data-metakey='. $id . '></div>';
	}
	public function format_rows( $label, $input ) {
		return '<tr><th>'.$label.'</th><td>'.$input.'</td></tr>';
	}
	public function save_fields( $post_id ) {

		if ( ! isset( $_POST['tomfordwebember_nonce'] ) )
			return $post_id;
		$nonce = $_POST['tomfordwebember_nonce'];
		if ( !wp_verify_nonce( $nonce, 'tomfordwebember_data' ) )
			return $post_id;
		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE )
			return $post_id;		
		
		$store = $_POST[ $this->meta_fields['id'] ];
		$store_obj = json_decode(stripslashes($store));

		update_post_meta( $post_id, $this->meta_fields['id'], maybe_serialize($store_obj) );

	}
}
if (class_exists('tomfordwebemberMetabox')) {
	new tomfordwebemberMetabox;
};