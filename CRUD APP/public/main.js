import { Utils } from "./utils.js"
const uti = new Utils()
//
class CrudAPI {
    // Propert holding all usable HTML elements(DOM)
    #elementsFor = {
        items: uti.getDom(`#container`),
        newItem: uti.getDom(`#addBtn`),
        uploadItem: uti.getDom(`#submit`),
        forms: uti.getDom(`#productForms`),
        methodName: uti.getDom(`#modalName`),
        trashCan: uti.getDom(`#trashCan`),
        upDate: uti.getDom(`#upDate`)
    }
    // Propert for holding data.
    #items = []
    #id = ``
    //
    // METHODS...
    //
    // CRUD API
    // 
    // GET
    #fetchData(apiUrl, configs) {
        // using the fetch function
        return fetch(apiUrl, configs)
            .then(response => {
                return response.json();
            })
            .catch(error => {
                console.error(`Error fetching data: ${error}`)
            })
    }
    // POST
    #create(apiUrl, body = {}, callback) {
        const configs = {
            method: `POST`,
            headers: {
                'Content-Type': `application/json`
            },
            body: JSON.stringify(body)
        }
        this.#fetchData(apiUrl, configs).then(data => {
            return callback(data)
        })
    }
    // GET
    #read(apiUrl, callback) {
        const configs = {
            method: `GET`,
        }
        this.#fetchData(apiUrl, configs).then(data => {
            return callback(data)
        })
    }
    // PUT
    #update(apiUrl, body = {}, callback) {
        const configs = {
            method: `PUT`,
            headers: { 'Content-Type': `application/json` },
            body: JSON.stringify(body)
        }
        this.#fetchData(apiUrl, configs).then(data => {
            return callback(data)
        })
    }
    // DELETE
    #delete(apiUrl, callback) {
        const configs = {
            method: `DELETE`,
        }
        this.#fetchData(apiUrl, configs).then(data => {
            return callback(data)
        })
    }
    //
    // CRUD API HANDLERS
    // 
    // Methods handles both POST and PUT requests.
    #uploadBtn() {
        uti.handleEvent(this.#elementsFor.uploadItem, `click`, () => {
            const value = this.#elementsFor.uploadItem.value
            const formData = new FormData(this.#elementsFor.forms)
            const image = `bi-image-fill`;
            const jsonData = Object.fromEntries(formData)
            jsonData.productImage = image;
            if (value == `new`) {
                const url = "/api/products/create";
                this.#create(url, jsonData, (response) => {
                    window.location.href = response.redirect;
                })
            } else {
                const id = this.#elementsFor.upDate.dataset.id;
                if (this.#id == id) {
                    const url = `/api/products/${this.#id}`;
                    this.#update(url, jsonData, (response) => {
                        window.location.href = response.redirect;
                    })
                }
            }
        })
    }
    // Method to handle the deletion event.
    #trashMethod() {
        uti.handleEvent(this.#elementsFor.trashCan, `click`, () => {
            const id = this.#elementsFor.trashCan.dataset.id;
            const url = `/api/products/${id}`;
            this.#delete(url, (response) => {
                window.location.href = response.redirect;
            })
        })
    }
    // Method publically available to START the whole CrudAPI.
    run() {
        const apiUrl = `/api/products/all`
        this.#read(apiUrl, (response) => {
            this.#items = response.products;
            this.#renderItems()
        })
        this.#uploadBtn()
        this.#trashMethod()
        this.#upDateMethod()
        this.#newBtn()
    }
    // Method to render the HTML.
    #renderItems() {
        const parent = uti.setDom(`div`, {
            class: `renderedItems`
        })
        const items = this.#getItems()
        if (items.length > 0) {
            items.forEach(item => {
                const child = itemEle(item)
                parent.appendChild(child)
                uti.handleEvent(child, `click`, () => {
                    this.#handleItem(item)
                })
            })
        } else {
            uti.setInnerText(parent, `NO PRODUCTS TO DISPLAY`)
        }
        this.#elementsFor.items.appendChild(parent)
    }
    // Method to handle the rendered HTML.
    #handleItem(item) {
        const siblings = uti.getDom(`#detailEle`).children
        uti.setInnerText(siblings[0], `${item.productName}`)
        uti.setInnerText(siblings[1], `is: K${item.currPrice}`)
        uti.setInnerText(siblings[2], `was: K${item.prevPrice}`)
        uti.setInnerText(siblings[3], `[${item.category}]`)
        uti.setInnerText(siblings[4], `Quantity: [${item.quantity}]`)
        //
        this.#elementsFor.trashCan.setAttribute(`data-id`, item._id)
        this.#elementsFor.upDate.setAttribute(`data-id`, item._id)
        this.#elementsFor.uploadItem.value = `old`;
        this.#id = item._id
    }
    // Method to retrive the values to the HTML forms, from the item to update.
    #upDateMethod() {
        uti.handleEvent(this.#elementsFor.upDate, `click`, () => {
            this.#elementsFor.uploadItem.value = `old`;
            const id = this.#elementsFor.upDate.dataset.id;
            const product = this.#getItemById(id)
            uti.setInnerText(this.#elementsFor.methodName, `UPDATING`);
            //
            productForms.productName.value = product.productName;
            // productForms.productImage.value = product.productImage;
            productForms.currPrice.value = product.currPrice;
            productForms.prevPrice.value = product.prevPrice;
            productForms.category.value = product.category;
            productForms.quantity.value = product.quantity;
        })
    }
    // Methods returns an array of all items.
    #getItems() { return this.#items }
    // Method returns an item by ID if exists,
    #getItemById(id) {
        let exist = false
        this.#getItems().forEach(item => {
            if (id == item._id) {
                exist = item
            }
        })
        return exist;
    }
    // Method handle the creation of new item.
    #newBtn() {
        uti.handleEvent(this.#elementsFor.newItem, `click`, () => {
            this.#elementsFor.uploadItem.value = `new`;
        })
    }
}
// 
// 
const crud = new CrudAPI()
crud.run()
// 
// Function to generate and return the HTML to render as an item.
function itemEle(item) {
    const outterEle = uti.setDom(`a`, {
        href: `/api/products/${item._id}`,
        class: `card outterEle`,
        "data-id": item._id,
        "data-bs-toggle": `modal`,
        "data-bs-target": `#details`
    })
    const imgEle = uti.setDom(`div`, { class: `imgEle` })
    const detailEle = uti.setDom(`div`, { class: `detailEle` })
    const productName = uti.setDom(`div`, { class: `productName` })
    const currPrice = uti.setDom(`div`, { class: `currPrice` })
    const prevPrice = uti.setDom(`div`, { class: `prevPrice` })
    const category = uti.setDom(`div`, { class: `category` })
    const quantity = uti.setDom(`div`, { class: `quantity` })
    const image = uti.setDom(`i`, { class: `image  ${item.productImage}` })
    //
    uti.setInnerText(productName, `${item.productName}`)
    uti.setInnerText(currPrice, `is: K${item.currPrice}`)
    uti.setInnerText(prevPrice, `was: K${item.prevPrice}`)
    uti.setInnerText(category, `[${item.category}]`)
    uti.setInnerText(quantity, `Quantity: [${item.quantity}]`)

    //
    detailEle.appendChild(productName)
    detailEle.appendChild(currPrice)
    detailEle.appendChild(prevPrice)
    detailEle.appendChild(category)
    detailEle.appendChild(quantity)

    imgEle.appendChild(image)
    //
    outterEle.appendChild(imgEle)
    outterEle.appendChild(detailEle)
    return outterEle;
}