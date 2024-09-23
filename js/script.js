/*
Functions:

-updateTable() : for updating the table entries of localstorage.
-validation() : for validating input fields it takes one argument as a tring to identify validation request is coming from add or edit.
-addStudent() : for adding new entries after validation.
-addEditRemoveBtn() : the function includes two eventlistner one for delete entry and other for edit entry.
-updateBtn.addEventListener : it includes a function for updating the existing entries.
-changeToRegistrationForm : this function is used to changing the form back to registration form, from updation form.

*/


let submitBtn = document.getElementById('submitBtn'); // button for form submission
let updateBtn = document.getElementById('updateBtn'); // button for updating edited form
let tableBody = document.querySelector('tbody'); // table body

submitBtn.addEventListener("click", addStudent); // eventlistner for adding new entries.
updateTable();// displaying existing entries

/* function to display exiting entries*/
function updateTable() {
    tableBody.innerHTML = ''; // clearing table for adding new entries.

    let storedStudents = JSON.parse(localStorage.getItem('students')) || []; //getting data from localstorage
    if (storedStudents.length > 0) {
        //looping each entries into row.
        for (let entries of storedStudents) {

            let newRow = document.createElement("tr");//creating new row for entries.

            //creating coloumn for each fields.
            let newColId = document.createElement('td');
            let newColName = document.createElement('td');
            let newColEmail = document.createElement('td');
            let newColContact = document.createElement('td');
            let editBtn = document.createElement('td');
            let delBtn = document.createElement('td');

            //adding data to each column.
            newColId.innerHTML = entries.id;
            newColName.innerHTML = entries.name;
            newColEmail.innerHTML = entries.email;
            newColContact.innerHTML = entries.contact;
            editBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
            delBtn.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
            editBtn.classList.add('edit');
            delBtn.classList.add('remove');

            //appending all coloumns to the row.
            newRow.appendChild(newColId);
            newRow.appendChild(newColName);
            newRow.appendChild(newColEmail);
            newRow.appendChild(newColContact);
            newRow.appendChild(editBtn);
            newRow.appendChild(delBtn);

            //appending row to the table.
            tableBody.appendChild(newRow);

        }
        //adding edit remove btn functionality.
        addEditRemoveBtn();

        //adding dynamic scrollbar.
        if (tableBody.parentElement.parentElement.scrollHeight > 360) {  
            tableBody.parentElement.parentElement.classList.add('scrollable'); 
        } else {
            tableBody.parentElement.parentElement.classList.remove('scrollable'); 
        }
    }
}

/*function for validating entries*/
function validation(rqFor) { //rqFor is taken to identify the validation request for add or edit.

    //values from input fields.
    let stdId = document.getElementById("stdId").value;
    let stdName = document.getElementById("stdName").value;
    let stdEmail = document.getElementById("stdEmail").value;
    let stdContact = document.getElementById("stdContact").value;

    //patterns for validation.
    const idPattern = /^[0-9]+$/;
    const namePattern = /^[a-zA-Z\s]+$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const contactPattern = /^[0-9]{10}$/;

    //checking for any empty field.
    if (!stdId || !stdName || !stdEmail || !stdContact) {
        alert("Some fields are empty.");
        return false;
    }

    if (!idPattern.test(stdId)) {
        alert("Invalid student Id. Only numbers are allowed.");
        return false;
    }
    //checking for id already exist or not in localstorage.
    let studentsList = JSON.parse(localStorage.getItem('students')) || [];
    if (studentsList.find(student => student.id === stdId) && rqFor === "add") {
        alert("Invalid student Id. Id already exists.");
        return false;
    }
    if (!namePattern.test(stdName)) {
        alert("Invalid name. Only letters are allowed.");
        return false;
    }
    if (!emailPattern.test(stdEmail)) {
        alert("Invalid email address.");
        return false;
    }
    if (!contactPattern.test(stdContact)) {
        alert("Invalid contact number. It must be a 10-digit number.");
        return false;
    }
    return true;
}

