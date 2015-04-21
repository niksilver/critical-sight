package controllers

import play.api.mvc.Action
import play.api.mvc.Controller
import org.pigsaw.ccpm._
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

  def lib(filename: String) = {
    controllers.Assets.at(path = "/public/lib", file = filename)
  }
}

object Application extends Application with Controller
