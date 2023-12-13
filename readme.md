BackEnd				
Загальна інформація	"- Створення API ендпоінтів: Необхідно створити API ендпоінти для обробки різних запитів від фронтенду, таких як реєстрація користувача, вхід в систему, отримання та збереження даних дошок, колонок та карток.
- Аутентифікація та авторизація: Забезпечити механізми аутентифікації та авторизації користувачів. 
- Обробка запитів фронтенду: Реалізувати обробку запитів, які надсилаються з фронтенду, і виконувати відповідні дії на основі цих запитів. Наприклад, створення нових юзерів, додавання записів про прийом їжі, оновлення даних тощо.
- Валідація та обробка даних: Здійснити валідацію вхідних даних, щоб переконатись у їхній правильності та цілісності перед збереженням у базу даних. Обробляти помилки та повідомлення про невдалий ввід.
- Зберігання даних: Розробити структуру бази даних та моделі для зберігання інформації про прийоми їжі, кількісні показники, записи споживання води. Забезпечити механізми для зчитування, оновлення та видалення цих даних."
- 	
Формули для разрахунку	"Формула для визначення денного рівня калорійного споживання, необхідного для підтримання поточної маси тіла.
Для чоловіків:
BMR =( 88.362 + (13.397 x вага в кілограмах) + (4.799 x зріст в сантиметрах) - (5.677 x вік в роках) ) х Коефіцієнт фізичної активності

Для жінок:
BMR = ( 447.593 + (9.247 x вага в кілограмах) + (3.098 x зріст в сантиметрах) - (4.330 x вік в роках) ) х Коефіцієнт фізичної активності

BMR - базовий обмінний обсяг калорій (в кілокалоріях) - це кількість енергії, яка витрачається організмом за добу на підтримання життєво важливих функцій у стані спокою."	"Коєфіцієнт фізичної активності зазвичай може приймати значення від 1,2 до 2,5 або більше, залежно від рівня активності конкретної особи:

 - Мінімальна або відсутність фізичної активності (сидяча робота, мало або жодних фізичних вправ): 1.2-1.3
 - Легка активність (легка фізична активність або тренування 1-3 рази на тиждень): 1.4-1.5
 - Середня активність (тренування 3-5 разів на тиждень): 1.6-1.7
 - Висока активність (інтенсивні тренування 6-7 разів на тиждень): 1.8-1.9
 - Дуже висока активність (фізична робота або інтенсивні тренування 2 рази на день): 2.0 і більше
 - 
