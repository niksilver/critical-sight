name := "Critical Sight"

version := "0.1"

scalaVersion := "2.11.6"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalacOptions ++=
	Seq("-deprecation", "-feature",
		"-language:implicitConversions")

// Use this to include classes_managed in Eclipse's library dependencies.
// Otherwise it will give a compile error for classes like
// views.html.Application
// which are generated from the views directory.
//
unmanagedJars in Compile += ( baseDirectory.value / "target/scala-2.11/classes_managed" )

// This added by following
// https://www.playframework.com/documentation/2.3.8/Build
//
libraryDependencies ++= Seq(
    jdbc,
    anorm,
    cache
)


// This adds ScalaTest+Play. See
// https://www.playframework.com/documentation/2.3.8/ScalaTestingWithScalaTest
// and for the right version see
// http://www.scalatest.org/plus/play/versions
//
libraryDependencies += "org.scalatestplus" %% "play" % "1.2.0" % "test"
