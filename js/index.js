// destructuring objects from "courses.json"
let courses,messages,desc;

// loadCourses,loadMessages,loadDesc from json server
const loadCourses = async ()=>{
    const load = await fetch("http://localhost:3000/courses");
    const res = await load.json();
    courses = res;
}
const loadMessages =  async ()=>{
    const load = await fetch("http://localhost:3000/message");
    const res = await load.json();
    messages = res;
}
const loadDesc =  async ()=>{
    const load = await fetch("http://localhost:3000/desc");
    const res = await load.json();
    desc = res;
}
const load = async ()=>{
    await loadMessages();
    displayCatMessage();
    await loadDesc();
    displayCatDesc();
    await loadCourses();
    displayCourses();   
    document.querySelector("#explore").innerHTML = `Explore ${activeTabs.innerHTML}`;
}
load();

/*filter search*/
const filter = (searchKeyWords,courseTitle)=>{
    let cnt  = 0;
    for(let i of searchKeyWords){
        for (let j of courseTitle){
            if(i==j) cnt ++;
        }
    }
    return cnt ;
}
const search = (keywords)=>{
    keywords = keywords.toLowerCase();
    keywords = keywords.split(" ");
    const searchInput = []
    for(let catName in courses){
        let cat = courses[catName];
        for(let course of cat){
            
            let courseName = course.name.toLowerCase();
            
            courseName = courseName.split(" ");
            
            const cnt  = filter(keywords, courseName);
            course.rank = cnt ;
            if(cnt >0)searchInput.push(course);
        }
    }
    searchInput.sort((a, b) => {
        return b.rank - a.rank;
    });
    courses.search = searchInput;
}
const searchButton = document.querySelector("#searchButton");
const searchBar = document.querySelector(".searchBar");

searchButton.addEventListener("click",()=>{
    event.preventDefault();
    if(searchBar.value != ""){
        courses.search = [];
        search(searchBar.value);
        displayCourses("search");
        if(activeTabs != null)activeTabs.classList.remove("listOfTabs");
        activeTabs = null;
        document.querySelector("#message").classList.add("result");
        hide("#desc");
        hide("#explore");
        document.querySelector("#message").innerHTML = `${courses.search.length} result(s) for "${searchBar.value}"`;
    }

});

/*Tab categories*/

// display activeTabs
let activeTabs = document.querySelector(".listOfTabs").children[0];
activeTabs.classList.add("listOfTabs");
// change the display property of element .
const hide = (elementid)=>{document.querySelector(elementid).classList.add("disappear");}
const show = (elementid)=>{document.querySelector(elementid).classList.remove("disappear");}
//display {the message, the description, the courses} of the active category.
const displayCatMessage = (category = activeTabs.textContent.toLowerCase())=>{
    document.querySelector("#message").innerHTML=messages[category];
}
const displayCatDesc = (category = activeTabs.textContent.toLowerCase())=>{
    document.querySelector("#desc").innerHTML=desc[category];
}
const displayCourses = (category = activeTabs.textContent.toLowerCase())=>{
// Creating div of course cards.
    const coursesDiv = document.createElement("div");
// loop  the courses active category.
    courses[category].forEach(course => {
        const courseCard = createCourseCard(course, category);
        coursesDiv.appendChild(courseCard);
    });   
//remove the old courses.
    document.querySelector("#courses").remove();
//display courses card based on category active 
    coursesDiv.id = "courses";
    document.querySelector("#category").appendChild(coursesDiv);
}
const categoryList = document.querySelector(".listOfTabs");
categoryList.addEventListener("click",(e)=>{
    if(e.target.localName == "li" && activeTabs != e.target){
        document.querySelector("#message").classList.remove("result");
        show("#desc");
        show("#explore");
        if(activeTabs!=null && activeTabs!=undefined)activeTabs.classList.remove("listOfTabs");
        activeTabs = e.target;
        activeTabs.classList.add("listOfTabs"); 
        displayCatMessage();
        displayCatDesc();
        displayCourses();
        document.querySelector("#explore").innerHTML = `Explore ${activeTabs.innerHTML}`;
    }
});

/*Creat Card*/
//based on forEach"as long data as the same it" let's take data from json server and "Creat card".
const createCourseCard = (courseInfo)=>{
    const courseCard = document.createElement("div");
    courseCard.classList.add("course");

    const courseImg = document.createElement("img");
    courseImg.src = "resourses/"+courseInfo.cat+"/course"+courseInfo.id+".jpg";
    courseCard.appendChild(courseImg);

    const courseName = document.createElement("h4");
    courseName.textContent = courseInfo.name;
    courseName.classList.add("courseName");
    courseCard.appendChild(courseName);

    const instructor = document.createElement("h5");
    instructor.textContent = courseInfo.instructor;
    instructor.classList.add("instructor");
    courseCard.appendChild(instructor);

    const rating = document.createElement("div");
    rating.textContent = courseInfo.rating;
    rating.classList.add("rating");

    for(let i=0;i<=5;i++){
        if((courseInfo.rating)>= i){
        const star = document.createElement("i");
        star.className = "fa-solid fa-star";
        rating.appendChild(star);   
        }
        else if((courseInfo.rating)+0.5>=i) {
        const star = document.createElement("i");
        star.className = "fa-solid fa-star-half-stroke";
        rating.appendChild(star);   
        } 
        else {
            const star = document.createElement("i");
            star.className = "fa-regular fa-star";
            rating.appendChild(star);  
        }
    }
    
    const users = document.createElement("span");
    users.textContent = `(${courseInfo.users})`;
    users.classList.add("users");

    rating.appendChild(users);
    courseCard.appendChild(rating);

    const prices = document.createElement("div");

    const currentPrice = document.createElement("span");
    currentPrice.classList.add("price");
    currentPrice.textContent = `E£${courseInfo.price}`;
    prices.appendChild(currentPrice);

    const oldPrice = document.createElement("span");
    oldPrice.classList.add("oldPrice");
    oldPrice.textContent = `E£${courseInfo.oldPrice}`;  
    if(courseInfo.oldPrice)prices.appendChild(oldPrice);
    courseCard.appendChild(prices);
    
    if(courseInfo.bestseller){
        const bestsellerSpan = document.createElement("span");
        bestsellerSpan.textContent = "Bestseller";
        bestsellerSpan.classList.add("bestseller");
        courseCard.appendChild(bestsellerSpan);
    }
    return courseCard;
}
//https://www.codegrepper.com/code-examples/javascript/How+to+use+search%2Ffilter+for+HTML+Divs+generated+from+JSON+data+using+JavaScript







