
// @GENERATOR:play-routes-compiler
// @SOURCE:/Users/alex/Downloads/fixed/webapp/conf/routes
// @DATE:Thu May 03 16:32:16 EEST 2018

package controllers;

import router.RoutesPrefix;

public class routes {
  
  public static final controllers.ReverseAnnotaurusController AnnotaurusController = new controllers.ReverseAnnotaurusController(RoutesPrefix.byNamePrefix());
  public static final controllers.ReverseAssets Assets = new controllers.ReverseAssets(RoutesPrefix.byNamePrefix());

  public static class javascript {
    
    public static final controllers.javascript.ReverseAnnotaurusController AnnotaurusController = new controllers.javascript.ReverseAnnotaurusController(RoutesPrefix.byNamePrefix());
    public static final controllers.javascript.ReverseAssets Assets = new controllers.javascript.ReverseAssets(RoutesPrefix.byNamePrefix());
  }

}
