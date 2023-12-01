import { Perfil, Postagem, PostagemAvancada, RepositorioDePerfis, RepositorioDePostagens } from "./index";
import { AplicacaoError, AtributoVazioError, PerfilExistenteError, PerfilNaoEncontradoError, PostagemJaExisteError, PostagemNaoEncontradaError } from "./excecoes";

class RedeSocial {
    private _repositorioDePerfis: RepositorioDePerfis = new RepositorioDePerfis();
    private _repositorioDePostagens: RepositorioDePostagens = new RepositorioDePostagens();

    get repositorioDePerfis(): RepositorioDePerfis {
        return this._repositorioDePerfis;
    }

    get respositorioDePostagens(): RepositorioDePostagens {
        return this._repositorioDePostagens;
    }

    incluirPerfil(perfil: Perfil){  
        this._repositorioDePerfis.incluirPerfil(perfil);
    }

    consultarPerfil(id?: number | undefined, nome?: string | undefined, email?: string | undefined): Perfil {  
        return this._repositorioDePerfis.consultarPerfil(id, nome, email);
    }

    incluirPostagem(postagem: Postagem){
        this._repositorioDePostagens.incluirPostagem(postagem);
    }

    consultarPostagem(id?: number | undefined, texto?: string | undefined, hashtag?: string | undefined, perfil?:  Perfil | undefined): Postagem[]{
        return this._repositorioDePostagens.consultarPostagem(id, texto, hashtag, perfil);
    }
    

    curtir(idPost: number): void {
        let postagemProcurada = this._repositorioDePostagens.consultarPostagemPorId(idPost)
        if (postagemProcurada.idPostagem == idPost) {
            postagemProcurada.curtir();     
        }
    }

    descurtir(idPost: number): void {
        let postagemProcurada = this._repositorioDePostagens.consultarPostagemPorId(idPost)
        if (postagemProcurada.idPostagem == idPost) {
            postagemProcurada.descurtir();     
        }
    }

    decrementar(postagem: PostagemAvancada): void {
        postagem.decrementarVisualizacoes();
    }

    exibirPostagensPorHashtag(hashtag: string): PostagemAvancada[] {
        let postagensFiltradas: PostagemAvancada [] = [];
        
        let result = this.consultarPostagem(undefined, undefined, hashtag, undefined);

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

    /*exibirTodasAsPostagens(): string{
        let postagens: string = '';

        for(let p of this._repositorioDePostagens){
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
    }*/

    exibirPerfis(): string{
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
        let indice: number = this._repositorioDePostagens.consultarPorIndice(idPostagem);
        for(let i = indice; i < this._postagens.length; i++){
            this._postagens[i] = this._postagens[i+1];
        }
        this._postagens.pop()
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
export{ RedeSocial };
