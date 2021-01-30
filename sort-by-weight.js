if (typeof array != "undefined") {
  array = undefined;
}
if (typeof pricePerWeightElements != "undefined") {
  pricePerWeightElements = undefined;
}
array = []

// Get all product list items including parent nodes (document.getElementsByClassName(product-list--list-item) only gets the parent list items, not the children including price by weight)
pricePerWeightElements = document.getElementsByClassName('price-per-quantity-weight')

for (let i = 0; i < pricePerWeightElements.length; i++) {
  if (window.location.search.includes(document.getElementsByClassName('price-per-quantity-weight')[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.className.split('list-')[1].replace('-', '='))) {
    array.push(pricePerWeightElements[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode);
  }
}

for (let j = 0; j < array.length; j++) {
  if (array[j].getElementsByClassName('price-per-quantity-weight')[0].innerText.includes('100g')) {
    var a = parseFloat(array[j].getElementsByClassName('price-per-quantity-weight')[0].innerText.split('£')[1].split('/')[0])
    array[j].getElementsByClassName('price-per-quantity-weight')[0].innerText = '£' + (a * 10).toFixed(2).toString() + '/kg'
  }
  if (array[j].getElementsByClassName('price-per-quantity-weight')[0].innerText.includes('100ml')) {
    var a = parseFloat(array[j].getElementsByClassName('price-per-quantity-weight')[0].innerText.split('£')[1].split('/')[0])
    array[j].getElementsByClassName('price-per-quantity-weight')[0].innerText = '£' + (a * 10).toFixed(2).toString() + '/l'
  }
  continue
}

// Sort array from lowest price/kg to highest price/kg
array.sort(
  function (a, b) {
    return parseFloat(a.getElementsByClassName('price-per-quantity-weight')[0].innerText.split('£')[1].split('/')[0]) - parseFloat(b.getElementsByClassName('price-per-quantity-weight')[0].innerText.split('£')[1].split('/')[0])
  }
)

// Replace the list in the DOM with your sorted list
for (var k = 0; k < array.length; k++) {
  // As you go between pages, more product lists are added to it. So we only want to modify the one for the page we are on.
  document.getElementsByClassName('product-list')[parseInt(window.location.search.split('page=')[1]) - 1 || 0].appendChild(array[k])
}
