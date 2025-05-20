let gotas = [];
let solo;
let tipoSolo = "vegetacao"; // valor inicial
let arvores = []; // Array para armazenar as árvores
let construcoes = []; // Array para armazenar as construções
let aviao; // Variável para armazenar o avião

function setup() {
  let canvas = createCanvas(600, 400);
  canvas.parent("canvas-holder");
  solo = new Solo(tipoSolo);
  if (tipoSolo === "vegetacao") {
    // Cria algumas árvores aleatoriamente com a base no solo
    for (let i = 0; i < 5; i++) {
      let x = random(50, width - 50);
      let y = solo.altura; // Define a base da árvore na altura do solo
      let alturaArvore = random(50, 80);
      arvores.push(new Arvore(x, y - alturaArvore)); // Subtrai a altura para posicionar a base
    }
  } else if (tipoSolo === "urbanizado") {
    // Cria algumas construções aleatoriamente
    for (let i = 0; i < 8; i++) {
      let largura = random(30, 60);
      let altura = random(50, 120);
      let x = random(largura / 2, width - largura / 2);
      let y = solo.altura - altura;
      construcoes.push(new Construcao(x, y, largura, altura));
    }
    aviao = new AviaoGeometrico(); // Cria o avião geométrico
  }
}

function draw() {
  background(200, 220, 255); // céu

  for (let i = gotas.length - 1; i >= 0; i--) {
    gotas[i].cair();
    gotas[i].mostrar();

    if (gotas[i].atingeSolo(solo.altura)) {
      solo.aumentarErosao();
      gotas.splice(i, 1);
    }
  }

  solo.mostrar();

  // Mostra as árvores
  for (let arvore of arvores) {
    arvore.mostrar();
  }

  // Mostra as construções
  for (let construcao of construcoes) {
    construcao.mostrar();
  }

  // Mostra o avião geométrico
  if (aviao) {
    aviao.voar();
    aviao.mostrar();
  }

  if (frameCount % 5 === 0) {
    gotas.push(new Gota());
  }
}

function setSoilType(tipo) {
  tipoSolo = tipo;
  solo = new Solo(tipoSolo);
  arvores = []; // Limpa as árvores ao mudar o tipo de solo
  construcoes = []; // Limpa as construções ao mudar o tipo de solo
  if (tipoSolo === "vegetacao") {
    // Cria novas árvores com a base no solo
    for (let i = 0; i < 5; i++) {
      let x = random(50, width - 50);
      let y = solo.altura; // Define a base da árvore na altura do solo
      let alturaArvore = random(50, 80);
      arvores.push(new Arvore(x, y - alturaArvore)); // Subtrai a altura para posicionar a base
    }
    aviao = null;
  } else if (tipoSolo === "urbanizado") {
    // Cria novas construções
    for (let i = 0; i < 8; i++) {
      let largura = random(30, 60);
      let altura = random(50, 120);
      let x = random(largura / 2, width - largura / 2);
      let y = solo.altura - altura;
      construcoes.push(new Construcao(x, y, largura, altura));
    }
    aviao = new AviaoGeometrico(); // Cria o avião geométrico
  } else {
    aviao = null; // Remove o avião se não for urbanizado
  }
}

class Gota {
  constructor() {
    this.x = random(width);
    this.y = 0;
    this.vel = random(4, 6);
  }

  cair() {
    this.y += this.vel;
  }

  mostrar() {
    stroke(0, 0, 200);
    line(this.x, this.y, this.x, this.y + 10);
  }

  atingeSolo(ySolo) {
    return this.y > ySolo;
  }
}

class Solo {
  constructor(tipo) {
    this.tipo = tipo;
    this.altura = height - 80;
    this.erosao = 0;
  }

  aumentarErosao() {
    let taxa;
    if (this.tipo === "vegetacao") taxa = 0.05;
    else if (this.tipo === "exposto") taxa = 0.5;
    else if (this.tipo === "urbanizado") taxa = 0.1; // Erosão menor em áreas urbanas com drenagem?

    this.erosao += taxa;
    this.altura += taxa;
  }

  mostrar() {
    noStroke();
    if (this.tipo === "vegetacao") {
      fill(60, 150, 60);
    } else if (this.tipo === "exposto") {
      fill(139, 69, 19);
    } else if (this.tipo === "urbanizado") {
      fill(120);
    }

    // Desenha o solo
    rect(0, this.altura, width, height - this.altura);

    // Desenha a caverna SOMENTE se o tipo de solo for "vegetacao"
    if (this.tipo === "vegetacao") {
      this.desenharCaverna();
    }

    fill(0);
    textSize(14);
    textAlign(LEFT);
    text(`Erosão: ${this.erosao.toFixed(1)}`, 10, 20);
    text(`Tipo de solo: ${this.tipo}`, 10, 40);
  }

