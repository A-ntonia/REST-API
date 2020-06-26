const request = require("supertest");
const app = require("./app");

//test comments entity with GET and POST requests
describe("Test the comments service", () => {
    //check /getcomments returns 200 http code
    test("GET /getcomments succeeds", () => {
        return request(app)
            .get("/getcomments")
            .expect(200);
    });
    //check /getcomments has content type json
    test("GET /getcomments returns JSON", () => {
        return request(app)
            .get("/getcomments")
            .expect("Content-type", /json/);
    });
    //check /newcomment returns 200 http code
    test("POST /newcomment works", async () => {
        await request(app);
        beforeEach(() => {
            global.fetch = jest.fn().mockImplementation(() => {
                const params = {
                    date: "test date",
                    comment: "test comment abcd",
                    id: "test id",
                    user: "test user"
                };
                app.find("/getcomment").simulate(params).expect(200);
            });
        });
    });
    //check /newcomment has content type json
    test("POST /newcomment adds course to be accessed via GET", async () => {
        await request(app);
      
        beforeEach(() => {
            global.fetch = jest.fn().mockImplementation(() => {
                const params = {
                    date: "test date",
                    comment: "test comment abcd",
                    id: "test id",
                    user: "test user"
                };
                app.find("/newcomment").simulate(params)
                .expect("Content-type", /json/);
            });
        });
    });
    //check /searchcomment returns 200 http code when searching for id 10
    test("GET /searchcomment succeeds", () => {
        return request(app)
            .get("/searchcomment?id=10")
            .expect(200);
    });
    //check /searchcomment has content type json when searching for id 10
    test("GET /searchcomment returns JSON", () => {
        return request(app)
            .get("/searchcomment?id=10")
            .expect("Content-type", /json/);
    });
    //check /searchcomment finds a comment with id 10
    test("GET /searchcomment includes comment with id 10", () => {
        return request(app)
            .get("/searchcomment?id=10").then(response => {
                console.log(response.body);
                for(let i = 0; i < response.body.length; i++){
                    expect(response.body[i].id).toEqual("10");
                }
            });
    });
});

//test courses entity with GET and POST requests
describe("Test the courses service", () => {
    //check /getcourses returns 200 http code
    test("GET /getcourses succeeds", () => {
        return request(app)
            .get("/getcourses")
            .expect(200);
    });
    //check /getcourses has content type json
    test("GET /getcourses returns JSON", () => {
        return request(app)
            .get("/getcourses")
            .expect("Content-type", /json/);
    });
    //check /getcourses has a course for spanish language
    test("GET /getcourses includes spanish", () => {
        return request(app)
            .get("/getcourses/spanish").then(response => {
                console.log(response.body);
                for(let i = 0; i < response.body.length; i++){
                    expect(response.body[i].language.toLowerCase()).toEqual("spanish");
                }
            });
    });
    //check /listcourses returns 200 http code
    test("GET /listcourses succeeds", () => {
        return request(app)
            .get("/listcourses")
            .expect(200);
    });
    //check /listcourses has content type json
        test("GET /listcourses returns JSON", () => {
            return request(app)
                .get("/listcourses")
                .expect("Content-type", /json/);
        });
    //check /listcourses has a course for spanish language
        test("GET /listcourses includes spanish", () => {
            return request(app)
                .get("/listcourses/spanish").then(response => {
                    console.log(response.body);
                    for(let i = 0; i < response.body.length; i++){
                        expect(response.body[i].language.toLowerCase()).toEqual("spanish");
                    }
                });
        });
    //check /searchlanguages returns 200 http code when searching for spanish language
    test("GET /searchlanguages succeeds", () => {
        return request(app)
            .get("/searchlanguages?lang=spanish")
            .expect(200);
    });
    //check /searchlanguages has content type json when searching for spanish language
    test("GET /searchlanguages returns JSON", () => {
        return request(app)
            .get("/searchlanguages?lang=spanish")
            .expect("Content-type", /json/);
    });
    //check /searchlanguages finds a spanish course
    test("GET /searchlanguages includes spanish", () => {
        return request(app)
            .get("/searchlanguages?lang=spanish").then(response => {
                console.log(response.body);
                for(let i = 0; i < response.body.length; i++){
                    expect(response.body[i].language.toLowerCase()).toEqual("spanish");
                }
            });
    });
    //check /searchlocation returns 200 http code when searching for spanish language
        test("GET /searchlocation succeeds", () => {
            return request(app)
                .get("/searchlocation?searchlocation=spanish")
                .expect(200);
        });
    //check /searchlocation has content type json when searching for spanish language
        test("GET /searchlocation returns JSON", () => {
            return request(app)
                .get("/searchlocation?searchlocation=spanish")
                .expect("Content-type", /json/);
        });
    //check /searchlocation finds a spanish course
        test("GET /searchlocation includes spanish", () => {
            return request(app)
                .get("/searchlocation?searchlocation=spanish").then(response => {
                    console.log(response.body);
                    for(let i = 0; i < response.body.length; i++){
                        expect(response.body[i].language.toLowerCase()).toEqual("spanish");
                    }
                });
        });
    //newcourse returns 200 http code when mock posting a course
    test("POST /newcourse works", async () => {
        await request(app);
        beforeEach(() => {
            global.fetch = jest.fn().mockImplementation(() => {
                const params = {
                    language: "test language abcd",
                    proficiency: "test proficiency",
                    cost: "test cost",
                    location: "test location",
                    email: "test email"
                };
                app.find("/newcourse").simulate(params).expect(200);
            });
        });
    });
    //check /newcourse has content type json
    test("POST /newcourse adds course to be accessed via GET", async () => {
        await request(app);
          
        beforeEach(() => {
            global.fetch = jest.fn().mockImplementation(() => {
                const params = {
                    language: "test language abcd",
                    proficiency: "test proficiency",
                    cost: "test cost",
                    location: "test location",
                    email: "test email"
                };
                app.find("/newcourse").simulate(params)
                .expect("Content-type", /json/);
            });
        });
    });
    //newcourse finds a course that was mock posted
    test("POST /newcourse adds course to be accessed via GET", async () => {
        await request(app);
      
        beforeEach(() => {
            global.fetch = jest.fn().mockImplementation(() => {
                const params = {
                    language: "test language abcd",
                    proficiency: "test proficiency",
                    cost: "test cost",
                    location: "test location",
                    email: "test email"
                };
                app.find("/newcourse").simulate(params);
            });
            app.get("/searchcourse?searchcourse=abcd").expect(/abcd/);
        });
    });
});