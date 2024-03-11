const getImageUrl = (elemId) => {
    return new Promise((resolve, reject) => {
        const fileInput = document.getElementById(elemId)
        const file = fileInput.files[0]
        if (file) {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => {
                const imageData = reader.result
                localStorage.setItem('temporaryImage', imageData)
                const tempImage =  localStorage.getItem('temporaryImage')
                localStorage.removeItem('temporaryImage')
                resolve(tempImage)
            }
            reader.onerror = (error) => {
                reject(error)
            }
        }
    })
}

const getOrSetBookArray = () => {
    const bookArray = localStorage.getItem('bookArray')
    if (bookArray) return JSON.parse(bookArray)
    localStorage.setItem('bookArray', JSON.stringify([
        {
            "id": 1,
            "title": "2-Week turnaround",
            "author": "Cameron Smith",
            "publisher": "Publisher X",
            "sinopsis": "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Provident, expedita..",
            "pageNumber": "100",
            "releaseDate": "2024-03-07",
            "edition": "1",
            "cover": '/static/images/attachment_122242026.png'
        },
        {
            "id": 2,
            "title": "Mind Control",
            "author": "Cameron Smith",
            "publisher": "Publisher X",
            "sinopsis": "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Provident, expedita..",
            "pageNumber": "100",
            "releaseDate": "2024-03-07",
            "edition": "1",
            "cover": '/static/images/attachment_121803961.jpeg'
        },
        {
            "id": 3,
            "title": "It's not common cents",
            "author": "Cameron Smith",
            "publisher": "Publisher X",
            "sinopsis": "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Provident, expedita..",
            "pageNumber": "100",
            "releaseDate": "2024-03-07",
            "edition": "1",
            "cover": '/static/images/attachment_121061160.jpeg'
        },
        {
            "id": 4,
            "title": "Zeitreisen sind verboten",
            "author": "Cameron Smith",
            "publisher": "Publisher X",
            "sinopsis": "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Provident, expedita..",
            "pageNumber": "100",
            "releaseDate": "2024-03-07",
            "edition": "1",
            "cover": '/static/images/attachment_101155833.jpeg'
        }
    ]))
    return JSON.parse(localStorage.getItem('bookArray'))
}

const getOrSetAuthorArray = () => {
    const authorArray = localStorage.getItem('authorArray')
    if (authorArray) return JSON.parse(authorArray)
    localStorage.setItem('authorArray', JSON.stringify([
        {
            "id": 1,
            "name": "Bailey",
            "surname": "Harper",
            "description": "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Provident, expedita..",
            "country": "Brasil",
            "birthDate": "2024-03-11",
            "picture": "https://source.unsplash.com/random/268x268/?person,portrait,face"
        },
        {
            "id": 2,
            "name": "Cameron",
            "surname": "Smith",
            "description": "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Provident, expedita..",
            "country": "Brasil",
            "birthDate": "2024-03-11",
            "picture": "https://source.unsplash.com/random/268x268/?person2,portrait,face"
        },
        {
            "id": 3,
            "name": "Casey",
            "surname": "Jones",
            "description": "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Provident, expedita..",
            "country": "Brasil",
            "birthDate": "2024-03-11",
            "picture": "https://source.unsplash.com/random/268x268/?person3,portrait,face"
        },
        {
            "id": 4,
            "name": "Charlie",
            "surname": "Davies",
            "description": "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Provident, expedita..",
            "country": "Brasil",
            "birthDate": "2024-03-11",
            "picture": "https://source.unsplash.com/random/268x268/?person4,portrait,face"
        }
    ]))
    return JSON.parse(localStorage.getItem('authorArray'))
}

const getOrSetId = (model) => {
    const id = localStorage.getItem(`${model}Id`)
    if (id) return id
    localStorage.setItem(`${model}Id`, 4)
    return 4
}

const incrementId = (model) => {
    let id = getOrSetId(model)
    localStorage.setItem(`${model}Id`, parseInt(++id))
    return id
}

