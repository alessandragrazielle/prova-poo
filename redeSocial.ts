import { Perfil, Postagem, PostagemAvancada, RepositorioDePerfis, RepositorioDePostagens } from "./index";

class RedeSocial {
    private _repositorioDePerfis: RepositorioDePerfis = new RepositorioDePerfis;
    private _repositorioDePostagens: RepositorioDePostagens = new RepositorioDePostagens;
    /*constructor(repositorioDePerfis: RepositorioDePerfis, rpostagens: RepositorioPostagens) {
        this._repositorioDePerfis = repositorioDePerfis;
        this._repositorioDePostagens = rpostagens;
    }*/

    get repositorioDePerfis(): RepositorioDePerfis {
        return this._repositorioDePerfis;
    }

    get respositorioDePostagens(): RepositorioDePostagens {
        return this._repositorioDePostagens;
    }

    incluirPerfil(perfil: Perfil): string {
        let perfilProcurado!: Perfil | null;

        if(perfil.idPerfil && perfil.nome && perfil.email){ //incluir perfil a partir do RepositorioDePerfis
            perfilProcurado = this.repositorioDePerfis.consultarPerfil(perfil.idPerfil, perfil.nome, perfil.email);
            if(!perfilProcurado){
                this.repositorioDePerfis.incluirPerfil(perfil);
                return 'Perfil incluído com sucesso!';
            }
            return 'Perfil já existente!';
        }

        return 'Todos os atributos devem estar preenchidos!';
    }

    consultarPerfil(id?: number, nome?: string, email?: string): Perfil | string {  //consultar perfil a partir do RepositorioDePerfis
        if (!(this.repositorioDePerfis.consultarPerfil(id, nome, email))){
            return 'Perfil não encontrado!'
        } 

        return this.repositorioDePerfis.consultarPerfil(id, nome, email);
    }

    consultarPostagem(id: number, texto: string, hashtag: string | undefined, perfil:  Perfil){
        if(!this.respositorioDePostagens.consultarPostagem(id, texto, hashtag, perfil)){
            return 'Postagem não encontrada!'
        }

        return this.respositorioDePostagens.consultarPostagem(id, texto, hashtag, perfil);
    }

    // modo 1
    incluirPostagem(postagem: Postagem): string {
        let postagemProcurada!: null;
        
    
        if (this.validaPostagem(postagem)) {
            let postagemExiste = this._repositorioDePostagens.consultarPostagem(postagem.idPostagem);

            if (postagemExiste !== null) {
                return 'Já existe uma postagem com o mesmo ID!';
            } else {
                this._repositorioDePostagens.incluirPostagem(postagem);
                return 'Post incluido!';
            }
        } else {
            return 'Todos os atributos da postagem devem estar preenchidos!';
        }
    
    }

    // modo 2
    incluirPostagem2(postagem: Postagem): string {
        let postagemProcurada!: Postagem | null;
    
        if (postagem.idPostagem && postagem.texto && postagem.perfil) {
            postagemProcurada = this._repositorioDePostagens.consultarPostagem(postagem.idPostagem, postagem.texto, undefined, postagem.perfil);
            if (!postagemProcurada) {
                this._repositorioDePostagens.incluirPostagem(postagem);
                return 'Postagem incluída com sucesso!';
            }
        }
        return 'Todos os atributos devem estar preenchidos!';
    }

    private validaPostagem(postagem: Postagem): boolean {
        return (
            postagem.idPostagem != undefined && 
            postagem.texto != undefined &&
            postagem.perfil != undefined
        );
    }    
}

export{ RedeSocial };



let rs: RedeSocial = new RedeSocial()
let rpostagem: RepositorioDePostagens = new RepositorioDePostagens()

// INCLUIR PERFIL
let perfil1: Perfil = new Perfil(1, 'alessandra', 'ale@gmail.com')
let perfil2: Perfil = new Perfil(2, 'kaylanne s', 'k@gmail.com')
let perfil3: Perfil = new Perfil(3, '   ', 'k@gmail.com') // n inclui
let perfil4: Perfil = new Perfil(3, 'kaylanne santos', 'kay@gmail.com') 
let perfil5: Perfil = new Perfil(4, 'alessandra  ', 'ale12@gmail.com') // n inclui

// INCLUIR POSTAGENS
let postagem1: Postagem = new Postagem(1, 'ok', perfil1);
let postagem2: Postagem = new Postagem(2, 'segundo post do perfil', perfil2);
let postagem3: Postagem = new Postagem(3, 'apenas um texto', perfil4);
let postagem4: Postagem = new Postagem(40000, 'um post qualquer', perfil1);

console.log('--------------------------------------------');
console.log('INCLUIR PERFIS \n');
console.log(rs.incluirPerfil(perfil1));
console.log(rs.incluirPerfil(perfil2)); 
console.log(rs.incluirPerfil(perfil3)); // o nome esta nulo
console.log(rs.incluirPerfil(perfil4)); 
console.log(rs.incluirPerfil(perfil5)); // nome ja existe


console.log('--------------------------------------------');
console.log('CONSULTAR PERFIL \n');
console.log(rs.consultarPerfil(5)); // n encontrado
console.log(rs.consultarPerfil(undefined, 'kaylanne santos'));
console.log(rs.consultarPerfil(undefined, 'kaylanne santos', 'ale@gmail.com')); // n encontrado

console.log('--------------------------------------------');
console.log('INCLUIR POSTAGENS \n');
console.log(rs.incluirPostagem(postagem1));
console.log(rs.incluirPostagem(postagem2));
console.log(rs.incluirPostagem(postagem3));
console.log(rs.incluirPostagem(postagem4));
