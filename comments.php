<?php if ( 'comments.php' == basename( $_SERVER['SCRIPT_FILENAME'] ) ) return; ?>
<section id="comments">
<?php

$ember_comment_form_args = array(
	
	'class_submit' => 'btn btn-default submit',

	'comment_field' => '<div class="col-sm-12"><div class="form-group"><label for="comment">' . _x( 'Comment', 'noun' ) . '</label><textarea id="comment" class="form-control" name="comment" cols="45" rows="8" aria-required="true"></textarea></div></div>',
	'comment_notes_before' => '<div class="col-sm-12"><p class="comment-notes">' . __( 'Your email address will not be published.' ) . ( $req ? $required_text : '' ) . '</p></div>',
	'submit_button' => '<div class="col-sm-12"><div class="form-group"><input name="%1$s" type="submit" id="%2$s" class="%3$s" value="%4$s" /></div>',
	'title_reply_before' => '<div class="col-sm-12"><h3 id="reply-title" class="comment-reply-title">',
	'title_reply_after' => '</h3></div>',
	'logged_in_as' => '<div class="col-sm-12"><p class="logged-in-as">' . sprintf( __( 'Logged in as <a href="%1$s">%2$s</a>. <a href="%3$s" title="Log out of this account">Log out?</a>' ), admin_url( 'profile.php' ), $user_identity, wp_logout_url( apply_filters( 'the_permalink', get_permalink( ) ) ) ) . '</p></div>',
	'fields' =>   array(
	  'author' =>
	    '<div class="col-md-6"><div class="comment-form-author form-group"><label for="author">' . __( 'Name', 'domainreference' ) . '</label> ' .
	    ( $req ? '<span class="required">*</span>' : '' ) .
	    '<input id="author" class="form-control" name="author" type="text" value="' . esc_attr( $commenter['comment_author'] ) .
	    '" size="30"' . $aria_req . ' /></div></div>',

	  'email' =>
	    '<div class="col-md-6"><div class="comment-form-email form-group"><label for="email">' . __( 'Email', 'domainreference' ) . '</label> ' .
	    ( $req ? '<span class="required">*</span>' : '' ) .
	    '<input class="form-control" id="email" name="email" type="text" value="' . esc_attr(  $commenter['comment_author_email'] ) .
	    '" size="30"' . $aria_req . ' /></div></div>',

	  'url' =>
	    '<div class="col-sm-12"><div class="comment-form-url form-group"><label for="url">' . __( 'Website', 'domainreference' ) . '</label>' .
	    '<input class="form-control" id="url" name="url" type="text" value="' . esc_attr( $commenter['comment_author_url'] ) .
	    '" size="30" /></div></div>',
	)
);
if ( comments_open() ) comment_form($ember_comment_form_args);

if ( have_comments() ) : 
	global $comments_by_type;

	$comments_by_type = &separate_comments( $comments );
	if ( ! empty( $comments_by_type['comment'] ) ) : ?>
		<section id="comments-list" class="comments">
			<header class="col-sm-12"><h3 class="comments-title"><?php comments_number(); ?></h3></header>

			<article class="col-sm-12">
			<?php wp_list_comments( array(
				'walker' => new tfwCommentWalker()
			) ); ?>
			</article>
			<?php if ( get_comment_pages_count() > 1 ) : ?>
			<?php get_template_part('comments','navigation'); ?>
			<?php endif; ?>
		</section>

	<?php 
	endif; 
endif;

?>
</section>