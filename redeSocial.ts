import { Perfil, Postagem, PostagemAvancada, RepositorioDePerfis, RepositorioDePostagens } from "./index";

class RedeSocial {
    private _repositorioDePerfis: RepositorioDePerfis = new RepositorioDePerfis();
    private _repositorioDePostagens: RepositorioDePostagens = new RepositorioDePostagens();
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

    incluirPerfil(perfil: Perfil): string | Perfil {  // com problema
        return this._repositorioDePerfis.incluirPerfil(perfil);
    }

    consultarPerfil(id?: number | undefined, nome?: string | undefined, email?: string | undefined): Perfil | string {  
        return this._repositorioDePerfis.consultarPerfil(id, nome, email);
    }

    incluirPostagem(postagem: Postagem): string{
        return this._repositorioDePostagens.incluirPostagem(postagem);
    }

    consultarPostagem(id?: number | undefined, texto?: string | undefined, hashtag?: string | undefined, perfil?:  Perfil | undefined): Postagem[] | string {
        return this._repositorioDePostagens.consultarPostagem(id, texto, hashtag, perfil);
    }
}

export{ RedeSocial };



let rs: RedeSocial = new RedeSocial()
let rpostagem: RepositorioDePostagens = new RepositorioDePostagens()

// INCLUIR PERFIL
let perfil1: Perfil = new Perfil(1, 'alessandra', 'ale@gmail.com')
let perfil2: Perfil = new Perfil(2, 'kaylanne s', 'k@gmail.com')
let perfil3: Perfil = new Perfil(2, '', 'k@gmail.com') // n inclui
let perfil4: Perfil = new Perfil(3, 'kaylanne santos', 'kay@gmail.com') 
let perfil5: Perfil = new Perfil(4, 'alessandra', 'ale12@gmail.com') // n inclui
let perfil10: Perfil = new Perfil(1, 'alessandra', 'ale@gmail.com')

// INCLUIR POSTAGENS
let postagem1: Postagem = new Postagem(1, 'ok', perfil1);
let postagem2: Postagem = new Postagem(2, 'segundo post do perfil', perfil2);
let postagem3: Postagem = new Postagem(3, ' ', perfil4); // texto vazio
let postagem4: Postagem = new Postagem(2, 'um post qualquer', perfil1); // id repitido
let postagem5: Postagem = new Postagem(5, 'outro post', perfil1);
let postagem6: PostagemAvancada = new PostagemAvancada(6, 'primeiro post avancado', perfil2);
let postagem7: PostagemAvancada = new PostagemAvancada(7, 'outro post avancado', perfil1);

// ADICIONANDO HASHTAG
postagem6.adicionarHashtag('#primeiroPostAvancado');
postagem6.adicionarHashtag('#maisUmaHashtag');
postagem7.adicionarHashtag('#maisUmaHashtag');
postagem6.adicionarHashtag('#vida');


console.log('--------------------------------------------');
console.log('INCLUIR PERFIS \n');
console.log(rs.incluirPerfil(perfil1));
console.log(rs.incluirPerfil(perfil2)); 
console.log(rs.incluirPerfil(perfil3)); // o nome esta nulo
console.log(rs.incluirPerfil(perfil4)); // email ja existe
console.log(rs.incluirPerfil(perfil5)); // nome ja existe
console.log(rs.incluirPerfil(perfil10)); // id ja existe

console.log('--------------------------------------------');
console.log('CONSULTAR PERFIL \n');
console.log(rs.consultarPerfil(5)); // n encontrado
console.log(rs.consultarPerfil(1));
console.log(`tipo: ${typeof(rs.consultarPerfil(undefined, 'kaylanne santos', 'ale@gmail.com'))}`)



console.log('--------------------------------------------');
console.log('INCLUIR POSTAGENS \n');
console.log(rs.incluirPostagem(postagem1));
console.log(rs.incluirPostagem(postagem2));
console.log(rs.incluirPostagem(postagem3)); // n inclui
console.log(rs.incluirPostagem(postagem4)); // n inclui
console.log(rs.incluirPostagem(postagem5)); 
console.log(rs.incluirPostagem(postagem6));
console.log(rs.incluirPostagem(postagem7));  

console.log('--------------------------------------------');
console.log('CONSULTAR POSTAGENS \n');
//console.log(rs.consultarPostagem(1, 'ok', undefined, perfil1));
//console.log(rs.consultarPostagem(8))
console.log(rs.consultarPostagem(6));
