# Як зв’язати VS Code з GitHub і AWS, зберігати та деплоїти сайт

Схема роботи після налаштування:

```
VS Code ──commit/push──▶ GitHub (код) ──GitHub Actions──▶ AWS S3 + CloudFront (сайт)
```

Ви редагуєте код, робите commit + push, і за 1–2 хвилини сайт оновлюється автоматично.

---

## 0. Підготовка комп’ютера

### Node.js 20+ (обов’язково)
На машині зараз стоїть Node **12** — він застарий для Vite і сайт не збереться. Встановіть Node 22 через nvm:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
# перезапустіть термінал, потім:
cd ~/Projects/landing1
nvm install      # візьме версію з файлу .nvmrc (22)
nvm use
node -v          # має бути v22.x
```

### Запуск сайту локально
```bash
npm install
npm run dev      # відкрийте http://localhost:5173
npm run build    # production-збірка в папку dist/
```

### Розширення VS Code (Ctrl+Shift+X)
- **GitHub Pull Requests** (GitHub) — вхід у GitHub і робота з репозиторієм
- **GitHub Actions** (GitHub) — статус деплою прямо у VS Code
- **AWS Toolkit** (Amazon Web Services) — перегляд S3, CloudFront, логів
- **Prettier** та **ESLint** — форматування коду (за бажанням)

---

## 1. GitHub: зберігання коду

### 1.1 Налаштування git (один раз)
```bash
git config --global user.name "Ваше Ім’я"
git config --global user.email "you@example.com"   # той самий email, що в GitHub
```

### 1.2 Вхід у GitHub з VS Code
1. Ліва нижня іконка **Accounts** (людина) → **Sign in with GitHub** → підтвердіть у браузері.

### 1.3 Створення репозиторію
**Варіант A — кнопками у VS Code (найпростіше):**
1. Відкрийте папку `landing1` у VS Code (`code ~/Projects/landing1`).
2. Вкладка **Source Control** (Ctrl+Shift+G) → **Publish to GitHub** → оберіть **private** repository.
3. VS Code сам зробить `git init`, перший коміт і push. Перевірте, що `node_modules` і `dist` **не** потрапили в список (їх відсікає `.gitignore`).

**Варіант B — терміналом:**
```bash
cd ~/Projects/landing1
git init -b main
git add .
git commit -m "Initial landing"
# створіть порожній репозиторій landing1 на github.com/new, потім:
git remote add origin git@github.com:<ваш-логін>/landing1.git
git push -u origin main
```

### 1.4 Щоденна робота
Source Control → введіть повідомлення → **Commit** → **Sync Changes** (push). Усе.

---

## 2. AWS: обліковий запис і доступ з VS Code

> Ніколи не працюйте під root-користувачем і не створюйте для нього access keys.

1. Увімкніть **MFA** для root у консолі AWS (Security credentials).
2. Відкрийте **IAM Identity Center** → Enable → створіть користувача для себе з permission set `AdministratorAccess`.
3. Встановіть AWS CLI v2:
   ```bash
   curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o awscliv2.zip
   unzip awscliv2.zip && sudo ./aws/install
   aws configure sso      # вкажіть Start URL з IAM Identity Center, регіон eu-central-1
   aws sso login
   ```
4. У VS Code: **AWS Toolkit** (іконка AWS на лівій панелі) → **Connect to AWS** → оберіть профіль, створений вище.

---

## 3. Хостинг: оберіть один варіант

| | **A. AWS Amplify Hosting** | **B. S3 + CloudFront + GitHub Actions** |
|---|---|---|
| Складність | 10 хвилин, лише кліки | 30–40 хвилин |
| Вартість лендінгу | ~0–2 $/міс | ~0–1 $/міс |
| Контроль | менше | повний, все в коді |
| Файл `.github/workflows/deploy.yml` | **видаліть** | потрібен |

### Варіант A — AWS Amplify (рекомендую для старту)
1. Консоль AWS → **Amplify** → **Create new app** → **GitHub** → авторизуйте доступ до репозиторію `landing1`, гілка `main`.
2. Amplify сам визначить Vite: build command `npm run build`, output `dist`. Підтвердіть.
3. Через 2–3 хв отримаєте адресу `https://main.xxxx.amplifyapp.com`.
4. Кожен push у `main` → автоматичний деплой.
5. Видаліть `.github/workflows/deploy.yml`, щоб GitHub Actions не запускав другий (непотрібний) деплой.

### Варіант B — S3 + CloudFront (workflow вже є в проєкті)

