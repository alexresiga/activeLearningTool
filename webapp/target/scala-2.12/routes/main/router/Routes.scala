
// @GENERATOR:play-routes-compiler
// @SOURCE:/Users/alex/Downloads/fixed/webapp/conf/routes
// @DATE:Thu May 03 16:32:16 EEST 2018

package router

import play.core.routing._
import play.core.routing.HandlerInvokerFactory._

import play.api.mvc._

import _root_.controllers.Assets.Asset

class Routes(
  override val errorHandler: play.api.http.HttpErrorHandler, 
  // @LINE:7
  AnnotaurusController_1: controllers.AnnotaurusController,
  // @LINE:17
  Assets_0: controllers.Assets,
  val prefix: String
) extends GeneratedRouter {

   @javax.inject.Inject()
   def this(errorHandler: play.api.http.HttpErrorHandler,
    // @LINE:7
    AnnotaurusController_1: controllers.AnnotaurusController,
    // @LINE:17
    Assets_0: controllers.Assets
  ) = this(errorHandler, AnnotaurusController_1, Assets_0, "/")

  def withPrefix(prefix: String): Routes = {
    router.RoutesPrefix.setPrefix(prefix)
    new Routes(errorHandler, AnnotaurusController_1, Assets_0, prefix)
  }

  private[this] val defaultPrefix: String = {
    if (this.prefix.endsWith("/")) "" else "/"
  }

  def documentation = List(
    ("""GET""", this.prefix, """controllers.AnnotaurusController.index"""),
    ("""GET""", this.prefix + (if(this.prefix.endsWith("/")) "" else "/") + """allDocuments""", """controllers.AnnotaurusController.getAllDocuments(completed:String, keyword:Option[List[String]])"""),
    ("""GET""", this.prefix + (if(this.prefix.endsWith("/")) "" else "/") + """document""", """controllers.AnnotaurusController.getDocument(name:String)"""),
    ("""GET""", this.prefix + (if(this.prefix.endsWith("/")) "" else "/") + """login""", """controllers.AnnotaurusController.loginPage"""),
    ("""POST""", this.prefix + (if(this.prefix.endsWith("/")) "" else "/") + """login""", """controllers.AnnotaurusController.login(username:String, password:String)"""),
    ("""GET""", this.prefix + (if(this.prefix.endsWith("/")) "" else "/") + """labels-for-task""", """controllers.AnnotaurusController.labelsForTask"""),
    ("""POST""", this.prefix + (if(this.prefix.endsWith("/")) "" else "/") + """document""", """controllers.AnnotaurusController.updateDocument(name:String)"""),
    ("""GET""", this.prefix + (if(this.prefix.endsWith("/")) "" else "/") + """assets/""" + "$" + """file<.+>""", """controllers.Assets.at(file:String)"""),
    Nil
  ).foldLeft(List.empty[(String,String,String)]) { (s,e) => e.asInstanceOf[Any] match {
    case r @ (_,_,_) => s :+ r.asInstanceOf[(String,String,String)]
    case l => s ++ l.asInstanceOf[List[(String,String,String)]]
  }}


  // @LINE:7
  private[this] lazy val controllers_AnnotaurusController_index0_route = Route("GET",
    PathPattern(List(StaticPart(this.prefix)))
  )
  private[this] lazy val controllers_AnnotaurusController_index0_invoker = createInvoker(
    AnnotaurusController_1.index,
    play.api.routing.HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AnnotaurusController",
      "index",
      Nil,
      "GET",
      this.prefix + """""",
      """ An example controller showing a sample home page""",
      Seq()
    )
  )

  // @LINE:8
  private[this] lazy val controllers_AnnotaurusController_getAllDocuments1_route = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), StaticPart("allDocuments")))
  )
  private[this] lazy val controllers_AnnotaurusController_getAllDocuments1_invoker = createInvoker(
    AnnotaurusController_1.getAllDocuments(fakeValue[String], fakeValue[Option[List[String]]]),
    play.api.routing.HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AnnotaurusController",
      "getAllDocuments",
      Seq(classOf[String], classOf[Option[List[String]]]),
      "GET",
      this.prefix + """allDocuments""",
      """""",
      Seq()
    )
  )

  // @LINE:9
  private[this] lazy val controllers_AnnotaurusController_getDocument2_route = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), StaticPart("document")))
  )
  private[this] lazy val controllers_AnnotaurusController_getDocument2_invoker = createInvoker(
    AnnotaurusController_1.getDocument(fakeValue[String]),
    play.api.routing.HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AnnotaurusController",
      "getDocument",
      Seq(classOf[String]),
      "GET",
      this.prefix + """document""",
      """""",
      Seq()
    )
  )

  // @LINE:10
  private[this] lazy val controllers_AnnotaurusController_loginPage3_route = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), StaticPart("login")))
  )
  private[this] lazy val controllers_AnnotaurusController_loginPage3_invoker = createInvoker(
    AnnotaurusController_1.loginPage,
    play.api.routing.HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AnnotaurusController",
      "loginPage",
      Nil,
      "GET",
      this.prefix + """login""",
      """""",
      Seq()
    )
  )

  // @LINE:11
  private[this] lazy val controllers_AnnotaurusController_login4_route = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), StaticPart("login")))
  )
  private[this] lazy val controllers_AnnotaurusController_login4_invoker = createInvoker(
    AnnotaurusController_1.login(fakeValue[String], fakeValue[String]),
    play.api.routing.HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AnnotaurusController",
      "login",
      Seq(classOf[String], classOf[String]),
      "POST",
      this.prefix + """login""",
      """""",
      Seq()
    )
  )

  // @LINE:13
  private[this] lazy val controllers_AnnotaurusController_labelsForTask5_route = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), StaticPart("labels-for-task")))
  )
  private[this] lazy val controllers_AnnotaurusController_labelsForTask5_invoker = createInvoker(
    AnnotaurusController_1.labelsForTask,
    play.api.routing.HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AnnotaurusController",
      "labelsForTask",
      Nil,
      "GET",
      this.prefix + """labels-for-task""",
      """ FIXME: If multiple tasks are to be supported, this should be rewritten to take a task ID""",
      Seq()
    )
  )

  // @LINE:14
  private[this] lazy val controllers_AnnotaurusController_updateDocument6_route = Route("POST",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), StaticPart("document")))
  )
  private[this] lazy val controllers_AnnotaurusController_updateDocument6_invoker = createInvoker(
    AnnotaurusController_1.updateDocument(fakeValue[String]),
    play.api.routing.HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.AnnotaurusController",
      "updateDocument",
      Seq(classOf[String]),
      "POST",
      this.prefix + """document""",
      """""",
      Seq()
    )
  )

  // @LINE:17
  private[this] lazy val controllers_Assets_at7_route = Route("GET",
    PathPattern(List(StaticPart(this.prefix), StaticPart(this.defaultPrefix), StaticPart("assets/"), DynamicPart("file", """.+""",false)))
  )
  private[this] lazy val controllers_Assets_at7_invoker = createInvoker(
    Assets_0.at(fakeValue[String]),
    play.api.routing.HandlerDef(this.getClass.getClassLoader,
      "router",
      "controllers.Assets",
      "at",
      Seq(classOf[String]),
      "GET",
      this.prefix + """assets/""" + "$" + """file<.+>""",
      """ Map static resources from the /public folder to the /assets URL path""",
      Seq()
    )
  )


  def routes: PartialFunction[RequestHeader, Handler] = {
  
    // @LINE:7
    case controllers_AnnotaurusController_index0_route(params@_) =>
      call { 
        controllers_AnnotaurusController_index0_invoker.call(AnnotaurusController_1.index)
      }
  
    // @LINE:8
    case controllers_AnnotaurusController_getAllDocuments1_route(params@_) =>
      call(params.fromQuery[String]("completed", None), params.fromQuery[Option[List[String]]]("keyword", None)) { (completed, keyword) =>
        controllers_AnnotaurusController_getAllDocuments1_invoker.call(AnnotaurusController_1.getAllDocuments(completed, keyword))
      }
  
    // @LINE:9
    case controllers_AnnotaurusController_getDocument2_route(params@_) =>
      call(params.fromQuery[String]("name", None)) { (name) =>
        controllers_AnnotaurusController_getDocument2_invoker.call(AnnotaurusController_1.getDocument(name))
      }
  
    // @LINE:10
    case controllers_AnnotaurusController_loginPage3_route(params@_) =>
      call { 
        controllers_AnnotaurusController_loginPage3_invoker.call(AnnotaurusController_1.loginPage)
      }
  
    // @LINE:11
    case controllers_AnnotaurusController_login4_route(params@_) =>
      call(params.fromQuery[String]("username", None), params.fromQuery[String]("password", None)) { (username, password) =>
        controllers_AnnotaurusController_login4_invoker.call(AnnotaurusController_1.login(username, password))
      }
  
    // @LINE:13
    case controllers_AnnotaurusController_labelsForTask5_route(params@_) =>
      call { 
        controllers_AnnotaurusController_labelsForTask5_invoker.call(AnnotaurusController_1.labelsForTask)
      }
  
    // @LINE:14
    case controllers_AnnotaurusController_updateDocument6_route(params@_) =>
      call(params.fromQuery[String]("name", None)) { (name) =>
        controllers_AnnotaurusController_updateDocument6_invoker.call(AnnotaurusController_1.updateDocument(name))
      }
  
    // @LINE:17
    case controllers_Assets_at7_route(params@_) =>
      call(params.fromPath[String]("file", None)) { (file) =>
        controllers_Assets_at7_invoker.call(Assets_0.at(file))
      }
  }
}
