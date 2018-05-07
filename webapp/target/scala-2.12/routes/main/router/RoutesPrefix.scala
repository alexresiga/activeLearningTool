
// @GENERATOR:play-routes-compiler
// @SOURCE:/Users/alex/Downloads/fixed/webapp/conf/routes
// @DATE:Thu May 03 16:32:16 EEST 2018


package router {
  object RoutesPrefix {
    private var _prefix: String = "/"
    def setPrefix(p: String): Unit = {
      _prefix = p
    }
    def prefix: String = _prefix
    val byNamePrefix: Function0[String] = { () => prefix }
  }
}
