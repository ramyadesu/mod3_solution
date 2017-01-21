(function (){
  'use strict';

  angular.module('NarrowItDownApp',[])
  .controller('NarrowItDownController',NarrowItDownController)
  .service('MenuListService',MenuListService)
  .directive('foundItems',FoundItems)
  .constant('UrlPath',"https://davids-restaurant.herokuapp.com");

function FoundItems(){
  var ddo = {
    templateUrl :'formItem.html'
  };
  return ddo;
}

NarrowItDownController.$inject = ['MenuListService'];

  function NarrowItDownController(MenuListService) {
    var menu = this;
    menu.searchText = "";
    menu.searchList = function () {
      var promise = MenuListService.getMenuList();
      promise.then(function(response){
      menu.items = MenuListService.getSearchList(response.data,menu.searchText);
    })
    .catch(function(error){
      console.log("Something went terribly wrong.");
    })
  };
  menu.removeItems = function(itemIndex){
    MenuListService.removeItem(itemIndex);
  };
}

MenuListService.$inject = ['$http','UrlPath'];
function MenuListService($http,UrlPath){
  var service = this;
  var items = [];

    service.addItem = function (iName,iShort,iDescription){
      var item = {
        short_name : iShort,
        name : iName,
        description : iDescription
      }
      items.push(item);
    };

    service.removeItem = function (itemIndex){
      items.splice(itemIndex,1);
    };

    service.getSearchList = function(rData,searchText){
      var list=rData.menu_items;
      items = [];
      if(searchText!=""){
        for(var i=0;i<list.length;i++){
          var desc = list[i].description;
          if(desc.includes(searchText)){
            service.addItem(list[i].name,list[i].short_name,list[i].description)
          }
        }
      }
      return items;
    };

    service.getMenuList = function (){
      var respose= $http({
        method:"GET",
        url : (UrlPath + "/menu_items.json")
      });
      return respose;
    };

  }

})();
