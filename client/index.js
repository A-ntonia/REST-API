//if error cause by server disconnect, alert user
function checkconnection() {
    alert("Unfortunately the server has been disconnected, please try again.");
}

// loads search for courses by language onto homepage and when home button clicked
async function loadlanguagesearch() {
    try {
        console.log("Loading course page: language.");
        //get request for page to search by language
        const response = await fetch("/coursesearch.html");
        const page = await response.text();
        //clears main div to load search page
        document.getElementById("main").innerHTML = "";
        document.getElementById("main").innerHTML = page;
        const coursebutton = document.getElementById("courseButton");
        //when button clicked call searchcourses to initate search
        coursebutton.addEventListener("click", searchlanguages);
    }
    catch(error) {
        if (error instanceof TypeError) {
            checkconnection();
        }
        else {
            console.log(error);
        }
    }
}
// loads search for courses by location
async function loadlocationsearch() {
    try{
        console.log("Loading course page: location.");
        //get request for page to search by location
        const response = await fetch("/locationssearch.html");
        const page = await response.text();
        //clear main div to load search page
        document.getElementById("main").innerHTML = "";
        document.getElementById("main").innerHTML = page;
        const coursebutton = document.getElementById("locationButton");
        //when button clicked call searchlocations to initate search
        coursebutton.addEventListener("click", searchlocations);
    }
    catch(error) {
        if (error instanceof TypeError) {
            checkconnection();
        }
        else {
            console.log(error);
        }
    }
}

// send user comment to server
async function sendcomment(event){
        event.preventDefault();
        //date and time user comments
        let date = new Date();
        let comment = document.getElementById("comment").value;
        //so comment is attached to correct course
        let id = this.parentElement.parentElement.id;
        let user = document.getElementById("username").value;
        //prevent course sending if either blank
        if (comment == "" || user == "") {
            alert("No section can be empty");
        }
        let data = {date, comment, id, user};
        try {
            console.log("sending comment to server");
            //post request for new comment
            const options = {
                method: "POST",
                body: JSON.stringify(data),
                headers: { 
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                    }
                };
            fetch("/newComment", options);
            //clear main div to post success message
            document.getElementById("main").innerHTML = "";
            const node = document.createElement("div");
            node.className = "Sent";
            const confirm = document.createElement("h2");
            const success = document.createTextNode("Success! Your comment has been uploaded.");
            confirm.appendChild(success);
            node.appendChild(confirm);
            document.getElementById("main").appendChild(node);
        }
        catch(error) {
            if (error instanceof TypeError) {
                checkconnection();
            }
            else {
                console.log(error);
            }
        }
    }

//for 'view comments' button - shows comments for that specific course by searching through comments by id
async function coursecomments(event) {
    event.preventDefault();
    try {
        //so correct comments loaded 
        const id = this.parentElement.id;
        console.log("comments for course with id: " + id);
        //fetch request - fetched comment by id
        const response = await fetch("http://127.0.0.1:5000/searchcomment?id=" + id);
        const comments = await response.json();
        //when no comments for that course
        if (comments.length == 0) {
            const node = document.createElement("div");
            const nocomments = document.createElement("h5");
            node.className = "card-body";
            nocomments.className = "card-text";
            node.setAttribute("id", "commentDisplay");
            const notext = document.createTextNode("This course currently has no comments.");
            nocomments.appendChild(notext);
            node.appendChild(nocomments);
            document.getElementById(id).appendChild(node);
        }
        else {
            //for however many comments for that course
            comments.forEach((comment) => {
                //creates elements for div   
                const node = document.createElement("div");
                const datetoadd = document.createElement("h5");
                const username = document.createElement("h5");
                const usercomment = document.createElement("h5");
                //assign classes
                node.className = "card-body";
                datetoadd.className = "text-muted";
                username.className = "card-text";
                usercomment.className = "card-text";
                node.setAttribute("id", "commentDisplay");
                //course data from server
                const userinfo = document.createTextNode("User:  " + comment.user);
                const commentinfo = document.createTextNode("Comment:  " + comment.comment);
                const date = document.createTextNode("Date:" + comment.date);
                //append data to elements
                username.appendChild(userinfo);
                usercomment.appendChild(commentinfo);
                datetoadd.appendChild(date);
                //append elements to div
                node.appendChild(datetoadd);
                node.appendChild(username);
                node.appendChild(usercomment);
                //append div to page
                document.getElementById(id).appendChild(node);   
            });
        }   
    }
    catch(error) {
        if (error instanceof TypeError) {
            checkconnection();
        }
        else {
            console.log(error);
        }
    }
}

