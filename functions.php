<?php

require_once('inc/menus/bs4NavWalker.php');
require_once('inc/comments/tfwCommentWalker.php');
require_once('inc/cpt/snippet.php');
require_once('inc/cpt/project.php');
require_once('inc/metaboxes/snippet/gist.php');
require_once('inc/metaboxes/landing-page/landing-page.php');

add_action( 'after_setup_theme', 'ember_setup' );
add_action( 'wp_enqueue_scripts', 'ember_load_scripts' );
add_action( 'comment_form_before', 'ember_enqueue_comment_reply_script' );
add_filter( 'the_title', 'ember_title' );
add_filter( 'wp_title', 'ember_filter_wp_title' );
add_action( 'widgets_init', 'ember_widgets_init' );
add_filter( 'get_comments_number', 'ember_comments_number' );

add_filter('next_comments_link_attributes', 'ember_pagination_link_attributes');
add_filter('previous_comments_link_attributes', 'ember_pagination_link_attributes');
add_filter('next_post_link', 'ember_posts_link_pagination_class');
add_filter('previous_post_link', 'ember_posts_link_pagination_class');
add_filter('comment_reply_link', 'replace_reply_link_class');

function ember_pagination_link_attributes() {


    return 'class="page-link"';
}


function ember_posts_link_pagination_class($format){


     $format = str_replace('href=', ember_pagination_link_attributes().' href=', $format);
     return $format;
}



function replace_reply_link_class($class){
    $class = str_replace("class='comment-reply-link btn btn-default btn-sm", "class='reply", $class);
    return $class;
}

function ember_setup()
{
	load_theme_textdomain( 'ember', get_template_directory() . '/languages' );
	add_theme_support( 'title-tag' );
	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'post-thumbnails' );
	global $content_width;
	if ( ! isset( $content_width ) ) $content_width = 640;
		register_nav_menus(
	array( 'main-menu' => __( 'Main Menu', 'ember' ) )
	);
}


function ember_load_scripts()
{
	wp_enqueue_style('ember', get_stylesheet_directory_uri() . '/dist/css/theme.min.css',array());	
	wp_register_script('ember',get_stylesheet_directory_uri() . '/dist/js/index.min.js', array('jquery'));

	wp_enqueue_script('ember');

}

function ember_enqueue_comment_reply_script()
{
if ( get_option( 'thread_comments' ) ) { wp_enqueue_script( 'comment-reply' ); }
}

function ember_title( $title ) {
	if ( $title == '' ) {
		return '&rarr;';
	} else {
		return $title;
	}
}

function ember_filter_wp_title( $title )
{
	return $title . esc_attr( get_bloginfo( 'name' ) );
}

function ember_widgets_init()
{
	register_sidebar( array (
		'name' => __( 'Sidebar Widget Area', 'ember' ),
		'id' => 'primary-widget-area',
		'before_widget' => '<li id="%1$s" class="widget-container %2$s">',
		'after_widget' => "</li>",
		'before_title' => '<h3 class="widget-title">',
		'after_title' => '</h3>',
	) );
}

function ember_custom_pings( $comment )
{
$GLOBALS['comment'] = $comment;
?>
<li <?php comment_class(); ?> id="li-comment-<?php comment_ID(); ?>"><?php echo comment_author_link(); ?></li>
<?php 
}

function ember_comments_number( $count )
{
	if ( !is_admin() ) {
		global $id;
		$comments_by_type = &separate_comments( get_comments( 'status=approve&post_id=' . $id ) );
		return count( $comments_by_type['comment'] );
	} else {
		return $count;
	}
}