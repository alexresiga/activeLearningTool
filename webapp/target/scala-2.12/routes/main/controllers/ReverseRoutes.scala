
// @GENERATOR:play-routes-compiler
// @SOURCE:/Users/alex/Downloads/fixed/webapp/conf/routes
// @DATE:Thu May 03 16:32:16 EEST 2018

import play.api.mvc.Call


import _root_.controllers.Assets.Asset

// @LINE:7
package controllers {

  // @LINE:7
  class ReverseAnnotaurusController(_prefix: => String) {
    def _defaultPrefix: String = {
      if (_prefix.endsWith("/")) "" else "/"
    }

  
    // @LINE:8
    def getAllDocuments(completed:String, keyword:Option[List[String]]): Call = {
      
      Call("GET", _prefix + { _defaultPrefix } + "allDocuments" + play.core.routing.queryString(List(Some(implicitly[play.api.mvc.QueryStringBindable[String]].unbind("completed", completed)), Some(implicitly[play.api.mvc.QueryStringBindable[Option[List[String]]]].unbind("keyword", keyword)))))
    }
  
    // @LINE:11
    def login(username:String, password:String): Call = {
      
      Call("POST", _prefix + { _defaultPrefix } + "login" + play.core.routing.queryString(List(Some(implicitly[play.api.mvc.QueryStringBindable[String]].unbind("username", username)), Some(implicitly[play.api.mvc.QueryStringBindable[String]].unbind("password", password)))))
    }
  
    // @LINE:9
    def getDocument(name:String): Call = {
      
      Call("GET", _prefix + { _defaultPrefix } + "document" + play.core.routing.queryString(List(Some(implicitly[play.api.mvc.QueryStringBindable[String]].unbind("name", name)))))
    }
  
    // @LINE:14
    def updateDocument(name:String): Call = {
      
      Call("POST", _prefix + { _defaultPrefix } + "document" + play.core.routing.queryString(List(Some(implicitly[play.api.mvc.QueryStringBindable[String]].unbind("name", name)))))
    }
  
    // @LINE:10
    def loginPage(): Call = {
      
      Call("GET", _prefix + { _defaultPrefix } + "login")
    }
  
    // @LINE:13
    def labelsForTask(): Call = {
      
      Call("GET", _prefix + { _defaultPrefix } + "labels-for-task")
    }
  
    // @LINE:7
    def index(): Call = {
      
      Call("GET", _prefix)
    }
  
  }

  // @LINE:17
  class ReverseAssets(_prefix: => String) {
    def _defaultPrefix: String = {
      if (_prefix.endsWith("/")) "" else "/"
    }

  
    // @LINE:17
    def at(file:String): Call = {
      
      Call("GET", _prefix + { _defaultPrefix } + "assets/" + implicitly[play.api.mvc.PathBindable[String]].unbind("file", file))
    }
  
  }


}
