# Godina

Игра: угадай год по фотографии.

<p align="center"><a href="https://rastereo.github.io/godina/" target="_blank"><img src="https://i.ibb.co/8NwTqf9/2023-10-11-174447.png" width="700px"></a></p>

## 🛠️Технологии:

+ [HTML](https://html.spec.whatwg.org)
+ [CSS](https://www.w3.org/Style/CSS)
+ [React](https://react.dev/)
+ [TypeScript](https://www.typescriptlang.org/)
+ [ESLint](https://eslint.org/)

## 🕹️Механика игры:

+ Игроку показывается фотография из API PastVu или кадр фильма из API
Кинопоиска.
+ Под фотографией есть ползунок с диапазоном от года возникновения
фотографии по наши дни, из которого нужно выбрать год, когда был сделан
снимок.
+ В игре 10 раундов.
+ За каждый ответ игрок получает очки: чем ближе к правильному ответу, тем
больше очков.
+ В конце игры показывается сумма очков, набранных во время игры.
+ Максимально можно набрать 1000 очков.

## 📂Директории:

+ `/components` — папка с компонентами
+ `/context` — папка с файлом контекстом информации о зарегистрированном пользователе
+ `/hooks` — папка с хуками
+ `/images` — папка c изображениями

Остальные директории вспомогательные.

## 📋Инструкция по запуску проекта:

1. Склонируйте репозиторий на свой компьютер:
```bash
git clone git@github.com:rastereo/godina.git
```
2. Установите зависимости
```bash
npm install
```
3. Запустите приложение
```bash
npm run start
```

## 🌐Ссылки

+ Сайт игры: https://rastereo.github.io/godina/
+ API PastVu: https://docs.pastvu.com/dev/api
+ API Кинопоиска: https://kinopoisk.dev/
