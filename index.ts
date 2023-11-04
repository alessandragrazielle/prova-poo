class Perfil{
    private _idPerfil: number;
    private _nome: string;
    private _email: string;
    private _postagensDoPerfil: Postagem[] = []; // alterar para _postagens (?)
    constructor(i:number, n:string, e:string){
        this._idPerfil = i;
        this._nome = n;
        this._email = e;
    }

    get idPerfil(): number{
        return this._idPerfil;
    }

    get nome(): string{
        return this._nome;
    }

    get email(): string{
        return this._email;
    }

    get postagensDoPerfil(): Postagem[] {
        return this._postagensDoPerfil;
    }
}

class Postagem{
    private _idPostagem: number;
    private _texto: string;
    private _curtidas: number = 0;
    private _descurtidas: number = 0;
    private _data: Date = new Date();
    private _perfil: Perfil;
    constructor(i:number, t:string, /*c:number, d:number, dt:Date,*/ p:Perfil){
        this._idPostagem = i;
        this._texto = t;
        //this._curtidas = c;
        //this._descurtidas = d;
        //this._data = dt;
        this._perfil = p;
    }

    get idPostagem(): number{
        return this._idPostagem;
    }

    get texto(): string{
        return this._texto;
    }

    get curtidas(): number{
        return this._curtidas
    }

    get descurtidas(): number{
        return this._descurtidas
    }

    get data(): Date{
        return this._data
    }

    get perfil(): Perfil{
        return this._perfil;
    }

    curtir(): void{
        this._curtidas ++;
    }

    descurtir(): void{
        this._descurtidas ++;
    }

    ehPopular(): boolean{
        return this.curtidas > (this.descurtidas + this.descurtidas * 50/100);
    }
}

class PostagemAvancada extends Postagem{
    private _hashtags: string[] = [];
    private _visualizacoesRestantes: number = 1000;
    constructor(i:number, t:string, c:number, d:number, dt:Date, p:Perfil){
        super(i, t, /*c, d, dt,*/ p);
    }

    get hashtags(): string[] {
        return this._hashtags;
    }

    get visualizacoesRestantes(): number {
        return this._visualizacoesRestantes;
    }

    /*set visualizacoesRestantes(visualRestantes: number) {
        this._visualizacoesRestantes = visualRestantes;
    }*/

    adicionarHashtag(hashtag:string): void{
        this.hashtags.push(hashtag);
    }

    existeHashtag(hashtag:string): boolean {
        let temHashtag = false;
        for(let h of this._hashtags){
            if(h == hashtag){
                temHashtag = true;
                break;
            }
        }
        return temHashtag;
    }

    decrementarVisualizacoes(): void {  // adicionar excessao (?)
        if (this._visualizacoesRestantes > 0) {
            this._visualizacoesRestantes--;
        }
    }

    quantidadeDeVizualizaoes(): number{ // é necessario ?
        return 1000 - this.visualizacoesRestantes;
    }
}

class RepositorioDePerfis {
    private _perfis: Perfil[] = [];

    consultarPerfil(id?: number, nome?: string, email?: string): Perfil{ // resolver o problema do undefined
        let perfilProcurado!: Perfil;

        for(let p of this._perfis){
            if((id == undefined || p.idPerfil == id) &&
                (nome == undefined || p.nome == nome) && 
                (email == undefined || p.email == email)){
                    perfilProcurado = p
            }
        }

        return perfilProcurado;
    }

    incluirPerfil(perfil: Perfil){
        if(perfil.idPerfil && 
            perfil.nome && 
            perfil.email){
            let perfilExiste = this._perfis.find(
                p =>
                    (p.idPerfil === perfil.idPerfil) ||
                    (p.nome === perfil.nome) ||
                    (p.email === perfil.email)
            )

            //let perfilExiste = this.consultarPerfil(perfil.idPerfil, perfil.nome, perfil.email)

            if(perfilExiste){ 
                return 'Perfil já existente!';                
            } 
        } else {
            return 'Todos os atributos devem estar preenchidos!';
        }

        this._perfis.push(perfil);
        return 'Perfil incluído com sucesso!'; 
    }
}



class RepositorioDePostagens {
    private _postagens: Postagem[] = [];

