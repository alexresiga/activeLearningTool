package controllers

import javax.inject._
import play.api._
import play.api.mvc._

import com.typesafe.config.ConfigFactory

import scala.io.Source
import scala.concurrent._
import scala.util._
import play.api.libs.json._
import java.io.File
import java.nio.file.Files
import java.nio.file.attribute.BasicFileAttributes
import java.nio.charset.StandardCharsets
import ai.lum.common.FileUtils._
import ai.lum.common.ConfigUtils._
import pdi.jwt.JwtJson
import play.api.mvc.Results._
import org.apache.lucene.analysis.standard.StandardAnalyzer
import org.apache.lucene.document.Document
import org.apache.lucene.document.Field
import org.apache.lucene.document.StringField
import org.apache.lucene.document.TextField
import org.apache.lucene.index.DirectoryReader
import org.apache.lucene.index.IndexWriter
import org.apache.lucene.index.IndexWriterConfig
//import org.apache.lucene.queryparser.classic.ParseException
import org.apache.lucene.queryparser.classic.QueryParser
import org.apache.lucene.search.IndexSearcher
import org.apache.lucene.search.Query
import org.apache.lucene.search.ScoreDoc
import org.apache.lucene.search.TopDocs
import org.apache.lucene.store.FSDirectory


@Singleton
class AnnotaurusController @Inject()(
  authAction: AuthAction,
  cc: ControllerComponents
) (implicit ex: ExecutionContext) extends AbstractController(cc) {

  val config = ConfigFactory.load()

  val usersJsonFile: File = config[File]("annotaurus.usersFile")
  // file containing annotation schema
  val annotationsJsonFile: File = config[File]("annotaurus.annotationsFile")

  val users: List[JsValue] = (Json.parse(usersJsonFile.readString(StandardCharsets.UTF_8)) \ "users").as[List[JsValue]]
  val analyzer = new StandardAnalyzer()

  // build map of userDirectory -> docs
  //val userDocuments: Map[String, Map[String, Int]] = Map.empty
  val userDocuments: Map[String, Map[String, Int]] = users.map { user =>
    val userFolder: String = (user \ "folder").as[String]
    val docsDir = new File(userFolder, "documents")
    if (!docsDir.exists) {
      println(s"${docsDir.getCanonicalPath} does not exist! Creating...")
      val _ = docsDir.mkdirs()
    }
    // filename -> index
    // check if folder exists
    val res: Map[String, Int] = {
      new File(userFolder, "documents")
        .listFilesByWildcard(wildcard = "*.json", recursive = true)
        .zipWithIndex
        .map { case (f: File, i: Int) => f.getName -> i }.toMap
    }
    userFolder -> res

  }.toMap.withDefaultValue(Map.empty[String, Int])

  // populate Lucene indices
  userDocuments.keys.foreach { userDirectory =>
    addDocFolder(userDirectory + File.separator + "documents")
  }

  def addDocFolder(folderPath: String): Unit = {
    val indexDir = new File(folderPath + File.separator + "index")
    val lastModifiedFile = new File(indexDir, "lastModified")
    val lastModifiedTime = if (lastModifiedFile.exists()) Source.fromFile(lastModifiedFile).mkString.toLong else 0L

    def needsUpdate(f: File): Boolean = {
      Files.readAttributes(f.toPath, classOf[BasicFileAttributes]).creationTime().toMillis > lastModifiedTime
    }

    Try {
      val index = FSDirectory.open(new File(folderPath + File.separator + "index").toPath)
      val config = new IndexWriterConfig(analyzer)
      val indexWriter = new IndexWriter(index, config)
      val dir = new File(folderPath)
      for {
        file <- dir.listFilesByWildcard(wildcard = "*.json", recursive = true)
        if needsUpdate(file)
      } {
        println(s"Adding file: ${file.getCanonicalPath}")
        addDoc(indexWriter, file)
      }
      Files.write(lastModifiedFile.toPath, System.currentTimeMillis().toString.getBytes(StandardCharsets.UTF_8))
      indexWriter.close()
    } match {
      case Success(s@_) => ()
      case Failure(e) =>
        println(s"Cannot write index to ${indexDir.getCanonicalPath}")
        println(e.getMessage)
    }
  }

  def addDoc(indexWriter: IndexWriter, file: File): Unit = if (file.exists) {
    val documentJson = Json.parse(Source.fromFile(file)("UTF-8").mkString)

    val doc = new Document()
    doc.add(new TextField("abstract", (documentJson \ "documentAbstract").as[String], Field.Store.YES))
    doc.add(new TextField("content", (documentJson \ "sections" \ 0 \ "content").as[String], Field.Store.YES))
     doc.add(new TextField("title", (documentJson \ "metadata" \ "title").as[String], Field.Store.YES))
    doc.add(new StringField("fileName", file.getName, Field.Store.YES))
    indexWriter.addDocument(doc)
  }

  def queryIndex(index: FSDirectory, keywordList: List[String]): List[String] = {
    val fields = Seq("title", "abstract", "content")
    val hasField = {s"^${fields.mkString("(", "|", ")")}:(.+)"}.r
    val keywordsWithFields = keywordList.map{
      case hasField(field, kw) => s"$field:$kw"
      case kw => fields.map{field => s"$field:$kw"}.mkString("(", " OR ", ")")
    }
    val queryString = keywordsWithFields.mkString(" AND ")

    val q: Query = new QueryParser("content", analyzer).parse(queryString)

    val reader = DirectoryReader.open(index)
    val searcher = new IndexSearcher(reader)
    val docs: TopDocs = searcher.search(q, 5000)
    val hits: List[ScoreDoc] = docs.scoreDocs.toList

    for (hit <- hits) yield searcher.doc(hit.doc).get("fileName")
  }

  // Checks to see if JWT is stored and valid
  def index: Action[AnyContent] = Action { request: Request[AnyContent] =>
    request.cookies.get("annotaurus-token") match {
      case None => Redirect("/login")
      case Some(cookie) =>
        val jwt = cookie.value
        print(s"jwt: $jwt")
        JwtJson.decode(jwt) match {
          case Failure(f@_) =>
            println("Invalid JWT!")
            Redirect("/login")
          case Success(claim) =>
            val userData = claim.content
            println(s"userData: $userData")
            Ok(views.html.index())
        }
    }
  }

  def loginPage = Action { request: Request[AnyContent] =>
    Ok(views.html.login())
  }

  def login(username: String, password: String): Action[AnyContent] = Action { implicit request: Request[AnyContent] =>
    users.find { user =>
      (user \ "username").as[String] == username && (user \ "password").as[String] == password
    } match {
      case Some(u) =>
        val claim = Json.obj(("username", username), ("folder", (u \ "folder").as[String]))
        val tok = JwtJson.encode(claim)
        Ok(tok)
      case None => Unauthorized
    }
  }

  // FIXME: This should be modified to take a task name if we are going to support multiple tasks
  /**
    * Returns labels associated with task
    */
  def labelsForTask: Action[AnyContent] = authAction { request: AuthenticatedRequest[AnyContent] =>
    Ok(Json.parse(annotationsJsonFile.readString(StandardCharsets.UTF_8)))
  }

  def getAllDocuments(completed: String, keyword: Option[List[String]]): Action[AnyContent] = authAction { request: AuthenticatedRequest[AnyContent] =>
    val allowed: Set[String] = Set("all", "true", "false")
    val kws = if (keyword.nonEmpty) keyword.get else Nil
    kws match {
      case badReq@_ if !(allowed contains completed) =>
        BadRequest(Json.obj("error" -> "'completed' parameter must be 'all', 'true', or 'false'"))
      case keywords =>
        Ok(makeDocumentsJson(request.folder, completed, keywords))
    }
  }

  /** Retrieves a document and its annotations */
  def getDocument(name: String): Action[AnyContent] = authAction { request: AuthenticatedRequest[AnyContent] =>
    val documentsFolder = new File(request.folder, "documents")

    // FIXME: how does this need to be sorted?
    val documentsFiles = documentsFolder.listFilesByWildcard(wildcard = "*.json", recursive = true).find(_.getName == name)
    documentsFiles match {
      case None =>
        NotFound(Json.obj("error" -> "Invalid id"))
      case Some(doc) =>
        println(s"Requested doc: ${doc.getName}")
        Ok(makeDocumentJson(request.folder, doc.getName))
    }
  }

  def updateDocument(name: String): Action[AnyContent] = authAction { request: AuthenticatedRequest[AnyContent] =>
    println("updateDocument!")
    // FIXME: how should this be sorted?
    val docOption = new File(request.folder, "documents").listFilesByWildcard(wildcard = "*.json", recursive = true).find(_.getName == name)

    docOption match {
      case None =>
        NotFound(Json.obj("error" -> "Invalid name"))
      case Some(doc) =>
        val annotationsPath = Seq(request.folder, "annotations", doc.getName).mkString(File.separator)

        request.body.asJson match {
          case Some(json) =>
            val res = Try {

              val annotationsJson = Json.obj(
                "completed" -> json("completed"),
                "relevant" -> json("relevant"),
                "warning" -> json("warning"),
                "annotations" -> json("annotations")
              )
              println(annotationsJson.toString)
              val outFile = new File(annotationsPath)
              val _= outFile.getParentFile.mkdirs()
              println(s"outFile: $outFile")
              outFile.writeString(Json.stringify(annotationsJson), StandardCharsets.UTF_8)
              Json.obj("result" -> "successful")
            }

            res match {
              case Success(msg) => Ok(msg)
              case Failure(_) => BadRequest(Json.obj("error" -> "Incomplete JSON request"))
            }

          case None => BadRequest(Json.obj("error" -> "Expecting 'application/json' request body"))
        }
    }
  }

  def makeDocumentJson(rootFolder: String, fileName: String): JsObject = {
    val filePath = Seq(rootFolder, "documents", fileName).mkString(File.separator)
    val annotationsPath = Seq(rootFolder, "annotations", fileName).mkString(File.separator)

    val documentJson = Json.parse(Source.fromFile(filePath).mkString)
    val annotationsJson = if (new File(annotationsPath).isFile) Json.parse(Source.fromFile(annotationsPath).mkString) else Json.obj()

    Json.obj(
      "document" -> documentJson,
      "annotations" -> annotationsJson
    )
  }


  def makeDocumentsJson(rootFolder: String, completed_type: String, keywords: List[String]): JsObject = {
    val indexDir = new File(rootFolder + File.separator + "documents" + File.separator + "index")
    // ensure directory exists
    val _ = indexDir.mkdirs()
    val index = FSDirectory.open(indexDir.toPath)

    val fileNames: List[String] = keywords match {
      case Nil => new File(rootFolder, "documents").listFilesByWildcard(wildcard = "*.json", recursive = true).map {
        _.getName
      }.toList
      case kws => queryIndex(index, kws)
    }

    val valid: Seq[JsValue] = for {
      file <- fileNames
      path = new File(rootFolder + File.separator + "documents" + File.separator + file)
      fileJson = Json.parse(path.readString("UTF-8"))
      completed = isCompleted(rootFolder, file)
      jsonObj = Json.obj("id" -> userDocuments(rootFolder)(file), "name" -> file, "completed" -> completed)
      if ((completed_type == "all") || (completed_type == "true" && completed) || (completed_type == "false" && !completed))
    } yield jsonObj

    Json.obj("documents" -> valid)
  }

  def isCompleted(rootFolder: String, fileName: String): Boolean = {
    val annotationsPath = Seq(rootFolder, "annotations", fileName).mkString(File.separator)
    if (!new File(annotationsPath).isFile) {
      false
    } else {
      val annotationsJson = Json.parse(Source.fromFile(annotationsPath).mkString)
      (annotationsJson \ "completed").as[String] == "true"
    }
  }
}

class AuthAction @Inject()(val parser: BodyParsers.Default)(
  implicit val executionContext: ExecutionContext
) extends ActionBuilder[AuthenticatedRequest, AnyContent] {

  // FIXME: should Failure return a redirect to login?
  def invokeBlock[A](request: Request[A], block: (AuthenticatedRequest[A]) => Future[Result]): Future[Result] = {
    val token = request.headers.get("Authorization")

    token match {
      case Some(tok) =>
        JwtJson.decodeJson(tok) match {
          case Success(json) => block(AuthenticatedRequest(folder = (json \ "folder").as[String], request = request))
          case Failure(_)    => Future(Unauthorized)
        }
      case None => Future(Unauthorized)
    }
  }
}

case class AuthenticatedRequest[A](folder: String, request: Request[A]) extends WrappedRequest[A](request)
