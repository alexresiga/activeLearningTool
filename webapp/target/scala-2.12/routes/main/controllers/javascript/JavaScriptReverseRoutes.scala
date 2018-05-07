
// @GENERATOR:play-routes-compiler
// @SOURCE:/Users/alex/Downloads/fixed/webapp/conf/routes
// @DATE:Thu May 03 16:32:16 EEST 2018

import play.api.routing.JavaScriptReverseRoute


import _root_.controllers.Assets.Asset

// @LINE:7
package controllers.javascript {

  // @LINE:7
  class ReverseAnnotaurusController(_prefix: => String) {

    def _defaultPrefix: String = {
      if (_prefix.endsWith("/")) "" else "/"
    }

  
    // @LINE:8
    def getAllDocuments: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AnnotaurusController.getAllDocuments",
      """
        function(completed0,keyword1) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + "allDocuments" + _qS([(""" + implicitly[play.api.mvc.QueryStringBindable[String]].javascriptUnbind + """)("completed", completed0), (""" + implicitly[play.api.mvc.QueryStringBindable[Option[List[String]]]].javascriptUnbind + """)("keyword", keyword1)])})
        }
      """
    )
  
    // @LINE:11
    def login: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AnnotaurusController.login",
      """
        function(username0,password1) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + "login" + _qS([(""" + implicitly[play.api.mvc.QueryStringBindable[String]].javascriptUnbind + """)("username", username0), (""" + implicitly[play.api.mvc.QueryStringBindable[String]].javascriptUnbind + """)("password", password1)])})
        }
      """
    )
  
    // @LINE:9
    def getDocument: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AnnotaurusController.getDocument",
      """
        function(name0) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + "document" + _qS([(""" + implicitly[play.api.mvc.QueryStringBindable[String]].javascriptUnbind + """)("name", name0)])})
        }
      """
    )
  
    // @LINE:14
    def updateDocument: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AnnotaurusController.updateDocument",
      """
        function(name0) {
          return _wA({method:"POST", url:"""" + _prefix + { _defaultPrefix } + """" + "document" + _qS([(""" + implicitly[play.api.mvc.QueryStringBindable[String]].javascriptUnbind + """)("name", name0)])})
        }
      """
    )
  
    // @LINE:10
    def loginPage: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AnnotaurusController.loginPage",
      """
        function() {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + "login"})
        }
      """
    )
  
    // @LINE:13
    def labelsForTask: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AnnotaurusController.labelsForTask",
      """
        function() {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + "labels-for-task"})
        }
      """
    )
  
    // @LINE:7
    def index: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.AnnotaurusController.index",
      """
        function() {
          return _wA({method:"GET", url:"""" + _prefix + """"})
        }
      """
    )
  
  }

  // @LINE:17
  class ReverseAssets(_prefix: => String) {

    def _defaultPrefix: String = {
      if (_prefix.endsWith("/")) "" else "/"
    }

  
    // @LINE:17
    def at: JavaScriptReverseRoute = JavaScriptReverseRoute(
      "controllers.Assets.at",
      """
        function(file0) {
          return _wA({method:"GET", url:"""" + _prefix + { _defaultPrefix } + """" + "assets/" + (""" + implicitly[play.api.mvc.PathBindable[String]].javascriptUnbind + """)("file", file0)})
        }
      """
    )
  
  }


}