**4.1 S3 бакет**
1. S3 → **Create bucket** → назва, напр. `lustra-landing-site`, регіон `eu-central-1`.
2. **Block all public access — залишити УВІМКНЕНИМ** (доступ буде лише через CloudFront).

**4.2 CloudFront**
1. CloudFront → **Create distribution** → Origin: ваш S3 бакет.
2. **Origin access → Origin access control (OAC)** → Create new OAC.
3. **Default root object:** `index.html`. Viewer protocol: **Redirect HTTP to HTTPS**.
4. Після створення CloudFront покаже банер **Copy policy** → вставте в S3 → Permissions → Bucket policy.
5. Запишіть **Distribution ID** (напр. `E1ABCDEF2GHIJ`) і домен `dxxxx.cloudfront.net`.

**4.3 Доступ GitHub → AWS без ключів (OIDC)**
1. IAM → **Identity providers** → Add provider → **OpenID Connect**:
   - Provider URL: `https://token.actions.githubusercontent.com`
   - Audience: `sts.amazonaws.com`
2. IAM → **Roles** → Create role → **Web identity** → провайдер вище, audience `sts.amazonaws.com`,
   GitHub organization = ваш логін, repository = `landing1`, branch = `main`.
3. Додайте до ролі inline-політику (підставте свої значення):
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": ["s3:ListBucket"],
         "Resource": "arn:aws:s3:::lustra-landing-site"
       },
       {
         "Effect": "Allow",
         "Action": ["s3:PutObject", "s3:DeleteObject", "s3:GetObject"],
         "Resource": "arn:aws:s3:::lustra-landing-site/*"
       },
       {
         "Effect": "Allow",
         "Action": "cloudfront:CreateInvalidation",
         "Resource": "arn:aws:cloudfront::<AWS_ACCOUNT_ID>:distribution/<DISTRIBUTION_ID>"
       }
     ]
   }
   ```
4. Назвіть роль `github-deploy-landing1`, скопіюйте її **ARN**.

**4.4 Змінні в GitHub**
Репозиторій на github.com → **Settings → Secrets and variables → Actions**:
- вкладка **Secrets** → `AWS_ROLE_ARN` = ARN ролі
- вкладка **Variables**:
  - `AWS_REGION` = `eu-central-1`
  - `S3_BUCKET` = `lustra-landing-site`
  - `CLOUDFRONT_DISTRIBUTION_ID` = `E1ABCDEF2GHIJ`

**4.5 Перевірка**
Зробіть будь-яку зміну → commit → push. На вкладці **Actions** (або в розширенні GitHub Actions у VS Code) має з’явитися зелений «Deploy to AWS». Сайт доступний на `https://dxxxx.cloudfront.net`.

---

## 5. Власний домен (за бажанням)
1. **Route 53 → Registered domains** — купіть домен (або перенесіть DNS існуючого в Route 53 Hosted zone).
2. **Amplify:** App → Hosting → **Custom domains** → Add domain — сертифікат і DNS налаштуються самі.
3. **CloudFront:** у **ACM**, регіон **us-east-1 (N. Virginia)** обов’язково, запросіть сертифікат на `example.com` і `www.example.com` (DNS validation → Create records in Route 53). Потім у distribution → Edit → Alternate domain names + цей сертифікат. У Route 53 створіть записи **A (Alias) → CloudFront distribution**.

---

## 6. Форма заявки
Зараз форма лише показує повідомлення «Дякуємо». Найпростіше підключення — [Web3Forms](https://web3forms.com) (безкоштовно, заявки приходять на пошту):
1. Отримайте access key на сайті.
2. У `src/components/Contact.jsx` замініть функцію `onSubmit`:
   ```js
   const onSubmit = async (e) => {
     e.preventDefault();
     const form = e.currentTarget;
     const data = new FormData(form);
     data.append('access_key', 'ВАШ_КЛЮЧ');
     await fetch('https://api.web3forms.com/submit', { method: 'POST', body: data });
     form.reset();
     setSent(true);
   };
   ```
Альтернатива в межах AWS: API Gateway + Lambda + SES (або відправка в Telegram-бот).

---

## 7. Що редагувати
- **Тексти, ціни, контакти, фото:** `src/data.js`
- **Кольори і шрифти:** `src/theme.js`
- **Власні фото:** покладіть у `public/images/` і вкажіть шлях `'/images/назва.jpg'` у `src/data.js`.
  Для слайдера «до/після» передайте різні фото в `before` / `after` у `src/components/BeforeAfter.jsx`.
- Демо-фото з Unsplash, рейтинг, кількість відгуків і бренди-партнери — заглушки: замініть реальними даними перед запуском.
