package controllers

import scala.concurrent.Future
import org.pigsaw.ccpm._
import org.scalatest.MustMatchers
import org.scalatestplus.play.PlaySpec
import play.api.libs.json._
import play.api.mvc.Controller
import play.api.mvc.Result
import play.api.mvc.Results
import play.api.test.FakeRequest
import play.api.test.Helpers.contentAsString
import play.api.test.Helpers.defaultAwaitTimeout

class PlanTest extends PlaySpec with MustMatchers with Results {

  class TestApplication extends Application with Controller

  "Some method" must {
    "be able to product a JSON result" in {
      val obj = Json.parse("""{ "greeting": "Hello, world!" }""")
      (obj \ "greeting").as[String] must equal("Hello, world!")
    }
  }

  "Application.sample" must {
    "output a JSON object" in {
      val app = new TestApplication
      val result: Future[Result] = app.sample.apply(FakeRequest())
      val bodyTest = contentAsString(result)
      val obj = Json.parse(bodyTest)
      (obj \\ "id")(0).as[String] must equal("t0")
    }
  }
  
  implicit val taskReads: Reads[Task] = {
    ( JsPath \ "id" ).read[String]
  } map { idName => Task(Symbol(idName)) }

  "Application.plan" must {
    
    "be able to generate a one-task plan - id only (1)" in {
      val p = new ScriptedPlan {
        add task 't0
      }
      val app = new TestApplication
      val json = app.jsonPlan(p)
      val tasks: Seq[Task] = (json \ "periods").validate[Seq[Task]].get
      tasks.length must equal (1)
      (tasks(0).id) must equal ( 't0 )
    }
    
    "be able to generate a one-task plan - id only (2 - to avoid faking)" in {
      val p = new ScriptedPlan {
        add task 't4
      }
      val app = new TestApplication
      val json = app.jsonPlan(p)
      val tasks: Seq[Task] = (json \ "periods").validate[Seq[Task]].get
      tasks.length must equal (1)
      (tasks(0).id) must equal ( 't4 )
    }
    
    "be able to generate a multi-task plan - ids only" in {
      val p = new ScriptedPlan {
        add task 't2
        add task 't4
        add task 't6
      }
      val app = new TestApplication
      val json = app.jsonPlan(p)
      val tasks: Seq[Task] = (json \ "periods").validate[Seq[Task]].get
      tasks.length must equal (3)
      (tasks map { _.id }) must contain theSameElementsAs (Seq('t2, 't4, 't6))
    }
    
    "be able to generate a multi-task plan - durations" in {
      val p = new ScriptedPlan {
        add task 't2 duration 22
        add task 't4 duration 44
        add task 't6 duration 66
      }
      val app = new TestApplication
      val json = app.jsonPlan(p)
      val tasks = (json \ "periods")
      val tasksArray = tasks.as[JsArray]
      val tasksSeq = tasksArray.value
      tasksSeq.length must equal (3)
      (tasksArray \\ "duration") map { _.as[Double] } must contain theSameElementsAs (Seq(22, 44, 66))
    }
    
    "be able to generate a multi-task plan - start times" in {
      val p = new ScriptedPlan {
        add task 't2 duration 22
        add task 't4 duration 44
        add task 't6 duration 66
        't2 ~> 't4 ~> 't6        
      }
      val app = new TestApplication
      val json = app.jsonPlan(p)
      val tasks = (json \ "periods")
      val tasksArray = tasks.as[JsArray]
      val tasksSeq = tasksArray.value
      tasksSeq.length must equal (3)
      val starts = (tasksSeq map { t => (t \ "id").as[String] -> (t \ "start").as[Double] }).toMap
      (starts("t2") + 22) must equal (starts("t4"))
      (starts("t4") + 44) must equal (starts("t6"))
    }
    
    "be work out start times from the buffered schedule" in {
      val p = new ScriptedPlan {
        add task 't1 duration 11
        add task 't2 duration 22
        add task 't3 duration 33
        't1 ~> 't3
        't2 ~> 't3
      }
      val app = new TestApplication
      val json = app.jsonPlan(p)
      val tasks = (json \ "periods")
      val tasksArray = tasks.as[JsArray]
      val tasksSeq = tasksArray.value
      tasksSeq.length must equal (3)
      val starts = (tasksSeq map { t => (t \ "id").as[String] -> (t \ "start").as[Double] }).toMap
      (starts("t1") + 11) must be < (starts("t3"))
      (starts("t2") + 22) must equal (starts("t3"))
    }
  }
}