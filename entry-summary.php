
<section class="entry-summary">
<?php the_excerpt(); ?>
<?php if(get_post_type() !== 'post') get_template_part('entry', get_post_type()); ?>
<?php if( is_search() ) { ?><div class="entry-links"><?php wp_link_pages(); ?></div><?php } ?>
</section>