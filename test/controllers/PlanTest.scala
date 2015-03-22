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
  
  def typesMap(json: JsObject): Map[String, String] = {
    val typesList = for {
      period <- (json \ "periods").as[Seq[JsValue]]
      id = (period \ "id").as[String]
      start = (period \ "type").as[String]
    } yield (id -> start)
    typesList.toMap
  }
  
  def startsMap(json: JsObject): Map[String, Double] = {
    val startsList = for {
      period <- (json \ "periods").as[Seq[JsValue]]
      id = (period \ "id").as[String]
      start = (period \ "start").as[Double]
    } yield (id -> start)
    startsList.toMap
  }

  "Application.plan" must {
    
    "be able to generate a one-task plan - id only (1)" in {
      val p = new ScriptedPlan {
        add task 't0
      }
      val app = new TestApplication
      val json = app.jsonPlan(p)
      val ids = (JsPath \ "periods" \\ "id")(json) map ( _.as[String])
      ids.length must equal (2) // Includes completion buffer
      ids must contain ( "t0" )
    }
    
    "be able to generate a one-task plan - id only (2 - to avoid faking)" in {
      val p = new ScriptedPlan {
        add task 't4
      }
      val app = new TestApplication
      val json = app.jsonPlan(p)
      val ids = (JsPath \ "periods" \\ "id")(json) map ( _.as[String] )
      ids.length must equal (2) // Includes completion buffer
      ids must contain ( "t4" )
    }
    
    "be able to generate a multi-task plan - ids only" in {
      val p = new ScriptedPlan {
        add task 't2
        add task 't4
        add task 't6
      }
      val app = new TestApplication
      val json = app.jsonPlan(p)
      val ids = (JsPath \ "periods" \\ "id")(json) map ( _.as[String] )
      ids.length must equal (4) // Includes completion buffer
      ids must contain allOf ("t2", "t4", "t6")
    }
    
    "be able to generate a multi-task plan - durations" in {
      val p = new ScriptedPlan {
        add task 't2 duration 22
        add task 't4 duration 44
        add task 't6 duration 66
      }
      val app = new TestApplication
      val json = app.jsonPlan(p)
      val durs = (JsPath \ "periods" \\ "duration")(json) map ( _.as[Double] )
      durs must contain theSameElementsAs (Seq(22.0, 44.0, 66.0))
    }
    
    "be include the correct type for each period" in {
      val p = new ScriptedPlan {
        add task 't2 duration 22
        add task 't4 duration 44
        add task 't6 duration 66
      }
      val app = new TestApplication
      val json = app.jsonPlan(p)
      val types = typesMap(json)
      
      types.size must equal (4)
      types("t2") must equal ("task")
      types("t4") must equal ("task")
      types("t6") must equal ("task")
      
      // Work out the id of the buffer
      val bId = types.keys.filter( id => id != "t2" && id != "t4" && id != "t6").head
      
      types(bId) must equal ("buffer")
    }
    
    "be include a type for each period" in {
      val p = new ScriptedPlan {
        add task 't2 duration 22
        add task 't4 duration 44
        add task 't6 duration 66
      }
      val app = new TestApplication
      val json = app.jsonPlan(p)
      val types = (JsPath \ "periods" \\ "type")(json) map ( _.as[String] )
      types.size must equal (4)
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
      val starts = startsMap(json)
      starts.size must equal (4) // Includes completion buffer
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
      val starts = startsMap(json)
      starts.size must equal (4) // Includes completion buffer
      (starts("t1") + 11) must be < (starts("t3"))
      (starts("t2") + 22) must equal (starts("t3"))
    }
  }
}