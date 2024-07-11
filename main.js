let productos = [];

fetch("./productos.json")
    .then(response => response.json())
    .then(data => {
        productos = data;
        cargarProductos(productos);
    });


const prodCont = document.querySelector(".prod-cont");

const filterButtons = document.querySelectorAll(".filter-butt");

const openCarrButt = document.querySelector(".open-carr-butt");
const closeCarrButt = document.querySelector(".close-carr-butt");
const menuCarr = document.querySelector(".menu-carr");

const carrNum = document.querySelector(".nav-carr-num");

const empityCarrText = document.querySelector(".empity-carr-text");
const carrProdDisplay = document.querySelector(".carr-prod-displ");
const allProdCarrCont = document.querySelector(".all-prod-carr-cont")
const priceTotal = document.querySelector(".price-total")
const buyButt = document.querySelector(".buy-butt");


filterButtons.forEach(button => { 
    button.addEventListener("click", (e) => {
        
        filterButtons.forEach(button => button.classList.remove("selectFilter"));
        e.currentTarget.classList.add("selectFilter");
        
        if (e.currentTarget.id != "todos") {
            const tipoProd = productos.filter(prod => prod.tipo === e.currentTarget.id);
            cargarProductos(tipoProd);
        } else {
            cargarProductos(productos);
        }
    })
})


function cargarProductos(selectProducts) {
    
    prodCont.innerHTML = "";
    
    selectProducts.forEach(producto => {
        
        const div = document.createElement("div");
        div.classList.add("prod");
        div.innerHTML = `
            <img src="${producto.img}" alt="${producto.descripcion}">
            <button id="${producto.id}" class="add-butt add-butt-off-click">
                <span id="showed" class="prod-spec">
                    <h4>${producto.descripcion}</h4>
                    <h5>$${producto.precio}</h5>
                </span>
                <h3 id="hidden" class="addToCarr">Agregar al Carrito!</h3>
            </button>
        `
        
        prodCont.append(div);
        
        const addButt = div.querySelector(".add-butt")
        const prodSpec = div.querySelector(".prod-spec")
        const addToCarrText = div.querySelector(".addToCarr")
        
        addButt.addEventListener("mouseover", () => {
            prodSpec.id = "hidden"
            addToCarrText.id = "showed"
        })
        addButt.addEventListener("mouseout", () => {
            prodSpec.id = "showed"
            addToCarrText.id = "hidden"
        })
        
        addButt.addEventListener("mousedown", () => {
            addButt.classList.add("add-butt-click");
            addButt.classList.remove("add-butt-off-click")
        })
        document.addEventListener("mouseup", () => {
            addButt.classList.remove("add-butt-click");
            addButt.classList.add("add-butt-off-click")


        addButt.addEventListener("click", addToCarrF);
        })
        addButt.addEventListener("click", () => {
            Toastify({
                text: "Añadido al carrito",
                duration: 2000,
                close: false,
                gravity: "bottom",
                position: "left",
                stopOnFocus: false,
                style: {
                    background: "Yellow",
                    color: "black",
                    "border-radius": "20px"
                },
                offset: {
                    x: '10px',
                    y: '15px'
                },
                onClick: function(){}
            }).showToast();
        })
    });
}


let prodOnCarr;
let prodOnCarrLS = localStorage.getItem("prod-on-carr");

if (prodOnCarrLS) {
    prodOnCarr = JSON.parse(prodOnCarrLS);
    actNumOnCarr();
    cargarProductosOnCarr()
} else {
    prodOnCarr = []
};


function addToCarrF(e) {
    const buttId = e.currentTarget.id;
    const addProd = productos.find(prod => prod.id === buttId);
    
    if (prodOnCarr.some(prod => prod.id === buttId)) {
        const i = prodOnCarr.findIndex(prod => prod.id === buttId)
        prodOnCarr[i].quant++;
    } else {
        addProd.quant = 1;
        prodOnCarr.push(addProd);
    }
    
    actNumOnCarr();
    
    localStorage.setItem("prod-on-carr", JSON.stringify(prodOnCarr));
    
    cargarProductosOnCarr()
}


