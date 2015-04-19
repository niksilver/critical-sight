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
    val tEnd = Task('tEnd)
    val t4 = Task('t4, "Extra work", 2.0, None)
    val p = new Plan {
      val tasks = Seq(t0, t1, t2, tEnd, t4)
      val dependencies = Set(
          t0 -> t1, t1 -> tEnd,
          t0 -> t2, t2 -> tEnd,
          t0 -> t4, t4 -> t1, t4 -> tEnd)
    }
    Ok(jsonPlan(p))
  }
  
  /**
   * Converts a `Plan` into its Json representation.
   */
  def jsonPlan(p: Plan): JsObject = {
    val sch = p.bufferedSchedule
    implicit val taskWrites = new Writes[Task] {
      def writes(t: Task) = Json.obj(
          "type" -> "task",
          "id" -> t.id.name,
          "duration" -> t.duration,
          "start" -> sch.start(t))
    }
    implicit val bufferWrites = new Writes[Buffer] {
      def writes(cp: Buffer) = Json.obj(
          "type" -> "buffer",
          "id" -> cp.id.name,
          "start" -> sch.start(cp),
          "duration" -> cp.duration)
    }
    implicit val periodWrites: Writes[Period] = new Writes[Period] {
      def writes(p: Period) = p match {
        case t: Task => taskWrites.writes(t)
        case b: Buffer => bufferWrites.writes(b)
      }
    }
    val periods = p.periodsWithBuffers
    val deps = p.dependenciesWithBuffers.toSeq map { tPair => Seq(tPair._1.id.name, tPair._2.id.name) }
    Json.obj(
        "periods" -> Json.toJson(periods),
        "dependencies" -> Json.toJson(deps))
  }
  
  /**
   * Responds to a textual plan with its Json representation.
   */
  def readPlan(text: String) = Action {
    val reader = new TextParsers
    val (plan, errors) = reader(text)
    Ok(jsonPlan(plan))
  }
}

object PlanController extends PlanController with Controller
