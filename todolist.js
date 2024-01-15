let btnAdd = document.querySelector("#input_btn_add");
let pendingTasksElement = document.querySelector(".pending_task_container ul");
let doneTasksElement = document.querySelector(".done_task_container ul");
let btnDeleteAllTasks = document.querySelector("#btn-delete-all");
let totalTasksElement = document.querySelector("#total");
let totalDoneTasksElement = document.querySelector("#done");
document.querySelector("#today_time").innerText = getCurrentDate();
totalTasksElement.querySelector("span").innerText = 0;
totalDoneTasksElement.querySelector("span").innerText = 0;

function getCurrentDate() {
  const currentDate = new Date();
  const day = currentDate.getDate().toString().padStart(2, '0');
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const year = currentDate.getFullYear();

  return `${day}/${month}/${year}`; //15/1/2023
}
// let task = [
//   {
//     id: 1,
//     name: "quet nha",
//     complete: false,
//     priority: false,
//   },
//   {
//     id: 2,
//     name: "Lau nha",
//     complete: true,
//     priority: false,
//   },
// ];
let tasksList = [];

function generateAutoId() {
  const timestamp = new Date().getTime();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const autoId = `${timestamp}${randomStr}`;
  return autoId;
}

btnAdd.onclick = (e) => {
  let inputAdd = document.querySelector("#input_text");
  if (!inputAdd) {
    console.log("Missing input!!!");
  } else {
    let pendingTaskDetail = document.createElement("li");
    let taskNameValue = inputAdd.value;
    let pendingdataAutoId = generateAutoId();
    pendingTaskDetail.setAttribute("data-task-id", pendingdataAutoId);
    pendingTaskDetail.innerHTML = `
            <div class="pending_task_left">
                <input type="checkbox" id="pending_task_checkbox">
                <span class="pending_task_name">${taskNameValue}</span>
            </div>
            <div class="pending_task_right">
                <button class="pending_task_right-btn" id="pendingtask_priority"><span><i
                        class="fa-solid fa-star"></i></span></button>
                <button class="pending_task_right-btn" id="pendingtask_edit"><span><i
                        class="fa-solid fa-pen-to-square"></i></span></button>
                <button class="pending_task_right-btn" id="pendingtask_delete"><span><i class="fa-solid fa-trash"></i></span></button>
            </div>
    `;
    pendingTaskDetail.classList.add("pending_task_detail");
    tasksList.push({
      id: pendingdataAutoId,
      name: inputAdd.value,
      complete: false,
      priority: false,
    });

    // Check complete Task
    let currentCheckbox = pendingTaskDetail.querySelector(
      "#pending_task_checkbox"
    ); // false
    currentCheckbox.onchange = (e) => {

      if (e.target.checked) {

        tasksList = tasksList.map((el) => {
          if (el.id == pendingdataAutoId) {
            return {
              ...el,
              complete: true,
            };
          } else {
            return el;
          }
        });

        pendingTaskDetail.classList.add("done_task_detail");
        pendingTaskDetail.classList.remove("pending_task_detail");

        pendingTaskDetail
          .querySelector(".pending_task_name")
          .classList.add("active_done_task");
        pendingTasksElement.removeChild(pendingTaskDetail);
        doneTasksElement.appendChild(pendingTaskDetail);
      } else {
        tasksList = tasksList.map((el) => {
          if (el.id == pendingdataAutoId) {
            return {
              ...el,
              complete: false,
            };
          } else {
            return el;
          }
        });
        pendingTaskDetail
          .querySelector(".pending_task_name")
          .classList.remove("active_done_task");
        doneTasksElement.removeChild(pendingTaskDetail);
        pendingTasksElement.appendChild(pendingTaskDetail);
      }
      handleCalculateTotalTasks();
    };

    pendingTasksElement.appendChild(pendingTaskDetail);
    handleCalculateTotalTasks();
    inputAdd.value = "";

    // Delete pending task
    let deleteBtn = pendingTaskDetail.querySelector("#pendingtask_delete");
    deleteBtn.onclick = (e) => {
      pendingTasksElement.removeChild(pendingTaskDetail);
      tasksList = tasksList.filter((el) => el.id !== pendingdataAutoId);
      handleCalculateTotalTasks();
    };

    // Edit task
    let btnEditTask = pendingTaskDetail.querySelector("#pendingtask_edit"); // false
    let titleTaskSpan = pendingTaskDetail.querySelector(".pending_task_name");

    let taskInputContainer =
      pendingTaskDetail.querySelector(".pending_task_left");
    let btnRightContainer = pendingTaskDetail
      .querySelector(".pending_task_right")
      .querySelectorAll(".pending_task_right-btn");

    btnEditTask.onclick = (e) => {
      let listPendingTasks = Array.from(
        pendingTasksElement.querySelectorAll("li")
      );
      let isExistingEditBox = listPendingTasks.some((task, id) => {
        return (
          task.querySelector("#edit_btn_container") &&
          !task
            .querySelector("#edit_btn_container")
            .classList.contains("hidden_item")
        );
      });
      if (isExistingEditBox) {
        alert("Please save the previous editing task!");
        return;
      }
      if (titleTaskSpan) {
        let titleTaskInput = document.createElement("input");

        let rightBtnContainer = document.createElement("div");
        rightBtnContainer.innerHTML = `

          <span id="todolist-icon-save">
              save
          </span>
          <span id="todolist-icon-cancel">
              cancel
          </span>

        `;
        rightBtnContainer.classList.add("edit_btn_container");
        rightBtnContainer.id = "edit_btn_container";

        // Gán giá trị của thẻ <span> cho thuộc tính value của phần tử <input>

        btnRightContainer.forEach(
          (el) => el.classList.add("hidden_item")
          // console.log(el)
        );
        titleTaskInput.value = titleTaskSpan.textContent;

        titleTaskInput.classList.add("pending_task_left");
        titleTaskSpan.classList.add("hidden_item");
        currentCheckbox.classList.add("hidden_item");

        if (
          !taskInputContainer.querySelector(".pending_task_left") &&
          !pendingTaskDetail.querySelector("#edit_btn_container")
        ) {
          taskInputContainer.appendChild(titleTaskInput); // dua input vo dom
          pendingTaskDetail
            .querySelector(".pending_task_right")
            .appendChild(rightBtnContainer);
        } else {
          taskInputContainer
            .querySelector(".pending_task_left")
            .classList.remove("hidden_item");

          pendingTaskDetail
            .querySelector("#edit_btn_container")
            .classList.remove("hidden_item");
        }

        //cancel
        let cancelBtn = rightBtnContainer.querySelector(
          "#todolist-icon-cancel"
        );

        cancelBtn.onclick = (e) => {
          rightBtnContainer.classList.add("hidden_item");
          titleTaskSpan.classList.remove("hidden_item");
          currentCheckbox.classList.remove("hidden_item");
          titleTaskInput.classList.add("hidden_item");
          btnRightContainer.forEach((el) => el.classList.remove("hidden_item"));
        };

        //save
        let saveBtn = rightBtnContainer.querySelector("#todolist-icon-save");
        saveBtn.onclick = (e) => {
          if (!titleTaskInput.value) {
            alert("Điền ngay cho chị");
            return;
          }
          rightBtnContainer.classList.add("hidden_item");
          titleTaskSpan.classList.remove("hidden_item");
          currentCheckbox.classList.remove("hidden_item");
          titleTaskInput.classList.add("hidden_item");
          btnRightContainer.forEach((el) => el.classList.remove("hidden_item"));
          titleTaskSpan.classList.remove("hidden_item");
          titleTaskSpan.innerText = titleTaskInput.value;

          tasksList = tasksList.map((el) => {
            if (el.id === pendingdataAutoId) {
              if (el.name !== titleTaskSpan.innerText) {
                return {
                  ...el,
                  name: titleTaskSpan.innerText,
                };
              }
            } else {
              return el;
            }
          });
        };
      } else {
        console.error("Không tìm thấy thẻ <span> cần thiết");
      }
    };

    //priority
    let priorityBtn = pendingTaskDetail.querySelector("#pendingtask_priority");
    priorityBtn.onclick = (e) => {
      let targetLiElement = e.target.closest("li");
      if (targetLiElement.classList.contains("priority_item")) {
        targetLiElement.classList.remove("priority_item");
        pendingTasksElement.removeChild(targetLiElement);
        pendingTasksElement.appendChild(targetLiElement);
        tasksList = tasksList.map((el) => {
          if (el.id == pendingdataAutoId) {
            return {
              ...el,
              priority: false,
            };
          } else {
            return el;
          }
        });
      } else {
        targetLiElement.classList.add("priority_item");
        pendingTasksElement.removeChild(targetLiElement);
        pendingTasksElement.prepend(targetLiElement);
        tasksList = tasksList.map((el) => {
          if (el.id == pendingdataAutoId) {
            return {
              ...el,
              priority: true,
            };
          } else {
            return el;
          }
        });
      }
    };
  }
};
//delete all
btnDeleteAllTasks.onclick = (e) => {
  if (
    pendingTasksElement.querySelectorAll("li").length > 0 ||
    doneTasksElement.querySelectorAll("li").length > 0
  ) {
    pendingTasksElement.innerHTML = "";
    doneTasksElement.innerHTML = "";
    tasksList = [];
    handleCalculateTotalTasks();
  }
};

function handleCalculateTotalTasks() {
  // Total Tasks
  let totalTasks = 0;
  if (pendingTasksElement.querySelectorAll("li").length > 0) {
    totalTasks += pendingTasksElement.querySelectorAll("li").length;
  }
  if (doneTasksElement.querySelectorAll("li").length > 0) {
    totalDoneTasksElement.querySelector("span").innerText =
      doneTasksElement.querySelectorAll("li").length;
    totalTasks += doneTasksElement.querySelectorAll("li").length;
  } else {
    totalDoneTasksElement.querySelector("span").innerText = 0;
  }
  totalTasksElement.querySelector("span").innerText = totalTasks;
}
