const net = require("net")

PORTA = 8000
HOST = "127.0.0.1"

let cont_id = 0;

db_carrinho =
{
    produtos: [],
    pago: false,
    entregue: false,
}


produtos = [
    {
        id: 0,
        descricao: "Limao",
        preco: 10.0,
        quantidade: 4
    },
    {
        id: 1,
        descricao: "Maracujá",
        preco: 25.0,
        quantidade: 1
    },
    {
        id: 2,
        descricao: "Arroz",
        preco: 12.0,
        quantidade: 42
    },
]


const conexaoListener = socket => {
    socket.on("data", (data) => {
        const dadosUser = data.toString().trim().split(" ")
        const acao = dadosUser[0].toLowerCase();

        switch (acao) {
            case "help":
                let help = "";
                help += "Adicionar produto, cmd: add_prod -p[descricao:str, preco:float, qtd: int]\n"
                help += "Ex: add_prod feijao 20.0 5\n"
                help += "Listar produtos, cmd:list -p[]\n"
                help += "Adicionar no carrinhos, cmd: add_c -p[id:int, qtd: int]\n"
                socket.write("\n" + help);
                break

            case "add_prod":
                if (dadosUser.length === 4) {
                    produtos.push({
                        id: cont_id + 1,
                        descricao: dadosUser[1],
                        preco: dadosUser[2],
                        quantidade: dadosUser[3],
                    })

                    cont_id += 1

                    socket.write("Adicionado com sucesso\n",);
                } else {
                    socket.write("Error ao adicionar produto");
                }
                break
            case "list":
                if (produtos.length === 0) {
                    socket.write("Lista de produtos vazia\n",)
                } else {
                    let opcoes = "";
                    produtos.forEach((produto) => {
                        opcoes += "{Id: " + produto.id + ", descricao:" + produto.descricao + ", quantidade: " + produto.preco + ", preco: " + produto.quantidade + "}\n"
                    })
                    socket.write("\nLista de produtos: \n" + opcoes)
                }
                break

            case "add_c":
                if (dadosUser.length === 3) {
                    const found = produtos.find(e => e.id == dadosUser[1])
                    if (typeof found === "undefined") {
                        socket.write("\nProduto não encontrado: \n")
                    } else {
                        if (found.quantidade >= dadosUser[2]) {
                            db_carrinho.produtos.push(
                                {
                                    id: found.id,
                                    descricao: found.descricao,
                                    preco: found.preco,
                                    quantidade: Number(dadosUser[2]),
                                },
                            )
                            let valor_final = 0
                            db_carrinho.produtos.forEach((e) => valor_final += e.preco * e.quantidade)
                            socket.write("\nValor do carrinho: " + valor_final + " R$")
                        } else {
                            socket.write("\nQuantidade informada superior ao disponível")
                        }
                    }
                } else {
                    socket.write("\nParâmetros inválidos, use help para detalhes\n")
                }
                break
            default:
                socket.write("Error desconhecido\n",)

        }
    })
}

const server = net.createServer(conexaoListener)


server.listen(PORTA, HOST, () => { console.log("Servidor inicializado!") })


