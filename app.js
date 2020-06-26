/**
 * @file app.js is the root file for this documentation.
 * @author anon for peer review
 */

 /**
 * npm modules required
 * @module npmModules
 * @requires express
 * @requires fs
 * @requires body-parser
 * @requires cors
 */

 // npm modules

/**
 * express module
 * @const
 */
const express = require("express");
/**
 * fs module
 * @const
 */
const fs = require("fs");
/**
 * body-parser module
 * @const
 */
const bodyparser = require("body-parser");
/**
 * cors module
 * @const
 */
const cors = require("cors");

/**
 * set up app
 * mounts middleare from all routes
 * @const
 * @namespace app
 */
// set up server
const app = express();

 /**
 * middleware required
 * @module middleware
 * @requires bodyparser.json()
 * @requires cors()
 * @requires express.static("client")
 */

/**
 * parse application/json
 * @name bodyparser
 */
app.use(bodyparser.json());
/**
 * enable cors middleware
 * @name cors
 */
app.use(cors());
/**
 * links client folder -- client side
 * @name clientFolder
 */
app.use(express.static("client"));

//link json files
/**
 * @module API
 * @requires ./client/courses.json
 * @requires ./client/comments.json
 */
/**
 * course json file
 * @const
 * @name courses.json
 */
const courses = require("./client/courses.json");
/**
 * comments json file
 * @const 
 * @name comments.json
 */
const comments = require("./client/comments.json");

/**
 * GET request for courses - this displays the courses languages and locations on the webpage.
 * @function
 * @name /listcourses
 * @async
 * @see {@link localhost:5000/listcourses}
 * @param {request} - Client requests courses
 * @param {JSON} - Response sent as json to client
 * @return {JSON} Json content - only the courses languages and locations are sent
 * @example Response: [
 * ["Spanish","Newcastle City Library"],
 * ["Arabic","Durham University Library"],
 * ["German","Darlington Library"],
 * ["Spanish","Bishop Auckland Library"],
 * ["German","Bowburn Community Center"],
 * ["Portuguese","Seaham Community Hall"],
 * ["Spanish","Newton Aycliffe Chuch"],
 * ["Arabic","Sunderland City Library"],
 * ["French","Newton Hall Library"],
 * ["Swahili","Washington Community Center"],
 * ["Hindi","Newton Aycliffe Hall"],
 * ["Portugese","Stockton City Hall"],
 * ["Urdu","Tow Law Library"],
 * ["Dutch","Sedgfield Community Hall"],
 * ["Dutch","Northumbria University"],
 * ["Welsh","Newcastle City Library"],
 * ["English","Newcastle University Library"],
 * ["Malay","Gateshead Community Center"],
 * ["Korean","Sunderland University"]
 * ]
 */

app.get("/listcourses", async(req, res) => {
    try {
        const matching = [];
        for(let i = 0; i < courses.length; i++) {
            if(courses[i].language){
                matching.push([courses[i].language, courses[i].location]);
            }
        }
        //console.log(matching);
        res.send(matching);
    }
    catch(error){
        console.log(error);
        throw error;
    }
});
/**
 * GET request for courses - this displays all the course info when the user requests more info.
 * @function
 * @name /getcourses
 * @async
 * @see {@link localhost:5000/getcourses}
 * @param {request} - Client requests courses
 * @param {JSON} - Response sent as json to client
 * @return {JSON} Json content - ALL the courses in json file are sent to client
 * @example Response: [
 * {
 * id:  '1',
 * language:    'Spanish',
 * proficiency: 'Beginner',
 * cost:    '£8 hour',
 * location:    'Newcastle City Library',
 * email:   'Espanolclase@gmail.com'
 * },
 * {
 * id:  '2',
 * language:    'Arabic,
 * proficiency: 'Beginner,
 * cost:    '£10 hour',
 * location:    'Durham University Library',
 * email:   'Arabic4all@hotmail.com'
 * },
 * {
 * id:  '3',
 * language:    'German',
 * proficiency: 'Beginner',
 * cost:    '£10 hour',
 * location:    'Darlington Library',
 * email:   'Germancourse@gmail.com'},
 * ....
 * ]
 */
