import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfigParams } from 'src/app/shared/models/config-params';
import { MoviesService } from 'src/app/core/movies.service';
import { Movie } from 'src/app/shared/models/movie';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ViewMovieComponent } from '../view-movie/view-movie.component';

@Component({
  selector: 'app-list-movies',
  templateUrl: './list-movies.component.html',
  styleUrls: ['./list-movies.component.scss']
})
export class ListMoviesComponent implements OnInit {

  config: ConfigParams = {
    pagina: 0,
    limite: 6,
    pesquisa: '',
    campo:{
      tipo: 'genre',
      valor: ''
    }
  };

  readonly qtdPagina = 6;
  filmes: Movie[] = [];

  filtro: FormGroup;
  @Input() generos: string[];

  readonly semFoto = '../../assets/images/filme.PNG'; 

  constructor(private serviceFilmes: MoviesService, 
              private fb: FormBuilder,
              private router: Router,
              public dialog: MatDialog) { }
  

  ngOnInit(): void {
    this.generos = ['Todos','Ação', 'Romance', 'Aventura', 'Terror', 'Ficção cientifica', 'Comédia', 'Drama'];
    this.filtro = this.fb.group({
      text: [''],
      genre: ['Todos']
    });

    this.filtro.get('text').valueChanges.subscribe((val: string) => {
      this.config.pesquisa = val;
      this.resetarConsulta();
    });

    this.filtro.get('genre').valueChanges.subscribe((val: string) => {
      if(val === 'Todos'){
        val = undefined;
      };

      this.config.campo.valor = val;
      this.resetarConsulta();
    });

    this.listarFilmes();
    
  }


  private resetarConsulta(): void{
    this.config.pagina = 0;
    this.filmes = [];
    this.listarFilmes();
  }

  private listarFilmes(): void {
    this.config.pagina++;
    this.serviceFilmes.listar(this.config)
    .subscribe( (filmes: Movie[]) => this.filmes.push(...filmes));
  }

  onScroll(): void{
    this.listarFilmes();
  }

   abrir(filme: Movie): void{
    const dialogRef = this.dialog.open(ViewMovieComponent, {
      data: {filme: filme} as any
    });
    dialogRef.beforeClosed().subscribe((retorno: any) =>{
      if(retorno === 'reload'){
        window.location.reload();
      }
      else if(!isNaN(retorno) && retorno != ''){
        this.router.navigateByUrl('filmes/cadastro/' + retorno);
        
      }
    })
    
  }
}
