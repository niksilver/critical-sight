package controllers

import org.scalatestplus.play.PlaySpec
import org.scalatest.MustMatchers

class SomethingTest extends PlaySpec with MustMatchers {
  "A number two" must {
    "Be equal to two" in {
      (5-3) must equal (2)
    }
  }
}