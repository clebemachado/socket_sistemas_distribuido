const net = require("net");

PORTA = 8000;
HOST = "127.0.0.1";

let cont_id = 0;

db_carrinho = {
  produtos: [],
  pago: false,
  entregue: false,
  valorTotal: 0,
};

produtos = [
  {
    id: 0,
    descricao: "Limao",
    preco: 10.0,
    quantidade: 100,
  },
  {
    id: 1,
    descricao: "Maracujá",
    preco: 25.0,
    quantidade: 50,
  },
  {
    id: 2,
    descricao: "Arroz",
    preco: 12.0,
    quantidade: 50,
  },
];

const conexaoListener = (socket) => {
  socket.on("data", (data) => {
    const dadosUser = data.toString().trim().split(" ");
    const acao = dadosUser[0].toLowerCase();

    switch (acao) {
      case "help":
        mostrarHelp(socket);
        break;

      case "add_prod":
        // Essa funcionalidade não precisa  
        addProdutos(dadosUser, produtos, socket);
        break;

      case "list":
        listarProdutos(produtos, socket);
        break;

      case "list_car":
        mostrarCarrinho(db_carrinho, socket);
        break;

      case "add_c":
        addCarrinho(dadosUser, produtos, db_carrinho, socket);
        break;

      case "rem_c":
        removerProduto(dadosUser, db_carrinho, socket);
        break;

      case "pagar":
        pagarProdutos(dadosUser, db_carrinho, socket);
        break;

      case "entregar":
        entregarProduto(dadosUser, db_carrinho, socket);
        break;

      default:
        socket.write("Error desconhecido\n");
    }
  });
};


/* Configurações SERV */

const server = net.createServer(conexaoListener);

server.listen(PORTA, HOST, () => {
  console.log("Servidor inicializado!");
});


/* Funções úteis*/

function atualizarValorTotal(listaProdutos) {
  let valor_final = 0;
  listaProdutos.forEach((e) => (valor_final += e.preco * e.quantidade));
  return valor_final;
}

function listaCarrinho(listaProdutos) {
  carrinhoCliente = "[";
  listaProdutos.forEach((produto) => {
    carrinhoCliente += `\n{ id: ${produto.id}, descrição: ${produto.descricao}, preço: ${produto.preco}, quantidade: ${produto.quantidade} },\n`;
  });
  carrinhoCliente = "\nDados do carrinho: " + carrinhoCliente + "]";
  return carrinhoCliente;
}


/* Funções cases*/

function mostrarHelp(socket) { 
  let help = "";
  help += "Listar produtos, cmd: list\n";
  help += "Adicionar no carrinhos, cmd: add_c -p[id:int, qtd: int]\n";
  help += "Remover do carrinho, cmd: rem_c -p[id:int]\n";
  help += "Pagar, cmd: pagar -p[valor:number]\n";
  help += "Solicitar Entrega, cmd: entregar\n";
  help += "\nExemplo, cmd: 'add_c 0 10'\n";
  socket.write("\n" + help);
}

function addProdutos(dadosUser, produtos, socket) {
  if (dadosUser.length === 4) {
    produtos.push({
      id: cont_id + 1,
      descricao: dadosUser[1],
      preco: dadosUser[2],
      quantidade: dadosUser[3],
    });

    cont_id += 1;

    socket.write("Adicionado com sucesso\n");
  } else {
    socket.write("Error ao adicionar produto");
  }
}

function listarProdutos(produtos, socket) {
  if (produtos.length === 0) {
    socket.write("Lista de produtos vazia\n");
  } else {
    let opcoes = "";
    produtos.forEach((produto) => {
      opcoes +=
        "{Id: " +
        produto.id +
        ", descricao:" +
        produto.descricao +
        ", preco: " +
        produto.preco +
        ", quantidade: " +
        produto.quantidade +
        "}\n";
    });
    socket.write("\nLista de produtos: \n" + opcoes);
  }
}

function mostrarCarrinho(db_carrinho, socket) {
  if (db_carrinho.produtos.length === 0) {
    socket.write("carrinho vazio\n");
  } else {
    carrinho_str = listaCarrinho(db_carrinho.produtos)
    socket.write("\nLista de produtos: \n" + carrinho_str);
  }
}

function addCarrinho(dadosUser, produtos, db_carrinho, socket) {
  if (dadosUser.length === 3) {
    const found = produtos.find((e) => e.id == dadosUser[1]);
    if (typeof found === "undefined") {
      socket.write("\nProduto não encontrado: \n");
    } else {
      if (found.quantidade >= dadosUser[2]) {
        db_carrinho.produtos.push({
          id: found.id,
          descricao: found.descricao,
          preco: found.preco,
          quantidade: Number(dadosUser[2]),
        });
        db_carrinho.produtos.valorTotal = atualizarValorTotal(
          db_carrinho.produtos
        );
        socket.write(listaCarrinho(db_carrinho.produtos));
        socket.write(
          "\nValor do carrinho: " +
          db_carrinho.produtos.valorTotal +
          " R$"
        );
      } else {
        socket.write("\nQuantidade informada superior ao disponível");
      }
    }
  } else {
    socket.write("\nParâmetros inválidos, use help para detalhes\n");
  }
}

function pagarProdutos(dadosUser, db_carrinho, socket) {
  if (dadosUser.length === 2) {
    let valorPago = Number(dadosUser[1]);
    let valorTotal = db_carrinho.produtos.valorTotal;
    if (valorPago >= valorTotal) {
      let troco =
        valorPago > valorTotal
          ? `Troco R$ ${valorPago - valorTotal}`
          : "\nObrigado";
      socket.write("\nPagamento realizado com sucesso!" + troco);
      db_carrinho.pago = true;
    } else {
      socket.write(
        "Valor pago menor que valor total, tente pagar novamnte"
      );
    }
  } else {
    socket.write("\nParâmetros inválidos, use help para detalhes\n");
  }
}

function entregarProduto(dadosUser, db_carrinho, socket) {
  if (dadosUser.length === 1) {
    if (db_carrinho.pago === true) {
      db_carrinho.entregue = true;
      socket.write("\nEntrega solicitada com sucesso\n");
    } else {
      socket.write(
        "\nPagamento não realizado, realize o pagamento para solicitar a entrega\n"
      );
    }
  } else {
    socket.write("\nParâmetros inválidos, use help para detalhes\n");
  }
}

function removerProduto(dadosUser, db_carrinho, socket) {
  if (dadosUser.length === 2) {
    db_carrinho.produtos = db_carrinho.produtos.filter((produto) => {
      if (!(produto.id === Number(dadosUser[1]))) {
        return produto;
      }
    });

    db_carrinho.produtos.valorTotal = atualizarValorTotal(
      db_carrinho.produtos
    );
    socket.write(listaCarrinho(db_carrinho.produtos));
    socket.write(
      "Valor total carrinho: R$" + db_carrinho.produtos.valorTotal
    );
  } else {
    socket.write("\nParâmetros inválidos, use help para detalhes\n");
  }
}
