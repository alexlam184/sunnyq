[![MIT License](https://img.shields.io/github/license/alexlam184/sunnyq)](https://github.com/alexlam184/sunnyq/blob/master/LICENSE)

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

This is a `Next.js project` with TailwindCSS

SunnyQ is an online quiz platform that enables teachers to host quizzes and share. Students can join the room and answer questions in real-time.

## Features

- Online Quiz created by host
- Data anaylst

## Installation

Install portfolio with `yarn`

```bash
  yarn install
```

### Linting

ESLint

```bash
  yarn lint
```

### Formatting

```bash
  yarn format
```

## Running in development mode

Start the server

```bash
  yarn dev
```

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

Open http://localhost:3000 with your browser to see the result.

## Tech Stack

**Client:** React, Next, TailwindCSS

**Server:** Socket.io

**Project:** ESlint,Husky,Prettier (formatting)

## Acknowledgements

- [Code formatting](https://gist.github.com/silver-xu/1dcceaa14c4f0253d9637d4811948437)
- [husky](https://typicode.github.io/husky/#/)
- [react icon](https://react-icons.github.io/react-icons/)

<details>
<summary>Layer</summary>

| Components | z-index |
| ---------- | ------- |
| header     | 40      |

</details>

<details>
<summary>TailwindCSS Style</summary>

Screen
| Components | min-width |
| ---------- | --------- |
| sm | 640px |
| md | 768px |
| lg | 1024px |

## REMARK

only use `lg:` is ok,the rest will be marked as small screen

```ts
// min screen width will be 10/12 of full screen (phone) , big screen wiil be width 100% (desktop)
<div className='absolute top-0 left-0 w-10/12  h-screen bg-white text-black z-40  lg:relative lg:w-full lg:h-full'>
  ...
</div>
```

</details>

# License & Copyright

[MIT](https://github.com/alexlam184/sunnyq/blob/master/LICENSE)

Developed By:

Alex Lam [Github](https://github.com/alexlam184/)

Winter Lau [Github](https://github.com/listenrwt)

_2024-08-12_
