# DocReminder

DocReminder helps you never miss an expiry date.
Save your important documents (passport, ID card, permit, warranty receipts)
and get an email reminder before they expire.

The project has two parts:

- `api/` – REST API built with Laravel
- `mobile/` – mobile app built with React Native (Expo)

## Features

**API**

- Register, login and logout with secure tokens
- Add, view, edit and delete your documents
- Every user can only see their own documents
- Upload a photo of a document or receipt
- Automatic email reminder every morning at 7:00 (Swiss time)
- Choose how many days before expiry you want a reminder (default: 30)

**Mobile app**

- Log in and stay logged in (token saved on the device)
- Automatic logout when the token is no longer valid
- See all documents sorted by expiry date
- Status for every document: **Valid**, **Soon** or **Expired**, with days left
- Overview of how many documents are valid, expiring soon or expired
- Add new documents
- Delete documents (with confirmation)
- Runs on iOS, Android and in the browser

## Tech Stack

- **Backend:** Laravel (PHP)
- **Login:** Laravel Sanctum (API tokens)
- **Database:** SQLite
- **Mobile app:** React Native with Expo
- **Storage on device:** AsyncStorage

## API Endpoints

All `/documents` routes need a token: `Authorization: Bearer <token>`

| Method | URL | What it does |
|---|---|---|
| POST | `/api/register` | Create an account |
| POST | `/api/login` | Log in and get a token |
| POST | `/api/logout` | Log out (delete the token) |
| GET | `/api/documents` | List my documents |
| POST | `/api/documents` | Add a document (with optional photo) |
| GET | `/api/documents/{id}` | Show one document |
| PUT | `/api/documents/{id}` | Edit a document |
| DELETE | `/api/documents/{id}` | Delete a document |

## Run it locally

### 1. API

```bash
cd api
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan storage:link
php artisan serve
```

Send reminders by hand (for testing):

```bash
php artisan documents:remind
```

### 2. Mobile app

```bash
cd mobile
npm install
```

Open `mobile/config.js` and set `API_URL` to the address of your API,
for example `http://localhost:8000/api`.

Then start the app:

```bash
npx expo start --web
```

To test on your phone, install **Expo Go** and run `npx expo start`,
then scan the QR code.

## Status

- [x] Backend API (Laravel)
- [x] Mobile app (React Native + Expo)
- [ ] Upload photos from the app
- [ ] Reminders in the user's own timezone
- [ ] Automated tests