//when user request more info for a course by clicking 'more info' button
async function getinfo(event) {
    event.preventDefault();
    try {         
        console.log("Showing more info for this course.");
        //get request, loads all info for that course
        const response = await fetch("/getcourses");
        const courses = await response.json();
        //load course by id
        let id = this.parentElement.id;
        //ccheck through all courses to load specific one
        courses.forEach((course) => {
            //load info for course with that id
            if (course.id == id){
                //clear main div to show all info for this course
                document.getElementById("main").innerHTML = "";
                //create elements of div
                const node = document.createElement("div");
                const language = document.createElement("h4");
                const proficiency = document.createElement("h4");
                const cost = document.createElement("h4");
                const location = document.createElement("h4");
                const email = document.createElement("h4");
                const commentsbutton = document.createElement("button");
                //assign classes
                node.className = "card-body";
                language.className = "Card-title";
                proficiency.className = "card-text";
                cost.className = "card-text";
                location.className = "class-text";
                email.className = "card-text";
                commentsbutton.className = "btn btn-info";
                //to match comments to this course by id
                node.setAttribute("id", course.id);
                //css purposes
                language.setAttribute("id", "top");
                proficiency.setAttribute("id", "mid");
                cost.setAttribute("id", "mid");
                location.setAttribute("id", "mid");
                email.setAttribute("id", "mid");
                //calls function when clicked
                commentsbutton.addEventListener("click", coursecomments);
                //course data from server
                const languagedata = document.createTextNode("Language:  " + course.language);
                const proficiencydata = document.createTextNode("Proficiency: " + course.proficiency);
                const costdata = document.createTextNode("Cost:  " + course.cost);
                const locationdata = document.createTextNode("Location:  " + course.location);
                const emaildata = document.createTextNode("Email:  " + course.email);
                const buttontext = document.createTextNode("View Comments");
                //append data to elements
                language.appendChild(languagedata);
                proficiency.appendChild(proficiencydata);
                cost.appendChild(costdata);
                location.appendChild(locationdata);
                email.appendChild(emaildata);
                commentsbutton.appendChild(buttontext);
                //append elements to div
                node.appendChild(language);
                node.appendChild(proficiency);
                node.appendChild(cost);
                node.appendChild(location);
                node.appendChild(email);
                node.appendChild(commentsbutton);
                //append div to page
                document.getElementById("main").appendChild(node);
            }
        });

    }
    catch(error) {
        if (error instanceof TypeError) {
            checkconnection();
        }
        else {
            console.log(error);
        }
    }
}

// brings up form data when user clicks "add comment" button
async function addcomment(event) {
    event.preventDefault();
    //so comment is added to correct course
    let id = this.parentElement.id;
    let div = document.getElementById(id);
    //prevents multiple forms
    if (div.getElementsByTagName("form").length) {
        return;
    }
    else {
        try {
            console.log("loading comment form");
            //create form
            const node = document.createElement("form");
            node.className = "form-comment";
            const username = document.createElement("input");
            username.setAttribute("id", "username");
            username.setAttribute("placeholder", "name");
            const comment = document.createElement("input");
            comment.setAttribute("id", "comment");
            comment.setAttribute("placeholder", "comment");
            const addcommentbutton = document.createElement("button");
            addcommentbutton.setAttribute("id", "submitbutton");
            const button = document.createTextNode("Add Comment");
            addcommentbutton.appendChild(button);
            addcommentbutton.className = "btn btn-danger";
            //when button clicked call function to send comment to server
            addcommentbutton.addEventListener("click", sendcomment);
            //append elements to div
            node.appendChild(username);
            node.appendChild(comment);
            node.appendChild(addcommentbutton);
            //append this comment form to this div for this course
            this.parentElement.appendChild(node);
            
        }
        catch(error) {
            if (error instanceof TypeError) {
                checkconnection();
            }
            else {
                console.log(error);
            }
        }
    }
}

