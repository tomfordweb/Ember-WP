 <?php


$gist_url = current(get_post_meta(get_the_ID(), 'gistembedcode_61991'));
 if(!empty($gist_url)) : ?>

<script src="<?php echo $gist_url.'.js'; ?>"></script>


 <?php endif; ?>