<?php get_header(); ?>
<section id="content" role="main" class="container">
	<div class="row">

		
		<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
			<article class="col-md-8 col-lg-9">
		<?php get_template_part( 'entry' ); ?>		
		<?php get_template_part( 'nav', 'below-single' ); ?>
		
			</article>
			<div class="col-md-4 col-lg-3">
			<?php get_sidebar(); ?>
			</div>

			<article class="col-sm-12">
				<?php if ( ! post_password_required() ) comments_template( '', true ); ?>
			</article>
		<?php endwhile; endif; ?>		
		
	</div>
</section>

<?php get_footer(); ?>