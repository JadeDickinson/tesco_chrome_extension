var pricePerUnitCSSClass = "[class*=price__subtext]"

function normaliseUnits(element, to, multiplier = 10) {
  var a = parseFloat(element.querySelectorAll(pricePerUnitCSSClass)[0].innerText.split('£')[1].split('/')[0])
  element.querySelectorAll(pricePerUnitCSSClass)[0].innerText = '£' + (a * multiplier).toFixed(2).toString() + to
}

if (typeof array != "undefined") {
  array = undefined;
}
if (typeof pricePerWeightElements != "undefined") {
  pricePerWeightElements = undefined;
}

// Get all product list items including parent nodes (document.getElementsByClassName(product-list--list-item) only gets the parent list items, not the children including price by weight)
pricePerWeightElements = document.getElementById('list-content').childNodes

// Only sort in-stock elements (out of stock elements do not have prices listed)
array = []
var priceCSSClass = "[class*=priceText]"
for (var i = 0; i < pricePerWeightElements.length; i++) {
  if (
    // priceText
    pricePerWeightElements[i].querySelectorAll(priceCSSClass).length > 0 &&
    pricePerWeightElements[i].querySelectorAll(priceCSSClass)[0].innerText.includes('£')
  ) {
    array.push(pricePerWeightElements[i]);
  }
}

var clubcardPricePerUnitCSSClass = "[class*=value-bar__content-subtext]"

// Convert prices per 100g to per kg and per 100ml to per litre
for (var j = 0; j < array.length; j++) {
  var selector = (array[j].querySelectorAll(clubcardPricePerUnitCSSClass).length > 0) ? clubcardPricePerUnitCSSClass : pricePerUnitCSSClass
  if (array[j].querySelectorAll(selector)[0].innerText.includes('100g')) {
    var otherUnitsExist = true
    normaliseUnits(array[j], '/kg')
  }
  if (array[j].querySelectorAll(selector)[0].innerText.includes('10g')) {
    var otherUnitsExist = true
    normaliseUnits(array[j], '/kg', 100)
  }
  if (array[j].querySelectorAll(selector)[0].innerText.includes('100ml')) {
    var otherUnitsExist = true
    normaliseUnits(array[j], '/l')
  }
  if (array[j].querySelectorAll(selector)[0].innerText.includes('10ml')) {
    var otherUnitsExist = true
    normaliseUnits(array[j], '/l', 100)
  }
  if (array[j].querySelectorAll(selector)[0].innerText.includes('75cl')) {
    var otherUnitsExist = true
    normaliseUnits(array[j], '/l', 1.33333)
  }
  continue
}

// Sort array from lowest price/kg to highest price/kg - using Clubcard price by weight if present
array.sort(
  function (a, b) {
    aPrice = 0
    bPrice = 0
    
    aSelector = a.querySelectorAll(clubcardPricePerUnitCSSClass).length > 0 ? clubcardPricePerUnitCSSClass : pricePerUnitCSSClass
    aPrice = parseFloat(a.querySelectorAll(aSelector)[0].innerText.split('£')[1].split('/')[0])

    bSelector = b.querySelectorAll(clubcardPricePerUnitCSSClass).length > 0 ? clubcardPricePerUnitCSSClass : pricePerUnitCSSClass
    bPrice = parseFloat(b.querySelectorAll(bSelector)[0].innerText.split('£')[1].split('/')[0])

    return aPrice - bPrice
  }
)

// insert out-of-stock items to start of array. Must be after sort or sort will fail
for (var i = 0; i < pricePerWeightElements.length; i++) {
  if (
    !(pricePerWeightElements[i].querySelectorAll(priceCSSClass).length > 0)
  ) {
    array.unshift(pricePerWeightElements[i]);
  }
}

// Replace the list in the DOM with your sorted list
for (var k = 0; k < array.length; k++) {
  (document.getElementById('list-content')).appendChild(array[k])
}