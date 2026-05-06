# Comandos de Git

## NOTA IMPORTANTE

**Si, y solo si tienen problemas con los comandos, los recuerdan, o 'n' razón, adjunto una guía de git que hice hace unos años**.

Esta guía es gracias a [Fernando Herrera](https://fernando-herrera.com)

## Comandos iniciales

- Obtener la ayuda y sugerencia inicial de git:

```bash
$ git
```

- Conocer la versión de git en el equipo:

```bash
$ git -v
$ git --version
```

- Obtener la ayuda sobre los comandos de git:

```bash
$ git -h
$ git --help
```

- Obtener la ayuda sobre un comando especifico de git:

```bash
$ git -h     [command]
$ git --help [command]
```

## Comandos para configuración global

**Si solamente se quiere configurar el repositorio por x-y circunstancia, entonces usar local en vez de global**

- Realizar una configuración de git de forma global en el equipo:

```bash
$ git config --global [configuración] [valor]
```

- Obtener la configuración global de forma enlistada e interactiva para su edición:

```bash
$ git config --global -e
$ git config --global --edit
```

- Crear un alias para un comando extenso y repetitivo:

```bash
$ git config --global alias.[alias] "[command]"
```

- Para realizar un pull fast forward:

```bash
$ git config --global pull.ff only
```

## Comandos para el versionamiento de un repositorio

- Iniciar o reiniciar un repositorio:

```bash
$ git init
```

- Añadir un archivo al stage:

```bash
$ git add [dir]\[file]
```

- Añadir todo un directorio al stage:

```bash
$ git add [dir]\
```

- Añadir todos los archivos que coincidan con una extensión:

```bash
$ git add [dir]\*.[ext]
```

- Añadir todos los archivos al stage:

```bash
$ git add .
```

- Sacar un archivo del stage:

```bash
$ git reset [dir]\[file]
```

- Sacar todo un directorio al stage:

```bash
$ git reset [dir]\
```

- Sacar todos los archivos que coincidan con una extensión:

```bash
$ git reset [dir]\*.[ext]
```

- Sacar todos los archivos al stage:

```bash
$ git reset .
```

- Conocer los cambios que no esten el stage respecto al commit anterior:

```bash
$ git diff
```

- Conocer los cambios que esten el stage respecto al commit anterior:

```bash
$ git diff --staged
```

- Conocer el estado de los archivos para realizar un commit:

```bash
$ git commit
```

- Crear un punto de incidencia, punto critico, punto especifico versionado del repositorio con todos los archivos en el staged:

```bash
$ git commit -m "[message]"
$ git commit --message "[message]"
```

- Crear un punto de incidencia, punto critico, punto especifico versionado del repositorio con todos los archivos en el staged que ya estén siendo seguidos por git:

```bash
$ git commit -am "[message]"
```

- Corregir en un editor interactivo el commit anterior:

```bash
$ git commit --ammend
// Para salir del editor, presionar: esc + : + w ( write, si es que se realizó un cambio)
// + q (quit) + ! ( para que lo haga de inmediato ) + enter
```

- Corregir el mensaje del commit anterior:

```bash
$ git commit --ammend -m [message]
```

- Crear una etiqueta que caracterice le versionamiento de un commit:

```bash
$ git tag [tag]
```

- Crear etiqueta con un mensaje especifico:

```bash
$ git tag -a [tag] -m "[message]"
$ git tag --anotated [tag] --message "[message]"
```

- Crear una etiqueta de un commit espcifico:

```bash
$ git tag -a [hash] -m "[message]"
```

- Obtener la información de un tag especifico:

```bash
$ git show [tash]
```

- Eliminar etiquetas para denotar commits significativos:

```bash
$ git tag -d [tag]
$ git tag --delete  [tag]
```

Regresar un archivo a su estado anterior del último commit

```bash
$ git checkout -- [path]\[file]
```

- Regresar al commit anterior o a un commit especifico:

```bash
// Regresa el repositorio al commit anterior sin sacarlos del stage sin quitar
// cambios ya hechos
$ git reset --soft HEAD^
// Regresa el repositorio al commit anterior sacando los cambios del staged pero sin
// quitar los cambios ya hechos
$ git reset --mixed HEAD^
// Regresa el repositorio al commit anterior en ese estado exacto, siendo el más "destructivo"
$ git reset --hard HEAD^
```

- Obtener el estado del repositorio:

```bash
$ git status
```

- Obtener los commit del repositorio:

```bash
$ git log
```

- Obtener todos las acciones considerables en el repositorio:

```bash
$ git reflog
```

- Crear un directorio sucio para guardar cambios que no deban pasar por el staged y un commit:

```bash
$ git stash
```

- Obtener la lista de stash creados:

```bash
$ git stash -l
$ git stash --list
```

- Obtener la lista de stash con información adicional:

```bash
$ git stash list --stat
```

- Obtener la información de un stash especifico:

```bash
$ git stash show [index]
```

- Obtener el último stash:

```bash
$ git stash pop
```

- Aplicar un stash especifico:

```bash
$ git stash apply [index]
```

- Eliminar un stash especifico:

```bash
$ git stash drop [index]
```

- Eliminar todos los stash:

```bash
$ git stash clear
```

## Ramas

- Obtener las ramas del repositorio:

```bash
$ git branch
```

- Obtener el nombre de una rama:

```bash
$ git branch [branch]
```

- Cambiar de la rama actual a la rama deseada:

```bash
$ git checkout [branch]
```

- Crear y cambiar a la rama:

```bash
$ git checkout -b [branch]
$ git checkout --branch [branch]
```

- Fusionar 2 ramas:

```bash
// Ir a la rama a fusionar
$ git checkout [branch]
// Traer los cambios de la rama a la actual
$ git merge [branch]
```

- Poner los commits de otra rama sobre otra:

```bash
// se debe indicar la rama a rebasar
$ git rebase [branch]
```

- Combinar commits de una rama sobre la otra:

```bash
// Se indicz la rama a rebasar
$ git rebase -i HEAD~[commitIndex]/[hashCommit]
// Seleccionar el squash para fusionar desde arriba a abajo
```

- Reescribir commits sobre los commits de otra rama:

```bash
$ // Se indica la rama a arrebasar
$ git rebase -i HEAD~[commitindex]/[hashCommit]
$ // seleccionar el reword para recomentar commits
```

Terminar el git rebase edit:

```bash
$ git rebase --continue
```

- Eliminar una rama:

```bash
$ git branch -d [branch]
$ git branch --delete [branch]
// Si se tiene que forzar, usar -f/--force
$ git branch -d [branch] -f
```

## Manipular archivos

- Mover archivos:

```bash
$ git mv [path]\[file] [path]\[file]
```

- Mover directorios:

```bash
$ git mv [path]\ [path]\
```

- Renombrar archivos:

```bash
$ git mv [samePath]\[file] [samePath]\[newFile]
```

- Renombrar directorios:

```bash
$ git mv [samePath]\ [samePath]\
```

- Eliminar archivos:

```bash
$ git rm [path]\[file]
```

- Eliminar directorios:

```bash
$ git rm [path]\
```

## Enlazar a un repositorio externo:

- Enlazar el repositorio local con un repositorio remoto:

```bash
$ git remote add origin [url]
```

- Obtener la url a la que apunta el **origin** del repositorio remoto:

```bash
$ git remote -v
```

- Enviar los avances de una rama al repositorio remoto:

```bash
$ git push -u origin [branch]
```

- Enviar los tags al repositorio remoto:

```bash
$ git push --tags
```

- Obtener los avances subidos al repositorio remoto al repositorio local:

```bash
$ git pull
```

- Obtener los avances subidos a una rama especifica del repositorio remoto al repositorio local :

```bash
$ git pull origin [main]
```

- Clonar un repositorio remoto:

```bash
$ git clone [url]
```
