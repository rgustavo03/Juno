Antes de clonar o projeto, crie o banco de dados e as tabelas com os seguintes passos:
  1. CREATE SCHEMA `juno`;
  2. CREATE TABLE `juno`.`usuarios` (
      `id` INT NOT NULL AUTO_INCREMENT,
      `nome` VARCHAR(255) NOT NULL,
      `email` VARCHAR(255) NOT NULL,
      `senha` VARCHAR(200) NOT NULL,
      `genero` VARCHAR(20) NOT NULL,
      `estado` VARCHAR(45) NOT NULL,
      `cidade` VARCHAR(255) NOT NULL,
      `endereco` VARCHAR(500) NOT NULL,
      `telefone` VARCHAR(45) NOT NULL,
      PRIMARY KEY (`id`));
  3. CREATE TABLE `juno`.`produtos` (
      `id_prod` VARCHAR(20) NOT NULL,
      `nome` VARCHAR(500) NOT NULL,
      `tipo` VARCHAR(45) NOT NULL,
      `preco` INT NOT NULL,
      `cor` VARCHAR(255) NOT NULL,
      `tamanho` VARCHAR(45) NOT NULL,
      PRIMARY KEY (`id_prod`));
  4. CREATE TABLE `juno`.`compras` (
      `id_compra` INT NOT NULL AUTO_INCREMENT,
      `data` DATE NOT NULL,
      `hora` TIME NOT NULL,
      `compra` VARCHAR(2000) NOT NULL,
      `preco` INT NOT NULL,
      `id_usuario` INT NOT NULL,
      PRIMARY KEY (`id_compra`),
      CONSTRAINT `id_usuario`
        FOREIGN KEY (`id_usuario`)
        REFERENCES `juno`.`usuarios` (`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE);


No VS Code, para clonar o projeto, siga os seguinte passos:
  1. Abra um terminal e clone o projeto dentro de sua pasta de projetos:
    - git clone https://github.com/rgustavo03/Juno.git
  2. Após baixar todos os arquivos, abra um novo terminal e digite:
    - cd Juno (esta etapa pode ser evitada se abrir a pasta Juno na opção "Open Folder" em "File" no canto superior esquerdo)
    - cd back
    - npm run start
  4. Abra um novo terminal e digite:
    - cd Juno (esta etapa pode ser evitada se abrir a pasta Juno na opção "Open Folder" em "File" no canto superior esquerdo)
    - cd front
    - npm run start
        Caso apareça o erro "'react-scripts' não é reconhecido como um comando interno
        ou externo, um programa operável ou um arquivo em lotes.", execute este comando:
          - npm install react-scripts --save
        E então, execute "npm run start" novamente.
 
A aplicação já deve funcionar :)
