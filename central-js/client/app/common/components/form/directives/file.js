angular.module('app').directive('fileField', function (ErrorsFactory) {
  return {
    require: 'ngModel',
    restrict: 'E',
    link: function (scope, element, attrs, ngModel) {
      var fileField = element.find('input');
      var oFile = scope.data.formData.params[ngModel.$name];
      var oFileField = {isNew:false};

      //for new upload service
      angular.forEach(scope.activitiForm.formProperties, function (item) {
        if(item.id === ngModel.$name && item.name.split(';').length === 3) {
          if(item.name.split(';')[2].indexOf("bNew=true") > -1) {
            oFileField = {
              id:item.id,
              isNew:true
            }
          }
        }
      });

      // for file in table
      if(!oFile && ngModel.$name) {
        function setFileInTable() {
          angular.forEach(scope.activitiForm.formProperties, function (prop) {
            if('aRow' in prop) {
              angular.forEach(prop.aRow, function (row) {
                angular.forEach(row.aField, function (field) {
                  if(ngModel.$name.indexOf(field.id) === 0){
                    oFile = field;
                    oFileField = {
                      id:field.id,
                      isNew:true
                    }
                  }
                })
              })
            }
          })
        } setFileInTable();

      }

      var nMaxFileSizeLimit = 10; // max upload file size = 10 MB
      var aAvailableFileExtensions = ["bmp", "gif", "jpeg", "jpg", "png", "tif", "doc", "docx", "odt", "rtf", "pdf"
        , "xls", "xlsx", "xlsm", "ods", "sxc", "wks", "csv", "zip", "rar", "7z", "p7s"];

      try {
        console.log('scope.data.formData.params[ngModel.$name].fileName=' + scope.data.formData.params[ngModel.$name].fileName);
        scope.data.formData.params[ngModel.$name].fileName = "123" + scope.data.formData.params[ngModel.$name].fileName;
        console.log('scope.data.formData.params[ngModel.$name].fileName(after)=' + scope.data.formData.params[ngModel.$name].fileName);
      } catch (_) {
        console.log('ERROR:scope.data.formData.params[ngModel.$name].fileName:' + _);
      }

      fileField.bind('change', function (event) {
        scope.$apply(function () {
          if (event.target.files && event.target.files.length > 0) {
            var aFilteredFiles = [];
            for(var nFileIndex = 0; nFileIndex < event.target.files.length; nFileIndex++){
              var sFileName = event.target.files[nFileIndex].name;
              var nFileSize = event.target.files[nFileIndex].size;
              var message = null;
              if (nFileSize > (nMaxFileSizeLimit * 1024 * 1024)){
                console.warn("File " + sFileName + " is very big for upload");
                message = "Розмір завантажуємого файлу " + sFileName + " " + (nFileSize / (1024 * 1024)).toFixed(1) + " МБайт перевищує допустимий.\n " +
                  "Для завантаження дозволяються файли розміром не більше " + nMaxFileSizeLimit + " МБайт.";
                ErrorsFactory.push({type:"warning", text: message});
              } else if (!verifyExtension(sFileName)) {
                console.warn("File " + sFileName + "is not supported");
                var extList = convertAvailableExtensionArrayToString();
                message = "Не підтримуємий тип файлу. Для завантаження допускаються файли лише наступних типів: " + extList;
                ErrorsFactory.push({type:"warning", text: message});
              } else {
                console.log("File " + sFileName + " validation successfully");
                aFilteredFiles.push(event.target.files[nFileIndex]);
              }
            }
            if(aFilteredFiles.length > 0){
              scope.switchProcessUploadingState();
              console.log("Start uploading " + aFilteredFiles.length + " file(s)");
              if(!oFile) {setFileInTable()}
              oFile.setFiles(aFilteredFiles);
              if(oFileField.isNew) {
                oFile.upload(scope.oServiceData, oFileField.id);
              } else {
                oFile.upload(scope.oServiceData);
              }
              console.log('ngModel.$name=' + ngModel.$name);
            }
          }
        });
      });

      function verifyExtension (sFileNameForCheck){
        var ext = sFileNameForCheck.split('.').pop().toLowerCase();
        for (var i = 0; i < aAvailableFileExtensions.length; i++){
          if (ext === aAvailableFileExtensions[i]){
            return true;
          }
        }
        return false;
      };

      function convertAvailableExtensionArrayToString (){
        var resultString = null;
        for(var i = 0; i < aAvailableFileExtensions.length; i++){
          if (i === 0){
            resultString = aAvailableFileExtensions[i];
            if (aAvailableFileExtensions.length > 1){
              resultString = resultString + ", ";
            } else {
              resultString = resultString + ".";
            }
          } else if (i === aAvailableFileExtensions.length - 1){
            resultString = resultString + aAvailableFileExtensions[i] + ".";
          } else {
            resultString = resultString + aAvailableFileExtensions[i] + ", ";
          }
        }
        return resultString;
      };

      fileField.bind('click', function (e) {
        e.stopPropagation();
      });
      element.bind('click', function (e) {
        e.preventDefault();
        fileField[0].click();
      });
    },
    // todo: Замінити цей темплейт на використування директиви buttonFileUpload
    template: '<p>' +
    ' <button type="button" ng-class="{\'btn-default\':item, \'btn-success\':!item}" class="btn" ng-disabled="isFileProcessUploading.bState">' +
    '  <span class="glyphicon glyphicon-file" aria-hidden="true"></span>' +
    '  <span ng-disabled="data.formData.params[property.id].isUploading">' +
    '   <span>{{item && item.value ? "Обрати iнший файл" : "Обрати файл"}}<span>' +
    '  </span>' +
    '  <span class="small-loading" ng-if="data.formData.params[property.id].isUploading"></span>' +
    '  <input type="file" style="display:none"  ng-disabled="isFileProcessUploading.bState">' +
    ' </button>' +
    ' <br ng-if="!item"/>' +
    ' <label style="word-break: break-word" ng-if="data.formData.params[property.id].value && !item || item && item.value">Файл: {{data.formData.params[property.id].fileName || item.fileName}}</label>' +
    ' <br/>' +
    ' <label ng-if="data.formData.params[property.id].value && data.formData.params[property.id].value.signInfo || item.value && item.signInfo"  class="form-control_"> ' +
    '    Підпис: {{data.formData.params[property.id].value.signInfo.name || item.signInfo.name}} ' +
    ' </label> ' +
    '</p>',
    replace: true,
    transclude: true
  };
});
