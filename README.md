## Project overview

This is a web game. Users obtain various “Rock-Paper-Scissors” objects randomly from [API]([https://nextjs.org/)](https://rps101.pythonanywhere.com/api) and could use those to battle with another users. 

## Installation instructions

First, pull the repository to your specified folder path.

Next, install required dependencies after "cd" to your folder path.

```bash
npm i
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

To set up your own firebase configuration (optional):

> You can check out [Add Firebase to your JavaScript project](https://firebase.google.com/docs/web/setup?hl=en&authuser=0&_gl=1*wmnwn1*_ga*MTk2MDU5OTgwNC4xNzEwNDU2MDY5*_ga_CW55HF8NVT*MTcxMDQ1NjA2OC4xLjEuMTcxMDQ1NjIyMi40OC4wLjA) to register a Firebase project. Proceed to Project settings and find your configurations for <ins>API key, auth domain, project ID, storage bucket, messaging sender ID, and app ID</ins>. Copy and paste above configurations into .env.local file, matching those with the "NEXT_PUBLIC_" variables.

## Usage guide

1.  user login through Github account 
2.  user get 5 random online Rock-Paper-Scissors “object” daily
3.  user could choose another user from the board, then 1 "object " is drawn to battle.  Result is unpredictable since both the "objects " from user and another user are randomized.
4.  the user name and battle result would be displayed on the board for public view.

