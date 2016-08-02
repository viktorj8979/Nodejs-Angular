(function(){
'use strict';

angular
	.module('datasources')
	.factory('Datasources', Datasources);

	Datasources.$inject = ['$http', '$q'];

	/**
	 * @name Datasources
	 * @desc API for Datasources
	 * @memberOf Datasources
	 */
	function Datasources($http, $q) {
		var Datasources = {};

		/** 
		 * @name getDatasources
		 * @desc Get all datasources.
		 * @return {{JSON}} datasources, array of datasource objects.
		 */
		Datasources.getDatasources = function() {
			//return HearstAPI.getDashboards();

			return $http.get('/api/v1/datasources').then(function(response) {
				return response.data;
			});
		};

		/** 
		 * @name getDashboard
		 * @desc Get a datasource by id.
		 * @return {{JSON}} datasource, datasource object.
		 */
		Datasources.getDatasource = function(id) {
			//return HearstAPI.getDashboard(contentId);

			return $http.get('/api/v1/datasources/' + id).then(function(response) {
				return response.data;
			});
		};

		/** 
		 * @name saveDatasource
		 * @desc Save dataource
		 * @return {{JSON}} dataource, saved dataource object.
		 */
		Datasources.saveDatasource = function(obj) {
			return $http.post('/api/v1/datasources', obj).then(function(response) {
				return response.data;
			});
		};

		/** 
		 * @name updateDatasource
		 * @desc Update datasource
		 * @return {{JSON}} datasource, updated datasource object.
		 */
		Datasources.updateDatasource = function(obj) {
			return $http.put('/api/v1/datasources', obj).then(function(response) {
				return response.data;
			});
		};

		/** 
		 * @name deleteDatasources
		 * @desc Delete datasources by id.
		 * @params {{Array.Integers}} idArray, an array of datasource ids to be deleted.
		 */
		Datasources.deleteDatasources = function(idArray) {
			//return HearstAPI.deleteDashboards(idArray);
			return $http.delete('/api/v1/datasources/' + idArray).then(function(response) {
				return response.data;
			});
		};

        /**
         * selectDataIntegration
         * @desc Function that will be called for setting of user and datasource
         * @param dataintegration
         */
		Datasources.setReplacingInfo = null;

        /**
         * setSelectingFunction
         * @desc Setting of function that will be called in parent scope
         * @param callback
         */
		Datasources.setSelectingFunction = function (fn) {

			if (_.isFunction(fn) && !Datasources.setReplacingInfo) {
				Datasources.setReplacingInfo = fn;
			}
		};

		/** S3 Actions */
		Datasources.S3 = {};

		/** 
		 * @name uploadFiles
		 * @desc Upload files to AWS S3.
		 * @params {{file}} file, file object to be uploaded.
		 */
		Datasources.S3.uploadFiles = function(files, account, group) {
			// If multiple files
			if(files.length > 1) {	
		        var defer = $q.defer();
		        var promises = [];
		        angular.forEach(files, function(file) {
		            promises.push(Datasources.S3.uploadFile(file, account, group));
		        });
		        return $q.all(promises);
			} else {
				// If single file
				return Datasources.S3.uploadFile(files, account, group);
			}
      	};

      	/** 
		 * @name uploadFile
		 * @desc Upload file on AWS.
		 * @params {{file}} file, file object to be uploaded.
		 */
      	Datasources.S3.uploadFile = function(newFile, account, group) {
			AWS.config.update(account.credentials);
			var bucket = new AWS.S3({ params: { Bucket: account.credentials.bucket } });
		    var params = { 
		    	Key: newFile[0].name,
		    	ContentType: newFile[0].type,
		    	Body: newFile[0],
		    	ServerSideEncryption: 'AES256' 
		    };

		    var defer = $q.defer();

		    bucket.upload(params, function(err, data) {
		    	if(err) {
		    		defer.reject(err);
		    	} else {
		    		Datasources
		    			.saveDatasource(createDatasource(newFile, account, group))
		    			.then(function(response) {
		    				defer.resolve(response);
		    			});
			    	//defer.resolve(data);
			    }
		    });

		    return defer.promise;
      	};

      	/** 
		 * @name replaceFile
		 * @desc Replace file on AWS.
		 * @params {{file}} file, file object to be uploaded.
		 */
      	Datasources.S3.replaceFile = function(newFile, oldFilePath, account) {
			AWS.config.update(account.credentials);
			var bucket = new AWS.S3({ params: { Bucket: account.credentials.bucket } });
		    var params = { 
		    	Key: oldFilePath,
		    	ContentType: newFile.type,
		    	Body: newFile,
		    	ServerSideEncryption: 'AES256' 
		    };

		    var defer = $q.defer();

		    bucket.upload(params, function(err, data) {
		    	if(err) {
		    		defer.reject(err);
		    	} else {
			    	defer.resolve(data);
			    }
		    });

		    return defer.promise;
      	};

        /**
         * Get content of the CSV file.
         * @param params
         * @param callback
         */

        Datasources.S3.getFileData = function (csv, callback) {
            AWS.config.update(csv.account.credentials);

            var s3 = new AWS.S3();
            var params = {
                Bucket: csv.account.credentials.bucket,
                Key: csv.data_path,
                ResponseContentType: 'text/csv'
            };
            s3.getObject(params, callback);
        };

        // format the csv columns.
		Datasources.formatColumnData = function(csv, datasource_id) {
			var columns = [];
			_.each(csv[0], function(value, key) {
			  var column = {};
			  var newKey = key.toLowerCase().replace(/ /g,'');
			  column['key'] = newKey;
			  column['name'] = key;
			  column['numeric'] = checkNumeric(value);
			  columns.push(column);
			});
			return columns;
		};

		// format the csv rows.
		Datasources.formatRowData = function(csv) {
			var rows = [];
			_.each(csv, function(value) {
			  var row = {};
			  for (var key in value) {
			    var newKey = key.toLowerCase().replace(/ /g,'');
			    row[newKey] = formatNumeric(value[key]);
			  }
			  rows.push(row);
			});
			return rows;
		};

		// Format value if it is numeric.
		function formatNumeric(value) {
			if (!isNaN(value) && !isNaN(parseFloat(value))) {
			  return parseFloat(value);
			} else {
			  return value;
			}
		}

		// Check if value is numeric.
		function checkNumeric(value) {
			if (isNaN(value)) {
			  return false;
			} else {
			  return true;
			}
		}

		return Datasources;
	}

	function createDatasource(file, account, group) {
		var datasource = {
			  title: file[0].name,
			  data_format: file[0].type,
			  data_location: "http://" + account.credentials.bucket + ".s3.amazonaws.com/" + file[0].name,
			  data_path: file[0].name,
			  dataIntegrationId: account.dataIntegrationId,
			  accountId: account._id,
			  groups: [
			    {
			      _id: group._id,
			      permission_id: 0
			    }
			  ]
		};

		return datasource;
	}

})();