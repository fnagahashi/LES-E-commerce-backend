import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertAllBooksWithStock1680000000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      WITH inserted_books AS (
        INSERT INTO book (
          id,
          title,
          author,
          category,
          "yearPublication",
          isbn,
          publisher,
          price,
          description,
          active
        )
        VALUES
          (uuid_generate_v4(), 'O Pequeno Príncipe', 'Antoine de Saint-Exupéry', 'aventura', '1943', '9788574061978', 'Agir', '39.90', 'Clássico da literatura.', true),

          (uuid_generate_v4(), 'Orgulho e Preconceito', 'Jane Austen', 'romance', '1813', '9788544001479', 'Companhia das Letras', '45.90', 'Romance clássico.', true),

          (uuid_generate_v4(), 'A Ilha do Tesouro', 'Robert Louis Stevenson', 'aventura', '1883', '9788520938409', 'Zahar', '39.90', 'Aventura clássica.', true),

          (uuid_generate_v4(), 'O Senhor dos Anéis: A Sociedade do Anel', 'J.R.R. Tolkien', 'fantasia', '1954', '9788533613379', 'HarperCollins', '54.90', 'Fantasia épica.', true),

          (uuid_generate_v4(), 'Garota Exemplar', 'Gillian Flynn', 'suspense', '2012', '9788580573664', 'Intrínseca', '49.90', 'Thriller psicológico.', true),

          (uuid_generate_v4(), 'O Iluminado', 'Stephen King', 'terror', '1977', '9788581050850', 'Suma', '52.90', 'Terror psicológico.', true),

          (uuid_generate_v4(), 'Steve Jobs: A Biografia', 'Walter Isaacson', 'biografia', '2011', '9788535915525', 'Companhia das Letras', '59.90', 'Biografia.', true),

          (uuid_generate_v4(), 'O Morro dos Ventos Uivantes', 'Emily Brontë', 'romance', '1847', '9788544001056', 'Penguin Companhia', '42.90', 'Romance intenso.', true),

          (uuid_generate_v4(), 'Persuasão', 'Jane Austen', 'romance', '1817', '9788544002124', 'Companhia das Letras', '39.90', 'Romance.', true),

          (uuid_generate_v4(), 'Como Eu Era Antes de Você', 'Jojo Moyes', 'romance', '2012', '9788580573480', 'Intrínseca', '44.90', 'Romance emocionante.', true),

          (uuid_generate_v4(), 'As Aventuras de Tom Sawyer', 'Mark Twain', 'aventura', '1876', '9788544001721', 'Penguin Companhia', '36.90', 'Aventura clássica.', true),

          (uuid_generate_v4(), 'Harry Potter e a Pedra Filosofal', 'J.K. Rowling', 'fantasia', '1997', '9788532530787', 'Rocco', '39.90', 'Fantasia.', true),

          (uuid_generate_v4(), 'O Código Da Vinci', 'Dan Brown', 'suspense', '2003', '9788580416312', 'Arqueiro', '49.90', 'Suspense.', true),

          (uuid_generate_v4(), 'It: A Coisa', 'Stephen King', 'terror', '1986', '9788581050478', 'Suma', '79.90', 'Terror.', true),

          (uuid_generate_v4(), 'Longo Caminho Para a Liberdade', 'Nelson Mandela', 'biografia', '1994', '9788574481876', 'Siciliano', '54.90', 'Biografia.', true)
        RETURNING id
      )
      INSERT INTO stock (id, quantity, "bookId")
      SELECT uuid_generate_v4(), 10, id FROM inserted_books;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM stock WHERE "bookId" IN (
        SELECT id FROM book WHERE isbn IN (
          '9788574061978',
          '9788544001479',
          '9788520938409',
          '9788533613379',
          '9788580573664',
          '9788581050850',
          '9788535915525',
          '9788544001056',
          '9788544002124',
          '9788580573480',
          '9788544001721',
          '9788532530787',
          '9788580416312',
          '9788581050478',
          '9788574481876'
        )
      );

      DELETE FROM book WHERE isbn IN (
        '9788574061978',
        '9788544001479',
        '9788520938409',
        '9788533613379',
        '9788580573664',
        '9788581050850',
        '9788535915525',
        '9788544001056',
        '9788544002124',
        '9788580573480',
        '9788544001721',
        '9788532530787',
        '9788580416312',
        '9788581050478',
        '9788574481876'
      );
    `);
  }
}
