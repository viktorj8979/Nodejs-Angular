angular
	.module('datasources')
	.controller('DatasourceAddCtrl', function($scope, DataIntegrationService, Datasources, Accounts){
		/* list of data integrations */
		$scope.dataIntegrations = [];
		/* selected data integration */
		$scope.dataIntegration = {};
		/* list of accounts */
		$scope.accounts = [];
		/* selected account */
		$scope.account = {};
		/* is user come for replacing data */
		$scope.isReplaced = false;
		/* curr path to data stored on the server */
		// $scope.dataPath = '';
		$scope.replacingObj = {};
		/* selected accounts */
		$scope.selectedAccounts = [];
		$scope.selectDataIntegration = selectDataIntegration;
		$scope.selectAccount = selectAccount;
		$scope.getTransferButtonName = getTransferButtonName;

		$scope.files = null;
		$scope.message = 'Upload Files';
		$scope.loading = false;
		$scope.files = null;
		$scope.upload = upload;
		$scope.uploadSuccess = false;
		$scope.uploadError = false;
		$scope.uploadWarning = false;

		$scope.dropzoneConfig = {
	        parallelUploads: 3,
	        maxFileSize: 30,
	        url: 'path/to/api'
	    };

	    init();

	    function init() {
	    	getDataIntegrations();
	    	getAccounts();
	    	Datasources.setSelectingFunction(setReplacingInfo);
	    }

		function selectDataIntegration(dataIntegration) {
			$scope.dataIntegration = dataIntegration;
			getAccountsByDataIntegrationId(dataIntegration._id);

			$scope.isReplaced = false;
		}

		function selectAccount(account) {
			$scope.account = account;
		}

		function setReplacingInfo(data) {
			selectDataIntegration(data.dataIntegration);
			selectAccount(data.account);

			$scope.isReplaced = true;
			$scope.replacingObj.fileDataPath = data.data_path;
			$scope.replacingObj.account      = data.account;
		}

		/** get data integrations **/
		function getDataIntegrations() {
			DataIntegrationService.getDataIntegrations().then(function (integrations) {
				$scope.dataIntegrations = integrations;
			});
		}

		function saveDatasource(datsource) {
			DataIntegrationService.saveDatasource(datasource).then(function (datasource) {
				console.log(datasource);
			});
		}

		/** get accounts **/
		function getAccounts() {
			Accounts.getAccountsByGroupId($scope.$parent.selectedGroup._id).then(function (accounts) {
				$scope.accounts = accounts;
			});
		}

		/** get accounts by data integration id **/
		function getAccountsByDataIntegrationId(dataIntegrationId) {
			$scope.selectedAccounts = [];
			$scope.selectedAccounts = _.where($scope.accounts, { dataIntegrationId: dataIntegrationId });
		}

		/**
		 * @name upload
		 * @desc upload files
		 * On success, show number of charts and return them on close.
		 * On failure, show server error message.
		 */
		function upload(isNeedToReplace) {
			var file, account;

			disableAlerts();

			if($scope.files && $scope.files.length) {
				$scope.loading = true;

				if (isNeedToReplace) {
					oldFilePath = $scope.replacingObj.fileDataPath;
					account 	= $scope.replacingObj.account;

					Datasources
						.S3.replaceFile($scope.file, oldFilePath, account)
						.then(success, error);
				} else {
					Datasources
						.S3.uploadFiles($scope.files, $scope.account, $scope.$parent.selectedGroup)
						.then(success, error);
				}

			} else {
				$scope.message       = 'No File Selected';
				$scope.uploadWarning = true;
			}

			function success(response) {

				if (isNeedToReplace) {
					$scope.message = 'Your files were uploaded';
				} else {
					$scope.message = 'Your file ' + $scope.file['name'] + 'were successful replaced';
				}
				
				$scope.uploadSuccess = true;
				$scope.loading = false;
				$scope.files   = [];
				$scope.$parent.getDatasources();
			}

			function error(response) {
				var error;

				if (response.data) {
					error = response.data
				} else {
					error = response;
				}

				$scope.message = 'Server error '+ error.code + ': ' + error.message;
		        $scope.uploadError = true;
		        $scope.loading = false;
			}
		}


		/**
	      * @name getTransferButtonName
	      * @desc Determine the name of transfer button, it is upload or 
	     */
	    function getTransferButtonName(isNeedToReplace) {
	    	return isNeedToReplace ? 'Replace' : 'Upload';
	    };


		/**
		 * @name disabledAlerts
		 * @desc disabled all alerts 
		 */
		function disableAlerts() {
			$scope.uploadSuccess = false;
			$scope.uploadError 	 = false;
			$scope.uploadWarning = false;
		}

});
