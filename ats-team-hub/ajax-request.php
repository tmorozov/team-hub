<?php 
function ats_send_json_exit($val) {
	header( "Content-Type: application/json" );
	echo json_encode( $val );
	die();	
}

function ats_get_articles_json() {
	ats_send_json_exit(AtsTeamHubArticles::getArticles());
}

function ats_get_team_search_name($team) {
	return $team['city'] ? $team['city'].' '.$team['name'] : $team['name'];
}

function ats_get_teams_json() {
	$ids = AtsTeamHubUserTeams::getTeamIds();
	
	$teams = array();
	if (  is_array ($ids) && count($ids) ) {
		// find teams by ids
		$teams_info = AtsTeamHubTeams::getAllTeams($ids);
		foreach($teams_info as $team) {
			$search_name = ats_get_team_search_name($team);
			$new_team = array(
				'id' => $team['id'],
				'name' => $search_name,
				'logo' => $team['logo']
			);
			$teams[] = $new_team;
		}
	}
	
	ats_send_json_exit($teams);
}

function ats_create_team() {
	// get the submitted parameters
	$name = $_POST['name'];
	
	$teams = AtsTeamHubTeams::getAllTeams();
	$new_team = array();
	$lower_name = strtolower($name);
	foreach ($teams as $team) {
		$search_name = ats_get_team_search_name($team);
		if ( strtolower($search_name) === $lower_name ) {
			$new_team = array(
				'id' => $team['id'],
				'name' => $search_name,
				'logo' => $team['logo']
			);
			
			$id = $new_team['id'];
			
			// add id to $ids
			$ids = AtsTeamHubUserTeams::getTeamIds();
			$new_ids = array_diff($ids, array($id));
			$new_ids[] = $id;
			AtsTeamHubUserTeams::setTeamIds($new_ids);
			
			break;
		}
	}
	ats_send_json_exit($new_team);
}

function ats_del_team() {
	// get the submitted parameters
	$name = $_POST['name'];
	$id = $_POST['id'];
	
	$ids = AtsTeamHubUserTeams::getTeamIds();
	$new_ids = array_diff($ids, array($id));
	AtsTeamHubUserTeams::setTeamIds($new_ids);
	
	$val = array();
	ats_send_json_exit($val);
}

function ats_find_team() {
	// get the submitted parameters
	$q = strtolower($_REQUEST["q"]);
	if (!$q) {
		die();
	}

	$teams = AtsTeamHubTeams::getAllTeams();
	foreach ($teams as $team) {
		$search_name = ats_get_team_search_name($team);
		if (strpos(strtolower($search_name), $q) !== false) {
			echo $search_name."\n";
		}
	}
	
	die();
}

add_action('wp_ajax_get-teamhub-articles', 'ats_get_articles_json' );
add_action('wp_ajax_nopriv_get-teamhub-articles', 'ats_get_articles_json' );

add_action('wp_ajax_get-teamhub-teams', 'ats_get_teams_json' );

add_action('wp_ajax_create-teamhub-team', 'ats_create_team' );

add_action('wp_ajax_del-teamhub-team', 'ats_del_team' );

add_action('wp_ajax_find-teamhub-team', 'ats_find_team' );

?>