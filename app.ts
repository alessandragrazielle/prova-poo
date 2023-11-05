import prompt from "prompt-sync";
let input = prompt();

import { RedeSocial } from "./redeSocial";
import { Perfil, Postagem, PostagemAvancada, RepositorioDePerfis, RepositorioDePostagens } from "./index";

class App {
    private _redeSocial: RedeSocial = new RedeSocial;
    private _idPerfilAnterior: number = 0;
    private _IdPostagemAnterior: number = 0;

    get redeSocial(): RedeSocial {
        return this._redeSocial;
    }

    menu(): void {
        let opcao: string = '';
        do {
            console.log('\nBem Vindo \nDigite uma opção: ');
            console.log('1 - Consultar Perfil    2 - Incluir Perfil      3 - Consultar Postagem\n' +
                        '4 - Incluir Postagem    5 - Avaliar Postagens   6 - Exibir Perfis \n' +
                        '7 - Exibir todas as postagens \n' +
                        '0 - Sair\n');

            opcao = input("Opção: ");
            
            switch (opcao) {
                case "1":
                    this.consultarPerfil();
                    break;
                case "2":
                    this.incluirPerfil();
                    break;
                case "3": 
                    this.consultarPostagem();
                    break;
                case "4":
                    this.incluirPostagem();
                    break;
                case "5":
                    this.avaliarPostagem();
                    break;
                case "6":
                    this.exibirPerfis();
                    break;
                case "7":
                    this.exibirTodasPostagens();
                    break;
                case "0": console.log('Aplicação encerrada!');
                    break;
                default:
                    console.log("Opção inválida. Tente novamente.");
                    break;
            }
        } while (opcao != "0");
    }

    consultarPerfil(): void {
        console.log('\nCONSULTAR PERFIL');
        let nomePerfil = input('Nome do perfil procurado: ');
        this.redeSocial.consultarPerfil(undefined, nomePerfil);
    }

    incluirPerfil(): void {
        console.log('\nCADASTRAR PERFIL');
        let idPerfil = ++this._idPerfilAnterior;
        let nome: string = input('Nome do seu perfil: ');
        let email: string = input('Digite seu email: ');

        let novoPerfil: Perfil = new Perfil(idPerfil, nome, email)
        this.redeSocial.incluirPerfil(novoPerfil);
    }

    consultarPostagem(): void{
        let opcao: string = '';

        do {
            console.log('\nDigite uma opção: ');
            console.log('1 - Consultar por texto    2 - Consultar por Hashtag \n' +
                        '3 - Consultar por perfil   4 - Consultar por id\n' +
                        '0 - Voltar\n');

            opcao = input("Opção: ");
            
            switch (opcao) {
                case "1":
                    this.consultarPorTexto();
                    break;
                case "2":
                    this.consultarPorHashtag();
                    break;
                case "3": 
                    this.consultarPorPerfil();
                    break;
                case "4": 
                    this.consultarPorId();
                    break;
                case "0": console.log('Voltando à pagina inicial!');
                    break;
                default:
                    console.log("Opção inválida. Tente novamente.");
                    break;
            }
        } while (opcao != "0");
    }

    consultarPorTexto(){
        console.log('\nCONSULTAR POSTAGEM POR TEXTO');
        let texto: string = input('Texto da postagem: ');
        let postagens = this.redeSocial.consultarPostagem(undefined, texto);

        console.log(postagens);
        
    }

    consultarPorHashtag(){
        console.log('\nCONSULTAR POSTAGEM POR HASHTAG');
        let hashtag: string = input('Hashtag a ser consultada: ');
        let postagens = this.redeSocial.exibirPostagensPorHashtag(hashtag);

        console.log(postagens);
    }

    consultarPorPerfil(){
        console.log('\nCONSULTAR POSTAGEM POR PERFIL');
        let nome: string = input('Nome do perfil que deseja ver as postagens: ');
        let perfil = this.redeSocial.consultarPerfil(undefined, nome);
        let postagens = this.redeSocial.exibirPostagensPorPerfil(perfil.idPerfil)

        console.log(postagens);
    }

    consultarPorId(){
        console.log('\nCONSULTAR POSTAGEM POR ID');
        let idPostagemStr: string = input('Id da postagem: ');
        let idPostagem: number = parseFloat(idPostagemStr)
        this.redeSocial.consultarPostagem(idPostagem);
    }

