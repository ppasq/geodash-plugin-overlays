geodash.controllers.GeoDashControllerOverlays = function($scope, $element, $controller, $interpolate)
{
  angular.extend(this, $controller('GeoDashControllerBase', {$element: $element, $scope: $scope}));
  //
  var mainScope = $element.parents(".geodash-dashboard:first").isolateScope();
  $scope.dashboard = geodash.util.deepCopy(mainScope.dashboard);
  $scope.dashboard_flat = geodash.util.deepCopy(mainScope.dashboard_flat);
  $scope.state = geodash.util.deepCopy(mainScope.state);
  $scope.assets = geodash.util.arrayToObject(extract("assets", $scope.dashboard));
  //////////////

  $scope.imageURL = function(overlay)
  {
    if(angular.isString(extract("image.url", overlay)) && extract("image.url", overlay).length > 0)
    {
      return extract("image.url", overlay);
    }
    else if(angular.isDefined(extract("image.asset", overlay)) && extract("image.asset", overlay).length > 0 )
    {
      return extract([extract("image.asset", overlay), "url"], $scope.assets);
    }
    else
    {
      return "";
    }
  };

  $scope.class_overlay = function(overlay)
  {
    var str = "geodash-map-overlay";
    if(angular.isDefined(extract("intents", overlay)) || angular.isDefined(extract("intent", overlay)))
    {
      str += " geodash-intent";
    }
    return str;
  };

  $scope.style = function(type, overlay)
  {
    var styleMap = {};

    angular.extend(styleMap,{
      "top": extract("position.top", overlay, 'auto'),
      "bottom": extract("position.bottom", overlay, 'auto'),
      "left": extract("position.left", overlay, 'auto'),
      "right": extract("position.right", overlay, 'auto'),
      "width": extract("width", overlay, 'initial'),
      "height": extract("height", overlay, 'initial'),
      "padding": "0",
      "margin": "0",
      "background": "transparent",
      "opacity": "1.0"
    });

    if(type == "text")
    {
      angular.extend(styleMap, {
        "font-family": extract("text.font.family", overlay, 'Arial'),
        "font-size": extract("text.font.size", overlay, '12px'),
        "font-style": extract("text.font.style", overlay, 'normal'),
        "text-shadow": extract("text.shadow", overlay, 'none')
      });
    }
    else if(type == "image")
    {

    }

    if(angular.isDefined(extract("intents", overlay)) || angular.isDefined(extract("intent", overlay)))
    {
      angular.extend(styleMap, {
        "cursor": "pointer"
      });
    }

    if(angular.isDefined(extract("css.properties", overlay)))
    {
      angular.extend(styleMap, geodash.util.arrayToObject(extract("css.properties", overlay)));
    }

    return geodash.codec.formatCSS(styleMap);
  };

  $scope.intents = function(overlay)
  {
    var data = [];
    var intents = extract("intents", overlay);
    if(Array.isArray(intents))
    {
      for(var i = 0; i < intents.length; i++)
      {
        var intent = intents[i];
        var intentName = intent.name;
        if(angular.isDefined(intentName))
        {
          var intentProperties = intent.properties;
          if(angular.isDefined(intentProperties))
          {
            var intentData = geodash.util.arrayToObject(intentProperties, {'$interpolate': $interpolate, 'ctx': {'overlay': overlay}});
            data.push({ "name": intent.name, "data": intentData });
          }
          else
          {
            data.push({ "name": intent.name });
          }
        }
      }
    }
    return data;
  };

};
