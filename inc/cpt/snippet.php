<?php

// Register Custom Post Type
function ember_create_snippet_cpt() {

	$labels = array(
		'name'                  => _x( 'Snippets', 'Post Type General Name', 'text_domain' ),
		'singular_name'         => _x( 'Snippet', 'Post Type Singular Name', 'text_domain' ),
		'menu_name'             => __( 'Snippets', 'text_domain' ),
		'name_admin_bar'        => __( 'Snippets', 'text_domain' ),
		'archives'              => __( 'Snippet Archives', 'text_domain' ),
		'attributes'            => __( 'Snippet Attributes', 'text_domain' ),
		'parent_item_colon'     => __( 'Parent Snippet:', 'text_domain' ),
		'all_items'             => __( 'All Snippets', 'text_domain' ),
		'add_new_item'          => __( 'Add New Snippet', 'text_domain' ),
		'add_new'               => __( 'Add New', 'text_domain' ),
		'new_item'              => __( 'New Snippet', 'text_domain' ),
		'edit_item'             => __( 'Edit Snippet', 'text_domain' ),
		'update_item'           => __( 'Update Snippet', 'text_domain' ),
		'view_item'             => __( 'View Snippet', 'text_domain' ),
		'view_items'            => __( 'View Snippets', 'text_domain' ),
		'search_items'          => __( 'Search Snippets', 'text_domain' ),
		'not_found'             => __( 'Not found', 'text_domain' ),
		'not_found_in_trash'    => __( 'Not found in Trash', 'text_domain' ),
		'featured_image'        => __( 'Featured Image', 'text_domain' ),
		'set_featured_image'    => __( 'Set featured image', 'text_domain' ),
		'remove_featured_image' => __( 'Remove featured image', 'text_domain' ),
		'use_featured_image'    => __( 'Use as featured image', 'text_domain' ),
		'insert_into_item'      => __( 'Insert into item', 'text_domain' ),
		'uploaded_to_this_item' => __( 'Uploaded to this item', 'text_domain' ),
		'items_list'            => __( 'Items list', 'text_domain' ),
		'items_list_navigation' => __( 'Items list navigation', 'text_domain' ),
		'filter_items_list'     => __( 'Filter items list', 'text_domain' ),
	);
	$rewrite = array(
		'slug'                  => 'snippets',
		'with_front'            => true,
		'pages'                 => true,
		'feeds'                 => true,
	);
	$args = array(
		'label'                 => __( 'Snippet', 'text_domain' ),
		'description'           => __( 'Code Snippets', 'text_domain' ),
		'labels'                => $labels,
		'supports'              => array( 'title', 'editor' ),
		'taxonomies'            => array( 'category', 'post_tag' ),
		'hierarchical'          => false,
		'public'                => true,
		'show_ui'               => true,
		'show_in_menu'          => true,
		'menu_position'         => 5,
		'menu_icon'             => 'dashicons-media-code',
		'show_in_admin_bar'     => true,
		'show_in_nav_menus'     => true,
		'can_export'            => true,
		'has_archive'           => true,
		'exclude_from_search'   => false,
		'publicly_queryable'    => true,
		'rewrite'               => $rewrite,
		'capability_type'       => 'page',
		'show_in_rest'          => true,
	);
	register_post_type( 'snippet', $args );

}
add_action( 'init', 'ember_create_snippet_cpt', 0 );