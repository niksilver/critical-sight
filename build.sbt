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

libraryDependencies ++= Seq(
)

// For Scalatest for Scala 2.11
libraryDependencies += "org.scalatest" % "scalatest_2.11" % "2.2.1" % "test"

// For ScalaMock
// libraryDependencies += "org.scalamock" %% "scalamock-scalatest-support" % "3.2" % "test"

