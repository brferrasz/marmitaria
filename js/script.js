// Seleciona os elementos do formulário e da tabela
const form = document.getElementById('form-pedido');
const tabela = document.getElementById('tabela-pedidos');

let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
let editandoIndex = null;

// Função para calcular o valor total
function calcularValor(tipo, quantidade, restricoes) {
    const precoBase = 25 * quantidade;
    let valor = precoBase;

    if (tipo === 'Vegetariana') {
        valor *= 0.9; // 10% de desconto
    }

    if (restricoes.length > 0) {
        valor += 5 * quantidade; // taxa de restrição
    }

    return valor;
}

// Função para salvar pedidos no LocalStorage
function salvarPedidos() {
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
}

// Função para atualizar a tabela
function atualizarTabela() {
    tabela.innerHTML = '';

    pedidos.forEach((pedido, index) => {
        const linha = document.createElement('tr');

        linha.innerHTML = `
            <td>${pedido.nome}</td>
            <td>${pedido.tipo}</td>
            <td>${pedido.quantidade}</td>
            <td>${pedido.restricoes.join(', ') || 'Nenhuma'}</td>
            <td>R$${pedido.valorTotal.toFixed(2)}</td>
            <td class="actions">
                <button class="editar" onclick="editarPedido(${index})">Editar</button>
                <button class="excluir" onclick="excluirPedido(${index})">Excluir</button>
            </td>
        `;

        tabela.appendChild(linha);
    });
}

// Função para limpar o formulário
function limparFormulario() {
    form.reset();
    editandoIndex = null;
}

// Função para lidar com o envio do formulário
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const tipo = document.getElementById('tipo').value;
    const quantidade = parseInt(document.getElementById('quantidade').value);

    const restricoes = [];
    if (document.getElementById('sem-gluten').checked) restricoes.push('Sem glúten');
    if (document.getElementById('sem-lactose').checked) restricoes.push('Sem lactose');

    const valorTotal = calcularValor(tipo, quantidade, restricoes);

    const pedido = {
        nome,
        tipo,
        quantidade,
        restricoes,
        valorTotal
    };

    if (editandoIndex === null) {
        // Adiciona novo pedido
        pedidos.push(pedido);
    } else {
        // Atualiza pedido existente
        pedidos[editandoIndex] = pedido;
    }

    salvarPedidos();
    atualizarTabela();
    limparFormulario();
});

// Função para editar um pedido
window.editarPedido = (index) => {
    const pedido = pedidos[index];

    document.getElementById('nome').value = pedido.nome;
    document.getElementById('tipo').value = pedido.tipo;
    document.getElementById('quantidade').value = pedido.quantidade;

    document.getElementById('sem-gluten').checked = pedido.restricoes.includes('Sem glúten');
    document.getElementById('sem-lactose').checked = pedido.restricoes.includes('Sem lactose');

    editandoIndex = index;
};

// Função para excluir um pedido
window.excluirPedido = (index) => {
    if (confirm('Tem certeza que deseja excluir este pedido?')) {
        pedidos.splice(index, 1);
        salvarPedidos();
        atualizarTabela();
    }
};

// Carrega os pedidos ao iniciar
atualizarTabela();
