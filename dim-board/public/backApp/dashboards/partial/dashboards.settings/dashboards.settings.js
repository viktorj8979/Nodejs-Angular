angular.module('dashboards').controller('DashboardsSettingsCtrl',function($scope, Themes){
	$scope.saveNewTheme = saveNewTheme;
	$scope.createNewTheme = createNewTheme;
	$scope.cancelThemeCostumization = cancelThemeCostumization;
	$scope.newThemeCreation = false;
	$scope.equalsThemes = equalsThemes;
	$scope.groupThemes = groupThemes;
	$scope.editTheme = editTheme;
	$scope.updateTheme = updateTheme;
	$scope.styleProps = [
		'invert_color',
		'background_color',
		'color',
		'border_color',
		'background_image',
		'border_width',
		'border_color',
	];
	$scope.$watch(function() {
		return $scope.$parent.dashboard;
	}, function(dashboard) {
		if(dashboard && dashboard.settings) {
			if (dashboard.settings.showCardFooters) {
				$scope.$parent.gridsterOpts.margins = [50,10];
			} else if(showCardFooters !== undefined) {
				$scope.$parent.gridsterOpts.margins = [10,10];
			}
		}
	});

	function findThemeByName(name, themes){
		for (var i = 0; i < themes.length; i++) {
			if(themes[i].name === name){
				return themes[i];
			}
		};
	}
	function createNewTheme() {
		$scope.newThemeCreation = true;
		$scope.dashboard.settings.newTheme = {
			group_id: $scope.$parent.selectedGroup._id,
		};
		$scope.dashboard.settings.newTheme.data = {};
		for(var style in $scope.styleProps){
			var prop = $scope.styleProps[style];
			if(prop === 'color'){
				$scope.dashboard.settings.newTheme.data[prop] = $scope.dashboard.settings.theme.data[prop] || 'black';
			} else {
				$scope.dashboard.settings.newTheme.data[prop] = $scope.dashboard.settings.theme.data[prop];
			}
		}
	}
	function equalsThemes(newTheme, theme) {
		if(newTheme.data){
			for(var key in newTheme.data){
				if(newTheme.data[key] !== theme.data[key]){
					return false;
				}
			}
		}
		return true;
	}
	function cancelThemeCostumization() {
		$scope.newThemeCreation = false; 
		$scope.themeUpdation = false;
		$scope.dashboard.settings.newTheme = {};
	}
	function saveNewTheme() {
		console.log('new theme has been saved');
		console.log($scope.dashboard.settings.newTheme);
		$scope.dashboard.settings.newTheme.type = "all";
		$scope.dashboard.settings.newTheme.core_theme = 'false';
		Themes.createTheme($scope.dashboard.settings.newTheme).then(function(res) {
			$scope.dashboard.settings.theme = res;
			$scope.themes.push(res);
			cancelThemeCostumization();
		})
	}
	function groupThemes(coreTheme) {
		if(coreTheme === 'true'){
			return 'Core Themes';
		} else {
			return 'Custom Themes';
		}
	}
	function editTheme() {
		$scope.themeUpdation = true;
		$scope.dashboard.settings.newTheme =  _.clone( $scope.dashboard.settings.theme, true);
	}
	function updateTheme() {
		console.log('theme has been saved');
		console.log($scope.dashboard.settings.newTheme);
		$scope.dashboard.settings.newTheme.type = "all";
		$scope.dashboard.settings.newTheme.core_theme = 'false';
		Themes.themeUpdate($scope.dashboard.settings.newTheme).then(function(res) {
			$scope.dashboard.settings.theme =  _.clone( $scope.dashboard.settings.newTheme, true);
			$scope.themes = updateThemesArrayAfterThemeUpdate($scope.dashboard.settings.newTheme, $scope.themes);
			cancelThemeCostumization();
		})
	}
	function updateThemesArrayAfterThemeUpdate(updatedTheme, themes){
		for (var i = 0; i < themes.length; i++) {
			if(themes[i]._id === updatedTheme._id){
				themes[i] = _.clone( updatedTheme, true);
			}
		};
		return themes;
	}
});