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
  if (
    window.location.search.includes(document.getElementsByClassName('price-per-quantity-weight')[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.className.split('list-')[1].replace('-', '='))
    || !window.location.search.includes('page=')
  ) {
    array.push(pricePerWeightElements[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode);
  }
}

// Convert prices per 100g to per kg and per 100ml to per litre
for (let j = 0; j < array.length; j++) {
  if (array[j].getElementsByClassName('price-per-quantity-weight')[0].innerText.includes('100g')) {
    normaliseUnits(array[j], '/kg')
  }
  if (array[j].getElementsByClassName('price-per-quantity-weight')[0].innerText.includes('100ml')) {
    normaliseUnits(array[j], '/l')
  }
  if (array[j].getElementsByClassName('price-per-quantity-weight')[0].innerText.includes('75cl')) {
    normaliseUnits(array[j], '/l', 1.33333)
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
  // If we reached the second page without clicking through from the first, only the second page's items will be in the DOM.
  (
    document.getElementsByClassName('list-page-' + window.location.search.split('page=')[1])[0]?.children[0] ||
      document.getElementsByClassName('product-list')[parseInt(window.location.search.split('page=')[1]) - 1] ||
      document.getElementsByClassName('product-list')[0]
  ).appendChild(array[k])
}

function normaliseUnits(element, to, multiplier = 10) {
  var a = parseFloat(element.getElementsByClassName('price-per-quantity-weight')[0].innerText.split('£')[1].split('/')[0])
  element.getElementsByClassName('price-per-quantity-weight')[0].innerText = '£' + (a * multiplier).toFixed(2).toString() + to
}
