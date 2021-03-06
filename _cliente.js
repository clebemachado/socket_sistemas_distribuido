const net = require("net");

PORTA = 8000;
HOST = "127.0.0.1";

const cliente = new net.Socket();

const readLine = require("readline");

const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
});

lista_de_carrinho = [];

const conexaoListener = async () => {
  console.log("Conectado ao servidor, use help para visualizar os comandos.");

  cliente.on("data", (data) => {
    /**
     * Ouvir as respostas do servidor
     */
    const dataString = data.toString();
    console.log("Resposta do servidor: " + dataString);
  });

  rl.addListener("line", (line) => {
    if (line == "clear") {
      console.clear()
    } else { 
      console.clear()
      cliente.write(line);
    }
    
  });
};

cliente.connect(PORTA, HOST, conexaoListener);