    consultarPostagem(id?: number, texto?: string, hashtag?: string, perfil?: Perfil): Postagem[] | string {
        let postagensFiltradas: Postagem[] = [];
    
        for (let p of this._postagens) {
            if ((id == undefined || p.idPostagem == id) &&
                (texto == undefined || p.texto == texto) &&
                (perfil == undefined || p.perfil == perfil)) {
                if (hashtag !== undefined && p instanceof PostagemAvancada && (p as PostagemAvancada).existeHashtag(hashtag)) {
                    postagensFiltradas.push(p);
                } else if (hashtag == undefined) {
                    postagensFiltradas.push(p);
                }
            }
        }
    
        if(postagensFiltradas.length == 0){
            return 'Postagem não encontrada!'
        }

        return postagensFiltradas;
    }

    incluirPostagem(postagem: Postagem): string {
        if (postagem.idPostagem &&   // mudar isso
            postagem.texto.trim() &&
            postagem.perfil) {
            let postagemExiste = this.consultarPostagem(postagem.idPostagem);
            //let postagemExiste = this._postagens.find(p => p.idPostagem === postagem.idPostagem); // colocar isso no consultar
    
            if (postagemExiste.length == 1) {
                return 'Já existe uma postagem com o mesmo ID!';
            } 
        } else {
            return 'Todos os atributos da postagem devem estar preenchidos!';
        }

        this._postagens.push(postagem)
        postagem.perfil.postagensDoPerfil.push(postagem);
        return'Postagem incluída com sucesso!';
    }  
}


export { Perfil, Postagem, PostagemAvancada, RepositorioDePerfis, RepositorioDePostagens }



// instanciando
//Perfis
let perfil1: Perfil = new Perfil(1, 'alessandra', 'ale@gmail.com')
let perfil2: Perfil = new Perfil(2, 'kaylanne', 'k@gmail.com')
let perfil3: Perfil = new Perfil(3, 'kaylanne santos', 'k@gmail.com') // n inclui
let perfil4: Perfil = new Perfil(3, 'kaylanne santossss', 'kay@gmail.com') 
let perfil5: Perfil = new Perfil(4, 'maria', 'm@gmail.com')

// Repositorio de perfis
let rperfil: RepositorioDePerfis = new RepositorioDePerfis();
rperfil.incluirPerfil(perfil1);
rperfil.incluirPerfil(perfil2);
rperfil.incluirPerfil(perfil3);
rperfil.incluirPerfil(perfil4);
rperfil.incluirPerfil(perfil5);

console.log('------------------------------------------------------');
console.log('PERFIS NO REPOSITORIO');
console.log(rperfil);


//console.log(rperfil.consultarPerfil(undefined,'maria',undefined));

//Postagens
let postagem1: Postagem = new Postagem(1, 'texto', perfil1);
let postagem2: Postagem = new Postagem(2, 'textoo', perfil2);
let postagem3: Postagem = new Postagem(3, 'textoooo',  perfil3);
let postagem4: Postagem = new Postagem(4, 'textoooo', perfil4);

//Postagens Avancadas
let postagemA1: PostagemAvancada = new PostagemAvancada(1, 'texto', 8, 5, new Date(), perfil1);
let postagemA2: PostagemAvancada = new PostagemAvancada(2, 'textoo', 7, 4, new Date(), perfil2);

// Adicionando hashtags
postagemA1.adicionarHashtag('#instagram')
postagemA1.adicionarHashtag('#post')
postagemA2.adicionarHashtag('#post')
postagemA2.adicionarHashtag('#vida')

console.log('------------------------------------------------------');
console.log('HASHTAGS');
console.log(postagemA1.hashtags);
console.log(postagemA2.hashtags);

console.log('------------------------------------------------------');
console.log('TEM HASHTAG?');
console.log(postagemA1.existeHashtag('#post'));
console.log(postagemA2.existeHashtag('#post'));
console.log(postagemA1.existeHashtag('#vida'));
console.log(postagemA2.existeHashtag('#vida'));

//console.log(rpostagem.consultarPostagem(undefined,undefined,undefined,perfil4));

console.log('------------------------------------------------------');
let rpostagem: RepositorioDePostagens = new RepositorioDePostagens();

//console.log(rpostagem._postagens);
rpostagem.incluirPostagem(postagem1)
rpostagem.incluirPostagem(postagem2)
rpostagem.incluirPostagem(postagem3)
rpostagem.incluirPostagem(postagem4)
rpostagem.incluirPostagem(postagemA1)
rpostagem.incluirPostagem(postagemA2)
console.log(rpostagem.consultarPostagem(undefined, undefined, '#post'))

//postagem1.descurtir()
//console.log(postagem1.ehPopular());
