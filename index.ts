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
    private _curtidas: number;
    private _descurtidas: number;
    private _data: Date;
    private _perfil: Perfil;
    constructor(i:number, t:string, c:number, d:number, dt:Date, p:Perfil){
        this._idPostagem = i;
        this._texto = t;
        this._curtidas = c;
        this._descurtidas = d;
        this._data = dt;
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
        super(i, t, c, d, dt, p);
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


class RepositorioDePerfis{
    private _perfis: Perfil[]=[];

    consultarPerfil(id: number, nome?: string, email?: string):Perfil{
        let perfilProcurado!: Perfil;
        for (let p of this._perfis){
            if((p.idPerfil == id) || 
            (p.nome == nome) || 
            (p.email == email)){
                perfilProcurado = p;
                break;
            }
        }
        return perfilProcurado;
    }

    incluir(perfil: Perfil): void {
        if(!this.consultarPerfil(perfil.idPerfil, perfil.nome, perfil.email)){ // pode consultar por: id; id, nome; id, nome, email
            this._perfis.push(perfil);
        }
    }
}


class RepositorioPostagens {
  private _postagens: Postagem[] = [];


  consultarPostagem(id?: number, texto?: string, hashtag?: string, perfil?: Perfil): Postagem[] {
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
    
        return postagensFiltradas;
    }

  incluir(postagem: Postagem): void {
    this._postagens.push(postagem);
    postagem.perfil.postagensDoPerfil.push(postagem);
  }
}
