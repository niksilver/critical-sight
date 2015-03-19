package controllers

import scala.concurrent.Future

import org.pigsaw.ccpm.Plan
import org.pigsaw.ccpm.PlanVerbs
import org.pigsaw.ccpm.ScriptedPlan
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

  "Application.plan" must {
    
    "be able to generate a one-task plan - id only (1)" in {
      val p = new ScriptedPlan {
        add task 't0
      }
      val app = new TestApplication
      val json = app.jsonPlan(p)
      val tasks = (json \ "tasks")
      val tasksArray = tasks.as[JsArray]
      val tasksSeq = tasksArray.value
      tasksSeq.length must equal (1)
      (tasksSeq(0) \ "id").as[String] must equal ("t0")
    }
    
    "be able to generate a one-task plan - id only (2 - to avoid faking)" in {
      val p = new ScriptedPlan {
        add task 't4
      }
      val app = new TestApplication
      val json = app.jsonPlan(p)
      val tasks = (json \ "tasks")
      val tasksArray = tasks.as[JsArray]
      val tasksSeq = tasksArray.value
      tasksSeq.length must equal (1)
      (tasksSeq(0) \ "id").as[String] must equal ("t4")
    }
    
    "be able to generate a multi-task plan - ids only" in {
      val p = new ScriptedPlan {
        add task 't2
        add task 't4
        add task 't6
      }
      val app = new TestApplication
      val json = app.jsonPlan(p)
      val tasks = (json \ "tasks")
      val tasksArray = tasks.as[JsArray]
      val tasksSeq = tasksArray.value
      tasksSeq.length must equal (3)
      (tasksArray \\ "id") map { _.as[String] } must contain theSameElementsAs (Seq("t2", "t4", "t6"))
    }
  }
}