//load courses onto page
async function viewcourses() {
    try {
        console.log("loading all courses");
        //get request for all courses, but only loading their languages and locations
        const response = await fetch("/listcourses");
        const courses = await response.json();
        //goes through all courses to list them 
        var countnum = courses.length;
        var counter = countnum + 1;
        //lists newest courses first
        courses.reverse().forEach((course) => {
            //work backwards
            counter -= 1;
            //create elements of div
            const node = document.createElement("div");
            const language = document.createElement("H4");
            const location = document.createElement("h4");
            const infobutton = document.createElement("button");
            const addcommentbutton = document.createElement("button");
            //assign their classes
            node.className = "card-body";
            language.className = "card-title";
            location.className = "card-text";
            infobutton.className = "btn btn-info";
            addcommentbutton.className = "btn btn-danger";
            //css purposes
            language.setAttribute("id", "top");
            location.setAttribute("id", "mid");
            infobutton.setAttribute("id", "cardbuttons");
            addcommentbutton.setAttribute("id", "cardbuttons");
            //course data from server
            const languagedata = document.createTextNode("Language: " + course[0]);
            const locationdata = document.createTextNode("Location:  " + course[1]);
            const info = document.createTextNode("More Info");
            const commentdata = document.createTextNode("Comment");
            node.setAttribute("id", counter);
            infobutton.addEventListener("click", getinfo);
            addcommentbutton.addEventListener("click", addcomment);
            //append course data to elements
            language.appendChild(languagedata);
            location.appendChild(locationdata);
            infobutton.appendChild(info);
            addcommentbutton.appendChild(commentdata);
            //append elements to div
            node.appendChild(language);
            node.appendChild(location);
            node.appendChild(infobutton);
            node.appendChild(addcommentbutton);

            document.getElementById("comments").appendChild(node);
        });
    }
    catch(error) {
        if (error instanceof TypeError) {
            checkconnection();
        }
        else {
            console.log(error);
        }
    }
}

