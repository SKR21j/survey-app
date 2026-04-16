# Ръководстов за стартиране

Това ръководство описва основните стъпки за стартиране на `survey-app` на друг компютър.
## 1. Инсталирай зависимости

### Опция A: Стартиране с Docker Compose 

1. Увери се, че имаш инсталирани:
   - Docker
   - Docker Compose

2. Създай `.env` файл по примера:

```bash
cp .env.example .env
```

3. Отвори `.env` и попълни стойностите за:
   - `DB_PASSWORD`
   - `JWT_SECRET`
   - други променливи, ако са нужни

4. Стартирай услугите:

```bash
docker-compose up -d
```

5. Провери приложенията:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8080`

### Опция B: Стартиране в development режим без Docker

#### Frontend

1. Отиди в папката `frontend`:

```bash
cd frontend
```

2. Инсталирай npm зависимости:

```bash
npm install
```

3. Стартирай приложението:

```bash
npm run dev
```

4. Ако е необходимо, настрой `VITE_API_BASE_URL` в `.env` на `http://localhost:8080/api`.

#### Backend

1. Отиди в папката `backend`:

```bash
cd backend
```

2. Увери се, че имаш инсталирана JDK 21+ и Maven 3.8+.

3. Задай променливите за връзка с базата данни:

```bash
export DB_URL=jdbc:postgresql://localhost:5432/surveydb_dev
export DB_USERNAME=postgres
export DB_PASSWORD=0000
export JWT_SECRET=<your-secret>
```

4. Стартирай:

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

## 3. Създай и конфигурирай базата данни

- Ако използваш Docker, PostgreSQL ще се стартира автоматично чрез `docker-compose.yml`.
- Ако използваш собствена PostgreSQL инстанция, създай база данни с име `surveydb_dev` или използвай име по избор, което трябва да съответства на `DB_URL`.

## 4. Проверка на работата

- Frontend трябва да бъде достъпен на `http://localhost:3000`.
- Backend Swagger UI (ако е активиран) трябва да работи на `http://localhost:8080/swagger-ui.html`.

## 5. Спиране на проекта

### Ако използваш Docker Compose:

```bash
docker-compose down
```

За да премахнеш и базовия том на PostgreSQL:

```bash
docker-compose down -v
```

### Ако стартираш ръчно:

- Затвори терминалите с `npm run dev` и `mvn spring-boot:run`.

## 6. Съвети

- Увери се, че портовете `3000` и `8080` не са заети.
- Ако използваш Windows PowerShell, за задаване на променливи в командния ред можеш да ползваш `setx` или да зададеш стойности в `.env`.
- За бърз локален старт най-лесно използвай `docker-compose up -d`.
