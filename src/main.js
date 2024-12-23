const stepsContainer = document.getElementById("steps-container");
const steps = stepsContainer.querySelectorAll(".step");
const backButton = document.getElementById("back-button");
const nextButton = document.getElementById("next-button");
const genderButtons = document.querySelectorAll(".gender-button");

const stepHeader = document.getElementById("step-header");
const step3Screen = document.getElementById("step3-screen");
const step4Screen = document.getElementById("step4-screen");
const step5Screen = document.getElementById("step5-screen");
const currentStepIndicator = document.getElementById("current-step");

const step3 = document.getElementById("step3");
const step4 = document.getElementById("step4");
const step5 = document.getElementById("step5");

const onboardingOverlay = document.querySelector(".onboarding-overlay");
const countryInput = document.getElementById("country")
const cityInput = document.getElementById("city")
const cityPopupUnderlay = document.querySelector('.onboarding__city-popup-underlay')
const cityPopup = document.querySelector('.onboarding__city-popup')
const onboardingCityPopupBtn = document.querySelector('.onboarding__city-popup-btn')
const onboardingCityInputDiv = document.querySelector('.onboarding__city-input--div')
const onboardingCityInPopupInput = document.getElementById('onboarding__city-in-popup-input')
const onboardingPopularCitiesWrapper = document.querySelector('.onboarding__popular-cities-wrapper')
const onboardingCoordLabel = document.querySelector('.onboarding__coord-label')
const onboardingPopularCitiesLabel = document.querySelector('.onboarding__popular-cities-label')
const onboardingPopularCitiesList = document.querySelector('.onboarding__popular-cities');


const header = document.querySelector('.header')
const tabbar = document.querySelector('.tabbar')

const onboardingLatInput = document.getElementById('onboarding__lat-input')
const onboardingLngInput = document.getElementById('onboarding__lng-input')


let onboardingCities = []
let onboardingCountries = []
let onboardingCurrentCountry = null
let onboardingCoords = null
let onboardingCurrentCityId = null


header.style.display = 'none'
tabbar.style.display = 'none'
document.body.style.overflow = 'hidden'

function initRegistration() {

  onboardingCurrentCountry = {
    name: 'Российская Федерация',
    id: 8
  }
  let birth_date = ''

  fetch('https://my.aspectum.app/api/countries').then(res => res.json().then(val => {
    populateSelect('country', val)
    onboardingCountries = val    
  }))
    .catch(error => {
      console.error('Ошибка:', error);
    });


  // По умолчанию РФ стоит в выбранной стране, потому для нее фетчим города:
  fetch('https://my.aspectum.app/api/cities/?country_id=8').then(res => res.json().then(val => {
    populatePopularCities(val.slice(0, 5))
    onboardingCities = val
  }))
    .catch(error => {
      console.error('Ошибка:', error);
    });

// Объединяем все шаги в один массив
  const allSteps = [...steps, step3, step4];

  let currentStep = 2; // Индекс текущего шага
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
    } else if (currentStep === 5) {

      // Переходим к шагу "Добро пожаловать"
      stepsContainer.style.display = "none";
      stepHeader.style.display = "none";
      step3Screen.style.display = "none";
      step4Screen.style.display = "none";
      step5Screen.style.display = "block";
      onboardingOverlay.classList.add('onboarding__final-step-overlay')

      // Активируем шаг 4
      step5.classList.add("active");

      // Обновить кнопки
      backButton.style.display = "none";
      nextButton.innerText = "Далее";
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

      birth_date = `${birthYear}-${addLeadingZero(birthMonth)}-${addLeadingZero(birthDay)}`

    } else if (step === 1) {
      const birthTimeValue = document.getElementById("birth_time").value;

      const timeArray = birthTimeValue.split(':')

      if (!birthTimeValue) {
        alert("Пожалуйста, введите время рождения.");
        return false;
      } else if (timeArray[0] > 24) {
        alert("Пожалуйста, введите час рождения правильно.");
        return false;
      } else if (timeArray[1] > 59) {
        alert("Пожалуйста, введите минуту рождения правильно.");
        return false;
      }

    } else if (step === 2) {
      const country = document.getElementById("country").value;
      const city = document.getElementById("city").value;

      // if (!country) {
      //   alert("Пожалуйста, выберите страну.");
      //   return false;
      // } else if (!countries.find(item => item.name === country)) {
      //
      //   alert("Пожалуйста, выберите страну из списка");
      //   return false;
      // }
      //
      // if (!city) {
      //   alert("Пожалуйста, введите город.");
      //   return false;
      // } else if (!cities.find(item => item.name === city)) {
      //
      //   alert("Пожалуйста, выберите город из списка. Если вашего города нет, выберите ближайший.");
      //   return false;
      // }
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

      // тут "+" запрещен в имейле
      // const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      // а тут разрешен
      const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

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

    const city = cities.find(item => item.name === document.getElementById("city").value)

    const data = {
      birth_date,
      birth_time: document.getElementById("birth_time").value,
      city_id: city.id,
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
        if (result.status === 'User created and logged in successfully') {
          // alert('Регистрация завершена!');          
          // location.hash = '/';
          currentStep = 5
          updateSteps()
        } else {
          // Обработка ошибок         
          alert(result.error);
        }
      })
      .catch(error => {
        console.error('Ошибка:', error);
      });
  }

