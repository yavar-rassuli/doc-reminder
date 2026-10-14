# DocReminder

DocReminder helps you never miss an expiry date.
Save your important documents (passport, ID card, permit, warranty receipts)
and get an email reminder before they expire.

## Features

- Register, login and logout with secure tokens
- Add, view, edit and delete your documents
- Every user can only see their own documents
- Upload a photo of a document or receipt
- Automatic email reminder every morning at 7:00 (Swiss time)
- Choose how many days before expiry you want a reminder (default: 30)

## Tech Stack

- **Backend:** Laravel (PHP)
- **Login:** Laravel Sanctum (API tokens)
- **Database:** SQLite
- **Mobile app:** React Native with Expo *(coming soon)*

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

## Status

- [x] Backend API (Laravel)
- [ ] Mobile app (React Native + Expo)