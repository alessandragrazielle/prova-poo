import { AplicacaoError, AtributoVazioError, PerfilExistenteError, PerfilNaoEncontradoError, PostagemJaExisteError, PostagemNaoEncontradaError } from "./excessoes";

class Perfil{
    private _idPerfil: number;
    private _nome: string;
    private _email: string;
    private _postagensDoPerfil: Postagem[] = [];
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

    set nome(nome: string){
        this._nome = nome
    }

    set email(email: string){
        this._email = email;
    }
}

class Postagem{
    private _idPostagem: number;
    private _texto: string;
    private _curtidas: number = 0;
    private _descurtidas: number = 0;
    private _data: Date = new Date();
    private _perfil: Perfil;
    constructor(i:number, t:string, p:Perfil){
        this._idPostagem = i;
        this._texto = t;
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
    private _visualizacoesRestantes: number = 1;
    constructor(i:number, t:string, p:Perfil){
        super(i, t, p);
    }

    get hashtags(): string[] {
        return this._hashtags;
    }

    get visualizacoesRestantes(): number {
        return this._visualizacoesRestantes;
    }

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

    decrementarVisualizacoes(): void { 
        if (this._visualizacoesRestantes > 0) {
            this._visualizacoesRestantes--;
        }
    }

    quantidadeDeVizualizaoes(): number{
        return 1000 - this.visualizacoesRestantes;
    }
}

class RepositorioDePerfis {
    private _perfis: Perfil[] = [];

    consultarPerfil(id?: number, nome?: string, email?: string): Perfil {
        let perfilProcurado!: Perfil;
        try {
            const perfilProcurado0 = this._perfis.find(p =>
                (id === undefined || p.idPerfil === id) &&
                (nome === undefined || p.nome === nome) &&
                (email === undefined || p.email === email)
            );

            if (!perfilProcurado0) {
                throw new PerfilNaoEncontradoError('Perfil não encontrado!');
            }

            perfilProcurado = perfilProcurado0;
        } catch (e: any) {
            if (e instanceof AplicacaoError) {
                console.log(e.message);
            }
        }

        return perfilProcurado;
    }

    incluirPerfil(perfil: Perfil){
        try {
            if (perfil.idPerfil && perfil.nome && perfil.email) {
                const perfilExiste = this._perfis.find(p =>
                    (p.idPerfil === perfil.idPerfil) ||
                    (p.nome === perfil.nome) ||
                    (p.email === perfil.email)
                );

                if (perfilExiste) {
                    throw new PerfilExistenteError('O perfil já existe!');
                }
            } else {
                throw new AtributoVazioError('Os atributos precisam ser preenchidos!');
            }

            this._perfis.push(perfil);
            console.log('Perfil incluído com sucesso!');
        } catch (e:any){
                if(e instanceof AplicacaoError){
                    console.log(e.message);
            } 
        }
    }

    exibirPostagensPorPerfil(id: number): Postagem[]{
        let postagensFiltradas: Postagem[] = [];
        let perfilProcurado = this.consultarPerfil(id);

        for(let postagem of perfilProcurado.postagensDoPerfil){
            if (postagem instanceof PostagemAvancada){
                if (postagem.visualizacoesRestantes > 0){
                    postagensFiltradas.push(postagem);
                    postagem.decrementarVisualizacoes();
                }
            } else {
                postagensFiltradas.push(postagem);
            }
        }

        return postagensFiltradas;
    }

    exibirTodosOsPerfis(): string{
        let perfis: string = '';

        for(let p of this._perfis){
            perfis += `
            Id: ${p.idPerfil}
            Nome: ${p.nome}
            Email: ${p.email}
            `
        }

        return perfis;
    }
    
    exibirPerfil(idPerfil: number){ // criado exibição por perfil
        let perfilProcurado = this.consultarPerfil(idPerfil);

        if(perfilProcurado.idPerfil == idPerfil){
            return `Id: ${perfilProcurado.idPerfil},\nUsuário: ${perfilProcurado.nome},\nEmail: ${perfilProcurado.email}.`;
        }
    }

    editarNome(antigoNome: string, nomeNovo: string){
        try{
            let perfil = this.consultarPerfil(undefined, antigoNome);
            perfil.nome = nomeNovo

            if(!perfil){
                throw new PerfilNaoEncontradoError('Perfil não encontrado!');
            }
        } catch (e:any){
            if(e instanceof AplicacaoError){
                console.log(e.message);
            }
        }
    }

    editarEmail(antigoEmail: string, emailNovo: string){
        try{
            let perfil = this.consultarPerfil(undefined, undefined, antigoEmail);
            perfil.email = emailNovo
            if(!perfil){
                throw new PerfilNaoEncontradoError('Perfil não encontrado!');
            }
        } catch (e:any){
            if(e instanceof AplicacaoError){
                console.log(e.message);
            }
        }
    }
    
}

class RepositorioDePostagens {
    private _postagens: Postagem[] = [];

    consultarPostagem(id?: number, texto?: string, hashtag?: string, perfil?: Perfil): Postagem[]{
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
    
        try{
            if(postagensFiltradas.length == 0){
                throw new PostagemNaoEncontradaError('Postagem não encontrada!');
            }
        } catch (e: any) {
            if (e instanceof AplicacaoError) {
                console.log(e.message);
            }
        }

        return postagensFiltradas;
    }

