function registerUser(event) {
  event.preventDefault();
  const inputs = event.target.querySelectorAll("input");
  const user = {
    name: inputs[0].value,
    email: inputs[1].value,
    password: inputs[2].value
  };

  let users = JSON.parse(localStorage.getItem("users")) || [];
  if(users.find(u => u.email === user.email)){
    alert("هذا البريد موجود مسبقاً!");
    return;
  }

  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));
  alert("تم إنشاء الحساب! يرجى تسجيل الدخول الآن.");
  event.target.reset();
  window.location.href = "login.html";
}

function loginUser(event) {
  event.preventDefault();
  const inputs = event.target.querySelectorAll("input");
  const email = inputs[0].value;
  const password = inputs[1].value;
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find(u => u.email === email && u.password === password);
  if(user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    alert("تم تسجيل الدخول بنجاح!");
    window.location.href = "dashboard.html"; 
  } else {
    alert("البريد الإلكتروني أو كلمة المرور غير صحيحة");
  }
}

function isLoggedIn() {
  return !!localStorage.getItem("currentUser");
}

function logout() {
  localStorage.removeItem("currentUser");
  alert("تم تسجيل الخروج");
  window.location.href = "index.html";
}

function updateNavbar() {
  const navContainer = document.querySelector("nav .container");
  if(!navContainer) return;

  const existingLinks = Array.from(navContainer.querySelectorAll("a, span.user-name"));
  existingLinks.forEach(el => el.remove());

  const user = JSON.parse(localStorage.getItem("currentUser"));

  if(user) {
    const links = [
      { text: "الرئيسية", href: "dashboard.html" },
      { text: "بيع سيارة", href: "sell.html" },
      { text: "تأجير سيارة", href: "rent.html" },
      { text: "سيارات للبيع", href: "cars-sale.html" },
      { text: "سيارات للإيجار", href: "cars-rent.html" }
    ];
    links.forEach(link => {
      const a = document.createElement("a");
      a.href = link.href;
      a.textContent = link.text;
      navContainer.appendChild(a);
    });

    const nameSpan = document.createElement("span");
    nameSpan.textContent = `مرحباً، ${user.name}`;
    nameSpan.className = "user-name";
    nameSpan.style.color = "white";
    nameSpan.style.marginLeft = "15px";
    navContainer.appendChild(nameSpan);

    const logoutBtn = document.createElement("a");
    logoutBtn.href = "#";
    logoutBtn.textContent = "تسجيل خروج";
    logoutBtn.onclick = logout;
    navContainer.appendChild(logoutBtn);

  } else {
    const loginBtn = document.createElement("a");
    loginBtn.href = "login.html";
    loginBtn.textContent = "تسجيل الدخول";
    navContainer.appendChild(loginBtn);

    const registerBtn = document.createElement("a");
    registerBtn.href = "register.html";
    registerBtn.textContent = "إنشاء حساب";
    navContainer.appendChild(registerBtn);
  }
}

function addCar(event, type) {
  if(!isLoggedIn()) { 
    alert("يجب تسجيل الدخول أولاً");
    window.location.href = "login.html";
    return;
  }

  event.preventDefault();
  const inputs = event.target.querySelectorAll("input");
  const car = {
    name: inputs[0].value,
    price: inputs[1].value,
    image: inputs[2].value,
    phone: inputs[3].value
  };

  let cars = JSON.parse(localStorage.getItem(type)) || [];
  cars.push(car);
  localStorage.setItem(type, JSON.stringify(cars));
  alert("تمت إضافة السيارة بنجاح");

  window.location.href = "dashboard.html"; 
}

function displayCars(type) {
  const container = document.getElementById("cars");
  if(!container) return;

  const cars = JSON.parse(localStorage.getItem(type)) || [];
  container.innerHTML = "";

  if(cars.length === 0) {
    container.innerHTML = "<p>لا توجد سيارات حالياً</p>";
    return;
  }

  cars.forEach(car => {
    const div = document.createElement("div");
    div.className = "car-card";
    div.innerHTML = `
      <h3>${car.name}</h3>
      <img src="${car.image}" alt="${car.name}" width="200">
      <p>السعر: ${car.price}</p>
      <p>للتواصل: ${car.phone}</p>
    `;
    container.appendChild(div);
  });
}
