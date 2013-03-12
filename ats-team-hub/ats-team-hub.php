<?php
/*
Plugin Name: ATS Team Hub
Description: This plugin creates a widget for selection of favorite teams and showing 5 articles related for them. 
Author: Timur Morozov
Version: 1.0
*/

define('ATS_TEAM_HUB_DIR', plugin_dir_url(__FILE__));
define('ATS_TEAM_HUB_SYS_DIR', plugin_dir_path(__FILE__) );
define('ATS_TEAM_HUB_USER_TEAMS', 'user_teams');
define('ATS_TEAM_HUB_TEAMS_CACHE', ATS_TEAM_HUB_SYS_DIR.'ats_teams_cache.json');

// new taxonomy 'City' for pages, could be used in associating Team->City
add_action( 'init', 'ats_create_city_taxonomy', 0 );
function  ats_create_city_taxonomy() {
	register_taxonomy('city', 'page', array(
		'hierarchical' => false,
		'label' => 'City'
		)
	);
}

// caching geolocation for user, to prevent to many requests
add_action( 'init', array('AtsTeamHubUserGeoCache', 'initGeo'));
class AtsTeamHubUserGeoCache {
	static private $geo;
	
	static function initGeo($geo) {
		$ip = $_SERVER['REMOTE_ADDR'];
		if( $ip == '127.0.0.1' ) { // for local debugging
			$ip = '195.160.234.7'; // Lviv
		}

		AtsTeamHubUserGeoCache::$geo = AtsTeamHubUserGeoCache::getGeoFromCookie($ip);
		if (AtsTeamHubUserGeoCache::$geo && AtsTeamHubUserGeoCache::$geo->ip == $ip) {
			return;
		}
		
		AtsTeamHubUserGeoCache::$geo = AtsTeamHubUserGeoCache::getGeoFromIpinfodb($ip);
		AtsTeamHubUserGeoCache::setGeoToCookie(AtsTeamHubUserGeoCache::$geo);
	}
	
	static function getGeoFromCookie($ip) {
		if ($_COOKIE["ats_user_geo"]) {
			$result = unserialize(base64_decode($_COOKIE["ats_user_geo"]));
			return $result;
		}
		return '';
	}
	
	static function setGeoToCookie($geo) {
		$data = base64_encode(serialize($geo));
		setcookie("ats_user_geo", $data, time()+3600*24*7); //set cookie for 1 week
	}
	
	static function getGeoFromIpinfodb($ip) {
		$geo_data_json = file_get_contents('http://api.ipinfodb.com/v3/ip-city/?key=95433fdb32ae08fad78ef518e0afad73e3bfb057e847e9f624460a7da8715eac&format=json&ip='.$ip);
		$geo_data = json_decode($geo_data_json);
		$result = (object) null;
		$result->ip = $geo_data->ipAddress;
		$result->latitude = $geo_data->latitude;
		$result->longitude = $geo_data->longitude;
		return $result;
	}
	
	static function getGeo() {
		return AtsTeamHubUserGeoCache::$geo;
	}
}

add_action( 'wp_enqueue_scripts', 'ats_teamhub_add_stylesheet' );
function ats_teamhub_add_stylesheet() {
	wp_register_style( 'ats-team-hub', ATS_TEAM_HUB_DIR.'css/team-hub.css' );
	wp_enqueue_style( 'ats-team-hub' );
	wp_register_style( 'ats-team-hub-suggest', ATS_TEAM_HUB_DIR.'css/suggest.css' );
	wp_enqueue_style( 'ats-team-hub-suggest' );
}

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
		wp_enqueue_script('suggest', array('jquery'));
		wp_enqueue_script('underscore', ATS_TEAM_HUB_DIR.'js/libs/underscore/underscore-min.js', array());
		wp_enqueue_script('backbone', ATS_TEAM_HUB_DIR.'js/libs/backbone/backbone-min.js', array('jquery', 'underscore', 'json2'));
		//wp_enqueue_script('backbone-marionette-bundled', ATS_TEAM_HUB_DIR.'js/libs/backbone_marionette_bundled/backbone.marionette.min.js', array('jquery', 'backbone'));
		wp_enqueue_script('backbone-marionette-bundled', ATS_TEAM_HUB_DIR.'js/libs/backbone_marionette_bundled/backbone.marionette-ie8.min.js', array('jquery', 'backbone'));
		wp_enqueue_script('ats-team-hub_ns', ATS_TEAM_HUB_DIR.'js/team-hub-app/namespace.js', array());
		wp_enqueue_script('ats-team-hub_article_model', ATS_TEAM_HUB_DIR.'js/team-hub-app/models/article-model.js', array('jquery', 'backbone','backbone-marionette-bundled', 'ats-team-hub_ns'));
		wp_enqueue_script('ats-team-hub_team_model', ATS_TEAM_HUB_DIR.'js/team-hub-app/models/team-model.js', array('jquery', 'backbone','backbone-marionette-bundled', 'ats-team-hub_ns'));
		wp_enqueue_script('ats-team-hub_articles_view', ATS_TEAM_HUB_DIR.'js/team-hub-app/views/article-view.js', array('jquery', 'backbone','backbone-marionette-bundled', 'ats-team-hub_ns', 'ats-team-hub_article_model'));
		wp_enqueue_script('ats-team-hub_teams_view', ATS_TEAM_HUB_DIR.'js/team-hub-app/views/team-view.js', array('jquery', 'backbone','backbone-marionette-bundled', 'ats-team-hub_ns', 'ats-team-hub_team_model'));
		wp_enqueue_script('ats-team-hub_app', ATS_TEAM_HUB_DIR.'js/team-hub-app/app.js', array(
			'jquery', 
			'backbone',
			'backbone-marionette-bundled', 
			'ats-team-hub_ns', 
			'ats-team-hub_teams_view',
			'ats-team-hub_articles_view',
			'ats-team-hub_team_model',
			'ats-team-hub_article_model'
		));
		
        global $post;
        $post_old = $post; // Save the post object.

		extract( $args );
		echo $before_widget;
		?>
		<div class="white-side-box team-hub">	
			<?php echo $before_title, __("TEAM HUB"), $after_title;?>
			<h2><?php _e("Follow your favorite teams");?></h2>
			<div class="ats-team-hub-content"></div>
			<?php if (is_user_logged_in()) { ?>
				<a href="" class="select-teams"><?php _e("customize/select your teams");?></a>
			<?php } else { ?>
				<a href="?redirect_to=<?php echo urlencode(home_url()); ?>" class="simplemodal-login"><?php _e("customize/select your teams");?></a>
			<?php } ?>
		</div>
		<?php 
		include 'templates.html';
		$preload_articles_json = json_encode(AtsTeamHubArticles::getArticles());
		?>
		<!-- start up -->
		<script>
		jQuery(document).ready(function () {
			TeamHub.ajaxurl = '<?php echo admin_url('admin-ajax.php'); ?>';
			var articles = <?php echo $preload_articles_json;?>;
			var options = {
				articles: articles
			};
				
			TeamHub.startApplication(options);
		});
		</script>
		<?php
		echo $after_widget;

        wp_reset_postdata();
        $post = $post_old; // Restore the post object.
	}

}
 
// register AtsTeamHubSideBar widget
add_action('widgets_init', create_function('', 'return register_widget("AtsTeamHubSideBar");'));

require_once('teams-cache.php');
require_once('team-functions.php');
require_once('ajax-request.php');

?>