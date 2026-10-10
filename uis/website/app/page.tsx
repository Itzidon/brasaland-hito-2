type InfoCardProps = {
  number: string;
  title: string;
  text: string;
  id?: string;
};

function InfoCard({ number, title, text, id }: InfoCardProps) {
  return (
    <article className="card" id={id}>
      <span>{number}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

export default function Home() {
  const cards = [
    {
      number: "01",
      title: "Colombia",
      text: "Parte central de la operación de Brasaland y sede de nuestros equipos corporativos.",
    },
    {
      number: "02",
      title: "Florida",
      text: "Presencia internacional que conecta la marca con clientes fuera de Colombia.",
    },
    {
      number: "03",
      title: "Brasaland Digital",
      text: "Nuestra unidad tecnológica interna crea herramientas para mejorar los procesos de los equipos de Brasaland.",
      id: "digital",
    },
  ];

  return (
    <main>
      <header className="header">
        <div className="logo">BRASALAND</div>

        <nav>
          <a href="#empresa">Empresa</a>
          <a href="#presencia">Presencia</a>
          <a href="#digital">Brasaland Digital</a>
        </nav>
      </header>

      <section className="hero">
        <div className="heroContent">
          <span className="tag">COLOMBIA · FLORIDA</span>

          <h1>Brasaland</h1>

          <p className="heroText">
            Una cadena de restaurantes de parrilla con 14 locales,
            conectando nuestra operación en Colombia y Florida.
          </p>

          <a className="button" href="#empresa">
            Conocer Brasaland
          </a>
        </div>

        <div className="heroCard">
          <span className="number">14</span>
          <span className="cardText">locales</span>

          <div className="line" />

          <span>Colombia + Florida</span>
        </div>
      </section>

      <section id="empresa" className="section">
        <p className="eyebrow">NUESTRA EMPRESA</p>

        <h2>Una operación que sigue creciendo</h2>

        <p>
          Brasaland es una cadena de restaurantes de parrilla con presencia
          en Colombia y Florida. Nuestra organización combina la operación
          gastronómica con herramientas digitales que ayudan a nuestros
          equipos en su trabajo diario.
        </p>
      </section>

      <section id="presencia" className="cards">
        {cards.map((card) => (
          <InfoCard
            key={card.number}
            number={card.number}
            title={card.title}
            text={card.text}
            id={card.id}
          />
        ))}
      </section>

      <footer>
        <strong>BRASALAND</strong>
        <span>Colombia · Florida</span>
      </footer>
    </main>
  );
}