"	"В залежності від цілей (схуднути, набрати м'язи або підтримувати вагу),  ось базові пропорції макроелементів для кожної з цих цілей:
 - Схуднення:
Білки: 25% від загальної кількості калорій
Жири: 20% від загальної кількості калорій
Вуглеводи: Решта калорій
 - Набір м'язової маси:
Білки: 30% від загальної кількості калорій
Жири: 20% від загальної кількості калорій
Вуглеводи: Решта калорій
 - Підтримка поточної ваги:
Білки: 20% від загальної кількості калорій
Жири: 25% від загальної кількості калорій
Вуглеводи: Решта калорій

"	"Базова потреба в воді залежно від ваги:
Вода(л)=Вага(кг)×0.03
Наприклад, для людини вагою 60 кг: 60 * 0.03 =1.8 л води на день.
_________________
Додаткова потреба в воді залежно від фізичної активності:
 - Мінімальна або відсутність фізичної активності (сидяча робота, мало або жодних фізичних вправ): Вода(л)=Вага(кг)×0.03
 - Легка активність (легка фізична активність або тренування 1-3 рази на тиждень): Вода(л)=Вага(кг)×0.03 +0.35(л)
 - Середня активність (тренування 3-5 разів на тиждень): Вода(л)=Вага(кг)×0.03 +0.35(л)
 - Висока активність (інтенсивні тренування 6-7 разів на тиждень): Вода(л)=Вага(кг)×0.03 +0.35(л)
 - Дуже висока активність (фізична робота або інтенсивні тренування 2 рази на день): Вода(л)=Вага(кг)×0.03 +0.7(л)"
 - 
Базова версія				
Розгорнути сервер для розробки				
- Підключити необхідні модулі				
- Налаштувати CORS	Налаштувати CORS для дозволу хостам на взаємодію з сервером			
- Обробка помилок	"Обробка помилок та відповіді сервера:
- Реалізувати обробку помилок на сервері та передачу зрозумілих повідомлень про помилки на клієнтську сторону.
- Забезпечити відповіді сервера з відповідними HTTP-статусами та повідомленнями про стан запитів (наприклад, 200 OK, 400 Bad Request, 401 Unauthorized, 500 Internal Server Error тощо)."""			

База даних (БД)				
- Структура БД	Обговорити структуру БД, визначити колекції та їх зв'язки			
- Підключення БД	Ініціалізувати та підключити БД до проекту			
- Розгортання бекенда на хостингу	Розгорнути backend на хостінгу - Render або аналоги
- 	
Документація ендпоінтів				
- Swagger	"Створити документацію енд-поінтів за допомогою пакета swagger-ui-express
відео - https://www.youtube.com/watch?v=oQaoymCOW8o&feature=youtu.be   
базовий код - https://github.com/NadyaHristuk/lesson-swagger-googleOAUTH2  
приклад - https://app.swaggerhub.com/apis/NadyaHristuk/your-api/1.0.12 "

- Опис ендпоінтів	Детально описати кожен ендпоінт з відповідними параметрами та відповідями			
АPI				
POST /api/auth/signup	Створити ендпоінт для реєстрації користувача, з перевірками унікальності інформації та створенням запису			
POST /api/auth/signin	Створити ендпоінт для логіну користувача з перевіркою облікових даних та генерацією токену аутентифікації			
POST /api/auth/forgot-password	Створити ендпоінт для оновлення інформації про пароль користувача, з надсиланням нового пароля на ємейл користувача, який він вказав при реєстрації			
- Авторизація	Написати прошарок авторизації, що перевірятиме наявність токену та відповідність прав доступу			
POST /api/auth/signout	Створити ендпоінт для виходу користувача з системи (логаут)			
GET /api/user/current	Створити ендпоінт для отримання інформації про користувача, в т.ч. інформацію про розраховану поточну BMR, денну норму води та співвідношення макроелементів до BMR 			
PUT /api/user/update	Створити ендпоінт для оновлення інформації про користувача або одного з полів контактної інформації з перерахунком BMR/денної норми води/співвідношення макроелементів до BMR, у разі змін даних, що застосовуються у формулах			
PUT /api/user/goal	Оновити ціль користувача і перерахувати співвідношення макроелементів до BMR. У тілі запиту можна передати нову ціль.			
POST /api/user/weight	Додати інформацію про актуальну вагу користувача за поточну дату і перерахувати BMR і денну норму води. У тілі запиту можна передати нове значення ваги.			
POST /api/user/food-intake	Зберегти інформацію про спожиту їжу користувачем за поточну дату.			
PUT /api/user/food-intake/:id	Оновити інформацію про спожиту їжу для конкретного запису за його ідентифікатором (id). У тілі запиту можна передати нові дані, такі як назва продукту, кількість грамів, вуглеводи, білки, жири.			
DELETE /api/user/food-intake/	Видалити інформацію про спожиту їжу відповідного прийому їжі за поточну дату. 			
POST /api/user/water-intake	Зберегти інформацію про спожиту воду користувачем за поточну дату			
DELETE /api/user/water-intake	Видалити інформацію про спожиту воду користувачем за поточну дату			
GET /api/user/statistics	Отримати статистику споживання калорій, води і ваги користувача за обраний період			
GET /api/recommended-food	"Отримати список рекомендованих продуктів. 
JSON  рекомендованих продуктів -  https://drive.google.com/file/d/1JDlPii3E6CDOH6b_7TFJrSJ98z5yiM-e/view?usp=drive_link"			
