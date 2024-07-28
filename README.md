# Listfire

Hosted at https://listfire.netlify.app

A Simple Shopping List App Enhanced with Simple Login / Sign Up features 

Written in Vanilla Javascript, HTML and CSS leveraging Firebase for the Realtime Data Store

This application was created in conjunction with a Scrimba (see info below) course on progressive web and mobile applications.

## Additional Features
- Save User Credentials more securely using hashed passwords
- Check if Username is already taken
- Add a logout option if the credentials are saved


### Completed Features:
- 7/1/2024 Remembers your login credentials written to localstorage
- 7/5/2024 Added option to change to traditional up down list format for items (user requested) by clicking on the logo
- 7/14/2024 Make single touch of list items not delete but instead have an indication that it is completed (green and faded out)
- 7/14/2024 Double touch (click) to delete instead of single


### Bug Fixes:
- 7/11/2024 When in straight down list format: deleting a list item breaks the fixed width of the list item: Fixed, item will retain proper width
- 7/28/2024 Fixed display issue on mobile when changing orientation from landscape to portrait using an updated meta tag with maximum-scale=1, user-scalable=no.


Quick start:

```
$ npm install
$ npm start
````

Head over to https://vitejs.dev/ to learn more about using vite



## About Scrimba

At Scrimba our goal is to create the best possible coding school at the cost of a gym membership! 💜
If we succeed with this, it will give anyone who wants to become a software developer a realistic shot at succeeding, regardless of where they live and the size of their wallets 🎉
The Frontend Developer Career Path aims to teach you everything you need to become a Junior Developer, or you could take a deep-dive with one of our advanced courses 🚀

- [Our courses](https://scrimba.com/allcourses)
- [The Frontend Career Path](https://scrimba.com/learn/frontend)
- [Become a Scrimba Pro member](https://scrimba.com/pricing)

Happy Coding!
