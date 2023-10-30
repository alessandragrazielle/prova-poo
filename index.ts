class Perfil{
    private _idPerfil: number;
    private _nome: string;
    private _email: string;
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
    private _hashtags: string[];
    private _visualizacoesRestantes: number = 1000;
    constructor(i:number, t:string, c:number, d:number, dt:Date, p:Perfil){
        super(i, t, c, d, dt, p);
    }

    adicionarHashtag(hashtag:string): void{
        this._hashtags.push(hashtag);
    }

    //existeHashtag(hashtag:string): boolean{    }
}

class RepositorioDePerfis{
    private _perfis: Perfil[]=[];

    consultarPerf(id?: number, nome?: string, email?: string): Perfil {  // ver dps
        let perfilProcurado!: Perfil;
        for (let p of this._perfis){
            if(p.idPerfil == id || p.nome == nome || p.email == email){
                perfilProcurado = p;
                break;
            }
            
        }
        return perfilProcurado;
    }

    incluir(perfil: Perfil): void {
        if(!this.consultarPerf(perfil.idPerfil)){
            this._perfis.push(perfil);
        }
    }
}


class RepositorioPOstagens{
    private _postagens: Postagem[] = [];

    consultarPost(id: number, texto:  string, hashtag: string, perfil: Perfil): Postagem[]{
        let postagemProcurada!: Postagem;
        for(let postagem of this._postagens){
            
        }
    }
}


let perfil1: Perfil = new Perfil(1, 'alessandra', 'ale@gmail.com')
let postagem1: Postagem = new Postagem(1, 'texto', 8, 5, new Date(), perfil1)
postagem1.descurtir()

let perfil2: Perfil = new Perfil(2, 'kaylanne', 'kayms@gmail.com')
let perfil3: Perfil = new Perfil(3, 'kaylanne', 'k@gmail.com')

let rp: RepositorioDePerfis = new RepositorioDePerfis();
rp.incluir(perfil1);
rp.incluir(perfil2);
rp.incluir(perfil3);
console.log(rp.perfis);




//console.log(postagem1.ehPopular());
