let submitBtn = document.getElementById('submitBtn'); // button for form submission
let updateBtn = document.getElementById('updateBtn'); // button for updating edited form
let tableBody = document.querySelector('tbody'); // table body

submitBtn.addEventListener("click", addStudent); // eventlistner for adding new entries.
updateTable();// displaying existing entries

/* function to display exiting entries*/
function updateTable() {
    tableBody.innerHTML = '';
    let storedStudents = JSON.parse(localStorage.getItem('students')) || [];
    console.log(storedStudents);
    if (storedStudents.length > 0) {
        for (let entries of storedStudents) {

            let newRow = document.createElement("tr");
            let newColId = document.createElement('td');
            let newColName = document.createElement('td');
            let newColEmail = document.createElement('td');
            let newColContact = document.createElement('td');
            let editBtn = document.createElement('td');
            let delBtn = document.createElement('td');

            newColId.innerHTML = entries.id;
            newColName.innerHTML = entries.name;
            newColEmail.innerHTML = entries.email;
            newColContact.innerHTML = entries.contact;
            editBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
            delBtn.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
            editBtn.classList.add('edit');
            delBtn.classList.add('remove');

            newRow.appendChild(newColId);
            newRow.appendChild(newColName);
            newRow.appendChild(newColEmail);
            newRow.appendChild(newColContact);
            newRow.appendChild(editBtn);
            newRow.appendChild(delBtn);
            tableBody.appendChild(newRow);

        }
        addEditRemoveBtn();
    }
}

/*function for validating entries*/
function validation(rqFor) {
    let stdId = document.getElementById("stdId").value;
    let stdName = document.getElementById("stdName").value;
    let stdEmail = document.getElementById("stdEmail").value;
    let stdContact = document.getElementById("stdContact").value;


    const idPattern = /^[0-9]+$/;
    const namePattern = /^[a-zA-Z\s]+$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const contactPattern = /^[0-9]{10}$/;

    if (!stdId || !stdName || !stdEmail || !stdContact) {
        alert("Some fields are empty.");
        return false;
    }

    if (!idPattern.test(stdId)) {
        alert("Invalid student Id. Only numbers are allowed.");
        return false;
    }
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
    let stdId = document.getElementById('stdId');
    let stdName = document.getElementById('stdName');
    let stdEmail = document.getElementById('stdEmail');
    let stdContact = document.getElementById('stdContact');
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
        updateTable();
        stdId.value = '';
        stdName.value = '';
        stdEmail.value = '';
        stdContact.value = '';
    }
}

/*function to add edit remove button eventlistner*/
function addEditRemoveBtn() {
    let editBtn = document.querySelectorAll('.edit');
    let delBtn = document.querySelectorAll('.remove');

    delBtn.forEach((button, index) => {
        button.addEventListener('click', () => {
            let stdId = button.parentElement.childNodes[0].innerHTML;
            let studentsList = JSON.parse(localStorage.getItem('students')) || [];
            studentsList = studentsList.filter(student => student.id !== stdId);
            localStorage.setItem('students', JSON.stringify(studentsList));
            updateTable();
        });
    });

    editBtn.forEach((button, index) => {
        button.addEventListener('click', () => {
            let studentsList = JSON.parse(localStorage.getItem('students')) || [];

            document.getElementById('stdId').value = studentsList[index].id;
            document.getElementById('stdName').value = studentsList[index].name;
            document.getElementById('stdEmail').value = studentsList[index].email;
            document.getElementById('stdContact').value = studentsList[index].contact;

            submitBtn.style.display = "none";
            submitBtn.style.pointerEvents = "none";
            updateBtn.style.display = "inline";
            updateBtn.style.pointerEvents = "all";

            updateBtn.value = index;
            document.getElementById('formHeading').innerHTML = "Edit Details";
            document.getElementById('formHeading').style.color = "greenyellow";
            document.getElementById('stdId').setAttribute("readonly","true");
            document.getElementById('stdId').setAttribute("disabled","true");
            document.getElementById('stdId').style.cursor = "not-allowed";

            document.getElementById('stdName').focus();
        })
    })
}

/* eventlistner for updating edited form*/
updateBtn.addEventListener("click", () => {
    if (validation("edit")) {
        let studentsList = JSON.parse(localStorage.getItem('students')) || [];
        if(studentsList[updateBtn.value]){
            studentsList[updateBtn.value].id = document.getElementById('stdId').value;
            studentsList[updateBtn.value].name = document.getElementById('stdName').value;
            studentsList[updateBtn.value].email = document.getElementById('stdEmail').value;
            studentsList[updateBtn.value].contact = document.getElementById('stdContact').value;
            localStorage.setItem('students', JSON.stringify(studentsList));
        }
        updateTable();
        changeToRegistrationForm();
    }
});

function changeToRegistrationForm(){
    document.getElementById('stdId').value = '';
    document.getElementById('stdName').value = '';
    document.getElementById('stdEmail').value = '';
    document.getElementById('stdContact').value = '';

    submitBtn.style.display = "revert";
    submitBtn.style.pointerEvents = "all";
    updateBtn.style.display = "none";
    updateBtn.style.pointerEvents = "none";

    document.getElementById('formHeading').innerHTML = "Registration Form";
    document.getElementById('formHeading').style.color = "white";
    document.getElementById('stdId').removeAttribute("readonly");
    document.getElementById('stdId').removeAttribute("disabled");
    document.getElementById('stdId').style.cursor = "text";
}
