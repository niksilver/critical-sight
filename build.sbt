name := "Critical Sight"

version := "0.1"

scalaVersion := "2.11.6"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalacOptions ++=
	Seq("-deprecation", "-feature",
		"-language:implicitConversions")

libraryDependencies ++= Seq(
)

// For Scalatest for Scala 2.11
libraryDependencies += "org.scalatest" % "scalatest_2.11" % "2.2.1" % "test"

// For ScalaMock
// libraryDependencies += "org.scalamock" %% "scalamock-scalatest-support" % "3.2" % "test"

