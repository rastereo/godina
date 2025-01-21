import './Presentation.scss';

function Presentation() {
  return (
    <main className="presentation">
      <h1 className="presentation__title">Игра Godina</h1>
      <figure>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/View_from_the_Window_at_Le_Gras%2C_Joseph_Nic%C3%A9phore_Ni%C3%A9pce%2C_uncompressed_UMN_source.png/1920px-View_from_the_Window_at_Le_Gras%2C_Joseph_Nic%C3%A9phore_Ni%C3%A9pce%2C_uncompressed_UMN_source.png"
          alt="Вид из окна в Ле Гра"
          className="presentation__image"
        />
        <figcaption className="presentation__description">
          «Вид из окна в Ле Гра» (фр. Point de vue du Gras) — первая из дошедших
          до наших дней гелиогравюр. Считается первой в мире фотографией, снятой
          с натуры. Создана французским изобретателем Жозефом Нисефором Ньепсом
          в 1826 (по другим данным — в 1827) году на пластинке, покрытой слоем
          битума.
          <a
            className="presentation__wiki"
            href="https://ru.wikipedia.org/wiki/%D0%92%D0%B8%D0%B4_%D0%B8%D0%B7_%D0%BE%D0%BA%D0%BD%D0%B0_%D0%B2_%D0%9B%D0%B5_%D0%93%D1%80%D0%B0#:~:text=Point%20de%20vue%20du%20Gras,%D0%BD%D0%B0%20%D0%BF%D0%BB%D0%B0%D1%81%D1%82%D0%B8%D0%BD%D0%BA%D0%B5%2C%20%D0%BF%D0%BE%D0%BA%D1%80%D1%8B%D1%82%D0%BE%D0%B9%20%D1%81%D0%BB%D0%BE%D0%B5%D0%BC%20%D0%B1%D0%B8%D1%82%D1%83%D0%BC%D0%B0."
          >
            Википедия
          </a>
        </figcaption>
      </figure>
      <p className="presentation__instruction">
        Добро пожаловать в игру, посвященную почти двухсотлетней истории
        фотографии. Ваша задача - угадать год создания фотографии, используя
        слайдер. Игра состоит из 10 раундов. После окончания игры вы сможете
        сохранить свой результат и, если он достаточно высок, попасть в таблицу
        лучших игроков. Удачи!
      </p>
      <button type="button">
        <span className="shadow" />
        <span className="edge" />
        <span className="front">Играть</span>
      </button>
    </main>
  );
}

export default Presentation;
