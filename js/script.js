$(document).ready(function() {
    // Seleção de Elementos
    const ListaProdutos = $('#ListaProdutos');
    const NomeProduto = $('#nome');
    const DescricaoProduto = $('#descricao');
    const URLProduto = $('#URL');
    const CategoriaProduto = $('#categoria');
    const PrecoProduto = $('#preco');
    const InputPesquisar = $('#inputPesquisar');
    const Filtro = $('#Filtro');
    const contagem = $('#contagem');
    let count = 0;

    const BtnCadastrar = $('#btnCadastrar');
    const BtnDelete = $('#btnDelete');
    const BtnSalvarAlteracoes = $('#btnSalvarAlteracoes');
    const BtnFechar = $('#btnFechar');

    const EditNome = $('#editNome');
    const EditDescricao = $('#editDescricao');
    const EditURL = $('#editURL');
    const EditCategoria = $('#editCategoria');
    const EditPreco = $('#editPreco');

    const API = 'https://cipaon.com.br/api/produto.php?token=408ADF71B5D3B2B041E6009A323731E064864E4702CF6ED81DAD428626ACAAEB'; // A API QUE FUNCIONOU FOI A FE1508, inclusive de outros colegas funcionou tbm dentro do meu código...
    let produtos = []; 

    init();

    // Funções
    function init() {
        exibirProdutos();
        cadastrarProdutoNaAPI();
    }

    function limparForms() {
        NomeProduto.val('');
        DescricaoProduto.val('');
        CategoriaProduto.val(0);
        URLProduto.val('');
        PrecoProduto.val('');
    }

    function exibirProdutos() {
        ListaProdutos.empty();

        $.getJSON(API, function (response) {
            produtos = response;
            produtos.sort((a, b) => a.nome.localeCompare(b.nome));

            produtos.forEach((produto) => {
                let categoria = produto.idCategoria == 1 ? 'Bolo' : 'Café';

                const item = $(`
                    <div class="item col-md-12">
                        <div class="col-md-2 nome fw-bold">${produto.nome}</div>
                        <div class="col-md-3 descricao pe-3">${produto.descricao}</div>
                        <div class="col-md-2 categoria text-primary fw-bold">${categoria}</div>
                        <div class="col-md-2 url"><img src="${produto.foto}" class="img-fluid" width="100px"></div>
                        <div class="col-md-1 preco fw-bold">R$ ${produto.preco}</div>
                        <div class="col-md-2 botoes">
                            <button class="btn btn-warning btnEditar" data-bs-toggle="modal" data-bs-target="#ModalEditar"><i class="bi bi-pencil-square"></i> Editar</button>
                            <button class="btn btn-danger btnExcluir" data-bs-toggle="modal" data-bs-target="#ModalExcluir"><i class="bi bi-x-circle"></i> Excluir</button>
                        </div>
                    </div>
                `); 
                ListaProdutos.append(item); 
                
                item.find('.btnExcluir').on('click', function() {
                    itemParaExcluir = $(this).closest('.item');
                });
    
                item.find('.btnEditar').on('click', function() {
                    itemParaEditar = $(this).closest('.item');
                    EditNome.val(itemParaEditar.find('.nome').text());
                    EditDescricao.val(itemParaEditar.find('.descricao').text());
                    EditCategoria.val(itemParaEditar.find('.categoria').text());
                    EditURL.val(itemParaEditar.find('.url').text());
                    EditPreco.val(itemParaEditar.find('.preco').text().replace('R$ ', ''));
                });

                count = produtos.length;
                contagem.text(count);
            });
        });
    }

    function cadastrarProdutoNaAPI() {
        BtnCadastrar.click(function() {
            let url_produto = URLProduto.val();
            let nome_produto = NomeProduto.val();
            let descricao_produto = DescricaoProduto.val(); 
            let preco_produto = PrecoProduto.val(); 
            let categoria_produto = CategoriaProduto.val(); 

            if (!url_produto) {
                URLProduto.val('https://www.quitandadelivery.com/images/geral/sem_foto_big.jpg');
            }

            if (nome_produto && descricao_produto && preco_produto && categoria_produto) {
                // Cadastra o produto na API
                var modalCadastrar = bootstrap.Modal.getInstance(document.getElementById('ModalCadastrar'));
                $.ajax({
                    url: 'https://cipaon.com.br/api/produto.php',
                    method: 'POST',
                    data: {
                        token: '408ADF71B5D3B2B041E6009A323731E064864E4702CF6ED81DAD428626ACAAEB',
                        nome: nome_produto,
                        descricao: descricao_produto,
                        idCategoria: categoria_produto,
                        foto: url_produto,
                        preco: preco_produto
                    },
                    success: function(a, b, c) {
                        // Caso de sucesso fazer
                        if (c.status === 201) {
                            limparForms();
                            exibirProdutos();
                            modalCadastrar.hide();
                            Swal.fire({
                                title: "👍😁",
                                text: "Produto adicionado com sucesso!",
                                timer: 3000,
                                icon: "success",
                                showConfirmButton: false,
                            });
                        } else {
                            Swal.fire({
                                title: "Erro!",
                                text: "Produto não cadastrado!",
                                timer: 3000,
                                icon: "error",
                                showConfirmButton: false,
                            });
                        }
                    },
                    error: function(error) {
                        console.error('Erro na requisição:', error);
                        alert("Erro ao cadastrar produto. Tente novamente.");
                    }
                });

            } else {
                alert("Por favor, preencha todos os campos");
            }
        });
    }

    function pesquisarProdutos(texto) {
        const items = ListaProdutos.find('.item');
        items.each(function() {
            const nomeProduto = $(this).find('.col-md-2:nth-child(1)').text().toLowerCase();
            if (nomeProduto.includes(texto.toLowerCase())) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }

    function ordenarEExibirProdutosPorCategoria() {
        produtos.sort((a, b) => {
            if (a.idCategoria === b.idCategoria) {
                return a.nome.localeCompare(b.nome);
            }
            return a.idCategoria.localeCompare(b.idCategoria);
        });

        exibirProdutos();
    }

    function ordenarEExibirProdutosPorOrdemAlfabetica() {
        produtos.sort((a, b) => a.nome.localeCompare(b.nome));
        exibirProdutos();
    }

    const EditarProduto = () => {
        if (itemParaEditar) {
            if (EditNome.val() && EditDescricao.val() && EditCategoria.val() != 0 && EditPreco.val()) {
                const produtoEditado = produtos.find(prod => prod.nome === itemParaEditar.find('.nome').text());
    
                if (produtoEditado) {
                    produtos = produtos.filter(prod => prod.nome !== produtoEditado.nome);
    
                    produtoEditado.nome = EditNome.val();
                    produtoEditado.descricao = EditDescricao.val();
                    produtoEditado.idCategoria = EditCategoria.val();
                    produtoEditado.foto = EditURL.val();
                    produtoEditado.preco = EditPreco.val();
    
                    editarProdutoNaAPI(produtoEditado);
    
                    produtos.push(produtoEditado);
    
                    exibirProdutos();
    
                    var modalEditar = bootstrap.Modal.getInstance(document.getElementById('ModalEditar'));
                    modalEditar.hide();
                }
            } else {
                alert("Por favor, preencha todos os campos");
            }
        }
    };
    
    const ExcluirProduto = () => {
        if (itemParaExcluir) {
            const nomeParaExcluir = itemParaExcluir.find('.nome').text();
            const produtoParaExcluir = produtos.find(prod => prod.nome === nomeParaExcluir);
    
            if (produtoParaExcluir) {
                excluirProdutoNaAPI(produtoParaExcluir);
    
                produtos = produtos.filter(prod => prod.nome !== nomeParaExcluir);
    
                exibirProdutos();
    
                var modalExcluir = bootstrap.Modal.getInstance(document.getElementById('ModalExcluir'));
                modalExcluir.hide();
            }
        }
    };
    
    
    const editarProdutoNaAPI = (produto) => {
        $.ajax({
            url: 'https://cipaon.com.br/api/produto.php',
            method: 'PUT',
            data: {
                token: '408ADF71B5D3B2B041E6009A323731E064864E4702CF6ED81DAD428626ACAAEB',
                nome: produto.nome,
                descricao: produto.descricao,
                idCategoria: produto.idCategoria,
                foto: produto.foto,
                preco: produto.preco
            },
            success: function() {
                console.log('Produto editado com sucesso na API:', );
            },
            error: function(xhr, status, error) {
                console.error('Erro na requisição:', status, error);
                alert("Erro ao editar produto. Tente novamente.");
            }
        });
    };
    
    const excluirProdutoNaAPI = (produto) => {
        $.ajax({
            url: 'https://cipaon.com.br/api/produto.php',
            method: 'DELETE',
            data: {
                token: '408ADF71B5D3B2B041E6009A323731E064864E4702CF6ED81DAD428626ACAAEB',
                nome: produto.nome 
            },
            success: function() {
                console.log('Produto excluído com sucesso na API:', );
            },
            error: function(xhr, status, error) {
                console.error('Erro na requisição:', status, error);
                alert("Erro ao excluir produto. Tente novamente.");
            }
        });
    };

    // Eventos
    BtnSalvarAlteracoes.on('click', function() {
        EditarProduto();
    });

    BtnDelete.on('click', function() {
        ExcluirProduto();
    });

    BtnFechar.on('click', function() {
        limparForms();
    });

    InputPesquisar.on('input', function() {
        pesquisarProdutos(InputPesquisar.val());
    });

    Filtro.on('change', function() {
        const filtroSelecionado = $(this).val();

        if (filtroSelecionado === 'categoria') {
            ordenarEExibirProdutosPorCategoria();
        } else if (filtroSelecionado === 'alfabetica') {
            ordenarEExibirProdutosPorOrdemAlfabetica();
        }
    });
});