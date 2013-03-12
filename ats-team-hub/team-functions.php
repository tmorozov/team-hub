<?php

// for preserving user-selected teams in DB
class AtsTeamHubUserTeams {
	static function getTeamIds() {
		$user_id = get_current_user_id();
		$key = ATS_TEAM_HUB_USER_TEAMS;
		$single = true;
		$teamIdsStr = get_user_meta( $user_id, $key, $single );
		$teamIdsArr = array();
		if(strlen($teamIdsStr)) {
			$teamIdsArr = explode(',', $teamIdsStr);
		}
		return $teamIdsArr;
	}

	static function setTeamIds($ids) {
		$user_id = get_current_user_id();
		$key = ATS_TEAM_HUB_USER_TEAMS;
		$teamIdsStr = implode(',', $ids);
		update_user_meta( $user_id, $key, $teamIdsStr);
	}
}

class AtsTeamHubTeams {
	static function getAllTeams($ids = array()) {
		// 1) from cache
		$teams = AtsTeamHubTeamsCache::getAllTeams($ids);
		if ($teams) {
			return $teams;
		}
		
		// 2) from CMS
		return AtsTeamHubTeamsCms::getAllTeams($ids);
	}

	static function cmpDistance( $a, $b ) {
		return $a['distance'] > $b['distance'];
	} 

	static function getDistance($latitude1, $longitude1, $latitude2, $longitude2) {  
		$theta = $longitude1 - $longitude2;
		$distance = (sin(deg2rad($latitude1)) * sin(deg2rad($latitude2))) + (cos(deg2rad($latitude1)) * cos(deg2rad($latitude2)) * cos(deg2rad($theta)));
		$distance = acos($distance);
		$distance = rad2deg($distance);
		$distance = $distance * 60 * 1.1515;
		return (round($distance, 2));
	}

	static function getLocalTeams() {
		$teams = AtsTeamHubTeams::getAllTeams();

		$geo_data = AtsTeamHubUserGeoCache::getGeo();
		$my_lat = $geo_data->latitude ? $geo_data->latitude : 0;
		$my_long = $geo_data->longitude ? $geo_data->longitude : 0;

		foreach($teams as $key => $team) {
			$team_lat = $team['geo_lat'] ? $team['geo_lat'] : 0;
			$team_long = $team['geo_long'] ? $team['geo_long'] : 0;
			$distance = AtsTeamHubTeams::getDistance($my_lat, $my_long, $team_lat, $team_long);
			$teams[$key]['distance'] = $distance;
		}
		
		usort($teams, array('AtsTeamHubTeams', 'cmpDistance'));
		
		$result = array();
		// TODO: convert hardcoded value to configurable
		$i = 3; // number of local team to use before user select his own teams
		foreach($teams as $team) {
			if ($i<=0) {
				break;
			}
			$result[] = $team;
			$i--;
		}
		
		return $result;
	}
}

class AtsTeamHubArticles {
	static function getArticles() {
		$ids = AtsTeamHubUserTeams::getTeamIds();
		
		$teams = array();
		if ( count($ids) ) {
			$teams = AtsTeamHubTeams::getAllTeams($ids);
		} else {
			$teams = AtsTeamHubTeams::getLocalTeams();
		}

		$cat_ids = array();
		$cat2team = array();
		
		foreach($teams as $team) {
			foreach($team['categories'] as $cat_id) {
				$cat2team[$cat_id] = $team;
				$cat_ids[] = $cat_id;
			}
		}

		// find all posts
		$articles = array();
		$query2 = new WP_Query( array( 
			'category__in' => $cat_ids,
			'tax_query' => array(
				array(
					'taxonomy' => 'post_format',
					'field' => 'slug',
					'terms' => array('post-format-video', 'post-format-image'),
					'operator' => 'NOT IN'
				)
			),
			'posts_per_page' => 5
		) );
		
		while ( $query2->have_posts() ) : $query2->the_post();
			$id = get_the_ID();
			$tumb_id = get_post_thumbnail_id();
			$img = $tumb_id ? wp_get_attachment_image_src($tumb_id) : "";
			
			$team = array();
			$category_terms_arr = wp_get_post_terms($id, 'category');
			foreach($category_terms_arr as $category) {
				if( isset($cat2team[$category->term_id]) ){
					$team = $cat2team[$category->term_id];
					break;
				}
			}
			
			$articles[] = array(
				'id' => $id,
				'thumb' => $img ? $img[0] : "",
				'title' => get_the_title(),
				'url' => get_permalink(),
				'team' => $team
			);
		endwhile;

		return $articles;
	}
}






?>