app.get("/getcourses", async(req, res) => {
    try {
        res.send(courses);
        console.log("Getting courses");
    }
    catch(error) {
        console.log(error);
    }
});

/**
 * @description POST request for new course - this writes the new course information from user to json file.
 * @function 
 * @name /newCourse
 * @async
 * @see {@link localhost:5000/newCourse}
 * @example Request: {
  language: 'Korean',
  proficiency: 'Beginner',
  cost: '£16 hour',
  location: 'Sunderland University',
  email: 'Koreanteacher@gmail.com'
}
 * @example Response: `res.statusCode: 200`
 * @param {text} - User sends text requesting a new course upload
 * @param {JSON} - Response confirms successful upload of course to json file
 * @return {statusCode} - 200
 */
app.post("/newCourse", async(req, res) => {
    try {
        app.get("/getcourses", async(req, res) => {
            try {
                res.send(courses);
            }
            catch(error) {
                console.log(error);
            }
        });
        const id = courses.length+1;
        const language = req.body.language;
        const proficiency = req.body.proficiency;
        const cost = req.body.cost;
        const location = req.body.location;
        const email = req.body.email;
        const newpost = {"id": id,
            "language": language,
            "proficiency": proficiency,
            "cost": cost,
            "location": location,
            "email": email};
        console.log(newpost);
        courses.push(newpost);
        
        const json = JSON.stringify(courses);
        fs.writeFile("client/courses.json", json, "utf8", console.log);
        res.send(`Added post ${id} ${language} ${proficiency} ${cost}  ${location}  ${email}`);
        console.log(res.statusCode);
    }
    catch(error) {
        res.send(error.message);
    }
});

 /**
  * GET request for searching through courses based on course language - this returns in a response the courses that match the search term.
  * @function
  * @name /searchlanguages
  * @async
  * @see {@link localhost:5000/searchlanguages?lang=searchword} 
  * @example Request: localhost:5000/searchlanguages?lang=Arabic
  * @example Response: [
  {
    language: 'Arabic',
    proficiency: 'Beginner',
    cost: '£10 hour',
    location: 'Durham University Library',
    email: 'Arabic4all@hotmail.com'
  },
  {
    language: 'Arabic',
    proficiency: 'Advanced',
    cost: '£15 hour',
    location: 'Sunderland City Library',
    email: 'Arabicteacher@gmail.com'
  }
]
  * @param {text} - User sends text to request a search for a language
  * @param {JSON} - Response is returned to client in JSON format
  * @return {JSON} - The courses that language match the search term from user are returned and sent to client.
  */
app.get("/searchlanguages", async(req, res) => {
    try {
        const lang = req.query.lang;
        const matching = [];
        console.log(`Searching for ${lang}`);
        for(let i = 0; i < courses.length; i++) {
            if(courses[i].language.toLowerCase().includes(lang.toLowerCase())){
                matching.push(courses[i]);
            }
        }
        console.log(matching);
        res.send(matching);
    }
    catch(error) {
        res.send(error.message);
    }
});
 /**
  * GET request for searching through courses based on location - this returns in a response the courses that match the search term.
  * @function
  * @name /searchlocation
  * @async
  * @see {@link localhost:5000/searchlocation?searchlocation=searchword} 
  * @example Request: localhost:5000/searchlocation?searchlocation=Newcastle
  * @example Response: [
  {
    id: '1',
    language: 'Spanish',
    proficiency: 'Beginner',
    cost: '£8 hour',
    location: 'Newcastle City Library',
    email: 'Espanolclase@gmail.com'
  },
  {
    id: '16',
    language: 'Welsh',
    proficiency: 'Beginner',
    cost: '£8 hour',
    location: 'Newcastle City Library',
    email: 'Welshlanguagerules@hotmail.com'
  },
  {
    id: '17',
    language: 'English',
    proficiency: 'Intermediate',
    cost: '£8 hour',
    location: 'Newcastle University Library',
    email: 'Englishasasecondlanguage@gmail.com'
  }
]
  * @param {text} - User sends text to request a search for a location
  * @param {JSON} - Response is returned to client in JSON format
  * @return {JSON} - The courses that location match the search term from user are returned and sent to client.
  */