  desenharCaverna() {
    fill(80); // Cor da caverna (cinza escuro)
    let larguraCaverna = 60;
    let alturaCaverna = 30;
    let xCaverna = width - 100;
    let yCaverna = this.altura - alturaCaverna;

    rect(xCaverna, yCaverna, larguraCaverna, alturaCaverna);
    fill(60, 150, 60);
    arc(xCaverna + larguraCaverna / 2, yCaverna, larguraCaverna, 20, PI, TWO_PI);
    fill(50);
    ellipse(xCaverna + larguraCaverna / 2, yCaverna + alturaCaverna / 2 + 5, larguraCaverna * 0.8, alturaCaverna * 0.6);
  }
}

class Arvore {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.alturaTronco = random(20, 40);
    this.larguraTronco = 10;
    this.raioCopa = random(15, 25);
    this.corTronco = color(101, 67, 33); // Marrom
    this.corCopa = color(34, 139, 34); // Verde escuro
  }

  mostrar() {
    // Tronco
    fill(this.corTronco);
    rect(this.x - this.larguraTronco / 2, this.y, this.larguraTronco, -this.alturaTronco); // Desenha para cima

    // Copa (círculo) - Ajusta a posição Y da copa
    fill(this.corCopa);
    ellipse(this.x, this.y - this.alturaTronco - this.raioCopa, this.raioCopa * 2, this.raioCopa * 2);
  }
}

class Construcao {
  constructor(x, y, largura, altura) {
    this.x = x;
    this.y = y;
    this.largura = largura;
    this.altura = altura;
    this.cor = color(150); // Cor cinza para edifícios
  }

  mostrar() {
    fill(this.cor);
    rect(this.x - this.largura / 2, this.y, this.largura, this.altura);
    // Adicione detalhes como janelas aqui, se desejar
    fill(200); // Cor clara para janelas
    let numJanelasVert = floor(this.altura / 20);
    let numJanelasHoriz = floor(this.largura / 15);
    let larguraJanela = this.largura / (numJanelasHoriz + 1) * 0.6;
    let alturaJanela = this.altura / (numJanelasVert + 1) * 0.6;
    for (let i = 1; i <= numJanelasVert; i++) {
      for (let j = 1; j <= numJanelasHoriz; j++) {
        let xJanela = this.x - this.largura / 2 + this.largura / (numJanelasHoriz + 1) * j - larguraJanela / 2;
        let yJanela = this.y + this.altura / (numJanelasVert + 1) * i - alturaJanela / 2;
        rect(xJanela, yJanela, larguraJanela, alturaJanela);
      }
    }
  }
}

class AviaoGeometrico {
  constructor() {
    this.x = -50; // Começa fora da tela à esquerda
    this.y = 70; // Altura ajustada
    this.tamanho = 20;
    this.corPrincipal = color(100, 150, 200); // Azul acinzentado
    this.corDetalhe = color(200, 200, 200); // Cinza claro
    this.velocidade = 3;
  }

  voar() {
    this.x += this.velocidade;
    if (this.x > width + 50) {
      this.x = -50; // Volta para o início
    }
  }

  mostrar() {
    push(); // Salva o estado de transformação atual
    translate(this.x, this.y); // Move a origem para a posição do avião

    // Corpo
    fill(this.corPrincipal);
    rect(-this.tamanho, 0, this.tamanho * 2, this.tamanho / 2);

    // Asas
    fill(this.corDetalhe);
    triangle(-this.tamanho, 0, -this.tamanho - this.tamanho / 2, -this.tamanho / 4, -this.tamanho - this.tamanho / 2, this.tamanho / 4); // Asa esquerda
    triangle(this.tamanho, 0, this.tamanho + this.tamanho / 2, -this.tamanho / 4, this.tamanho + this.tamanho / 2, this.tamanho / 4); // Asa direita

    // Cauda
    fill(this.corPrincipal);
    triangle(this.tamanho, 0, this.tamanho + this.tamanho / 4, -this.tamanho / 2, this.tamanho + this.tamanho / 4, this.tamanho / 2);

    // Hélice (simplificada)
    fill(this.corDetalhe);
    ellipse(-this.tamanho, this.tamanho / 4, this.tamanho / 3, this.tamanho / 3);
    line(-this.tamanho - this.tamanho / 3, this.tamanho / 4, -this.tamanho + this.tamanho / 3, this.tamanho / 4);
    line(-this.tamanho, this.tamanho / 4 - this.tamanho / 3, -this.tamanho, this.tamanho / 4 + this.tamanho / 3);

    pop(); // Restaura o estado de transformação anterior
  }
}

function mousePressed() {
  // Exemplo para adicionar uma nova árvore ou construção ao clicar
  if (tipoSolo === "vegetacao") {
    let alturaNovaArvore = random(50, 80);
    arvores.push(new Arvore(mouseX, solo.altura - alturaNovaArvore));
  } else if (tipoSolo === "urbanizado") {
    let largura = random(30, 60);
    let altura = random(50, 120);
    construcoes.push(new Construcao(mouseX, solo.altura - altura, largura, altura));
  }
}