// loads comments onto page
async function viewcomments() {
    try {
        console.log("loading all comments");
        //get request for all comments
        const response = await fetch("/getcomments");
        const comments = await response.json();
        comments.forEach((comment) => {
            //loads comments to specific courses by id
            let id = comment.id;
            //create elements of each div
            const node = document.createElement("div");
            const datetoadd = document.createElement("h5");
            const username = document.createElement("h5");
            const usercomment = document.createElement("h5");
            //assign their classes 
            node.className = "card-body";
            datetoadd.className = "text-muted";
            username.className = "card-text";
            usercomment.className = "card-text";
            node.setAttribute("id", "commentDisplay");
            const userinfo = document.createTextNode("User:  " + comment.user);
            const commentinfo = document.createTextNode("Comment:  " + comment.comment);
            const date = document.createTextNode("Date:" + comment.date);
            username.appendChild(userinfo);
            usercomment.appendChild(commentinfo);
            datetoadd.appendChild(date);
            //append elements to div
            node.appendChild(datetoadd);
            node.appendChild(username);
            node.appendChild(usercomment);

            document.getElementById(id).appendChild(node);     
       
        });
    }
    catch(error) {
        if (error instanceof TypeError) {
            checkconnection();
        }
        else {
            console.log(error);
        }
    }
}
// search through courses by language
async function searchlanguages(event) {
    event.preventDefault();
    try{
        let lang = document.getElementById("searchcourse").value;
        console.log("searching courses by language: " + lang);
        //prevent empty search
        if (lang.length == 0){
            alert ("Please enter a language.");
        }
        else {
            //get request for search based on language
            const response = await fetch("http://127.0.0.1:5000/searchlanguages?lang=" + lang);
            const body = await response.text();            
            const courses = JSON.parse(body);
            //empty main div to list search results
            document.getElementById("main").innerHTML = "";
            const container = document.createElement("div");
            container.setAttribute("id", "container");
            container.className = "container";
            var title = document.createElement("h2");
            var titledescription = document.createTextNode("Search Results for: " + lang.toUpperCase());
            title.appendChild(titledescription);
            container.appendChild(title);
            document.getElementById("main").appendChild(container);
            //if no matching courses for that search
            if (courses.length == 0) {
                document.getElementById("main").innerHTML = "";
                const node = document.createElement("div");
                node.className = "nosearchresult";
                const nomatch = document.createElement("h2");
                const nomatchdata = document.createTextNode("Sorry, we don't currently have any courses available for this language.");
                nomatch.appendChild(nomatchdata);
                node.appendChild(nomatch);
                document.getElementById("main").appendChild(node);
            }
            else {
                const comments = document.createElement("div");
                //list courses by newest first
                courses.reverse().forEach((course) => {
                    //create elements for results div
                    const node = document.createElement("div");
                    const language = document.createElement("h4");
                    const proficiency = document.createElement("h4");
                    const cost = document.createElement("h4");
                    const location = document.createElement("h4");
                    const email = document.createElement("h4");
                    //assign their classes
                    node.className = "card-body";
                    language.className = "card-title";
                    proficiency.className = "card-text";
                    cost.className = "card-text";
                    location.className = "card-text";
                    email.className = "card-text";
                    //for css purposes
                    language.setAttribute("id", "top");
                    proficiency.setAttribute("id", "mid");
                    cost.setAttribute("id", "mid");
                    location.setAttribute("id", "mid");
                    email.setAttribute("id", "mid");
                    //append course data from server
                    const languagedata = document.createTextNode("Language: " + course.language);
                    const proficiencydata = document.createTextNode("Proficiency:  " + course.proficiency);
                    const costdata = document.createTextNode("Cost:  " + course.cost);
                    const locationdata = document.createTextNode("Location:  " + course.location);
                    const emaildata = document.createTextNode("Email:  " + course.email);
                    //append text to elements
                    language.appendChild(languagedata);
                    proficiency.appendChild(proficiencydata);
                    cost.appendChild(costdata);
                    location.appendChild(locationdata);
                    email.appendChild(emaildata);
                    //append elements to div
                    node.appendChild(language);
                    node.appendChild(proficiency);
                    node.appendChild(cost);
                    node.appendChild(location);
                    node.appendChild(email);
                    //append div to page
                    comments.appendChild(node);
                });
                container.appendChild(comments);
                document.getElementById("main").appendChild(container);
            }
        }
    }
    catch(error) {
        if (error instanceof TypeError) {
            checkconnection();
        }
        else {
            console.log(error);
        }
    }
}
//search through courses based on location
async function searchlocations(event) {
    event.preventDefault();
    try{
        let searchlocation = document.getElementById("searchlocation").value;
        console.log("searching courses by location: " + searchlocation);
        //prevent empty search
        if (searchlocation.length == 0){
            alert ("Please enter a location.");
        }
        else {
            //get request for courses by searching location
            const response = await fetch("http://127.0.0.1:5000/searchlocation?searchlocation=" + searchlocation);
            const body = await response.text();            
            const locations = JSON.parse(body);
            //empty div to show results
            document.getElementById("main").innerHTML = "";
            const container = document.createElement("div");
            container.setAttribute("id", "container");
            container.className = "container";
            var title = document.createElement("h2");
            var titledescription = document.createTextNode("Search Results for: " + searchlocation.toUpperCase());
            title.appendChild(titledescription);
            container.appendChild(title);
            document.getElementById("main").appendChild(container);
            //if no courses matching location search
            if (locations.length == 0) {
                document.getElementById("main").innerHTML = "";
                const node = document.createElement("div");
                node.className = "nosearchresult";
                const nomatch = document.createElement("h2");
                const nomatchdata = document.createTextNode("Sorry, we don't currently have any courses available in this location.");
                nomatch.appendChild(nomatchdata);
                node.appendChild(nomatch);
                document.getElementById("main").appendChild(node);
            }
            else {
                const comments = document.createElement("div");
                //list newest courses first
                locations.reverse().forEach((course) => {
                    //create elements of results div
                    const node = document.createElement("div");
                    const language = document.createElement("h4");
                    const proficiency = document.createElement("h4");
                    const cost = document.createElement("h4");
                    const location = document.createElement("h4");
                    const email = document.createElement("h4");
                    //assign their classes
                    node.className = "card-body";
                    language.className = "card-title";
                    proficiency.className = "card-text";
                    cost.className = "card-text";
                    location.className = "card-text";
                    email.className = "card-text";
                    //for css purposes
                    language.setAttribute("id", "top");
                    proficiency.setAttribute("id", "mid");
                    cost.setAttribute("id", "mid");
                    location.setAttribute("id", "mid");
                    email.setAttribute("id", "mid");
                    //append course data from server
                    const languagedata = document.createTextNode("Language: " + course.language);
                    const proficiencydata = document.createTextNode("Proficiency:  " + course.proficiency);
                    const costdata = document.createTextNode("Cost:  " + course.cost);
                    const locationdata = document.createTextNode("Location:  " + course.location);
                    const emaildata = document.createTextNode("Email:  " + course.email);
                    //append text to elements
                    language.appendChild(languagedata);
                    proficiency.appendChild(proficiencydata);
                    cost.appendChild(costdata);
                    location.appendChild(locationdata);
                    email.appendChild(emaildata);
                    //append all to div
                    node.appendChild(language);
                    node.appendChild(proficiency);
                    node.appendChild(cost);
                    node.appendChild(location);
                    node.appendChild(email);
                    //append div to page
                    comments.appendChild(node);
                });
                container.appendChild(comments);
                document.getElementById("main").appendChild(container);
            }
        }
    }
    catch(error) {
        if (error instanceof TypeError) {
            checkconnection();
        }
        else {
            console.log(error);
        }
    }
}

