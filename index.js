
class Node {
  constructor (data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(array) {
    this.root = this.buildTree(array)
  }


  buildTree(array) {
    if (array.length === 0) {
      return null;
    }
    const noDuplicati = new Set(array);
    const arrayOrdinato = [...noDuplicati];
    arrayOrdinato.sort((a, b) => a - b);

    let radice = this.costruisciRamo(arrayOrdinato);

    return radice;
  }

  costruisciRamo (array) {
    if (array.length === 0) {
      return null
    }
    let indiceCentrale = Math.floor(array.length / 2);
    let meta = array[indiceCentrale];
    let metaSx = array.slice(0, indiceCentrale);
    let metaDx = array.slice(indiceCentrale + 1, array.length);

    let nodo = new Node(meta);
    nodo.left = this.costruisciRamo(metaSx);
    nodo.right = this.costruisciRamo(metaDx);

    return nodo;
  }

  includes (value, nodoCorrente = this.root) {
    if (nodoCorrente === null) {
      return false;
    }
    if (nodoCorrente.data === value) {
      return true;
    } else if (value > nodoCorrente.data) {
      return this.includes(value, nodoCorrente.right)
    } else {
      return this.includes(value, nodoCorrente.left)
    }
  }

  insert(value, nodoCorrente = this.root) {
    if (this.root === null) {
      return this.root = new Node (value);
    }
    if (value === nodoCorrente.data) {
      return
    } else if (value < nodoCorrente.data) {
      if (nodoCorrente.left === null) {
        return nodoCorrente.left = new Node (value);
      }
      this.insert (value, nodoCorrente.left);
    } else {
      if (nodoCorrente.right === null) {
        return nodoCorrente.right = new Node (value);
      }
      this.insert (value, nodoCorrente.right);
    }
  }

  /*BISOGNA INDIVIDUARE IL NODO CHE CONTIENE IL VALORE DA ELIMINARE;
  UNA VOLTA INDIVIDUATO BISOGNA CAPIRE SE IL NODO CONTIENE FIGLI
  SE NON HA UN FIGLI SI PUò ELIMINARE SENZA PROBLEMI,
  SE IL NODO HA 2 FIGLI BISOGNA PRENDERE IL VALORE PIU PICCOLO DEI SUOI SOTTOFIGLI DEL RAMO DESTRO E SOSTITUIRLO AL NODO CHE VOGLIAMO ELIMINARE, BISOGNA RICORDARSI DI ELIMINARE IL COLLEGAMENTO DEL NUOVO NODO AL SUO NODO PRECEDENTE;
  SE IL NODO DA ELIMINARE HA SOLO UN FIGLIO BASTA SEMPLICEMENTE COLLEGARE IL NODO PRECEDENTE AL NODO SUCCESSIVO DEL NODO DA ELIMINARE
  */
  deleteItem(value) {
    if (this.root === null) { /*VERIFICHIAMO CHE IL TREE NON SIA VUOTO */
      return;
    }
    if (this.root.data === value) { /*verifico se il valore è la radice */
      /*da finire */
      if (this.root.left === null && this.root.right === null) {/*caso in cui la radice non ha figli */
        this.root = null;
      } else if (this.root.left === null && this.root.right !== null) { /*caso in cui la radice ha 1 solo figlio a dx */
        this.root = this.root.right;
      } else if (this.root.left !== null && this.root.right === null) { /*caso in cui la radice ha 1 solo figlio a sx */
        this.root = this.root.left;
      } else { /*caso in cui la radice ha 2 figli */
        let nodoMinore = this._valorePiuPiccolo(this.root.right, this.root, this.root);
        nodoMinore.left = this.root.left;
        nodoMinore.right = this.root.right;
        this.root = nodoMinore;
      }
    } else {

      let nodiTrovati = this._cercaValore(value); /*Se non è la radice otteniamo un array di 2 elementi che contengono il nodo con il valore e il suo genitore */
      if (!nodiTrovati) { /*verifico che il risultato non sia undefined */
        return;
      }
      let nodoTarget = nodiTrovati[0];
      let nodoGenitore = nodiTrovati[1];  /*ora che ho i nodi verifico il singolo caso in base al quantitativo di figli  */
      if (nodoTarget.left === null && nodoTarget.right === null) { /*caso con zero figli */
        if (nodoGenitore.left === nodoTarget) {
          nodoGenitore.left = null;
        } else {
          nodoGenitore.right = null;
        }
      } else if (nodoTarget.left !== null && nodoTarget.right === null) { /*caso con 1 figlio a sinistra */
        if (nodoGenitore.left === nodoTarget) {
          nodoGenitore.left = nodoTarget.left;
        } else {
          nodoGenitore.right = nodoTarget.left;
        }
      } else if (nodoTarget.left === null && nodoTarget.right !== null) { /*caso con 1 figlio a destra */
        if (nodoGenitore.left === nodoTarget) {
          nodoGenitore.left = nodoTarget.right;
        } else {
          nodoGenitore.right = nodoTarget.right;
        }
      } else { /*caso con 2 figli: utilizziamo una funzione ricorsiva per trovare il valore piu piccolo a partire dal figlio destro */
        let nodoMinore = this._valorePiuPiccolo(nodoTarget.right, nodoTarget, nodoTarget);
        if (nodoGenitore.left === nodoTarget) {
          nodoGenitore.left = nodoMinore;
          nodoMinore.left = nodoTarget.left;
          nodoMinore.right = nodoTarget.right;
        } else {
          nodoGenitore.right = nodoMinore;
          nodoMinore.left = nodoTarget.left;
          nodoMinore.right = nodoTarget.right;
        }
        }
    }
  } 

  _valorePiuPiccolo (nodoFiglio, nodoGenitore, nodoTarget) {  /*assegno come primo parametro il figlio destro del nodo target, come secondo il nodoTarget, come terzo il nodoTarget */

    if (nodoFiglio.left === null && nodoFiglio.right !== null && nodoGenitore !== nodoTarget) { /*caso base1: se il nodo minore non è un figlio diretto di target e ha un figlio a dx assegno genitore.left uguale al nodominore.right */
      nodoGenitore.left = nodoFiglio.right;
      return nodoFiglio; /*ritorno il nodo minore che andrà a sostituire il nodo target*/
    }
    if (nodoFiglio.left === null && nodoFiglio.right === null && nodoGenitore !== nodoTarget) { /*caso base2: se il nodo minore non ha figli e non è un figlio diretto di target imposto genitore.left = null  */
      nodoGenitore.left = null;
      return nodoFiglio;
    }
    if (nodoFiglio.left === null && nodoFiglio.right !== null && nodoGenitore === nodoTarget) { /*caso base3: se il nodo minore ha un figlio a destra ed è un figlio diretto di target, */
      nodoGenitore.right = nodoFiglio.right;
      return nodoFiglio;
    }
    if (nodoFiglio.left === null && nodoFiglio.right === null && nodoGenitore === nodoTarget) { /*caso base4: se il nodo minore non ha figli ed è un figlio diretto di target, */
      nodoGenitore.right = null;
      return nodoFiglio
    }
    if (nodoFiglio.left !== null) { /*imposto il caso ricorsivo che scende fino al valore minore */
      return this._valorePiuPiccolo(nodoFiglio.left, nodoFiglio, nodoTarget);
    }
  }

  _cercaValore(value, nodoCorrente = this.root, nodoGenitore = this.root) {
    if (nodoCorrente === null) {
      return
    }
    if (nodoCorrente.data === value) {
      return [nodoCorrente, nodoGenitore];
    } else if (value < nodoCorrente.data) {
      return this._cercaValore(value, nodoCorrente.left, nodoCorrente);
    } else {
      return this._cercaValore(value, nodoCorrente.right, nodoCorrente);
    }
  }
  
}


const prettyPrint = (node, prefix = '', isLeft = true) => {
  if (node === null || node === undefined) {
    return;
  }

  prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
  console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
  prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
}




let arrayTest = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]
let test = new Tree(arrayTest);
prettyPrint(test.root); 