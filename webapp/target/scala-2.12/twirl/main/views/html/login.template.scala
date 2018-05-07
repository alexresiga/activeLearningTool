
package views.html

import _root_.play.twirl.api.TwirlFeatureImports._
import _root_.play.twirl.api.TwirlHelperImports._
import _root_.play.twirl.api.Html
import _root_.play.twirl.api.JavaScript
import _root_.play.twirl.api.Txt
import _root_.play.twirl.api.Xml
import models._
import controllers._
import play.api.i18n._
import views.html._
import play.api.templates.PlayMagic._
import play.api.mvc._
import play.api.data._

object login extends _root_.play.twirl.api.BaseScalaTemplate[play.twirl.api.HtmlFormat.Appendable,_root_.play.twirl.api.Format[play.twirl.api.HtmlFormat.Appendable]](play.twirl.api.HtmlFormat) with _root_.play.twirl.api.Template0[play.twirl.api.HtmlFormat.Appendable] {

  /**/
  def apply():play.twirl.api.HtmlFormat.Appendable = {
    _display_ {
      {


Seq[Any](format.raw/*1.1*/("""<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
    <title>Login - Annotaurus</title>
    <meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' name='viewport'/>
    <!--     Fonts and icons     -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
    <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700"/>
    <!-- CSS Files -->
        <!-- CSS Files -->
        <!-- vendor.min includes all themes, etc. -->
    <link rel="stylesheet" href="assets/ui/css/vendor.min.css">

    <style>
        body """),format.raw/*17.14*/("""{"""),format.raw/*17.15*/("""
            """),format.raw/*18.13*/("""background-color:#203348;
        """),format.raw/*19.9*/("""}"""),format.raw/*19.10*/("""
        """),format.raw/*20.9*/("""a:link """),format.raw/*20.16*/("""{"""),format.raw/*20.17*/("""
            """),format.raw/*21.13*/("""color: black;
        """),format.raw/*22.9*/("""}"""),format.raw/*22.10*/("""

        """),format.raw/*24.9*/("""/* visited link */
        a:visited """),format.raw/*25.19*/("""{"""),format.raw/*25.20*/("""
            """),format.raw/*26.13*/("""color: black;
        """),format.raw/*27.9*/("""}"""),format.raw/*27.10*/("""

        """),format.raw/*29.9*/("""/* mouse over link */
        a:hover """),format.raw/*30.17*/("""{"""),format.raw/*30.18*/("""
            """),format.raw/*31.13*/("""color: #203348 !important;
        """),format.raw/*32.9*/("""}"""),format.raw/*32.10*/("""

        """),format.raw/*34.9*/("""/* selected link */
        a:active """),format.raw/*35.18*/("""{"""),format.raw/*35.19*/("""
            """),format.raw/*36.13*/("""color: black;
        """),format.raw/*37.9*/("""}"""),format.raw/*37.10*/("""

        """),format.raw/*39.9*/(""".elements"""),format.raw/*39.18*/("""{"""),format.raw/*39.19*/("""
            """),format.raw/*40.13*/("""margin: 20px 5px;
        """),format.raw/*41.9*/("""}"""),format.raw/*41.10*/("""
    """),format.raw/*42.5*/("""</style>
</head>
<body>
<div >
    <div>
        <div class="container">
            <div class="row">
                <div class="container text-center" style="font-size:50px;color: white!important;top: 70px;height:100px;">Annotaurus
                </div>
                <div class="col-md-4 col-md-offset-4">
                    <div class="card card-signup">
                        <div name="myform" class="form" style="margin-bottom: 50px;">
                            <div class="content" style="padding: 20px 0;border-radius: 5px; background-color: white;">
                                <div class="elements">
                                    <input name="user" type="text" class="form-control" placeholder="User">
                                </div>
                                <div class="elements">
                                    <input name="password" type="password" class="form-control" placeholder="Password">
                                </div>
                                <div class=" text-center" style="margin-top: 30px;">
                                    <button id="login-button" type="submit" class="btn btn-simple">
                                        <a style="color:#203348">LOGIN</a>
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <p style="color: white; text-align: center">Version 0.9</p>
        </div>
        <footer class="footer">
            <div class="container">
                <nav class="pull-center">
                </nav>
            </div>
        </footer>
    </div>
</div>
</body>
    <script src="assets/ui/js/login.min.js" type="text/javascript"></script>
</html>
"""))
      }
    }
  }

  def render(): play.twirl.api.HtmlFormat.Appendable = apply()

  def f:(() => play.twirl.api.HtmlFormat.Appendable) = () => apply()

  def ref: this.type = this

}


              /*
                  -- GENERATED --
                  DATE: Thu May 03 17:30:19 EEST 2018
                  SOURCE: /Users/alex/Downloads/fixed/webapp/app/views/login.scala.html
                  HASH: 907c28f454aef4beab4dcf6d3e9f19c73fa0626e
                  MATRIX: 811->0|1563->724|1592->725|1633->738|1694->772|1723->773|1759->782|1794->789|1823->790|1864->803|1913->825|1942->826|1979->836|2044->873|2073->874|2114->887|2163->909|2192->910|2229->920|2295->958|2324->959|2365->972|2427->1007|2456->1008|2493->1018|2558->1055|2587->1056|2628->1069|2677->1091|2706->1092|2743->1102|2780->1111|2809->1112|2850->1125|2903->1151|2932->1152|2964->1157
                  LINES: 26->1|42->17|42->17|43->18|44->19|44->19|45->20|45->20|45->20|46->21|47->22|47->22|49->24|50->25|50->25|51->26|52->27|52->27|54->29|55->30|55->30|56->31|57->32|57->32|59->34|60->35|60->35|61->36|62->37|62->37|64->39|64->39|64->39|65->40|66->41|66->41|67->42
                  -- GENERATED --
              */
          