app.get("/searchlocation", async(req, res) => {
    try {
        const searchlocation = req.query.searchlocation;
        const matching = [];
        console.log(`Searching for ${searchlocation}`);
        for(let i = 0; i < courses.length; i++) {
            if(courses[i].location.toLowerCase().includes(searchlocation.toLowerCase())){
                matching.push(courses[i]);
            }
        }
        console.log(matching);
        res.send(matching);
    }
    catch(error) {
        res.send(error.message);
    }
  });

/**
 * GET request for comment - this displays the comments on the webpage.
 * @function
 * @name /getcomments
 * @async
 * @see {@link localhost:5000/getcomments}
 * @param {request} - Client is requesting the comment 
 * @param {JSON} - Response sent as json to client
 * @return {JSON} Json content - all comments
 * @example Response: [
 * {
 * date: '2020-02-10T12:03:16.655Z',
 * comment: 'Will I be able to understand Bollywood movies after this course?',
 * id: '11',
 * user: 'Artemisia'
 * },
 * {
 * date:    '2020-02-22T01:10:00.655Z',
 * comment: 'Is Swahili hard for beginners?',
 * id:  '10',
 * user:    'Gabriel'
 * },
 * {
 * date:  '2020-03-1T12:21:36.655Z',
 * comment:   'I need to learn conversational German for business, do you think this course will be suitable?',
 * id:    '5',
 * user:  'Daniel
 * },
 * ....
 * ]
 */
app.get("/getcomments", async(req, res) => {
    try {
        res.send(comments);
        console.log("Getting comments");
    }
    catch(error) {
        console.log(error);
    }
});

/**
 * POST request for new comment
 * @function 
 * @name /newComment
 * @async
 * @example Request:
{
  date: '2020-04-09T11:36:32.319Z',
  comment: 'Hi Zara, Yes you can call me on 0909 900 999',
  id: '12',
  user: 'Portugese teacher',
}
 * @example Response: `res.statusCode: 200`
 * @param {text} - User is requesting a new comment upload
 * @param {JSON} - Response confirms successful upload of comment to json file
 * @return {statusCode} - 200
 */
app.post("/newComment", async(req, res) => {
    try{
        const date = req.body.date;
        const comment = req.body.comment;
        const id = req.body.id;
        const user = req.body.user;
        const newpost = {"date": date,
            "comment": comment,
            "id": id,
            "user": user};
        console.log(newpost);
        comments.push(newpost);

        const json = JSON.stringify(comments);
        fs.writeFile("client/comments.json", json, "utf8", console.log);

        res.send(`Added post ${date} ${comment} ${id} ${user}`);
        console.log(res.statusCode);
    }
    catch(error) {
        res.send(error.message);
    }
});

 /**
  * GET request for searching through comments based on comment id - this returns in a response the comments that match the course id (show comments for that paticular course).
  * @function
  * @name /searchcomment
  * @async
  * @see {@link localhost:5000/searchcomment?id=id} 
  * @example Request: localhost:5000/searchcomment?id=10
  * @example Response: [
  * {
  * date:   '2020-02-22T01:10:00.655Z',
  * comment:    'Is Swahili hard for beginners?',
  * id: '10',
  * user:   'Gabriel'
  * }
  * ]
  * @param {text} - CLient sends text to request a search for comments with id
  * @param {JSON} - Response is returned to client in JSON format
  * @return {JSON} - The comments that id match the id term from client are returned and sent to client, so comments can be displayed for that course.
  */
 app.get("/searchcomment", async(req, res) => {
    try {
        const id = req.query.id;
        const matching = [];
        console.log(`Searching for comment with id: ${id}`);
        for(let i = 0; i < comments.length; i++) {
            if(comments[i].id.includes(id)){
                matching.push(comments[i]);
            }
        }
        console.log(matching);
        res.send(matching);
    }
    catch(error) {
        res.send(error.message);
    }
});
/**
 * exports the API to server
 * @module app
 */
module.exports = app;