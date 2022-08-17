# Material for DAT490 (Architectures for Scale-Out Systems)
### (colloquially "the DevOps course")

Here you find material used in teaching DAT490 (Architectures for Scale-Out Systems), an elective master-level course in the [Master Program Software Engineering](https://www.chalmers.se/en/education/programmes/masters-info/Pages/Software-Engineering-and-Technology.aspx) at Chalmers as well as in the [Software Engineering and Management master](https://www.gu.se/en/study-gothenburg/software-engineering-and-management-masters-programme-n2sof) at Gothenburg University.

The course is designed as a highly practical and pragmatic crash course in the varied techniques that characterize modern Web development. We discuss and experiment with cloud computing, Docker, Kubernetes, DevOps, monitoring, and release engineering, along with general principles such as how to engineer scalable systems. 

Please see [the official course syllabus](https://student.portal.chalmers.se/en/chalmersstudies/programme-information/Pages/SearchProgram.aspx?course_id=32908&parsergrp=2) for more information on the context of the course.

## Course Project
A key element of the course is a practical project, which students are expected to develop during the course duration. The goal of the project is to adopt an existing (highly simplified) Web application and to:

- Dockerize it
- Deploy it using Kubernetes on Google Cloud
- Develop a continuous deployment pipeline using GitLab
- Re-architect and extend it
- Add a Prometheus based monitoring solution
- Set up canary releases, as well as feature toggles

These tasks are split into 5 weekly assignments. Each task is either marked as mandatory (required because something later builds on it) or optional. All tasks come with (relatively) extensive and specific instructions (see `assignments` folder). All necessary code is contained in `project_templates` (frontend and backend are the example application, cluster_management is used in Assignment 3).

### Technical Requirements
The project relies fairly heavily on GitLab (more specifically, a private GitLab installation, *not* the free-tier public version of GitLab) and Google Cloud (trial version is sufficient). All instructions have been tested using the specific version of GitLab available to Chalmers students. Version-specific differences are not unlikely (GitLab is moving fast, and sometimes breaking things).

*Unfortunately I am not able to help make the project work on other cloud providers or other versions of GitLab.*

### Necessary Prior Student Knowledge
The project does not require any specific prior knowledge, but does expect a certain level of technical sophistication of students (i.e., students that find it difficult to quickly grasp the basics of a new programming language or web framework may struggle). Students should also be willing and able to read online documentation.

We have also found that students with no prior knowledge of system administration and server management find some of the tasks in the project rather daunting.

## Lecture Slides
In addition to the project description, this repository also contains the slides used for classroom lectures (nine lecture units, available in Keynote and PDF format). These slide decks are mostly intended for other instructors - the slides are likely not, and are not intended to be, directly useful for solving the project.

## Copyright
All material is shared as-is with the hope that it will be useful for learners or other instructors. However, I cannot give guarantees about the correctness of any of the provided material. Furthermore, I will have only limited time to support you if you are studying this material on your own.

**Lecture slides** and **assignment descriptions** are provided under a creative commons [CC-BY](https://creativecommons.org/licenses/by/4.0/) license, and are free to use for other instructors. I would appreciate a [message](mailto:philipp.leitner@chalmers.se) if you found this material helpful to plan or execute your own course (or studying on your own). More material, such as example exams, can be potentially be shared upon direct request.

**Project templates** are available under an [MIT License](https://www.mit.edu/~amini/LICENSE.md). Copyright to the source code is held by Philipp Leitner, Joel Scheuner, and Ranim Khojah.

---

### About the Author
This course was designed by [Philipp Leitner](http://philippleitner.net), Associate Professor at [Chalmers University of Technology](https://www.chalmers.se/sv/Sidor/default.aspx) in Gothenburg, Sweden. Contact me via [email](mailto:philipp.leitner@chalmers.se) or on [Twitter](https://twitter.com/xLeitix).