    incluirPostagem(): void {
        console.log('\nINCLUIR POSTAGEM');
        let idPostagem = ++this._IdPostagemAnterior;
        let nomePerfil: string = input('Qual seu nome de perfil? ');
        let texto: string = input('O que voce esta pensando? ');
        let temHashtag: string = input('Deseja adicionar hashtag? (s/n) ');

        let perfil = this._redeSocial.consultarPerfil(undefined, nomePerfil);

        if(temHashtag == 'n'){
            let novaPostagem: Postagem = new Postagem(idPostagem, texto, perfil);   
            this.redeSocial.incluirPostagem(novaPostagem);       
        } else if (temHashtag == 's') {
            let quantidadeStr = input('Quantas hashtags deseja adicionar? ');
            let quantidade: number = parseFloat(quantidadeStr);

            let novaPostagem: PostagemAvancada = new PostagemAvancada(idPostagem, texto, perfil); 

            for(let i=1; i<=quantidade; i++){
                let hashtag = input('Adicione uma hashtag: ');
                novaPostagem.adicionarHashtag(hashtag);
            }

            this.redeSocial.incluirPostagem(novaPostagem);
        }        
    }

    avaliarPostagem(): void {
        let opcao: string = '';

        do {
            console.log('\nDigite uma opção: ');
            console.log('1 - Avaliar por texto    2 - Avaliar por Hashtag \n' +
                        '3 - Avaliar por id \n' +
                        '0 - Voltar\n');

            opcao = input("Opção: ");
            
            switch (opcao) {
                case "1":
                    this.avaliarPorTexto();
                    break;
                case "2":
                    this.avaliarPorHashtag();
                    break;
                case "3": 
                    this.avaliarPorId();
                    break;
                case "0": console.log('Voltando à pagina inicial!');
                    break;
                default:
                    console.log("Opção inválida. Tente novamente.");
                    break;
            }
        } while (opcao != "0");
    }

    avaliarPorTexto(): void {
        console.log('\nAVALIAR POSTAGENS POR TEXTO');
        let texto: string = input('Texto da postagem: ');
        let postagens = this.redeSocial.consultarPostagem(undefined, texto);

        let avaliacao = input('Voce deseja curtir ou descurtir a(s) postagem(ens)? (c/d) ')
        for (let p of postagens) {
            if(p instanceof Postagem){
                if (avaliacao === 'c') {
                    this.redeSocial.curtir(p.idPostagem);
                } else if (avaliacao === 'd') {
                    this.redeSocial.descurtir(p.idPostagem);
                }
            }
            console.log(`\nPostagem(s) ${avaliacao === 'c' ? 'curtida(s)' : 'descurtida(s)'} com sucesso!`);
        }

        console.log(postagens);
    }

    avaliarPorHashtag(): void{
        console.log('\nAVALIAR POSTAGENS POR HASHTAG');
        let hashtag: string = input('Hashtag a ser avaliada: ');
        let postagens = this.redeSocial.exibirPostagensPorHashtag(hashtag);

        let avaliacao = input('Voce deseja curtir ou descurtir a(s) postagem(ens)? (c/d) ')
        for (let p of postagens) {
            if(p instanceof PostagemAvancada){
                if (avaliacao === 'c') {
                    this.redeSocial.curtir(p.idPostagem);
                } else if (avaliacao === 'd') {
                    this.redeSocial.descurtir(p.idPostagem);
                }
            }
            console.log(`\nPostagem(s) ${avaliacao === 'c' ? 'curtida(s)' : 'descurtida(s)'} com sucesso!`);
        }

        console.log(postagens);
    }

    avaliarPorId(): void{
        console.log('\nAVALIAR POSTAGEM POR ID');
        let idPostagemStr: string = input('Id da postagem: ');
        let idPostagem: number = parseFloat(idPostagemStr)
        let postagem = this.redeSocial.consultarPostagem(idPostagem);

        let avaliacao = input('Voce deseja curtir ou descurtir a(s) postagem(ens)? (c/d) ')
        if (avaliacao === 'c') {
            this.redeSocial.curtir(idPostagem);
        } else {
            this.redeSocial.descurtir(idPostagem);
        }

        console.log(postagem);
    }

    exibirPerfis(): void{
        console.log('TODOS OS PERFIS');
        console.log(this.redeSocial.exibirPerfis());
    }

    exibirTodasPostagens(): void{
        console.log('TODOS AS POSTAGENS');
        console.log(this.redeSocial.exibirTodasAsPostagens())
    }
}

const meuApp: App = new App();
meuApp.menu();
