<?php

// this will be called from cron-job like this: http://ats.com/?update-ats-teams-cache=1
add_action('init', array(AtsTeamHubTeamsCache, 'update'));

class AtsTeamHubTeamsCms {
	static function getAllTeams($ids = array()) {
		$args = array(
			'post_type' => 'page',
			'meta_query' => array(
				array(
					'key' => '_wp_page_template',
					'value' => 'page-team.php'
				)
			),
			'posts_per_page'=>-1
		);

		if (count($ids)) {
			$args['post__in'] = $ids;
		}
		
		// The Query
		$the_query = new WP_Query( $args );

		// The Loop
		$teams = array();
		$page_ids = array();
		while ( $the_query->have_posts() ) : $the_query->the_post();
			$id = get_the_ID();
			$tumb_id = get_post_thumbnail_id();
			$img = $tumb_id ? wp_get_attachment_image_src($tumb_id) : "";
			$name = get_the_title();
			
			$city_terms_arr = wp_get_post_terms($id, 'city');
			$city = '';
			if (count($city_terms_arr) && $city_terms_arr[0]->name) {
				$city = $city_terms_arr[0]->name;
			}

			$category_terms_arr = wp_get_post_terms($id, 'category');
			$cat_ids = array();
			foreach($category_terms_arr as $category) {
				$cat_ids[] = $category->term_id;
			}
			
			$latitude = get_post_meta($id, 'geo_latitude', true);
			$longitude = get_post_meta($id, 'geo_longitude', true);
			
			$page_ids[] = $id;
			$teams[] = array(
				'id' => $id,
				'name' => $name,
				'logo' => $img ? $img[0] : "",
				'city' => $city,
				'categories' => $cat_ids,
				'geo_lat' => $latitude,
				'geo_long' => $longitude
			);
		endwhile;
		
		return $teams;
	}
}

class AtsTeamHubTeamsCache {
	static function getAllTeams($ids = array()) {
		$data = @file_get_contents(ATS_TEAM_HUB_TEAMS_CACHE);
		if (!$data) {
			return '';
		}
		
		$indexed_teams = json_decode($data, true); // "true" - convert object to arrays
		$teams = array();
		
		if (count($ids)) {
			foreach($ids as $id) {
				$tmp_team = $indexed_teams[$id];
				if ($tmp_team) {
					$teams[] = $tmp_team;
				}
			}
			
			return $teams;
		}
		
		foreach($indexed_teams as $id=>$team) {
			$teams[] = $team;
		}
		
		return $teams;
	}
	
	// will be called from cron-job
	static function update() {
		if (isset($_REQUEST['update-ats-teams-cache'])) {
			$res = AtsTeamHubTeamsCache::resetCache();
			if( $res ) {
				echo "cache updated: $res bytes";
			} else {
				echo "cache update fail";
			}
			exit;
		}
	}
	
	static function resetCache() {
		$teams = AtsTeamHubTeamsCms::getAllTeams();
		$indexed_teams = array();
		foreach($teams as $team) {
			$indexed_teams[$team['id']] = $team;
		}
		$res = @file_put_contents(ATS_TEAM_HUB_TEAMS_CACHE, json_encode($indexed_teams));
		return $res;
	}
}

?>