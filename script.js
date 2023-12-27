async function fetchData() {
  let url =
    "https://cdn.shopify.com/s/files/1/0564/3685/0790/files/singleProduct.json?v=1701948448";
  let response = await fetch(url);
  let json = await response.json();
  updateUI(json);
}
fetchData();

function updateUI({ product }) {
  //   console.log(product);
  let { vendor, title, price, compare_at_price, description, options } =
    product;

  //first half
  let productImgElm = document.getElementById("product-image");
  productImgElm.style.backgroundImage = `url(${product.images[0].src})`;
  productImgElm.style.backgroundSize = "cover";
  let thumbnailElms = document.querySelectorAll(".thumbnails");
  thumbnailElms[0].classList.add("selected");
  for (let i = 0; i < thumbnailElms.length; i++) {
    thumbnailElms[i].style.backgroundImage = `url(${product.images[i].src})`;
    thumbnailElms[i].style.backgroundSize = "cover";
    thumbnailElms[i].style.cursor = "pointer";
    thumbnailElms[i].onclick = function (e) {
      for (let j = 0; j < thumbnailElms.length; j++) {
        thumbnailElms[j].classList.remove("selected");
      }

      thumbnailElms[i].classList.add("selected");
      productImgElm.style.backgroundImage = e.target.style.backgroundImage;
      productImgElm.style.backgroundSize = "cover";
    };
  }

  //second half
  //vendor,title,price,compare-at-price,percentage
  let vendorElm = document.querySelector(".vendor");
  vendorElm.innerText = vendor;

  let productTitleElm = document.querySelector(".product-title");
  productTitleElm.innerText = title;

  let priceElm = document.querySelector(".price");
  priceElm.innerText = price + ".00";

  let compareAtPricericeElm = document.querySelector(".compare-at-price");
  compareAtPricericeElm.innerText = compare_at_price;

  let percentageElm = document.querySelector(".percentage-off");
  const num1 = parseInt(price.substring(1), 10);
  const num2 = parseInt(compare_at_price.substring(1), 10);
  const discount = num2 - num1;
  let percentage = (discount / num2) * 100;
  percentageElm.innerText = parseInt(percentage) + "% Off"; //35% Off

  //description
  let descriptionElm = document.querySelector(".description");
  descriptionElm.innerHTML = description;

  //color
  let colorArr = options[0].values;
  let colorElms = document.querySelectorAll(".color");
  colorElms[0].style.border = "2px solid white";
  const addColor = colorElms[0].classList[1];
  colorElms[0].style.outline = `${colorArr[0][addColor]} solid 2px`;
  colorElms[0].children[0].style.display = "block";

  for (let i = 0; i < colorElms.length; i++) {
    const addColor = colorElms[i].classList[1];
    colorElms[i].style.backgroundColor = colorArr[i][addColor];

    colorElms[i].onclick = function () {
      for (let j = 0; j < colorElms.length; j++) {
        colorElms[j].style.border = "none";
        colorElms[j].style.outline = "none";
        colorElms[j].children[0].style.display = "none";
        colorElms[j].classList.remove("sel");
      }
      colorElms[i].style.border = "2px solid white";
      colorElms[i].style.outline = `${colorArr[i][addColor]} solid 2px`;
      colorElms[i].children[0].style.display = "block";
      colorElms[i].classList.add("sel");
    };
  }

  //size
  const sizeArr = options[1].values;
  let labelElms = document.querySelectorAll("label");
  for (let i = 0; i < labelElms.length; i++) {
    if (i === 3) {
      let temp = sizeArr[i].split(" ");
      labelElms[i].innerHTML = `<div class='extra'>
        <span>${temp[0]}</span>
        <span>${temp[1]}</span>
      </div>`;
    } else {
      labelElms[i].innerHTML = sizeArr[i];
    }
  }
  const radioBtns = document.querySelectorAll("input");
  for (let i = 0; i < radioBtns.length; i++) {
    radioBtns[i].onchange = function () {
      for (let j = 0; j < radioBtns.length; j++) {
        radioBtns[j].nextElementSibling.style.color = "#726C6C";
        radioBtns[j].nextElementSibling.style.fontWeight = "100";
      }
      radioBtns[i].nextElementSibling.style.color = "#3a4980";
      radioBtns[i].nextElementSibling.style.fontWeight = "600";
    };
  }

  //counter
  let count = 1;
  let minusBtn = document.querySelector(".minus");
  let plusBtn = document.querySelector(".plus");
  const counterElm = document.querySelector(".counter");
  plusBtn.onclick = function () {
    count++;
    counterElm.innerText = count;
  };
  minusBtn.onclick = function () {
    if (count == 1) return;
    count--;
    counterElm.innerText = count;
  };

  //add to cart
  const cartBtnElm = document.querySelector(".add-to-cart");
  let timerID;
  cartBtnElm.onclick = function () {
    if (timerID) clearTimeout(timerID);
    const afterAddElm = document.querySelector(".after-adding");
    afterAddElm.style.display = "flex";
    let divElms =
      afterAddElm.previousElementSibling.previousElementSibling.children[1]
        .children;
    let size;
    for (let i = 0; i < divElms.length; i++) {
      if (divElms[i].children[0].checked) {
        size = divElms[i].children[0].value;
      }
    }
    let color;
    let colorDivElms =
      afterAddElm.previousElementSibling.previousElementSibling
        .previousElementSibling.previousElementSibling.children[1].children;
    for (let i = 0; i < colorDivElms.length; i++) {
      if (colorDivElms[i].classList.contains("sel")) {
        color = colorDivElms[i].classList[1];
      }
    }
    afterAddElm.innerHTML = `<p>${count} ${title} with Color ${color} and Size ${size} added to cart</p>`;
    timerID = setTimeout(() => afterAddElm.style.display = "none", 5000);
  };
}