// sends new course data submitted by user to server
async function sendcourse(event) {
    event.preventDefault();
    let language = document.getElementById("language").value;
    let proficiency = document.getElementById("proficiency").value;
    let cost = "£" + document.getElementById("cost").value;
    let location = document.getElementById("location").value;
    let email = document.getElementById("email").value;
    var number = /[0-9]/;
    //don't allow any empty section
    if (language == "" || proficiency == "" || cost == "" || location == "" || email == ""){
        alert("No section can be empty");
    }
    //check cost is number
    else if (!cost.match(number)) {
        alert("Cost has to be a number");
    }
    else {
        let data = {language, proficiency, cost, location, email};
        try {
            console.log("Sending course to server");
            //post request, post new course
            const options = {
                method: "POST",
                body: JSON.stringify(data),
                headers: { "Content-Type": "application/json"} ,
            };
            fetch("/newCourse", options);
            //empty div to success message
            document.getElementById("main").innerHTML = "";
            const node = document.createElement("div");
            node.className = "Sent";
            const confirm = document.createElement("h2");
            const success = document.createTextNode("Success! Your course has been uploaded.");
            confirm.appendChild(success);
            node.appendChild(confirm);
            document.getElementById("main").appendChild(node);
        }
        catch(error) {
            if (error instanceof TypeError) {
                checkconnection();
            }
            else {
                console.log(error);
            }
        }
    }
}

// loads courses and comments
async function loadcourses() {
    try {
        //get request for courses page
        const response = await fetch("/courses.html");
        const page = await response.text();
        document.getElementById("main").innerHTML = "";
        //load page
        document.getElementById("main").innerHTML = page;
        //load courses and comments
        viewcourses().then(viewcomments);
    }
    catch(error) {
        if (error instanceof TypeError) {
            checkconnection();
        }
        else {
            console.log(error);
        }
    }
}

// loads new course form - allows user to submit new course
async function loadnewCourse() {
    try {
        console.log("Loading new course form.");
        //get request for page
        const response = await fetch("/newCourse.html");
        const page = await response.text();

        document.getElementById("main").innerHTML = page;
        const button = document.getElementById("greenbutton");
        //button clicked call function to send course to server
        button.addEventListener("click", sendcourse);
    }
    catch(error) {
        if (error instanceof TypeError) {
            checkconnection();
        }
        else {
            console.log(error);
        }
    }
}