package controllers

import scala.concurrent.Future
import org.scalatest.MustMatchers
import org.scalatestplus.play.PlaySpec
import play.api.libs.json.Json
import play.api.mvc.Result
import play.api.mvc.Results
import play.api.test.FakeRequest
import play.api.test.Helpers.contentAsString
import play.api.test.Helpers.defaultAwaitTimeout
import play.api.mvc.Controller

class PlanTest extends PlaySpec with MustMatchers with Results {

  class TestApplication extends Application with Controller
  
  "Some method" must {
    "be able to product a JSON result" in {
      val obj = Json.parse("""{ "greeting": "Hello, world!" }""")
      (obj \ "greeting").as[String] must equal ("Hello, world!")
    }
  }
  
  "Application.sample" must {
    "ouput a JSON object" in {
      val app = new TestApplication
      val result: Future[Result] = app.sample.apply(FakeRequest())
      val bodyTest = contentAsString(result)
      val obj = Json.parse(bodyTest)
      (obj \\ "id")(0).as[String] must equal ("t0")
    }
  }
}