const toDo = (function() {
    function Project(projectTitle) {
        return {projectTitle,toDoList:[]};
    }
    function ToDo(title,description,dueDate,priority) {
        return {title,description,dueDate,priority};
    }
    function divToDo(title1,description1,dueDate1,priority1) {
        let div = document.createElement('div');
        div.className = "toDo";
        let title = document.createElement('div');
        title.className = "title";
        let description = document.createElement('div');
        description.className = "description";
        let dueDate = document.createElement('div');
        dueDate.className = "dueDate";
        let priority = document.createElement('div');
        priority.className = "priority";
        title.textContent = title1;
        description.textContent = description1;
        dueDate.textContent = dueDate1;
        priority.textContent = priority1;
        if (priority1 == "High") {
            priority.style.color = 'Red';
        } else {
            priority.style.color = "Green";
        }
        let img = document.createElement("img");
        let imgD = document.createElement("img");
        imgD.className = "delete";
        img.className = "edit";
        imgD.src = "./delete.png"
        img.src = "./pencil.png";
        div.appendChild(title);
        div.appendChild(description);
        div.appendChild(dueDate);
        div.appendChild(priority);
        div.appendChild(img);
        div.appendChild(imgD);
        return div;
    }
    function editForm() {
        // Création du formulaire
        const form = document.createElement("form");
        form.className = "editForm";
        // Label et input pour le titre
        const labelTitle = document.createElement("label");
        labelTitle.textContent = "New Title";
        labelTitle.setAttribute("for", "title");
        form.appendChild(labelTitle);

        const inputTitle = document.createElement("input");
        inputTitle.type = "text";
        inputTitle.name = "title";
        inputTitle.placeholder = "Title";
        inputTitle.required = true;
        form.appendChild(inputTitle);

        // Label et input pour la description
        const labelDescription = document.createElement("label");
        labelDescription.textContent = "New Description";
        labelDescription.setAttribute("for", "description");
        form.appendChild(labelDescription);

        const inputDescription = document.createElement("input");
        inputDescription.type = "text";
        inputDescription.name = "description";
        inputDescription.placeholder = "Description";
        inputDescription.required = true;
        form.appendChild(inputDescription);

        // Sélecteur de priorité
        const selectPriority = document.createElement("select");
        selectPriority.name = "priority";
        selectPriority.required = true;

        const optionNone = document.createElement("option");
        optionNone.value = "";
        optionNone.selected = true;
        optionNone.textContent = "None";
        selectPriority.appendChild(optionNone);

        const optionLow = document.createElement("option");
        optionLow.value = "Low";
        optionLow.textContent = "Low";
        selectPriority.appendChild(optionLow);

        const optionHigh = document.createElement("option");
        optionHigh.value = "High";
        optionHigh.textContent = "High";
        selectPriority.appendChild(optionHigh);

        form.appendChild(selectPriority);

        // Label et input pour la date
        const labelDate = document.createElement("label");
        labelDate.textContent = "New Date";
        labelDate.setAttribute("for", "date");
        form.appendChild(labelDate);

        const inputDate = document.createElement("input");
        inputDate.type = "date";
        inputDate.name = "date";
        inputDate.required = true;
        form.appendChild(inputDate);

        // Bouton submit
        const buttonSubmit = document.createElement("button");
        buttonSubmit.class = "addEdit";
        buttonSubmit.type = "submit";
        buttonSubmit.textContent = "Add";
        form.appendChild(buttonSubmit);
        return form;
    }
    return {Project,ToDo,divToDo,editForm};

})();



//D O M

