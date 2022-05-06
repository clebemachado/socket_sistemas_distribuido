# Microprojeto 01 - Implementação de um serviço de supermercado delivery (sockets)

## Componentes 👥:

- Clebson Mendonça Machado da Silva
- Luíz Felipe Silva Santos

---

## A fazeres 🕛:

- [x]  Listar os produtos disponíveis
- [x]  Adicionar um produto no carrinho
- [x]  Remover um produto do carrinho
- [x]  Pagar o pedido
- [x]  Solicitar a entrega

---

## Observações 👀:

No cliente no objeto rl, foi adicionado no addlistener console.clear para limpar o terminal e deixar mais “organizado”, assim basta remover.

```jsx
rl.addListener("line", (line) => {

    if (line == "clear") {
      console.clear()
    } else { 
      console.clear()
      cliente.write(line);
    }
  
 });
```

---

## Comandos ⌨️:

Foram adicionados os seguintes comandos

- Para listar os produtos do supermercado
    - list
- Para adicionar um produto no carrinho
    - add_c -p[id:int, qtd: int]
    - exemplo: add_c 0 10
- Remover um produto do carrinho:
    - rem_c -p[id:int]
    - rem_c 0
- Para pagar os produtos que estão no carrinho
    - pagar -p[valor:number]
    - pagar 400
- Para solicitar a entrega dos produtos
    - entregar
- Para ver ajuda
    - help
