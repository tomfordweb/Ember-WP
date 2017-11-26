<?php

class tfwCommentWalker extends Walker_Comment {
		var $tree_type = 'comment';
		var $db_fields = array( 'parent' => 'comment_parent', 'id' => 'comment_ID' );
 
		// constructor – wrapper for the comments list
		function __construct() { ?>

			<section class="comments-list">

		<?php }

		// start_lvl – wrapper for child comments list
		function start_lvl( &$output, $depth = 0, $args = array() ) {
			$GLOBALS['comment_depth'] = $depth + 2; ?>
			
			<section class="child-comments comments-list">

		<?php }
	
		// end_lvl – closing wrapper for child comments list
		function end_lvl( &$output, $depth = 0, $args = array() ) {
			$GLOBALS['comment_depth'] = $depth + 2; ?>

			</section>

		<?php }

		// start_el – HTML for comment template
		function start_el( &$output, $comment, $depth = 0, $args = array(), $id = 0 ) {
			$depth++;
			$GLOBALS['comment_depth'] = $depth;
			$GLOBALS['comment'] = $comment;
			$parent_class = ( empty( $args['has_children'] ) ? '' : 'parent' ); 
	
			if ( 'article' == $args['style'] ) {
				$tag = 'article';
				$add_below = 'comment';
			} else {
				$tag = 'article';
				$add_below = 'comment';
			} ?>
			<div class="card">
				<div class="card-header">
					<p class="text-left"><?php echo get_avatar( $comment, 40 ); ?>
						<a class="comment-author-link" href="<?php comment_author_url(); ?>" itemprop="author"><?php comment_author(); ?></a> &mdash;
						<time class="comment-meta-item" datetime="<?php comment_date('Y-m-d') ?>T<?php comment_time('H:iP') ?>" itemprop="datePublished"><?php comment_date('jS F Y') ?>, <?php comment_time() ?></time>
					</p>
					<p class="text-right">
												
					</p>
				</div>
				<div class="card-body">
				<div  id="comment-<?php comment_ID() ?>" itemprop="comment" itemscope itemtype="http://schema.org/Comment" <?php comment_class(array('card-body', empty( $args['has_children'] ) ? '' :'parent')) ?>>
			  		<?php comment_text() ?>
			  	</div>
			  	</div>
			  	<div class="card-footer">
			  		<div class="col-sm-6"><p><?php comment_reply_link(array_merge( $args, array('add_below' => $add_below, 'depth' => $depth, 'max_depth' => $args['max_depth']))) ?></p></div>
			  		<div class="col-sm-6 text-right">
			  			<?php if ($comment->comment_approved == '0') : ?>
						<p class="comment-meta-item">Your comment is awaiting moderation.</p>
						<p><?php edit_comment_link('Edit this comment','',''); ?></p>
						<?php endif; ?>

			  		</div>
			  		
					
			  	</div>



		<?php }

		// end_el – closing HTML for comment template
		function end_el(&$output, $comment, $depth = 0, $args = array() ) { ?>

			
			
		</div>

		<?php }

		// destructor – closing wrapper for the comments list
		function __destruct() { ?>

			</section>
		
		<?php }

	}