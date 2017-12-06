<section class="entry-content">
<?php if ( has_post_thumbnail() ) { the_post_thumbnail(); } ?>
<?php the_content(); ?>


<?php get_template_part('entry-'.get_post_type()); ?>
<div class="entry-links"><?php wp_link_pages(); ?></div>
</section>