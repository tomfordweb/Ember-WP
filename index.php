<?php get_header(); ?>
<section id="content" role="main" class="container"> 
	<div class="row">
		<div class="col-md-8 col-lg-9">
			<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
			<?php get_template_part( 'entry' ); ?>
			<?php comments_template(); ?>
			<?php endwhile; ?>
			
			<?php else: ?>

				<p class="lead">Sorry, no posts exist.</p>
			<?php endif; ?>

			<?php get_template_part( 'nav', 'below' ); ?>
		</div>
		<div class="col-md-4 col-lg-3">
			<?php get_sidebar(); ?>
		</div>
	</div>
</section>

<?php get_footer(); ?>