// Инициализация
  updateSteps();
}


// Наполняем селект странами, страны фетчим внутри функции initRegistration
const populateSelect = (id, fetchedData) => {
  const datalist = document.getElementById(id);
  datalist.innerHTML = '';
  fetchedData.forEach(country => {
    const option = document.createElement('option');
    option.value = country.id;
    option.textContent = country.name;
    datalist.appendChild(option);
  });
}

// Наполняем блок "Популярные города" городами, города фетчим внутри функции initRegistration
const populatePopularCities = (citiesList) => {
  onboardingPopularCitiesList.innerHTML = '';
  citiesList.forEach(city => {
    const listItem = document.createElement('li');
    listItem.textContent = city.name;
    listItem.dataset.cityId = city.id;
    listItem.dataset.lat = city.latitude || "";  // пока так, потом todo
    listItem.dataset.lng = city.longitude || ""; // пока так, потом todo
    listItem.className = 'onboarding__city-item';
    onboardingPopularCitiesList.appendChild(listItem);
  });

  setEventListenerOnCityItems()
}


// Обработчик клика по селекту - Страна рождения
countryInput.addEventListener('change', (e) => {
  const selectedOption = e.target.options[e.target.selectedIndex];
  const value = selectedOption.value; // Получаем значение
  const text = selectedOption.textContent; // Получаем текстовое содержимое

  onboardingCurrentCountry = {
    id: value,
    name: text
  }
  
  onboardingCurrentCityId = null

  
  onboardingCityInputDiv.textContent = ''

  // фетчим города для выбранной страны:
  fetch('https://my.aspectum.app/api/cities/?country_id=' + value).then(res => res.json().then(val => {
    populatePopularCities(val.slice(0, 5))
    onboardingCities = val    
  }))
    .catch(error => {
      console.error('Ошибка:', error);
    });
})


// очистка формы при скрытии попапа

const closeCityPopup = () => {
  onboardingLatInput.value = ""
  onboardingLngInput.value = ""
  document.removeEventListener('keydown', handleKeyDown);
  cityPopupUnderlay.style.display = 'none';
  populatePopularCities(onboardingCities.slice(0, 5))
  onboardingPopularCitiesLabel.textContent = 'Популярные города'  
  onboardingCityInPopupInput.value = ""
  onboardingPopularCitiesWrapper.style.display = 'block'
}

// Закрытие попапа по Esc
const handleKeyDown = (e) => {
  if (e.key === 'Escape') { // Проверяем, что нажата клавиша Esc
    // cityPopupUnderlay.style.display = 'none';
    closeCityPopup()
  }
}

