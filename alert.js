$(() => {
  let todoArray = [];
  const MAX_ELEMENTS = 5;
  let currentPage = 1;
  let currentTab = "all";

  const $form = $(".todo-addition");
  const $input = $(".todo-text");
  const $list = $(".list");
  const $tasks = $(".todo-condition");
  const $inputMark = $(".mark-all");
  const $deleteDoneBtn = $(".delete-all");
  const $paginationContainer = $(".pagination");
  const $allCounterBtn = $(".all-counter");
  const $finishedCounterBtn = $(".finished-counter");

  const arrayFinishedTodo = () => todoArray.filter((item) => item.finished);
  const arrayUnfinishedTodo = () => todoArray.filter((item) => !item.finished);
  const computeCurrentId = (event) => event.currentTarget.parentElement.id;
  const validation = (string) => !(string.trim() === "");
  const replacer = (string) =>
    string.replaceAll("<", "&#60;").replaceAll(">", "&#62;");

  const computeTabsArray = () => {
    let newTodoArray = todoArray;
    if (currentTab === "active") {
      newTodoArray = arrayUnfinishedTodo();
    } else if (currentTab === "completed") {
      newTodoArray = arrayFinishedTodo();
    }
    return newTodoArray;
  }; //вычисление массива всех,завершенных, активных

  const getArrayBorder = (newTodoArray) => {
    const rightBorder = currentPage * MAX_ELEMENTS;
    const leftBorder = rightBorder - MAX_ELEMENTS;
    const requiredArray = newTodoArray.slice(leftBorder, rightBorder);

    return requiredArray;
  }; //выделение элементов для одной страницы

  const renderPagination = (newTodoArray) => {
    let paginationString = "";
    const pageCount = Math.ceil(newTodoArray.length / MAX_ELEMENTS);

    if (pageCount !== 1) {
      for (let i = 0; i < pageCount; i++) {
        paginationString = `${paginationString}<button class="${
          i + 1 === currentPage ? "active-page" : ""
        } switching">${i + 1}</button>`;
      }
    }
    $paginationContainer.html(paginationString);
  };

  const validationCurrentPage = (requiredArray) => {
    if (currentPage !== 1 && requiredArray.length === 0) {
      currentPage = currentPage - 1;

      render();
    }
  };
  const changeCurrentPage = (event) => {
    currentPage = Number(event.currentTarget.textContent);
    render();
  };
  const goToPage = () => {
    const lastPage = Math.ceil(todoArray.length / MAX_ELEMENTS);
    currentPage = lastPage;
  };

  const renderCounter = () => {
    $allCounterBtn.text(arrayUnfinishedTodo().length);
    $finishedCounterBtn.text(arrayFinishedTodo().length);
  };

  const renderTabs = () => {
    switch (currentTab) {
      case "all":
        $(".todo-condition :nth-child(1)").attr("selected", true);
        $(".todo-condition :nth-child(2)").attr("selected", false);
        $(".todo-condition :nth-child(3)").attr("selected", false);
        break;
      case "active":
        $(".todo-condition :nth-child(2)").attr("selected", true);
        $(".todo-condition :nth-child(1)").attr("selected", false);
        $(".todo-condition :nth-child(3)").attr("selected", false);
        break;
      case "completed":
        $(".todo-condition :nth-child(3)").attr("selected", true);
        $(".todo-condition :nth-child(2)").attr("selected", false);
        $(".todo-condition :nth-child(1)").attr("selected", false);
    }
  };

  const render = () => {
    renderCounter();
    const tabsArray = computeTabsArray();
    renderPagination(tabsArray);
    const newTodoArray = getArrayBorder(tabsArray);
    const stringHtml = newTodoArray.reduce((acc, item) => {
      acc =
        acc +
        `<li id = ${item.id}> 
            <input type="checkbox" class='checkbox'  ${
              item.finished ? "checked" : ""
            }/>
            <span class='text-area'>${item.text}</span>
            <button class="button-delete">Удалить</button>
        </li>`;

      return acc;
    }, "");

    renderTabs();
    $list.html(stringHtml);
    checkArray();
    validationCurrentPage(newTodoArray);
  };
  const addTodoToArr = (event) => {
    event.preventDefault();
    if (validation($input.val())) {
      const newTodo = {
        id: Date.now(),
        text: replacer($input.val()),
        finished: false,
      };
      todoArray.push(newTodo);
      currentTab = "all";
      goToPage();
      render();
    }
    $input.val("");
  };

  const displayStateTasks = (event) => {
    const eventValue = $tasks.val();
    currentTab = eventValue;

    render();
  };

  const checkArray = () => {
    const arrayLength = todoArray.length;
    const arrayCheckedLength = arrayFinishedTodo().length;
    if (arrayLength === 0) {
      $inputMark.prop("disabled", true);
      $inputMark.prop("checked", false);
    } else if (arrayCheckedLength === arrayLength) {
      $inputMark.prop("checked", true);
      $inputMark.prop("disabled", false);
    } else if (arrayCheckedLength !== arrayLength) {
      $inputMark.prop("checked", false);
      $inputMark.prop("disabled", false);
    }
  };

  const markTodoFinished = (event) => {
    const currentId = computeCurrentId(event);
    const elementById = event.currentTarget.checked;

    todoArray.forEach((item) => {
      if (item.id === Number(currentId)) {
        item.finished = elementById;
      }
    });

    render();
  };
  const removeTodoFromList = (event) => {
    const currentId = computeCurrentId(event);
    todoArray = todoArray.filter((item) => item.id !== Number(currentId));
    currentTab = "all";
    render();
  };
  const editTextTodo = (event) => {
    if (!event.currentTarget.querySelector("input")) {
      event.currentTarget.outerHTML = `<input type="text" class='save-text' value="${event.currentTarget.innerText}">`;
      const $element = $(".save-text");
      const data = $element.val();
      $element.focus().val("").val(data);
    }
  };
  const saveEditTextTodo = (event) => {
    const inputValue = event.currentTarget.value;

    const elementId = computeCurrentId(event);

    if (validation(inputValue)) {
      todoArray.forEach((item) => {
        if (item.id === Number(elementId)) {
          item.text = replacer(inputValue);
        }
      });
    }

    render();
  };
  const markAllTodoFinished = (event) => {
    const checkboxValue = event.currentTarget.checked;
    todoArray.forEach((item) => (item.finished = checkboxValue));
    render();
  };
  const deleteAllFinished = () => {
    todoArray = arrayUnfinishedTodo();
    render();
  };

  $(document).on("change", ".checkbox", markTodoFinished);
  $(document).on("click", ".button-delete", removeTodoFromList);
  $(document).on("dblclick", ".text-area", editTextTodo);
  $(document).on("blur", ".save-text", saveEditTextTodo);
  $(document).on("click", ".switching", changeCurrentPage);
  $inputMark.on("change", markAllTodoFinished);
  $deleteDoneBtn.on("click", deleteAllFinished);
  $form.on("submit", addTodoToArr);
  $tasks.on("change", displayStateTasks);
});
