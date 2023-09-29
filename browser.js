//create features
function itemTemplate(item) {
    return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
    <span class="item-text">${item.text}</span>
    <div>
      <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
      <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
    </div>
  </li>`
}

// initial page load render
let ourHTML = item.map(function(item){
  return itemTemplate(item)
}).join("")
document.getElementById("item-list").insertAdjacentHTML("beforeend", ourHTML)
let createfield = document.getElementById("create-field")
document.getElementById("create-form").addEventListener("submit", function(e){
    e.preventDefault()
    axios.post("/create-item", {text: createfield.value}).then(function(response) {
        //create the  HTML for new item 
        document.getElementById("item-list").insertAdjacentHTML("beforeend", itemTemplate(response.data))
        createfield.value = ""
        createfield.focus()
      }).catch(function() {
          console.log("try again later") 
      }) 
})

document.addEventListener("click", function(e) {
    //delete features
    if (e.target.classList.contains("delete-me")) {
        if (confirm("Are you sure you want to delete")){
            axios.post("/delete-item", {id: e.target.getAttribute("data-id")}).then(function() {
                e.target.parentElement.parentElement.remove()
              }).catch(function() {
                  console.log("try again later")
              }) 
        }
    }

    //update features
    if (e.target.classList.contains("edit-me")) {
    let userinput = prompt("input new item", e.target.parentElement.parentElement.querySelector(".item-text").innerHTML)
    if (userinput)
    axios.post("/update-item", {text:userinput, id: e.target.getAttribute("data-id")}).then(function() {
        e.target.parentElement.parentElement.querySelector(".item-text").innerHTML = userinput
      }).catch(function() {
          console.log("try again later")
      }) 
    }  
}) 