const db = firebase.firestore();

function addTask() {
    var taskInput = document.getElementById("taskInput");
    var taskTitle = taskInput.value.trim();
    if (taskTitle !== "") {
        var taskList = document.getElementById("taskList");

        var taskItem = document.createElement("li");
        taskItem.classList.add("task-item");

        var taskCheckbox = document.createElement("input");
        taskCheckbox.type = "checkbox";
        taskCheckbox.onclick = function() { toggleTask(taskItem, taskCheckbox) };

        var taskTitleText = document.createElement("span");
        taskTitleText.textContent = taskTitle;

        var deleteButton = document.createElement("button");
        deleteButton.textContent = "Deletar";
        deleteButton.onclick = function() { deleteTask(taskItem, taskTitle) };

        taskItem.appendChild(taskCheckbox);
        taskItem.appendChild(taskTitleText);
        taskItem.appendChild(deleteButton);

        taskList.appendChild(taskItem);

        taskInput.value = "";

        const user = firebase.auth().currentUser;
        if (user) {
            db.collection('tasks').doc(user.uid).collection('userTasks').add({
                title: taskTitle,
                completed: false
            }).then((docRef) => {
                console.log("Tarefa adicionada com ID: ", docRef.id);
            }).catch((error) => {
                console.error("Erro ao adicionar tarefa: ", error);
            });
        }
    }
}

function toggleTask(taskItem, taskCheckbox) {
    var taskTitleText = taskItem.querySelector("span");

    if (taskCheckbox.checked) {
        taskTitleText.style.textDecoration = "line-through"; 
        taskTitleText.style.color = "gray"; 

        taskItem.parentElement.appendChild(taskItem);

        const user = firebase.auth().currentUser;
        if (user) {
            const taskId = taskItem.id;
            db.collection('tasks').doc(user.uid).collection('userTasks').doc(taskId).update({
                completed: true
            }).then(() => {
                console.log("Tarefa marcada como concluída");
            }).catch((error) => {
                console.error("Erro ao atualizar tarefa: ", error);
            });
        }
    } else {
        taskTitleText.style.textDecoration = "none"; 
        taskTitleText.style.color = "black"; 

        taskItem.parentElement.insertBefore(taskItem, taskItem.parentElement.firstChild);

        const user = firebase.auth().currentUser;
        if (user) {
            const taskId = taskItem.id;
            db.collection('tasks').doc(user.uid).collection('userTasks').doc(taskId).update({
                completed: false
            }).then(() => {
                console.log("Tarefa desmarcada como concluída");
            }).catch((error) => {
                console.error("Erro ao atualizar tarefa: ", error);
            });
        }
    }
}

function deleteTask(taskItem, taskTitle) {
    taskItem.remove();

    const user = firebase.auth().currentUser;
    if (user) {
        const taskId = taskItem.id;
        db.collection('tasks').doc(user.uid).collection('userTasks').doc(taskId).delete().then(() => {
            console.log("Tarefa deletada: ", taskTitle);
        }).catch((error) => {
            console.error("Erro ao deletar tarefa: ", error);
        });
    }
}

function loadTasks() {
    const user = firebase.auth().currentUser;
    if (user) {
        db.collection('tasks').doc(user.uid).collection('userTasks').get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                var taskTitle = doc.data().title;
                var completed = doc.data().completed;

                var taskItem = document.createElement("li");
                taskItem.classList.add("task-item");
                taskItem.id = doc.id;

                var taskCheckbox = document.createElement("input");
                taskCheckbox.type = "checkbox";
                taskCheckbox.checked = completed;
                taskCheckbox.onclick = function() { toggleTask(taskItem, taskCheckbox) };

                var taskTitleText = document.createElement("span");
                taskTitleText.textContent = taskTitle;
                if (completed) {
                    taskTitleText.style.textDecoration = "line-through";
                    taskTitleText.style.color = "gray";
                }

                var deleteButton = document.createElement("button");
                deleteButton.textContent = "Deletar";
                deleteButton.onclick = function() { deleteTask(taskItem, taskTitle) };

                taskItem.appendChild(taskCheckbox);
                taskItem.appendChild(taskTitleText);
                taskItem.appendChild(deleteButton);

                document.getElementById("taskList").appendChild(taskItem);
            });
        }).catch((error) => {
            console.error("Erro ao carregar tarefas: ", error);
        });
    }
}

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        loadTasks();
    } else {
        window.location.href = "../login/login.html";
    }
});

function logout() {
    firebase.auth().signOut()
        .then(() => {
            console.log("Usuário deslogado com sucesso.");
            window.location.href = "../login/login.html";
        })
        .catch((error) => {
            console.error("Erro ao deslogar: ", error);
        });
}
