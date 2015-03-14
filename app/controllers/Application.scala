package controllers

import play.api.mvc.Action
import play.api.mvc.Controller

object Application extends Controller {
  
  def index = Action {
    val content = views.html.Application.index("Anything")
    Ok(content)
  }

  def image(filename: String) = {
    controllers.Assets.at(path = "/public/images", file = filename)
  }
}