const setEventListenerOnCityItems = ()=>{
  document.querySelectorAll('.onboarding__city-item')
    .forEach(itemEl => {
      itemEl.addEventListener('click', () => {

        // вставляем координаты в инпуты        
        onboardingLatInput.value = itemEl.dataset.lat
        onboardingLngInput.value = itemEl.dataset.lng

        // скрываем ненужную теперь часть попапа (с популярными городами и проч)
        onboardingPopularCitiesWrapper.style.display = 'none'
        onboardingCoordLabel.style.display = 'none'

        // вставляем название города в инпут    
        onboardingCityInPopupInput.value = itemEl.textContent

        // кнопка Готово становится активной
        onboardingCityPopupBtn.disabled = false
      })
    })
}


// открытие попапа по клику на инпут Место рождения:
cityInput.addEventListener('click', (e) => {

  setEventListenerOnCityItems()


  //
  onboardingCityInPopupInput.addEventListener('focus', (e) => {
    onboardingPopularCitiesWrapper.style.display = 'block'
    onboardingPopularCitiesLabel.textContent = 'Начните вводить название города...'
    onboardingCoordLabel.style.display = 'block'
    onboardingCityPopupBtn.disabled = false
    onboardingPopularCitiesList.innerHTML = ''
  })


  onboardingCityInPopupInput.addEventListener('input', (e) => {
    
    const url = 'https://my.aspectum.app/api/cities/?country_id=' + onboardingCurrentCountry.id +'&prefix=' + e.target.value
    
    fetch(url).then(res => res.json().then(val => {
      populatePopularCities(val)
      cities = val
    }))
      .catch(error => {
        console.error('Ошибка:', error);
      });

  })
  


  // Закрытие попапа по клику за пределами попапа
  cityPopupUnderlay.addEventListener('click', (e) => {
    if (!cityPopup.contains(e.target)) {
      closeCityPopup()
    }
  })


// Добавляем обработчик события keydown на весь документ
  document.addEventListener('keydown', handleKeyDown);

// открываем сам попап
  cityPopupUnderlay.style = 'display: block'
})


// Маска для инпута времени рождения:
const timeInput = document.getElementById('birth_time');
const im = new Inputmask({
  mask: "99:99",
});

im.mask(timeInput);

// Функция - для добавления нулей, чтобы преобразовать дату в нужный формат
function addLeadingZero(num) {
  return num < 10 ? `0${num}` : `${num}`;
}

onboardingLatInput.addEventListener('input', (e) => {
  // type = number не подойдет, т.к. браузер точку принудительно меняет на запятую, поэтому валидируем вручную
  onboardingLngInput.value = onboardingLngInput.value.replace(/[^0-9.]/g, "");

  if (onboardingLatInput.value && onboardingLngInput.value) {
    onboardingCityPopupBtn.disabled = false
  }
})

onboardingLngInput.addEventListener('input', (e) => {
  // type = number не подойдет, т.к. браузер точку принудительно меняет на запятую, поэтому валидируем вручную
  onboardingLngInput.value = onboardingLngInput.value.replace(/[^0-9.]/g, "");

  if (onboardingLatInput.value && onboardingLngInput.value) {
    onboardingCityPopupBtn.disabled = false
  } else {
    onboardingCityPopupBtn.disabled = true
  }
})

onboardingCityPopupBtn.addEventListener('click', (e) => {

  const latitude = parseFloat(onboardingLatInput.value);
  const longitude = parseFloat(onboardingLngInput.value);

  let isValid = true;
  let message = '';

  // Проверка широты
  if (isNaN(latitude) || latitude < -90 || latitude > 90) {
    isValid = false;
    message += 'Широта должна быть числом от -90 до 90. ';
  }

  // Проверка долготы
  if (isNaN(longitude) || longitude < -180 || longitude > 180) {
    isValid = false;
    message += 'Долгота должна быть числом от -180 до 180.';
  }

  if (isValid) {

    // если город выбран
    if (onboardingCityInPopupInput.value) {
      // устанавливаем город и закрываем попап
      onboardingCityInputDiv.textContent = onboardingCityInPopupInput.value
    } else {
      onboardingCoords = {lat: latitude, lng: longitude}
      onboardingCityInputDiv.textContent = `${latitude}, ${longitude}`
    }
    closeCityPopup()

  } else {
    alert(message)
  }

})

initRegistration()