function cargarProductosOnCarr() {
    if (prodOnCarr && prodOnCarr.length > 0) {
        
        empityCarrText.id = "none";
        carrProdDisplay.id = "";
        
        allProdCarrCont.innerHTML = "";

        prodOnCarr.forEach(prod => {
            
            const div = document.createElement("div");
            div.classList.add("prod-carr-cont");
            div.innerHTML = `
                <div class="prod-carr">
                    <div class="prod-img-carr-cont">
                        <img src="${prod.img}" alt="${prod.descripcion}">
                    </div>
                    <div class="prod-carr-all-spec">
                        <div class="prod-carr-upper-info">
                            <h3 class="prod-carr-name">${prod.descripcion}</h3>
                            <button id="${prod.id}" class="remove-prod-butt">Quitar</button>
                        </div>
                        <div class="prod-carr-bott-info">
                            <div class="cant-prod-carr-cont">
                                <button id="${prod.id}" class="minus-button default-quant-buttons-effect">-</button>
                                <h4 class="quant-prod-carr">${prod.quant}</h4>
                                <button id="${prod.id}" class="plus-button default-quant-buttons-effect">+</button>
                            </div>
                            <h3 class="price-prod-carr">$${prod.precio}</h3>
                        </div>
                    </div>
                </div>
                <div class="carr-row"></div>
            `;
            
            allProdCarrCont.append(div);
            
            const removeProdButt = div.querySelector(".remove-prod-butt");
            removeProdButt.addEventListener("click", removeProdCarr);
            
            const plusButton = div.querySelector(".plus-button");
            plusButton.addEventListener("click", addToCarrF);
            plusButton.addEventListener("mousedown", () => {
                plusButton.classList.remove("default-quant-buttons-effect")
                plusButton.classList.add("plus-button-green-effect");
            });
            document.addEventListener("mouseup", () => {
                plusButton.classList.add("default-quant-buttons-effect")
                plusButton.classList.remove("plus-button-green-effect")
            });

            const minusButton = div.querySelector(".minus-button");
            minusButton.addEventListener("click", minusOneProd);
            minusButton.addEventListener("mousedown", () => {
                minusButton.classList.remove("default-quant-buttons-effect")
                minusButton.classList.add("minus-button-red-effect");
            });
            document.addEventListener("mouseup", () => {
                minusButton.classList.add("default-quant-buttons-effect")
                minusButton.classList.remove("minus-button-red-effect")
            });
            
            
            const totalNum = prodOnCarr.reduce((acc, prod) => acc + (prod.precio * prod.quant), 0);
            priceTotal.innerText = `$${totalNum}`;
        })


    } else {
        empityCarrText.id = "";
        carrProdDisplay.id = "none";
    }
}


function removeProdCarr(e) {
    Toastify({
        text: "Eliminado del carrito",
        duration: 3000,
        close: false,
        gravity: "bottom",
        position: "left",
        stopOnFocus: false,
        style: {
            background: "red",
            "border-radius": "10px"
        },
        offset: {
            x: '10px',
            y: '15px'
        },
        onClick: function(){}
    }).showToast();
    
    const buttId = e.currentTarget.id;
    const prodIndex = prodOnCarr.findIndex(prod => prod.id === buttId);
    
    prodOnCarr.splice(prodIndex, 1);
    
    cargarProductosOnCarr();
    actNumOnCarr();
    localStorage.setItem("prod-on-carr", JSON.stringify(prodOnCarr));
}

function minusOneProd(e) {
    const buttId = e.currentTarget.id;
    const prodIndex = prodOnCarr.findIndex(prod => prod.id === buttId);
    
    if (prodOnCarr[prodIndex].quant === 1) {
        removeProdCarr(e);
    } else {
        prodOnCarr[prodIndex].quant -= 1
    }
    
    cargarProductosOnCarr();
    actNumOnCarr();
    localStorage.setItem("prod-on-carr", JSON.stringify(prodOnCarr));
}

buyButt.addEventListener("mousedown", () => {
    buyButt.classList.add("buy-butt-click-on");
    buyButt.classList.remove("buy-butt-click-off");
})
buyButt.addEventListener("mouseup", () => {
    buyButt.classList.remove("buy-butt-click-on");
    buyButt.classList.add("buy-butt-click-off");
})
buyButt.addEventListener("click", buyButtF)

function buyButtF() {
    Toastify({
        text: "Gracias por su compra!",
        duration: 3000,
        close: false,
        gravity: "bottom",
        position: "left",
        stopOnFocus: false,
        style: {
            color: "white",
            background: "lime",
            "border-radius": "10px"
        },
        offset: {
            x: '10px',
            y: '15px'
        },
        onClick: function(){}
    }).showToast();
    
    prodOnCarr.length = 0;
    cargarProductosOnCarr();
    actNumOnCarr();
    localStorage.setItem("prod-on-carr", JSON.stringify(prodOnCarr));
}

function actNumOnCarr() {
    let num = prodOnCarr.reduce((acc, prod) => acc + prod.quant, 0);
    carrNum.innerText = num;
}


openCarrButt.addEventListener("click", () => {
    menuCarr.id = "menu-carr-show";
})

closeCarrButt.addEventListener("click", () => {
    menuCarr.id = "menu-carr-hidden";
})