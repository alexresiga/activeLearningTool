name := "annotaurus-webapp"

libraryDependencies ++= {
  val luceneVersion = "7.2.1"
  Seq(
    guice,
    filters,
    "org.scalatestplus.play" %% "scalatestplus-play"     % "3.1.2" % Test,
    "com.pauldijou"          %% "jwt-play-json"          % "0.14.1",
    "org.apache.lucene"      % "lucene-core"             % luceneVersion,
    "org.apache.lucene"      % "lucene-analyzers-common" % luceneVersion,
    //"org.apache.lucene" % "lucene-join" % luceneVersion,
    "org.apache.lucene" % "lucene-queries"     % luceneVersion,
    "org.apache.lucene" % "lucene-queryparser" % luceneVersion,
    //"org.apache.lucene" % "lucene-highlighter" % luceneVersion
    "ai.lum" %% "common" % "0.0.8"
  )
}

PlayKeys.devSettings := Seq("play.akka.dev-mode.akka.http.parsing.max-uri-length" -> "20480")
libraryDependencies += filters
