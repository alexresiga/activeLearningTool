
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

object index extends _root_.play.twirl.api.BaseScalaTemplate[play.twirl.api.HtmlFormat.Appendable,_root_.play.twirl.api.Format[play.twirl.api.HtmlFormat.Appendable]](play.twirl.api.HtmlFormat) with _root_.play.twirl.api.Template0[play.twirl.api.HtmlFormat.Appendable] {

  /**/
  def apply():play.twirl.api.HtmlFormat.Appendable = {
    _display_ {
      {


Seq[Any](format.raw/*1.1*/("""<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Annotaurus</title>
    <meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' name='viewport'/>
    <!--     Fonts and icons     -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
    <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700"/>
    <!-- CSS Files -->
    <!-- vendor.min includes all themes, etc. -->
    <link rel="stylesheet" href="assets/ui/css/vendor.min.css">
    <link rel="stylesheet" href="assets/ui/css/app.min.css">
    <!--   Core JS Files   -->
    <script src="assets/ui/js/bundle.min.js" type="text/javascript"></script>
</head>
<body>
<!-- Modal -->
<div class="modal fade" id="HelpModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
     aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header content text-center">
                <h5> Keyboard Shortcuts</h5>
            </div>
            <div class="modal-body content" style="text-align: left;padding-left: 35%;">
                <p> ► &nbsp;&nbsp; Load next document </p>
                <p> ◄ &nbsp;&nbsp; Load previous document</p>
                <p> V &nbsp;&nbsp; Validate current document</p>
                <p> W &nbsp;&nbsp; Mark current item for review </p>
            </div>
            <div class="content text-center">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>
<div class="row">
    <div id="left" class="col-xs-3">
        <div class="content" id="toolname">
            <div>
                <i class="fa fa-user" style="cursor: default;"></i>&nbsp;<span id="user"></span>&nbsp;
                <button id="log-out"
                        style="font-size:0.9em ;border: 1px solid #1F3249;border-radius:5px;background-color: #1F3249;margin-bottom:5px;">
                    <i class="fa fa-sign-out-alt" style="color:white;"></i> log out
                </button>
            </div>
            <div style="float: right;position:absolute;top:15px;right: 10px;"><i class="fa fa-question-circle"></i></div>
        </div>

        <br>

        <div class="parent content">
            <div id="task">Task</div>
            <div id="dropdown" class="dropdown">
                <div href="#" id="dropdown-button" class="btn-simple dropdown-toggle"
                   style="padding:7px 10px!important;">
                    Multi-label classification
                    <b class="caret"></b>
                </div>
                <ul class="dropdown-menu">
                    <li><a href="#">Multi-label classification </a></li>
                    <!--<li class="divider"></li>                        -->
                    <!--<li><a href="#">Named entity annotation </a></li>-->
                    <!--<li class="divider"></li>                        -->
                    <!--<li><a href="#">Relation annotation </a></li>    -->
                </ul>
            </div>
        </div>

        <div id="buttons" class="content">
            <div id="view" class="content" style="display:inline-block!important;left:0;margin-right:10px;">View</div>
            <button id="all" class="btn btn-white">All</button>
            <button id="incomplete" class="btn btn-white" style="background-color:#4D6A8A;color:white">Incomplete
            </button>
            <button id="complete" class="btn btn-white" style="background-color:#4D6A8A;color:white">Complete</button>
        </div>
        <div class="form-group label-floating">
            <label class="control-label" style="color:white!important">Search</label>
            <input id="search-bar" name="p" type="search" class="form-control"> <!-- style="color:white!important"> -->
        </div>
        <div style="overflow:auto;height:15%;margin-top: 5px;">
            <div style="white-space:nowrap;">
                <div class="content" style="display:inline-block;">Current search</div>
                <button id="clear-all" class="content text-center"
                        style="font-size:0.9em ;position:absolute;right:15px;display:inline-block;border: 3px solid #2B7CC9;border-radius:7px;background-color: #2B7CC9;">
                    <i class="fa fa-times" style="color:white;"></i> clear search
                </button>
                <br></div>
            <div id="search-history"></div>
        </div>
        <div id="documentName">
        </div>
        <div id="statistics" style="margin-bottom: 10px;">
            Statistics
        </div>
        <div style="white-space:nowrap">
            <div style="display:inline-block;height:15px;width:222px;">
                <div id="pbar" class="progress progress-line-primary">
                    <div id="bar" class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0"
                         aria-valuemax="100" style="width: 0%;"><span class="sr-only">30% Complete</span></div>
                </div>
            </div>
            <div id="percentage" class="content text-center"
                 style="display:inline-block;margin-left:15px;margin-bottom:15px!important;">
            </div>
        </div>
        <div style="white-space:nowrap">
            <div style="display:inline-block;height:15px;width:222px;">
                <div id="pbar" class="progress progress-line-primary">
                    <div id="bar-list" class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0"
                         aria-valuemax="100" style="width: 0%;"><span class="sr-only">30% Complete</span></div>
                </div>
            </div>
            <div id="percentage-list" class="content text-center"
                 style="display:inline-block;margin-left:15px;margin-bottom:15px!important;">
            </div>
        </div>
        <div id="history">
            History
        </div>
        <div id="historyList" class="content" style="overflow:auto;height:28%;margin-top: 5px;">

        </div>
    </div>
    <div id="center-main" class="col-xs-6">
        <div class="row">
            <div id="center" class="col-xs-12">
                <div id="title" class="content text-center" style="font-weight: bold;"></div>
                <div id="authors" class="content text-center" style="white-space: nowrap">

                </div>
                <p id="abstractHeader" style="font-weight: bold;"><br><br>ABSTRACT<br><br></p>
                <div id="abstract" class="content"></div>
                <p id="contentHeader" style="font-weight: bold;"><br><br>CONTENT<br><br></p>
                <div id="content" class="content" style="white-space: pre-line"></div>
            </div>
            <div id="center-below" class="col-xs-12 content" style="padding: 5px 0 5px 0!important;text-align:left;">
                <div style="width: 100%;background-image: url('assets/ui/img/buttons_bottom.png'); background-size: 100% 95%;background-repeat:no-repeat;position: absolute;height: 75px;">
                    <div style="position:relative; width:31%; float: left;text-align: center;">
                        <img class="image" id="arrow-left" src="assets/ui/img/arrow_bottom_left.png"
                             style="position:relative;top:10px;margin-left:5px;">
                        <img class="image" id="arrow-right" src="assets/ui/img/arrow_bottom_right.png"
                             style="position:relative;top:10px;margin-left:39px;">
                    </div>
                    <div style="position:relative; width:28%; float: left;text-align: center;">
                        <img class="image" id="validate" src="assets/ui/img/bottom_check.png"
                             style="position:relative;top:10px;margin-left:1px;">
                        <img class="image" id="warning" src="assets/ui/img/bottom_exclamation.png"
                             style="position:relative;top:10px;margin-left:25px;">
                    </div>
                    <div style="position:relative; width:41%; float:left;text-align: center;">
                        <img class="image" src="assets/ui/img/arrow_bottom_back.png"
                             style="position:relative;top:10px;margin-left:5px;opacity: 0.3;cursor: default;transform: none;">
                        <img id="default-labels" class="image" src="assets/ui/img/arrow_bottom_back2.png"
                             style="position:relative;top:10px;margin-left:15px;">
                        <img class="image" src="assets/ui/img/arrow_bottom_forward.png"
                             style="position:relative;top:10px;margin-left:25px;opacity: 0.3;cursor: default;transform: none;">
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="right" class="col-xs-3">
        <div class="title-right content" style="white-space:nowrap">
            <div style="display:inline-block">ANNOTATIONS</div>
            <button id="clear-all-labels" class="content text-center"
                    style="font-size:0.8em ;position:absolute;right:15px;display:inline-block;border: 3px solid #2B7CC9;border-radius:7px;background-color: #2B7CC9;">
                <i class="fa fa-times" style="color:white;"></i> clear annotations
            </button>
        </div>
        <div class="radio">
            <label id="irrelevant">
                <input type="radio" id="irrelevantInput" name="optionsRadios">
                <div style="background-color: #962d07;color: #ffffff; border-radius: 4px;padding: 3px;">Irrelevant</div>
            </label>
        </div>
        <div class="radio">
            <label id="relevant">
                <input type="radio" id="relevantInput" name="optionsRadios">
                <div style="background-color: green;color: #ffffff; border-radius: 4px;padding: 3px;">Relevant</div>
            </label>
        </div>
        <div id="annotations" style="overflow:auto;height: 81%;"></div>
    </div>
</div>
</body>
</html>"""))
      }
    }
  }

  def render(): play.twirl.api.HtmlFormat.Appendable = apply()

  def f:(() => play.twirl.api.HtmlFormat.Appendable) = () => apply()

  def ref: this.type = this

}


              /*
                  -- GENERATED --
                  DATE: Thu May 03 17:41:51 EEST 2018
                  SOURCE: /Users/alex/Downloads/fixed/webapp/app/views/index.scala.html
                  HASH: 86acc44f2cbbbebf3d7dd0af62fe3301c15013dd
                  MATRIX: 811->0
                  LINES: 26->1
                  -- GENERATED --
              */
          