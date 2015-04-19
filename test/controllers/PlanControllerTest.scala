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
import play.mvc.Http.Response
import play.mvc.SimpleResult

class PlanTest extends PlaySpec with MustMatchers with Results {

  class TestPlanController extends PlanController with Controller

  def ids(json: JsObject): Seq[String] = {
    val ids = for {
      period <- (json \ "periods").as[Seq[JsValue]]
      id = (period \ "id").as[String]
    } yield id
    ids
  }
  
  def propertyMap[V](json: JsObject, prop: String, reads: Reads[V]): Map[String, V] = {
    val kvList = for {
      period <- (json \ "periods").as[Seq[JsValue]]
      id = (period \ "id").as[String]
      value = (period \ prop).as(reads)
    } yield (id -> value)
    kvList.toMap
  }
  
  def typesMap(json: JsObject): Map[String, String] = {
    propertyMap(json, "type", Reads.StringReads)
  }
  
  def startsMap(json: JsObject): Map[String, Double] = {
    propertyMap(json, "start", Reads.DoubleReads)
  }
  
  def durationsMap(json: JsObject): Map[String, Double] = {
    propertyMap(json, "duration", Reads.DoubleReads)
  }

  "PlanController.jsonPlan" must {
    
    "be able to generate a one-task plan - id only (1)" in {
      val p = new ScriptedPlan {
        add task 't0
      }
      val app = new TestPlanController
      val json = app.jsonPlan(p)
      val ids = (JsPath \ "periods" \\ "id")(json) map ( _.as[String])
      ids.length must equal (2) // Includes completion buffer
      ids must contain ( "t0" )
    }
    
    "be able to generate a one-task plan - id only (2 - to avoid faking)" in {
      val p = new ScriptedPlan {
        add task 't4
      }
      val app = new TestPlanController
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
      val app = new TestPlanController
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
      val app = new TestPlanController
      val json = app.jsonPlan(p)
      val durs = (JsPath \ "periods" \\ "duration")(json) map ( _.as[Double] )
      durs must contain (22.0)
      durs must contain (44.0)
      durs must contain (66.0)
    }
    
    "include the correct type for each period" in {
      val p = new ScriptedPlan {
        add task 't2 duration 22
        add task 't4 duration 44
        add task 't6 duration 66
      }
      val app = new TestPlanController
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
    
    "include a type for each period" in {
      val p = new ScriptedPlan {
        add task 't2 duration 22
        add task 't4 duration 44
        add task 't6 duration 66
      }
      val app = new TestPlanController
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
      val app = new TestPlanController
      val json = app.jsonPlan(p)
      val starts = startsMap(json)
      starts.size must equal (4) // Includes completion buffer
      (starts("t2") + 22) must equal (starts("t4"))
      (starts("t4") + 44) must equal (starts("t6"))
    }
    
    "return the tasks in order, if they were given in order" in {
      val strIds = (0 to 99) map { "t" + _ }
      val ts = strIds map { s => Task(Symbol(s)) }
      val p = new Plan {
        val tasks = ts
        val dependencies = Set[(Task,Task)]()
      }
      val app = new TestPlanController
      val json = app.jsonPlan(p)
      val types = typesMap(json)
      val jsonTaskIds = ids(json) filter ( types(_) == "task" )
      jsonTaskIds must contain theSameElementsInOrderAs (strIds)
    }
    
    "work out start times from the buffered schedule" in {
      val p = new ScriptedPlan {
        add task 't1 duration 11
        add task 't2 duration 22
        add task 't3 duration 33
        't1 ~> 't3
        't2 ~> 't3
      }
      val app = new TestPlanController
      val json = app.jsonPlan(p)
      val starts = startsMap(json)
      starts.size must equal (5) // Includes completion buffer and feeder buffer
      (starts("t1") + 11) must be < (starts("t3"))
      (starts("t2") + 22) must equal (starts("t3"))
    }
    
    "include a proper id for the completion buffer" in {
      // The completion buffer id is automatically generated, so
      // to test we haven't got a stub value in there we'll make
      // plan, get the completion buffer id, then make another plan
      // with task that has that id and get *that* completion
      // buffer id. They should be different.

      val app = new TestPlanController()
      
      val p1 = new ScriptedPlan {
        add task 't0
      }
      val p1CpId = p1.completionBuffer.id
      val json1 = app.jsonPlan(p1)
      val json1CpId = (ids(json1) find { _ != "t0" }).get
      
      json1CpId must equal (p1CpId.name)
      
      val p2 = new ScriptedPlan {
        add task p1CpId
      }
      val p2CpId = p2.completionBuffer.id
      val json2 = app.jsonPlan(p2)
      val json2CpId = (ids(json2) find { _ != p1CpId.name }).get
      
      p1CpId must not equal (p2CpId)
      json2CpId must equal (p2CpId.name)
    }
    
    "have the correct start for the completion buffer (1)" in {
      val p = new ScriptedPlan {
        add task 't0 duration 22
      }
      val app = new TestPlanController
      val json = app.jsonPlan(p)
      val starts = startsMap(json)
      val t0Start = starts("t0")
      val cpStart = (starts find { _._1 != "t0" }).get._2

      (cpStart) must equal (t0Start + 22)
    }
    
    "have the correct start for the completion buffer (2 - to avoid faking)" in {
      val p = new ScriptedPlan {
        add task 't0 duration 33
      }
      val app = new TestPlanController
      val json = app.jsonPlan(p)
      val starts = startsMap(json)
      val t0Start = starts("t0")
      val cpStart = (starts find { _._1 != "t0" }).get._2

      (cpStart) must equal (t0Start + 33)
    }
    
    "have duration for the completion buffer" in {
      val app = new TestPlanController()
      
      val p = new ScriptedPlan {
        add task 't0 duration 10
      }
      val json = app.jsonPlan(p)
      val jsonCpId = (ids(json) find { _ == p.completionBuffer.id.name }).get
      val jsonCpDur = durationsMap(json)(jsonCpId)
      
      jsonCpDur must be > (0.0)
    }
    
    "have duration for the completion buffer which is based on the project length" in {
      val app = new TestPlanController()
      
      val p1 = new ScriptedPlan {
        add task 't0 duration 10
      }
      val json1 = app.jsonPlan(p1)
      val json1CpId = (ids(json1) find { _ == p1.completionBuffer.id.name }).get
      val json1CpDur = durationsMap(json1)(json1CpId)
      
      val p2 = new ScriptedPlan {
        add task 't0 duration 11
      }
      val json2 = app.jsonPlan(p2)
      val json2CpId = (ids(json2) find { _ == p2.completionBuffer.id.name }).get
      val json2CpDur = durationsMap(json2)(json2CpId)
      
      json2CpDur must be > (json1CpDur)
    }
    
    "include an empty dependencies list if there are no task dependencies" in {
      val app = new TestPlanController()
      
      val p = new ScriptedPlan {}
      val json = app.jsonPlan(p)
      val deps = (json \ "dependencies").as[Seq[String]]
      
      deps must equal (Nil)
    }
    
    "include the correct dependencies list if there are some task dependencies" in {
      val app = new TestPlanController()
      
      val p = new ScriptedPlan {
        add task 't0
        add task 't1
        add task 't2
        't0 ~> 't1 ~> 't2
      }
      val cpName = p.completionBuffer.id.name
      val json = app.jsonPlan(p)
      val deps = (json \ "dependencies").as[Seq[Seq[String]]]
      
      deps must contain theSameElementsAs (Seq(Seq("t0", "t1"), Seq("t1", "t2"), Seq("t2", cpName)))
    }
    
    "include a feeder buffer among the periods if there is one" in {
      val app = new TestPlanController()
      
      val p = new ScriptedPlan {
        add task 't0
        add task 't1 duration 1
        add task 't2 duration 2
        add task 't3
        't0 ~> 't1 ~> 't3
        't0 ~> 't2 ~> 't3
      }
      
      p.bufferedSchedule.feederBuffers.size must equal (1)
      
      val fb = p.bufferedSchedule.feederBuffers.head
      
      val json = app.jsonPlan(p)
      val idSeq = ids(json)
      
      idSeq must contain (fb.id.name)
    }
    
    "include any feeder buffer immediately after its predecessor" in {
      val app = new TestPlanController()

      //    [t1]\
      //        +[t2]---------------\
      //                            |
      //    [t3  ]\                 |
      //          +[t4  ]-----------+
      //                            |
      //    [t5                    ]+
      //                            +[t6]
      
      val t1 = Task('t1, "Task one", 1, None)
      val t2 = Task('t2, "Task two", 1, None)
      val t3 = Task('t3, "Task three", 2, None)
      val t4 = Task('t4, "Task four", 2, None)
      val t5 = Task('t5, "Task five", 10, None)
      val t6 = Task('t6)
  
      val p = new Plan {
        val tasks = Seq(t1, t2, t3, t4, t5, t6)
        val dependencies = Set(t1 -> t2, t2 -> t6, t3 -> t4, t4 -> t6, t5 -> t6)
      }

      val bufferT2 = (p.bufferedSchedule.feederBuffers find { _.predecessor == t2 }).get
      val bufferT4 = (p.bufferedSchedule.feederBuffers find { _.predecessor == t4 }).get
      
      val json = app.jsonPlan(p)
      val idSeq = ids(json)
      
      idSeq.sliding(3).toSeq must contain (Seq("t1", "t2", bufferT2.id.name))
      idSeq.sliding(3).toSeq must contain (Seq("t3", "t4", bufferT4.id.name))
    }
  }
  
  "PlanController.readPlan" must {
    "turn a simple textual plan into json" in {
      val text = """t0: "Begin" 0.0
        |t1: "First task" 3.0
        |t2: "End" 0.0
        |t0 -> t1 -> t2""".stripMargin
        
      val app = new TestPlanController()
      val response: Future[Result]= app.readPlan(text).apply(FakeRequest())
      val json = Json.parse(contentAsString(response)).asInstanceOf[JsObject]
      val taskIds = ids(json)
      taskIds.size must equal (4) // Includes buffer
      taskIds must contain allOf ("t0", "t1", "t2")
    }
  }
}