    consultarPostagemPorId(idPost: number): Postagem{
        let postagemProcurada!: Postagem;

        for(let p of this._postagens){
            if(p.idPostagem == idPost){
                postagemProcurada = p
            }
        }

        try{
            if(!postagemProcurada){
                throw new PostagemNaoEncontradaError('Postagem não encontrada!');
            }
        } catch (e: any) {
            if (e instanceof AplicacaoError) {
                console.log(e.message);
            }
        }

        return postagemProcurada;
    }

    private consultarPorIndice(id:number){
        let indiceProcurado: number = -1;
        try{
            for(let i = 0; i < this._postagens.length; i++){
                if(this._postagens[i].idPostagem == id){
                    indiceProcurado = i;
                }
            }

            if(indiceProcurado == -1){
                throw new PostagemNaoEncontradaError('Essa postagem não exite!')
            }
        } catch(e: any){
            if (e instanceof AplicacaoError){
                console.log(e.message);
            }
        }

        return indiceProcurado;
    }


    incluirPostagem(postagem: Postagem){
        try{
            if (postagem.idPostagem && postagem.texto.trim() && postagem.perfil) {
                let postagemExiste = this.consultarPostagem(postagem.idPostagem);
        
                if (postagemExiste.length == 1) {
                    throw new PostagemJaExisteError('Já existe uma postagem com o mesmo id!');
                } 
            } else {
                throw new AtributoVazioError('Todos os atributos da postagem devem estar preenchidos!');
            }

            this._postagens.push(postagem)
            postagem.perfil.postagensDoPerfil.push(postagem);
            console.log('Postagem incluída com sucesso!');
        } catch (e: any) {
            if (e instanceof AplicacaoError) {
                console.log(e.message);
            }
        }
    }  

    curtir(idPost: number): void {
        let postagemProcurada = this.consultarPostagemPorId(idPost)
        if (postagemProcurada.idPostagem == idPost) {
            postagemProcurada.curtir();     
        }
    }

    descurtir(idPost: number): void {
        let postagemProcurada = this.consultarPostagemPorId(idPost)
        if (postagemProcurada.idPostagem == idPost) {
            postagemProcurada.descurtir();     
        }
    }

    exibirTodasPostagens(): string{
        let postagens: string = '';

        for(let p of this._postagens){
            if(p instanceof PostagemAvancada){
                postagens += `
                Id: ${p.idPostagem}
                Texto: ${p.texto}
                Curtidas: ${p.curtidas}
                Descurtidas: ${p.descurtidas}
                Hashtags: ${p.hashtags}
                Vizualizações: ${p.quantidadeDeVizualizaoes()}
                `
                if (p.visualizacoesRestantes > 0){
                    p.decrementarVisualizacoes();
                }
            } else {
                postagens += `
                Id: ${p.idPostagem}
                Texto: ${p.texto}
                Curtidas: ${p.curtidas}
                Descurtidas: ${p.descurtidas}
                `
            }
        }

        return postagens;
    }

    exibirPostagensPorHashtag(hashtag: string): PostagemAvancada[] {
        let postagensFiltradas: PostagemAvancada [] = [];
        
        let result = this.consultarPostagem(undefined, undefined, hashtag, undefined);//como instanciar ????????

        if (typeof result === 'string') {
            console.log(result);
            return postagensFiltradas;
        }

        for(let postagem of result){
            if (postagem instanceof PostagemAvancada && postagem.existeHashtag(hashtag)){
                if (postagem.visualizacoesRestantes > 0){
                    postagensFiltradas.push(postagem);
                    postagem.decrementarVisualizacoes();
                }
            }
        }
        return postagensFiltradas;
    }


    exibirPorPostagem(idPostagem?: number, texto?: string){ 
        let postagemProcurada = this.consultarPostagem(idPostagem);
        if(postagemProcurada instanceof PostagemAvancada){
            if (postagemProcurada.visualizacoesRestantes > 0){
                postagemProcurada.decrementarVisualizacoes();
            }
        }

        if(idPostagem != undefined){
            return this.consultarPostagem(idPostagem);
        }

        if(texto != undefined){
            return this.consultarPostagem(undefined, texto);
        }
    }

    postagensPopulares(): Postagem[]{
        let postagensPopulares: Postagem[] = []

        for(let p of this._postagens){
            if(p.ehPopular()){
                postagensPopulares.push(p)
            }
        }

        try{
            if(postagensPopulares.length == 0){
                throw new PostagemNaoEncontradaError('Não há postagens populares')
            }
        } catch(e: any) {
            if (e instanceof AplicacaoError) {
                console.log(e.message);
            }
        }

        return postagensPopulares;
    }

    excluirPostagem(idPostagem: number){
        let indice: number = this.consultarPorIndice(idPostagem);
        for(let i = indice; i < this._postagens.length; i++){
            this._postagens[i] = this._postagens[i+1];
        }
        this._postagens.pop()
    }
    
}

export { Perfil, Postagem, PostagemAvancada, RepositorioDePerfis, RepositorioDePostagens }
