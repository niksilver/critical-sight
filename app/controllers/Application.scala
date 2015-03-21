package controllers

import play.api.mvc.Action
import play.api.mvc.Controller
import org.pigsaw.ccpm.Task
import org.pigsaw.ccpm.Plan
import play.api.libs.json.Json
import org.pigsaw.ccpm.ScriptedPlan
import play.api.libs.json._

trait Application {
  this: Controller =>

  def index = Action {
    val content = views.html.Application.index("Anything")
    Ok(content)
  }

  def image(filename: String) = {
    controllers.Assets.at(path = "/public/images", file = filename)
  }

  def javascript(filename: String) = {
    controllers.Assets.at(path = "/public/javascripts", file = filename)
  }

  def sample = Action {
    val t0 = Task('t0)
    val t1 = Task('t1, "Write a long list", 2.0, None)
    val t2 = Task('t2, "Do what's on the list", 5.0, None)
    val t3 = Task('t3)
    val p = new Plan {
      val tasks = Set(t0, t1, t2, t3)
      val dependencies = Set(t0 -> t1, t1 -> t2, t2 -> t3)
    }
    val jsonPlan = Json.parse("""{
        "tasks": [{ "id": "t0", "start": 0, "duration": 0 }]
      }""")
    Ok(jsonPlan)
  }
  
  def jsonPlan(p: Plan): JsObject = {
    val sch = p.bufferedSchedule
    implicit val taskWrites = new Writes[Task] {
      def writes(t: Task) = Json.obj(
          "id" -> t.id.name,
          "duration" -> t.duration,
          "start" -> sch.start(t))
    }
    Json.obj("periods" -> Json.toJson(p.tasks))
  }
}

object Application extends Application with Controller
