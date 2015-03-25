package controllers

import play.api.mvc.Action
import play.api.mvc.Controller
import org.pigsaw.ccpm._
import play.api.libs.json.Json
import org.pigsaw.ccpm.ScriptedPlan
import play.api.libs.json._

trait PlanController {
  this: Controller =>

  def sample = Action {
    val t0 = Task('t0)
    val t1 = Task('t1, "Write a long list", 2.0, None)
    val t2 = Task('t2, "Do what's on the list", 5.0, None)
    val t3 = Task('t3)
    val p = new Plan {
      val tasks = Seq(t0, t1, t2, t3)
      val dependencies = Set(t0 -> t1, t1 -> t2, t2 -> t3)
    }
    Ok(jsonPlan(p))
  }
  
  def jsonPlan(p: Plan): JsObject = {
    val sch = p.bufferedSchedule
    implicit val taskWrites = new Writes[Task] {
      def writes(t: Task) = Json.obj(
          "type" -> "task",
          "id" -> t.id.name,
          "duration" -> t.duration,
          "start" -> sch.start(t))
    }
    implicit val cpWrites = new Writes[CompletionBuffer] {
      def writes(cp: CompletionBuffer) = Json.obj(
          "type" -> "buffer",
          "id" -> cp.id.name,
          "start" -> sch.start(cp),
          "duration" -> cp.duration)
    }
    implicit val periodWrites: Writes[Period] = new Writes[Period] {
      def writes(p: Period) = p match {
        case t: Task => taskWrites.writes(t)
        case cp: CompletionBuffer => cpWrites.writes(cp)
      }
    }
    val periods = Seq[Period]() ++ p.tasks ++ p.completionBufferOption
    val deps = p.dependencies.toSeq map { tPair => Seq(tPair._1.id.name, tPair._2.id.name) }
    Json.obj(
        "periods" -> Json.toJson(periods),
        "dependencies" -> Json.toJson(deps))
  }
}

object PlanController extends PlanController with Controller