const dom = (function() {
    let projectsList = [toDo.Project("all")];
    let projectsListName = ["all"];
    let formProject = document.getElementById("formProject");
    let formToDo = document.getElementById("formToDo");
    let currentProject = "all";
    //this function adds Event Listeners to the forms
    const initialize = () => {
        //projects form
        formProject.addEventListener("submit", (e) => {
            e.preventDefault();
            let projectName = "";
            let elements = formProject.elements;
            Array.from(elements).forEach((elem) => {
                if (elem.name == "projectName") {
                    projectName = elem.value;
                }
            })
            if (!projectsListName.includes(projectName)) {
                let project = new toDo.Project(projectName);
                projectsList.push(project);
                currentProject = projectName;
                showProjects();
                showToDos();
                switchProject();
                projectsListName.push(projectName);
            }else {
                alert("Name already taken!");
            }
        });
        // to do lists forms
        formToDo.addEventListener("submit", (e) => {
            e.preventDefault();
            let elements = formToDo.elements;
            let title = "";
            let description = "";
            let dueDate;
            let priority;
            Array.from(elements).forEach((elem) => {
                if (elem.name == "title") {
                    title = elem.value;
                } else if (elem.name == "description") {
                    description = elem.value;
                } else if (elem.name == "date") {
                    dueDate = elem.value;
                } else if (elem.name == "priority") {
                    priority = elem.options[elem.selectedIndex].text;
                }
            })
            // cant have same title for 2 toDos
            for (let proj of projectsList) {
                for (let todo of proj.toDoList) {
                   if (title == todo.title && proj.projectTitle == currentProject) {
                        alert("cant have same todos!");
                        return;
                    }
                }
            }
            let todo = new toDo.ToDo(title,description,dueDate,priority);
            projectsList.forEach((project) => {
                if (project.projectTitle == currentProject) {
                    project.toDoList.push(todo);
                }
            })
            showToDos();
            
        })
    }
    const showProjects = () => {
        let projectListDiv = document.querySelector(".pj");
        //removes all child nodes of the list (resetting)
        projectListDiv.textContent = "";
        projectsList.forEach((p) => {
            let div = document.createElement('div');
            div.className = "project";
            div.textContent = p.projectTitle;
            projectListDiv.appendChild(div);
        })
    }
    const showToDos = () => {
        let toDoDiv = document.querySelector(".toDoList");
        //removes all child nodes of the list (resetting)
        toDoDiv.textContent = "";
        projectsList.forEach((project) => {
            if (project.projectTitle == currentProject) {
                project.toDoList.forEach((t) => {
                    let div = toDo.divToDo(t.title,t.description,t.dueDate,t.priority);
                    toDoDiv.append(div);
                    editToDo();
                    removeToDos();
                })
            }
        })
    }
    let switchProject = () => {
        let projects = document.querySelectorAll('.project');
        projects.forEach((p) => {
            p.addEventListener("click", (e) => {
                currentProject = p.textContent;
                showToDos();
            })
        })
        
    }
    const editToDo = () => {
        let edits = document.querySelectorAll(".edit");
        edits.forEach((edit) => {
            let edit2 = edit.cloneNode(true);
            edit.parentNode.replaceChild(edit2,edit);
            // Ajouter un nouveau listener sur le clone
        edit2.addEventListener("click", (e) => {
            let todo = e.target.parentNode;

            edit2.style.display = "none";

            let form = toDo.editForm();
            todo.appendChild(form);

            form.addEventListener("submit", (e) => {
                e.preventDefault();
                todo.removeChild(form);
                edit2.style.display = 'block';

                // Initialisation correcte des nouvelles valeurs
                let newTitle, newDescription, newDueDate, newPriority;
                let elements = form.elements;

                Array.from(elements).forEach((elem) => {
                    switch (elem.name) {
                        case 'title':
                            newTitle = elem.value;
                            break;
                        case 'description':
                            newDescription = elem.value;
                            break;
                        case 'date':
                            newDueDate = elem.value;
                            break;
                        case 'priority':
                            newPriority = elem.options[elem.selectedIndex].text;
                            break;
                    }
                });
                let oldTitle = "";
                todo.childNodes.forEach((cn) => {
                    if (cn.className === 'title') {
                        oldTitle = cn.textContent;
                        console.log("old title = " + oldTitle);
                        cn.textContent = newTitle;
                    } else if (cn.className === 'description') {
                        cn.textContent = newDescription;
                    } else if (cn.className === 'priority') {
                        cn.textContent = newPriority;
                    } else if (cn.className === 'dueDate') {
                        console.log("new due date = " + newDueDate);
                        cn.textContent = newDueDate;
                    }
                });
                //replacing it in the array
                for (let proj of projectsList) {
                    for (let todo of proj.toDoList) {
                        if (oldTitle == todo.title && proj.projectTitle == currentProject) {
                            //cant have two toDos with the same name
                            
                            todo.title = newTitle;
                            todo.description = newDescription;
                            todo.dueDate = newDueDate;
                            todo.priority = newPriority;
                            console.log(todo);
                            return;
                        }
                    }
                }

            });
        });
    });
    }

    const removeToDos = () => {
        let deletes = document.querySelectorAll(".delete");
        deletes.forEach((del) => {
            let del2 = del.cloneNode(true);
            del.parentNode.replaceChild(del2,del);
            del2.addEventListener("click",(e) => {
                let todo = e.target.parentNode;
                let elems = todo.childNodes;
                let t = "";
                elems.forEach((elem) => {
                    if (elem.className == "title") {
                        t = elem.textContent;
                    }
                });
                //delete from the array of the project
                for (let proj of projectsList) {
                    if (proj.projectTitle == currentProject) {
                        console.log("mon t = " + t);
                        proj.toDoList = proj.toDoList.filter((td) => {
                            return td.title != t;
                        })
                        console.log(proj.toDoList);
                    }
                };
                todo.parentNode.removeChild(todo);
            })
            
        })
    }

    return {initialize,showProjects,showToDos,switchProject,editToDo,removeToDos};
})();

dom.initialize();
dom.showProjects();
dom.switchProject();
