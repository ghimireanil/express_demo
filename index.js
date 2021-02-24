const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const courses = [
  { id: 1, name: 'course1' },
  { id: 2, name: 'course2' },
  { id: 3, name: 'course3' },
];

//HTTP GET request
app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/api/courses', (req, res) => {
  res.send(courses);
});

//HTTP POST
app.post('/api/courses', (req, res) => {
  const { error } = validateCourse(req.body); // destructuring
  if (error) {
    //400
    res.status(400).send(error.details[0].message);
    return;
  }

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);
  res.send(course);
});

//HTTP PUT
app.put('/api/courses/:id', (req, res) => {
  //Look up the course
  //If not existing return 404
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send('The course with given ID wasnot found');
    return;
  }
  //Validate
  //If invalid, return 400 --bad request
  //   const result = validateCourse(req.body);
  const { error } = validateCourse(req.body); // destructuring
  if (error) {
    //400
    res.status(400).send(error.details[0].message);
    return;
  }

  //Update course
  course.name = req.body.name;
  //Return the updated course
  res.send(course);
});

function validateCourse(course) {
  const schema = {
    name: Joi.string().min(3).required(),
  };
  return Joi.validate(course, schema);
}

//HTTP DELETE
app.delete('api/courses/:id', (req, res) => {
  //Lookup the course
  //Not existing, return 404
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send('The course with given ID wasnot found');
    return;
  }

  //Delete
  courses.index = courses.indexOf(course);
  courses.splice(index, 1);
  // return the same course
  res.send(course);
});

app.get('/api/courses/:id', (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send('The course with given ID wasnot found');
    return;
  }
  res.send(course);
});

//PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listnening on port ${port}....`));