const createBook = (bookForm) => {
    const correctId = incrementId('book')
    const bookArray = getOrSetBookArray()

    getImageUrl('cover').then((imageBase64) => {
        const bookObject = {
            id: correctId,
            title: bookForm.elements.bookTitle.value,
            author: bookForm.elements.bookAuthor.value,
            publisher: bookForm.elements.bookPublisher.value,
            sinopsis: bookForm.elements.bookSinopsis.value,
            pageNumber: bookForm.elements.pageNumber.value,
            releaseDate: bookForm.elements.releaseDate.value,
            edition: bookForm.elements.bookEdition.value,
            cover: imageBase64
        }
        bookArray.push(bookObject)
        localStorage.setItem('bookArray', JSON.stringify(bookArray))
    }).catch((err) => {alert(err)})
    
}

const populateBookPage = (pagesToRedirect, itemsPerPage=4, page=1) => {
    const books = getOrSetBookArray()
    const bookRow = document.getElementById('book-row')
    const addedElem = document.querySelectorAll('#added-after')
    const pageButtons = document.querySelectorAll('#page-buttons')

    document.getElementById('page-buttons-previous').href = `./listBook.html?page=${page-1 || 1}`
    document.getElementById('page-buttons-next').href = `./listBook.html?page=${page+1 || 2}`

    if (page > 1) {
        pageButtons.forEach((elem, index) => {
            elem.href = `./listBook.html?page=${pagesToRedirect[index]}`
        })
    }
    addedElem.forEach(elem => elem.remove())
    
    const startIndex = ((page || 1) - 1) * itemsPerPage

    document.getElementById('page-show').textContent = `${startIndex + 1} - ${(startIndex + itemsPerPage <= books.length) ? startIndex + itemsPerPage : books.length} of ${books.length}` 

    for (let index = startIndex; index < startIndex + itemsPerPage; index++) {
        if (!books[index]) break
        bookRow.insertAdjacentHTML('beforeend', `<div class="col-md-6 col-xl-3 col-12" id="added-after">
        <div class="card mx-auto mb-3" style="width: 18rem;">
          <img src="${books[index].cover || `https://source.unsplash.com/random/268x268/?person${books[index].id},portrait,face`}" class="card-img-top" alt="capa do livro">
          <div class="card-body">
            <h5 class="card-title text-truncate d-block">${books[index].title}</h5>
            <p class="card-text text-truncate d-block">${books[index].sinopsis}</p>
            <a href="./showBook.html?id=${books[index].id}" class="btn btn-primary">Ver mais</a>
          </div>
        </div>
      </div>`)
    }
}

const populateShowBookPage = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const bookId = urlParams.get('id')
    const bookArray = getOrSetBookArray()
    const bookData = bookArray.filter(book => book.id == bookId)[0]

    const elemObject = {
        deleteBook: document.getElementById('delete-book'),
        editBook: document.getElementById('edit-book'),
        title: document.getElementById('book-title'),
        author: document.getElementById('book-author'),
        publisher: document.getElementById('book-publisher'),
        sinopsis: document.getElementById('book-sinopsis'),
        pageNumber: document.getElementById('book-page-number'),
        releaseDate: document.getElementById('book-release-date'),
        edition: document.getElementById('book-edition'),
        cover: document.getElementById('book-cover'),
    }

    if (bookData){
        elemObject.deleteBook.addEventListener('click', () => {deleteBook(bookId)})
        elemObject.editBook.href = `editBook.html?id=${bookId}`  
        elemObject.title.textContent = bookData.title    
        elemObject.author.textContent = 'Escrito por: ' +bookData.author    
        elemObject.publisher.textContent = 'Publicado por: ' + bookData.publisher    
        elemObject.sinopsis.textContent = 'Sinópse: ' + bookData.sinopsis    
        elemObject.pageNumber.textContent = 'Número de páginas : ' + bookData.pageNumber    
        elemObject.releaseDate.textContent = 'Data de Lançamento: ' + bookData.releaseDate    
        elemObject.edition.textContent = 'Edição: ' + bookData.edition  
        elemObject.cover.src = bookData.cover || `https://source.unsplash.com/random/268x268/?person${book.id},portrait,face`  
    } else {
        window.location.href = 'listBook.html'
        window.alert('livro não encontrado')
    }
}

const updateBook = (bookForm, event=0, method='GET') => {
    if (event) event.preventDefault()
    const urlParams = new URLSearchParams(window.location.search)
    const bookId = urlParams.get('id')
    const bookArray = getOrSetBookArray()
    const bookData = bookArray.filter(book => book.id == bookId)[0]

    const elemObject = {
        title: document.getElementById('editBookTitle'),
        author: document.getElementById('editBookAuthor'),
        publisher: document.getElementById('editBookPublisher'),
        sinopsis: document.getElementById('bookSinopsis'),
        pageNumber: document.getElementById('editPageNumber'),
        releaseDate: document.getElementById('editReleaseDate'),
        edition: document.getElementById('editBookEdition'),
    }

    if (method === 'GET'){
        if (bookData){ 
            elemObject.title.value = bookData.title    
            elemObject.author.value = bookData.author    
            elemObject.publisher.value = bookData.publisher    
            elemObject.sinopsis.value = bookData.sinopsis    
            elemObject.pageNumber.value = bookData.pageNumber    
            elemObject.releaseDate.value = bookData.releaseDate    
            elemObject.edition.value = bookData.edition  
        } else {
            window.location.href = 'listBook.html'
            alert('livro não encontrado')
        }
    } else if (method === 'POST'){
        getImageUrl('editBookCover').then((imageBase64) => {
            const newBookObject = {
                id: bookId,
                title: bookForm.elements.editBookTitle.value,
                author: bookForm.elements.editBookAuthor.value,
                publisher: bookForm.elements.editBookPublisher.value,
                sinopsis: bookForm.elements.bookSinopsis.value,
                pageNumber: bookForm.elements.editPageNumber.value,
                releaseDate: bookForm.elements.editReleaseDate.value,
                edition: bookForm.elements.editBookEdition.value,
                cover: imageBase64
            }
    
            localStorage.setItem('bookArray', JSON.stringify(bookArray.map((book) => {
                if (book.id == bookId) {
                    return newBookObject
                }
                return book
            })))
    
            window.location.href = 'listBook.html'
        }).catch(err => {alert(err)})
    }
}

const deleteBook = (bookId) => {
    const bookArray = getOrSetBookArray()

    localStorage.setItem('bookArray', JSON.stringify(bookArray.filter((book) => book.id != bookId)))
    window.location.href = 'listBook.html'
}

const createAuthor = (authorForm) => {
    const correctId = incrementId('author')
    const authorArray = getOrSetAuthorArray()

    getImageUrl('authorPicture').then((imageBase64) => {
        const authorObject = {
            id: correctId,
            name: authorForm.elements.authorName.value,
            surname: authorForm.elements.authorSurname.value,
            description: authorForm.elements.authorDescription.value,
            country: authorForm.elements.authorCountry.value,
            birthDate: authorForm.elements.authorBirth.value,
            picture: imageBase64
        }
        authorArray.push(authorObject)
        localStorage.setItem('authorArray', JSON.stringify(authorArray))
    }).catch(err => alert(err))
}

const populateAuthorPage = (pagesToRedirect, itemsPerPage=4, page=1) => {
    const authors = getOrSetAuthorArray()
    const authorRow = document.getElementById('author-row')
    const addedElem = document.querySelectorAll('#added-after')
    const pageButtons = document.querySelectorAll('#page-buttons')

    document.getElementById('page-buttons-previous').href = `./listAuthor.html?page=${page-1 || 1}`
    document.getElementById('page-buttons-next').href = `./listAuthor.html?page=${page+1 || 2}`
    
    if (page > 1) {
        pageButtons.forEach((elem, index) => {
            elem.href = `./listAuthor.html?page=${pagesToRedirect[index]}`
        })
    }
    
    addedElem.forEach(elem => elem.remove())
    
    const startIndex = ((page || 1) - 1) * itemsPerPage

    document.getElementById('page-show').textContent = `${startIndex + 1} - ${(startIndex + itemsPerPage <= authors.length) ? startIndex + itemsPerPage : authors.length} of ${authors.length}` 

    for (let index = startIndex; index < startIndex + itemsPerPage; index++) {
        if (!authors[index]) break
        authorRow.insertAdjacentHTML('beforeend', `<div class="col-md-6 col-xl-3 col-12" id="added-after">
        <div class="card mx-auto mb-3" style="width: 18rem;">
          <img src="${authors[index].picture || `https://source.unsplash.com/random/268x268/?person${authors[index].id},portrait,face`}" class="card-img-top" alt="capa do livro">
          <div class="card-body">
            <h5 class="card-title">${authors[index].name} ${authors[index].surname}</h5>
            <p class="card-text">${authors[index].description}</p>
            <a href="./showAuthor.html?id=${authors[index].id}" class="btn btn-primary">Ver mais</a>
          </div>
        </div>
      </div>`)
    }
}

const populateShowAuthorPage = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const authorId = urlParams.get('id')
    const authorArray = getOrSetAuthorArray()
    const authorData = authorArray.filter(author => author.id == authorId)[0]

    const elemObject = {
        deleteAuthor: document.getElementById('delete-author'),
        editAuthor: document.getElementById('edit-author'),
        fullName: document.getElementById('author-full-name'),
        description: document.getElementById('author-description'),
        country: document.getElementById('author-country'),
        birthDate: document.getElementById('author-birth-date'),
        picture: document.getElementById('author-picture')
    }

    if (authorData){
        elemObject.deleteAuthor.addEventListener('click', () => {deleteAuthor(authorId)})
        elemObject.editAuthor.href = `editAuthor.html?id=${authorId}`  
        elemObject.fullName.textContent = `${authorData.name} ${authorData.surname}`    
        elemObject.description.textContent = authorData.description    
        elemObject.country.textContent = 'Nacionalidade: ' + authorData.country    
        elemObject.birthDate.textContent = 'Nascido em: ' + authorData.birthDate    
        elemObject.picture.src = authorData.picture || `https://source.unsplash.com/random/268x268/?person${author.id},portrait,face`  
    } else {
        window.location.href = 'listAuthor.html'
        window.alert('autor não encontrado')
    }
}

const updateAuthor = (authorForm, event=0, method='GET') => {
    if (event) event.preventDefault()
    const urlParams = new URLSearchParams(window.location.search)
    const authorId = urlParams.get('id')
    const authorArray = getOrSetAuthorArray()
    const authorData = authorArray.filter(author => author.id == authorId)[0]

    const elemObject = {
        name: document.getElementById('editAuthorName'),
        surname: document.getElementById('EditAuthorSurname'),
        description: document.getElementById('editAuthorDescription'),
        country: document.getElementById('EditAuthorCountry'),
        birthDate: document.getElementById('EditAuthorBirth'),
    }

    if (method === 'GET'){
        if (authorData){ 
            elemObject.name.value = authorData.name    
            elemObject.surname.value = authorData.surname    
            elemObject.description.value = authorData.description    
            elemObject.country.value = authorData.country    
            elemObject.birthDate.value = authorData.birthDate    
        } else {
            window.location.href = 'listAuthor.html'
            alert('autor não encontrado')
        }
    } else if (method === 'POST'){
        getImageUrl('EditAuthorPicture').then((imageBase64) => {
            const newAuthorObject = {
                id: authorId,
                name: authorForm.elements.editAuthorName.value,
                surname: authorForm.elements.EditAuthorSurname.value,
                description: authorForm.elements.editAuthorDescription.value,
                country: authorForm.elements.EditAuthorCountry.value,
                birthDate: authorForm.elements.EditAuthorBirth.value,
                picture: imageBase64
            }
    
            localStorage.setItem('authorArray', JSON.stringify(authorArray.map((author) => {
                if (author.id == authorId) {
                    return newAuthorObject
                }
                return author
            })))
    
            window.location.href = 'listAuthor.html'
        }).catch(err => {alert(err)})
    }
}

const deleteAuthor = (authorId) => {
    const authorArray = getOrSetAuthorArray()

    localStorage.setItem('authorArray', JSON.stringify(authorArray.filter((author) => author.id != authorId)))
    window.location.href = 'listAuthor.html'
}

const pagination = (model, event=0) => {
    const setPageButtons = (pageButtons, page, maxPage) => {
        const pagesToRedirect = []
        if (!page || page === 1){
            pageButtons.forEach((elem, index) => {
                elem.textContent = index + 1
                pagesToRedirect.push(elem.textContent)
                if (index === 0){
                    elem.classList.add('disabled')
                    document.getElementById('page-buttons-previous').classList.add('disabled')
                }
            })
        } else {

            pageButtons.forEach((elem, index) => {
                if (page === maxPage && maxPage > 2) {
                    elem.textContent = page - 2 + index
                    pagesToRedirect.push(elem.textContent)
                    if (index === 2) {
                        elem.classList.add('disabled')
                        document.getElementById('page-buttons-next').classList.add('disabled')
                    }
                } else {
                    elem.textContent = page - 1 + index
                    pagesToRedirect.push(elem.textContent)
                    if (index === 1){
                        elem.classList.add('disabled')
                    }
                }
            })
        }
        return pagesToRedirect
    }
    const paginationElement = document.querySelector('nav > ul > li:nth-child(2)')
    const urlParams = new URLSearchParams(window.location.search)
    const page = parseInt(urlParams.get('page'))

    if (event?.target?.id === 'pagination' && event?.target?.value.length < 6) {
        localStorage.setItem('perPage', event.target.value)
    }
    
    let modelArray = ''

    if (model === 'author'){
        modelArray = getOrSetAuthorArray()
    } else {
        modelArray = getOrSetBookArray()
    }

    const maxPage = Math.ceil(modelArray.length  / (parseInt(localStorage.getItem('perPage')) || 4)) 
    
    const addedElem = document.querySelectorAll('#added-before')
    
    for (let index = 0; index<maxPage; index++){
        paginationElement.insertAdjacentHTML('beforebegin', `<li class="page-item" id="added-before"><a class="page-link" href="./${model === 'author' ? 'listAuthor.html' : 'listBook.html'}?page=${index+1}" id="page-buttons">${index+1}</a></li>`)
        if (index === 2) break
    }

    const pageButtons = document.querySelectorAll('#page-buttons')
    const pagesToRedirect = setPageButtons(pageButtons, page, maxPage)
    
    addedElem.forEach(elem => elem.remove())

    if (model === 'author'){
        populateAuthorPage(pagesToRedirect, parseInt(localStorage.getItem('perPage')) || 4, page)
    } else{
        populateBookPage(pagesToRedirect, parseInt(localStorage.getItem('perPage')) || 4, page)
    }
}

window.onload = init(document.title)

function init(page) {
    switch (page) {
        case 'Cadastrar Autor':
            const createAuthorForm = document.getElementById('create-author-form')
            createAuthorForm.addEventListener('submit', () => {createAuthor(createAuthorForm)})
          break
        case 'Cadastrar Livro':
            const createBookForm = document.getElementById('create-book-form')
            createBookForm.addEventListener('submit', () => {createBook(createBookForm)})
            break
        case 'Editar Autor':
            const updateAuthorForm = document.getElementById('edit-author-form')
            updateAuthor(updateAuthorForm)
            updateAuthorForm.addEventListener('submit', event => {updateAuthor(updateAuthorForm, event, 'POST')})
            break
        case 'Editar Livro':
            const updateBookForm = document.getElementById('edit-book-form')
            updateBook(updateBookForm)
            updateBookForm.addEventListener('submit', (event) => {updateBook(updateBookForm, event, 'POST')})
            break
        case 'Autores':
            pagination('author')
            document.getElementById('pagination').addEventListener('change', (event) => pagination('author', event))
            document.querySelectorAll('[id*="page-buttons"]').forEach(elem => elem.addEventListener('click', (event) => pagination('author', event)))
            break
        case 'Livros':
            pagination('book')
            document.getElementById('pagination').addEventListener('change', (event) => pagination('book', event))
            document.querySelectorAll('[id*="page-buttons"]').forEach(elem => elem.addEventListener('click', (event) => pagination('book', event)))
            break
        case 'Visualizar Autor':
            populateShowAuthorPage()
            break
        case 'Visualizar Livro':
            populateShowBookPage()
            break
        default:
          
      }
}