/*function to add new entries*/
function addStudent() {

    //taking values from input fields
    let stdId = document.getElementById('stdId');
    let stdName = document.getElementById('stdName');
    let stdEmail = document.getElementById('stdEmail');
    let stdContact = document.getElementById('stdContact');

    // adding entries after validation
    if (validation("add")) {
        let student = {
            id: stdId.value,
            name: stdName.value,
            email: stdEmail.value,
            contact: stdContact.value
        }
        let studentsList = JSON.parse(localStorage.getItem('students')) || [];
        studentsList.push(student);
        localStorage.setItem('students', JSON.stringify(studentsList));

        updateTable();//updating table entries

        //reassigning value to empty to all input fields
        stdId.value = '';
        stdName.value = '';
        stdEmail.value = '';
        stdContact.value = '';
    }
}

/*function to add edit remove button eventlistner*/
function addEditRemoveBtn() { // this function adds edit and remove btn eventlistner.
    let editBtn = document.querySelectorAll('.edit');
    let delBtn = document.querySelectorAll('.remove');

    //functionality for delete entries.
    delBtn.forEach((button, index) => {
        button.addEventListener('click', () => {
            let studentsList = JSON.parse(localStorage.getItem('students')) || [];
            //removing the entry matching with the id.
            studentsList = studentsList.filter(student => student.id !== studentsList[index].id);
            localStorage.setItem('students', JSON.stringify(studentsList));

            updateTable();// updating the table.
        });
    });
    //functinality for editing entries.
    editBtn.forEach((button, index) => {
        button.addEventListener('click', () => {
            let studentsList = JSON.parse(localStorage.getItem('students')) || [];

            //displaying old entries in form for updation.
            document.getElementById('stdId').value = studentsList[index].id;
            document.getElementById('stdName').value = studentsList[index].name;
            document.getElementById('stdEmail').value = studentsList[index].email;
            document.getElementById('stdContact').value = studentsList[index].contact;

            //changing submit button to update button.
            submitBtn.style.display = "none";
            submitBtn.style.pointerEvents = "none";
            updateBtn.style.display = "inline";
            updateBtn.style.pointerEvents = "all";

            // adding value for updatebutton to identify which entry is to be edited.
            updateBtn.value = index;

            //form heading changed to edit form
            document.getElementById('formHeading').innerHTML = "Edit Details";
            document.getElementById('formHeading').style.color = "greenyellow";

            // id is set to unchangeable at time of updation
            document.getElementById('stdId').setAttribute("readonly","true");
            document.getElementById('stdId').setAttribute("disabled","true");
            document.getElementById('stdId').style.cursor = "not-allowed";

            //focused of name input field.
            document.getElementById('stdName').focus();
        })
    })
}

/* eventlistner for updating edited form*/
updateBtn.addEventListener("click", () => {
    //updating form after validation.
    if (validation("edit")) {
        let studentsList = JSON.parse(localStorage.getItem('students')) || [];

        if(studentsList[updateBtn.value]){//updateBtn.value has the index of the entry which to be edited.
            //updating new values.
            studentsList[updateBtn.value].name = document.getElementById('stdName').value;
            studentsList[updateBtn.value].email = document.getElementById('stdEmail').value;
            studentsList[updateBtn.value].contact = document.getElementById('stdContact').value;

            localStorage.setItem('students', JSON.stringify(studentsList));
        }

        updateTable();//updating table.
        changeToRegistrationForm();// changing form back to original registration form.
    }
});

function changeToRegistrationForm(){

    //values set to empty.
    document.getElementById('stdId').value = '';
    document.getElementById('stdName').value = '';
    document.getElementById('stdEmail').value = '';
    document.getElementById('stdContact').value = '';

    //update button change to submit button.
    submitBtn.style.display = "revert";
    submitBtn.style.pointerEvents = "all";
    updateBtn.style.display = "none";
    updateBtn.style.pointerEvents = "none";

    //changed form heading to registration form
    document.getElementById('formHeading').innerHTML = "Registration Form";
    document.getElementById('formHeading').style.color = "white";

    //removed readonly property from id input field
    document.getElementById('stdId').removeAttribute("readonly");
    document.getElementById('stdId').removeAttribute("disabled");
    document.getElementById('stdId').style.cursor = "text";
}
