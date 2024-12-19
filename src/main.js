let countries = []
let birth_date = ''

function initRegistration() {
  // Ваш код инициализации без обёртки
  const stepsContainer = document.getElementById("steps-container");
  const steps = stepsContainer.querySelectorAll(".step");
  const backButton = document.getElementById("back-button");
  const nextButton = document.getElementById("next-button");
  const genderButtons = document.querySelectorAll(".gender-button");

  const stepHeader = document.getElementById("step-header");
  const step3Screen = document.getElementById("step3-screen");
  const step4Screen = document.getElementById("step4-screen");
  const currentStepIndicator = document.getElementById("current-step");

  const step3 = document.getElementById("step3");
  const step4 = document.getElementById("step4");


  fetch('https://my.aspectum.app/api/countries').then(res => res.json().then(val => {

    populateDatalist('options-countries', val)
    countries = val
  }))


  // Объединяем все шаги в один массив
  const allSteps = [...steps, step3, step4];

  let currentStep = 0; // Индекс текущего шага
  let selectedGender = "male"; // Выбранный пол

  // Функция обновления видимости шагов
  const updateSteps = () => {
    // Удаляем классы 'active' и 'completed' у всех шагов
    allSteps.forEach(step => {
      step.classList.remove("active");
      step.classList.remove("completed");
    });

    if (currentStep < 3) {
      stepsContainer.style.display = "block";
      stepHeader.style.display = "block";
      step3Screen.style.display = "none";
      step4Screen.style.display = "none";

      steps.forEach((step, index) => {
        const inputs = step.querySelectorAll("input, select");

        if (index < currentStep) {
          step.classList.add("completed");
          inputs.forEach(input => input.setAttribute("disabled", "true"));
        } else if (index === currentStep) {
          step.classList.add("active");
          inputs.forEach(input => input.removeAttribute("disabled"));
        } else {
          inputs.forEach(input => input.setAttribute("disabled", "true"));
        }
      });

      // Обновить шаг в заголовке
      currentStepIndicator.innerText = currentStep + 1;

      // Обновить кнопки "Назад" и "Далее"
      backButton.style.display = currentStep === 0 ? "none" : "inline-block";
      nextButton.innerText = "Далее";

    } else if (currentStep === 3) {
      // Переходим к шагу "Давайте знакомиться"
      stepsContainer.style.display = "none";
      stepHeader.style.display = "none";
      step3Screen.style.display = "block";
      step4Screen.style.display = "none";

      // Активируем шаг 3
      step3.classList.add("active");

      // Обновить кнопки
      backButton.style.display = "inline-block";
      nextButton.innerText = "Далее";

    } else if (currentStep === 4) {
      // Переходим к шагу "Личный кабинет"
      stepsContainer.style.display = "none";
      stepHeader.style.display = "none";
      step3Screen.style.display = "none";
      step4Screen.style.display = "block";

      // Активируем шаг 4
      step4.classList.add("active");

      // Обновить кнопки
      backButton.style.display = "inline-block";
      nextButton.innerText = "Завершить";
    }
  };

  // Логика выбора пола
  genderButtons.forEach(button => {
    button.addEventListener("click", () => {
      genderButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      selectedGender = button.dataset.gender; // Сохраняем выбранный пол
    });
  });

  // Обработчики событий для кнопок "Назад" и "Далее"
  backButton.addEventListener("click", () => {
    if (currentStep > 0) {
      currentStep--;
      updateSteps();
    } else {
      // Вернуться на предыдущую страницу или показать сообщение
      window.history.back();
    }
  });

  nextButton.addEventListener("click", () => {
    if (validateStep(currentStep)) {
      if (currentStep === 4) {
        // Отправляем данные на сервер для завершения регистрации
        submitRegistration();
      } else {
        currentStep++;
        updateSteps();
      }
    }
  });

  // Функция валидации текущего шага
  function validateStep(step) {
    if (step === 0) {

      // кол-во дней в месяцах
      const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

      const birthMonth = document.getElementById("birth-month").value;
      if (!birthMonth) {
        alert("Пожалуйста, введите месяц рождения.");
        return false;
      }

      const birthDay = document.getElementById("birth-day").value;
      if (!birthDay) {
        alert("Пожалуйста, введите день рождения.");
        return false;

      } else if (birthDay > daysInMonth[birthMonth - 1]) {  // проверяем на кол-во дней в месяце 
        alert("Пожалуйста, введите правильный день рождения.");
        return false;
      }

      const birthYear = document.getElementById("birth-year").value;
      if (!birthYear) {
        alert("Пожалуйста, введите год рождения.");
        return false;
      } else if (+birthYear < 1900 || +birthYear > new Date().getFullYear()) {  // проверяем год 
        alert("Пожалуйста, введите правильный год рождения.");
        return false;
      }
      
      birth_date = `${birthDay}.${birthMonth}.${birthYear}`
      console.log('birth_date', birth_date)

    } else if (step === 1) {
      const birthTimeValue = document.getElementById("birth_time").value;
      
      const timeArray = birthTimeValue.split(':')
            
      if (!birthTimeValue) {
        alert("Пожалуйста, введите время рождения.");
        return false;
      } else if(timeArray[0] > 24) {
        alert("Пожалуйста, введите час рождения правильно.");
        return false;
      } else if(timeArray[1] > 59) {
        alert("Пожалуйста, введите минуту рождения правильно.");
        return false;
      }
      
      
    } else if (step === 2) {
      const country = document.getElementById("country").value;
      const city = document.getElementById("city").value;
      if (!country) {
        alert("Пожалуйста, выберите страну.");
        return false;
      }
      if (!city) {
        alert("Пожалуйста, введите город.");
        return false;
      }
    } else if (step === 3) {
      const nickname = document.getElementById("nickname").value;
      if (!nickname) {
        alert("Пожалуйста, введите имя.");
        return false;
      }
      if (!selectedGender) {
        alert("Пожалуйста, выберите пол.");
        return false;
      }
    } else if (step === 4) {
      const email = document.getElementById("email").value;
      const dataConsent = document.getElementById("data_consent").checked;

      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!email) {
        alert("Пожалуйста, введите ваш email.");
        return false;
      } else if (!emailRegex.test(email)) {
        alert("Пожалуйста, введите правильный email.");
        return false;
      }
      
      
      if (!dataConsent) {
        alert("Пожалуйста, дайте согласие на обработку персональных данных.");
        return false;
      }
    }
    return true;
  }

  // Функция отправки данных регистрации на сервер
  function submitRegistration() {
    const data = {
      birth_date,
      birth_time: document.getElementById("birth_time").value,
      country: document.getElementById("country").value,
      city: document.getElementById("city").value,
      nickname: document.getElementById("nickname").value,
      gender: selectedGender,
      email: document.getElementById("email").value,
      data_consent: document.getElementById("data_consent").checked,
      newsletter_consent: document.getElementById("newsletter_consent").checked,
    };

    // Отправляем данные на сервер - 
    fetch('https://my.aspectum.app/api/signup/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          // Регистрация прошла успешно
          alert('Регистрация завершена!');
          // Перенаправляем пользователя на главную страницу или в личный кабинет
          location.hash = '/';
        } else {
          // Обработка ошибок
          alert('Ошибка при регистрации: ' + result.message);
        }
      })
      .catch(error => {
        console.error('Ошибка:', error);
      });

    // console.log("На сервер отправится: ", data)
  }

  // Инициализация
  updateSteps();
}


function populateDatalist(id, fetchedCountries) {
  const datalist = document.getElementById(id);
  datalist.innerHTML = '';
  fetchedCountries.forEach(country => {
    const option = document.createElement('option');
    option.value = country.name;
    datalist.appendChild(option);
  });
}

document.getElementById("country").addEventListener('input', (e) => {

  const inputIcon = document.querySelector('.select-icon--country')
  if (e.target.value) {
    inputIcon.style.display = 'none'
  } else {
    inputIcon.style.display = 'inline'
  }

  const countryValue = e.target.value
  if (countryValue) {
    const country = countries.find(item => item.name === countryValue)

    if (country) {
      fetch('https://my.aspectum.app/api/cities/?country_id=' + country.id).then(res => res.json().then(val => {
        populateDatalist('options-cities', val)
      }))
    }
  }
})

document.getElementById("city").addEventListener('input', (e) => {
  const inputIcon = document.querySelector('.select-icon--city')
  if (e.target.value) {
    inputIcon.style.display = 'none'
  } else {
    inputIcon.style.display = 'inline'
  }
})

initRegistration()


const timeInput = document.getElementById('birth_time');
// const im = new Inputmask('99:99');

const im = new Inputmask({
  mask: "99:99",  
});


im.mask(timeInput);
