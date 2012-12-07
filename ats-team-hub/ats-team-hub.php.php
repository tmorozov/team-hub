<?php
/*
Plugin Name: ATS Team Hub
Description: This plugin creates a widget for selection of favorite teams and showing 5 articles related for them. 
Author: Timur Morozov
Version: 1.0
*/

define('ATS_TEAM_HUB_DIR', plugin_dir_url(__FILE__));

class AtsTeamHubSideBar extends WP_Widget{

    function __construct() {
        $widget_ops = array(
            'classname'   => 'ats_team_hub_sidebar',
            'description' => __('Makes posible selection of favorite teams and shows 5 articles related for them.')
        );
        parent::__construct('ats_team_hub_sidebar', __('ATS Team Hub Sidebar'), $widget_ops);
    }

	public function form($instance) {
	}
 
	public function update($new_instance, $old_instance) {
		return $new_instance;
	}
 
	public function widget($args, $instance) {
		wp_enqueue_script('underscore', ATS_TEAM_HUB_DIR.'js/libs/underscore/underscore-min.js', array());
		wp_enqueue_script('backbone', ATS_TEAM_HUB_DIR.'js/libs/backbone/backbone-min.js', array('jquery', 'underscore', 'json2'));
		wp_enqueue_script('backbone-marionette-bundled', ATS_TEAM_HUB_DIR.'js/libs/backbone_marionette_bundled/backbone.marionette.min.js', array('jquery', 'backbone'));
	
        global $post;
        $post_old = $post; // Save the post object.

		extract( $args );
		echo $before_widget;
		?>
<div class="white-side-box team-hub">
		<?php 
		echo $before_title;
		_e("TEAM HUB");
		echo $after_title;
		?>
	<h2><?php _e("Follow your favorite teams");?></h2>
	<div class="content">
		<ul class="team-articles">
		</ul>
	</div>
	<a href=""><?php _e("customize/select your teams");?></a>
</div>
		<?php
		echo $after_widget;

        wp_reset_postdata();
        $post = $post_old; // Restore the post object.
	}

}
 
// register AtsTeamHubSideBar widget
add_action('widgets_init', create_function('', 'return register_widget("AtsTeamHubSideBar");'));

?>