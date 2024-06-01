const canvas = document.querySelector("canvas"),
toolBtns = document.querySelectorAll(".tool"),
fillColor = document.querySelector("#fill-color"),
sizeSlider = document.querySelector("#size-slider"),
colorBtns = document.querySelectorAll(".colors .option"),
colorPicker = document.querySelector("#color-picker"),
clearCanvas = document.querySelector(".clear-canvas"),
saveImg = document.querySelector(".save-canvas"),
ctx = canvas.getContext("2d");

// global variables dengan default value
let prevMouseX, prevMouseY, snapshot,
isDrawing = false,
selectedTool = "brush",
brushWidth = 5,
selectedColor = "#000";

const setCanvasBackground = () => {
    // mengatur seluruh latar belakang kanvas menjadi putih, sehingga latar belakang img yang diunduh akan berwarna putih
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor; // mengatur gaya isi kembali ke Warna yang dipilih, itu akan menjadi warna kuas
}

window.addEventListener("load", () => {
    // mengatur lebar/tinggi kanvas.. offsetwidth/height mengembalikan lebar/tinggi elemen yang dapat dilihat
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});

const drawRect = (e) => {
    // jika fillColor tidak dicentang, gambarlah persegi dengan batas, else, gambarlah persegi dengan latar belakang
    if(!fillColor.checked) {
        // membuat lingkaran sesuai dengan mouse pointer
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}

const drawCircle = (e) => {
    ctx.beginPath(); // membuat path baru untuk menggambar lingkaran
    // mendapatkan radius lingkaran sesuai dengan mouse pointer
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI); 
    fillColor.checked ? ctx.fill() : ctx.stroke(); // jika fillColor dicentang, isikan lingkaran, lalu gambar border circle
}

const drawTriangle = (e) => {
    ctx.beginPath(); // creating new path to draw circle
    ctx.moveTo(prevMouseX, prevMouseY); // moving triangle to the mouse pointer
    ctx.lineTo(e.offsetX, e.offsetY); // membuat baris pertama sesuai dengan mouse pointer
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY); // creating bottom line of triangle
    ctx.closePath();
    fillColor.checked ? ctx.fill() : ctx.stroke(); // jika fillColor dicentang, isikan segitiga jika tidak draw border
}

const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX; // menambahkan current mouseX position as prevMouseX value
    prevMouseY = e.offsetY; // menambahkan current mouseY position as prevMouseY value
    ctx.beginPath(); // creating new path to draw
    ctx.lineWidth = brushWidth; // menambahkan brushSize as line width
    ctx.strokeStyle = selectedColor; // menambahkan selectedColor as stroke style
    ctx.fillStyle = selectedColor; // menambahkan selectedColor as fill style
    // mengcopy canvas data & menambahkan sbg snapshot value
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

const drawing = (e) => {
    if(!isDrawing) return; // if isDrawing is false return from here
    ctx.putImageData(snapshot, 0, 0); // adding copied canvas data on to this canvas

    if(selectedTool === "brush" || selectedTool === "eraser") {
        // if selected tool is eraser then set strokeStyle to white 
        // to paint white color on to the existing canvas content else set the stroke color to selected color
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY); // creating line according to the mouse pointer
        ctx.stroke(); // drawing/filling line with color
    } else if(selectedTool === "rectangle"){
        drawRect(e);
    } else if(selectedTool === "circle"){
        drawCircle(e);
    } else {
        drawTriangle(e);
    }
}

toolBtns.forEach(btn => {
    btn.addEventListener("click", () => { // adding click event to all tool option
        // removing active class from the previous option and adding on current clicked option
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
    });
});

sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value); // meneruskan slider value as brushSize

colorBtns.forEach(btn => {
    btn.addEventListener("click", () => { // menambahkan click event ke semua color button
        // menghapus selected class dari option sebelumnya dan menambahkan on current clicked option
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        // meneruskan selected btn background color as selectedColor value
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});

colorPicker.addEventListener("change", () => {
    // meneruskan nilai warna yang dipilih dari color picker ke warna terakhir btn background
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clearing whole canvas
    setCanvasBackground();
});

// Save an image
saveImg.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = `${Date.now()}.jpg`; 
    link.href = canvas.toDataURL(); 
    link.click(); 
});

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false);